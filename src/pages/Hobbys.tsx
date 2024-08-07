import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Col, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { HobbysInitialValues, IHobbys } from "../types/Hobbys";
import { GET_HOBBYS } from "@graphql/query";
import { CREATE_HOBBY, DELETE_HOBBYS, UPDATE_HOBBYS } from "@graphql/mutation";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import TextArea from "antd/es/input/TextArea";

const Hobbys = () => {
  const { data, loading, error } = useQuery(GET_HOBBYS);
  const [deleteOneHobby] = useMutation(DELETE_HOBBYS, {
    refetchQueries: [{ query: GET_HOBBYS }],
    onCompleted: () => {
      message.success("Hobbys deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneHobby({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentHobbys, setCurrentHobbys] = useState<IHobbys | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      setImage(result.secure_url);
    } catch {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    if (currentHobbys) {
      currentHobbys && setImage(currentHobbys.image);
    } else {
      setImage(null);
    }
  }, [currentHobbys]);

  const [createOneHobbys] = useMutation(CREATE_HOBBY, {
    refetchQueries: [{ query: GET_HOBBYS }],
    onCompleted: () => message.success("Hobby created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneHobbys] = useMutation(UPDATE_HOBBYS, {
    refetchQueries: [{ query: GET_HOBBYS }],
    onCompleted: () => message.success("Hobby updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: HobbysInitialValues) => {
    try {
      await createOneHobbys({
        variables: {
          input: {
            image: image,
            translations: {
              createMany: {
                data: [
                  {
                    hobby: values.enHobby,
                    aboutHobby: values.enAboutHobby,
                    languageCode: "en",
                  },
                  {
                    hobby: values.kaHobby,
                    aboutHobby: values.kaAboutHobby,
                    languageCode: "ka",
                  },
                ],
              },
            },
            profile: { connect: { id: "1" } },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating hobby:", error);
    }
  };

  const handleUpdate = async (values: HobbysInitialValues) => {
    try {
      await updateOneHobbys({
        variables: {
          id: currentHobbys?.id,
          image: { set: image },
          data: {
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    hobby: { set: values.enHobby },
                    aboutHobby: { set: values.enAboutHobby },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    hobby: { set: values.kaHobby },
                    aboutHobby: { set: values.kaAboutHobby },
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
      console.error("Error updating hobby:", error);
    }
  };

  const handleCancel = () => {
    setCurrentHobbys(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (hobbys: IHobbys) => {
    setCurrentHobbys(hobbys);
    setIsModalVisible(true);

    const en = hobbys.translations.find((t) => t.languageCode === "en");
    const ka = hobbys.translations.find((t) => t.languageCode === "ka");

    const initialValues = {
      enHobby: en?.hobby,
      kaHobby: ka?.hobby,
      enAboutHobby: en?.aboutHobby,
      kaAboutHobby: ka?.aboutHobby,
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
        Add New Hobby
      </Button>

      <List
        dataSource={data?.findManyHobbys || []}
        renderItem={(hobbys: IHobbys) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(hobbys)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(hobbys.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                hobbys.translations.find((t) => t.languageCode === "en")?.hobby
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentHobbys ? "Edit Hobby" : "Create Hobby"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentHobbys) {
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
          onFinish={currentHobbys ? handleUpdate : handleCreate}
        >
          <Form.Item label="Image">
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
              <p className="ant-upload-text">Click or drag to upload image</p>
            </Dragger>
            {image && (
              <img
                src={image}
                alt="uploaded"
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="English Hobby"
                name="enHobby"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Hobby About"
                name="enAboutHobby"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Georgian Hobby"
                name="kaHobby"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Georgian Hobby About"
                name="kaAboutHobby"
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

export default Hobbys;
