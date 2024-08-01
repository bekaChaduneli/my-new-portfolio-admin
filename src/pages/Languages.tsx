import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ILanguages, LanguagesInitialValues } from "../types/Languages";
import { GET_LANGUAGES } from "@graphql/query";
import {
  CREATE_LANGUAGE,
  DELETE_LANGUAGES,
  UPDATE_LANGUAGES,
} from "@graphql/mutation";

const Languages = () => {
  const { data, loading, error } = useQuery(GET_LANGUAGES);
  const [deleteOneLanguage] = useMutation(DELETE_LANGUAGES, {
    refetchQueries: [{ query: GET_LANGUAGES }],
    onCompleted: () => {
      message.success("Languages deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneLanguage({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentLanguages, setCurrentLanguages] = useState<ILanguages | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneLanguages] = useMutation(CREATE_LANGUAGE, {
    refetchQueries: [{ query: GET_LANGUAGES }],
    onCompleted: () => message.success("Language created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneLanguages] = useMutation(UPDATE_LANGUAGES, {
    refetchQueries: [{ query: GET_LANGUAGES }],
    onCompleted: () => message.success("Language updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: LanguagesInitialValues) => {
    try {
      await createOneLanguages({
        variables: {
          input: {
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    description: values.enDescription,
                    level: values.enLevel,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    description: values.kaDescription,
                    level: values.kaLevel,
                    languageCode: "ka",
                  },
                ],
              },
            },
            aboutMe: { connect: { id: "1" } },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating language:", error);
    }
  };

  const handleUpdate = async (values: LanguagesInitialValues) => {
    try {
      await updateOneLanguages({
        variables: {
          id: currentLanguages?.id,
          data: {
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    level: { set: values.enLevel },
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    level: { set: values.kaLevel },
                    description: { set: values.kaDescription },
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
      console.error("Error updating language:", error);
    }
  };

  const handleCancel = () => {
    setCurrentLanguages(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (languages: ILanguages) => {
    setCurrentLanguages(languages);
    setIsModalVisible(true);

    const en = languages.translations.find((t) => t.languageCode === "en");
    const ka = languages.translations.find((t) => t.languageCode === "ka");

    const initialValues: LanguagesInitialValues = {
      enName: en?.name,
      kaName: ka?.name,
      enLevel: en?.level,
      kaLevel: ka?.level,
      enDescription: en?.description,
      kaDescription: ka?.description,
    };
    form.setFieldsValue(initialValues);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Add New Language
      </Button>

      <List
        dataSource={data?.findManyLanguages || []}
        renderItem={(languages: ILanguages) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(languages)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(languages.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                languages.translations.find((t) => t.languageCode === "en")
                  ?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentLanguages ? "Edit Language" : "Create Language"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentLanguages) {
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
          onFinish={currentLanguages ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="English Name"
            name="enName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="English Level"
            name="enLevel"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="English Description"
            name="enDescription"
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
          <Form.Item
            label="Georgian Level"
            name="kaLevel"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Georgian Description"
            name="kaDescription"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Languages;
