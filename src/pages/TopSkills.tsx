import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ITopSkills, TopSkillsInitialValues } from "../types/TopSkills";
import { GET_TOPSKILLS } from "@graphql/query";
import {
  CREATE_TOPSKILL,
  DELETE_TOPSKILLS,
  UPDATE_TOPSKILLS,
} from "@graphql/mutation";

const TopSkills = () => {
  const { data, loading, error } = useQuery(GET_TOPSKILLS);
  const [deleteOnePost] = useMutation(DELETE_TOPSKILLS, {
    refetchQueries: [{ query: GET_TOPSKILLS }],
    onCompleted: () => {
      message.success("TopSkills deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOnePost({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentTopSkills, setCurrentTopSkills] = useState<ITopSkills | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneTopSkills] = useMutation(CREATE_TOPSKILL, {
    refetchQueries: [{ query: GET_TOPSKILLS }],
    onCompleted: () => message.success("Post created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneTopSkills] = useMutation(UPDATE_TOPSKILLS, {
    refetchQueries: [{ query: GET_TOPSKILLS }],
    onCompleted: () => message.success("Post updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: TopSkillsInitialValues) => {
    try {
      await createOneTopSkills({
        variables: {
          input: {
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    languageCode: "ka",
                  },
                ],
              },
            },
            linkedin: { connect: { id: "1" } },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async (values: TopSkillsInitialValues) => {
    try {
      await updateOneTopSkills({
        variables: {
          id: currentTopSkills?.id,
          data: {
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                  },
                },
              ],
            },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancel = () => {
    setCurrentTopSkills(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (topSkills: ITopSkills) => {
    setCurrentTopSkills(topSkills);
    setIsModalVisible(true);

    const en = topSkills.translations.find((t) => t.languageCode === "en");
    const ka = topSkills.translations.find((t) => t.languageCode === "ka");

    const initialValues: TopSkillsInitialValues = {
      enName: en?.name,
      kaName: ka?.name,
    };
    form.setFieldsValue(initialValues);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{
          maxWidth: "208px",
        }}
      >
        Add New Top Skill
      </Button>

      <List
        dataSource={data?.findManyTopSkills || []}
        renderItem={(topSkills: ITopSkills) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(topSkills)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(topSkills.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                topSkills.translations.find((t) => t.languageCode === "en")
                  ?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentTopSkills ? "Edit TopSkill" : "Create TopSkill"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentTopSkills) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
          });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentTopSkills ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="English Name"
            name="enName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Georgian Name"
            name="kaName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopSkills;
