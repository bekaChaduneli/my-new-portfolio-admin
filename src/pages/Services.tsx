import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IServices, ServicesInitialValues } from "../types/Services";
import { GET_SERVICES } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import {
  CREATE_SERVICES,
  DELETE_SERVICES,
  UPDATE_SERVICES,
} from "@graphql/mutation";
import TextArea from "antd/es/input/TextArea";

const Services = () => {
  const [deleteOneService] = useMutation(DELETE_SERVICES, {
    refetchQueries: [{ query: GET_SERVICES }],
    onCompleted: () => {
      message.success("Services deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneService({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentServices, setCurrentServices] = useState<IServices | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingBackground, setLoadingBackground] = useState<boolean>(false);
  const [background, setBackground] = useState<string | null | undefined>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingBackground(true);
      const result = await uploadToCloudinary(file);
      setBackground(result.secure_url);
    } catch {
      message.error("Error uploading file.");
    } finally {
      setLoadingBackground(false);
    }
  };

  const { data, loading, error } = useQuery(GET_SERVICES);
  useEffect(() => {
    if (currentServices) {
      currentServices && setBackground(currentServices.background);
    } else {
      setBackground(null);
    }
  }, [currentServices, isModalVisible]);
  const [createOneServices] = useMutation(CREATE_SERVICES, {
    refetchQueries: [{ query: GET_SERVICES }],
    onCompleted: () => message.success("Service created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneServices] = useMutation(UPDATE_SERVICES, {
    refetchQueries: [{ query: GET_SERVICES }],
    onCompleted: () => message.success("Service updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: ServicesInitialValues) => {
    try {
      await createOneServices({
        variables: {
          input: {
            background: background,
            order: values.order,
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    description: values.enDescription,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    description: values.kaDescription,
                    languageCode: "ka",
                  },
                ],
              },
            },
          },
        },
      });
      form.resetFields();
      setBackground(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdate = async (values: ServicesInitialValues) => {
    try {
      await updateOneServices({
        variables: {
          id: currentServices?.id,
          data: {
            background: { set: background },
            order: { set: values.order },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    description: { set: values.kaDescription },
                  },
                },
              ],
            },
          },
        },
      });
      form.resetFields();
      setBackground(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleCancel = () => {
    setCurrentServices(null);
    setBackground(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (services: IServices) => {
    setCurrentServices(services);
    setIsModalVisible(true);

    const en = services.translations.find((t) => t.languageCode === "en");
    const ka = services.translations.find((t) => t.languageCode === "ka");

    const initialValues: ServicesInitialValues = {
      order: services?.order,
      enDescription: en?.description,
      enName: en?.name,
      kaDescription: ka?.description,
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
        Add New Service
      </Button>

      <List
        dataSource={data?.findManyServices || []}
        renderItem={(services: IServices) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(services)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(services.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                services.translations.find((t) => t.languageCode === "en")?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentServices ? "Edit Service" : "Create Service"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentServices) {
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
          onFinish={currentServices ? handleUpdate : handleCreate}
        >
          <Form.Item label="Background">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File);
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag to upload background
              </p>
            </Dragger>
            {background && (
              <img
                src={background}
                alt="uploaded"
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Order" name="order" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="English Name"
                name="enName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Description"
                name="enDescription"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Georgian Name"
                name="kaName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Georgian Description"
                name="kaDescription"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
