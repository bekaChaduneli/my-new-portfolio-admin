import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { IGithubRepo, IGithubRepoTranslation } from "../types/GithubRepos";
import {
  CREATE_GITHUBREPO,
  DELETE_GITHUBREPOS,
  UPDATE_GITHUBREPO,
} from "@graphql/mutation";
import { GET_GITHUBREPOS } from "@graphql/query";

const GithubRepos = () => {
  const { data, loading, error } = useQuery(GET_GITHUBREPOS);
  const [deleteGithubRepo] = useMutation(DELETE_GITHUBREPOS, {
    refetchQueries: [{ query: GET_GITHUBREPOS }],
    onCompleted: () => {
      message.success("Github Repo deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentRepo, setCurrentRepo] = useState<IGithubRepo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createGithubRepo] = useMutation(CREATE_GITHUBREPO, {
    refetchQueries: [{ query: GET_GITHUBREPOS }],
    onCompleted: () => {
      message.success("Github Repo created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateGithubRepo] = useMutation(UPDATE_GITHUBREPO, {
    refetchQueries: [{ query: GET_GITHUBREPOS }],
    onCompleted: () => {
      message.success("Github Repo updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      message.error(error.message);
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleCreate = (values: any) => {
    createGithubRepo({
      variables: {
        input: {
          link: values.link,
          stars: values.stars,
          language: values.language,
          translations: {
            createMany: {
              data: [
                {
                  title: values.enTitle,
                  description: values.enDescription,
                  languageCode: "en",
                },
                {
                  title: values.kaTitle,
                  description: values.kaDescription,
                  languageCode: "ka",
                },
              ],
            },
          },
        },
      },
    });
  };

  const handleUpdate = (values: any) => {
    updateGithubRepo({
      variables: {
        id: currentRepo?.id,
        data: {
          link: { set: values.link },
          stars: { set: values.stars },
          language: { set: values.language },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  title: { set: values.enTitle },
                  description: { set: values.enDescription },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  title: { set: values.kaTitle },
                  description: { set: values.kaDescription },
                },
              },
            ],
          },
        },
      },
    });
  };

  const handleCancel = () => {
    setCurrentRepo(null);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleEdit = (repo: IGithubRepo) => {
    setCurrentRepo(repo);
    setIsModalVisible(true);

    const en = repo.translations.find(
      (translation: IGithubRepoTranslation) => translation.languageCode === "en"
    );
    const ka = repo.translations.find(
      (translation: IGithubRepoTranslation) => translation.languageCode === "ka"
    );

    const initialValues = {
      link: repo.link,
      stars: repo.stars,
      language: repo.language,
      enTitle: en?.title,
      enDescription: en?.description,
      kaTitle: ka?.title,
      kaDescription: ka?.description,
    };

    form.setFieldsValue(initialValues);
  };

  const handleDelete = (id: string) => {
    deleteGithubRepo({ variables: { id } });
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setCurrentRepo(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
      >
        Add Github Repo
      </Button>
      <List
        dataSource={data?.findManyGithubRepos}
        renderItem={(item: IGithubRepo) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(item)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(item.id)}>
                Delete
              </Button>,
            ]}
          >
            {item.link}
          </List.Item>
        )}
      />
      <Modal
        width={1200}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (currentRepo) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
            handleCancel();
          }}
        >
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Form.Item label="Stars" name="stars">
            <Input />
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="English Title" name="enTitle">
                <Input />
              </Form.Item>
              <Form.Item label="English Description" name="enDescription">
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Georgian Language Title" name="kaTitle">
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian Language Description"
                name="kaDescription"
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default GithubRepos;
