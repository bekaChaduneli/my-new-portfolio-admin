import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AboutMeInitialValues, IAboutMe } from "../types/AboutMe";
import {
  CREATE_ABOUTME,
  DELETE_ABOUTME,
  UPDATE_ABOUTME,
} from "@graphql/mutation";
import { GET_ABOUTME } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import TextArea from "antd/es/input/TextArea";

const AboutMe = () => {
  const { data, loading, error } = useQuery(GET_ABOUTME);
  const [deleteOneAboutMe] = useMutation(DELETE_ABOUTME, {
    refetchQueries: [{ query: GET_ABOUTME }],
    onCompleted: () => {
      message.success("AboutMe deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    deleteOneAboutMe({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentAboutMe, setCurrentAboutMe] = useState<IAboutMe | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      const url = result.secure_url;
      setImage(url);
    } catch (error) {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    if (currentAboutMe) {
      currentAboutMe && setImage(currentAboutMe.image);
    } else {
      setImage(null);
    }
  }, [currentAboutMe]);

  const [createOneAboutMe] = useMutation(CREATE_ABOUTME, {
    refetchQueries: [{ query: GET_ABOUTME }],
    onCompleted: () => {
      message.success("AboutMe created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneAboutMe] = useMutation(UPDATE_ABOUTME, {
    refetchQueries: [{ query: GET_ABOUTME }],
    onCompleted: () => {
      message.success("AboutMe updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: AboutMeInitialValues) => {
    try {
      await createOneAboutMe({
        variables: {
          input: {
            id: "1",
            image: image,
            experience: parseInt(values.experience),
            age: parseInt(values.age),
            projectNum: parseInt(values.projectNum),
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    about: values.enAbout,
                    role: values.enRole,
                    country: values.enCountry,
                    city: values.enCity,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    about: values.kaAbout,
                    role: values.kaRole,
                    country: values.kaCountry,
                    city: values.kaCity,
                    languageCode: "ka",
                  },
                ],
              },
            },
          },
        },
      });
      form.resetFields();
      setImage(null);
      setCurrentAboutMe(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating AboutMe:", error);
    }
  };

  const handleUpdate = async (values: AboutMeInitialValues) => {
    try {
      await updateOneAboutMe({
        variables: {
          id: "1",
          data: {
            image: { set: image },
            experience: { set: parseInt(values.experience) },
            age: { set: parseInt(values.age) },
            projectNum: { set: parseInt(values.projectNum) },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    about: { set: values.enAbout },
                    role: { set: values.enRole },
                    country: { set: values.enCountry },
                    city: { set: values.enCity },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    about: { set: values.kaAbout },
                    role: { set: values.kaRole },
                    country: { set: values.kaCountry },
                    city: { set: values.kaCity },
                  },
                },
              ],
            },
          },
        },
      });
      form.resetFields();
      setCurrentAboutMe(null);
      setImage(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating AboutMe:", error);
    }
  };

  const handleCancel = () => {
    setCurrentAboutMe(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (aboutMe: IAboutMe) => {
    setCurrentAboutMe(aboutMe);
    setIsModalVisible(true);

    const en = aboutMe.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = aboutMe.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues: AboutMeInitialValues = {
      image: image,
      experience: aboutMe.experience.toString(),
      age: aboutMe.age.toString(),
      projectNum: aboutMe.projectNum.toString(),
      enName: en?.name,
      kaName: ka?.name,
      enAbout: en?.about,
      kaAbout: ka?.about,
      enRole: en?.role,
      kaRole: ka?.role,
      enCountry: en?.country,
      kaCountry: ka?.country,
      enCity: en?.city,
      kaCity: ka?.city,
    };
    form.setFieldsValue(initialValues);
  };

  return (
    <div>
      {!data?.findFirstAboutMe && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{
            maxWidth: "208px",
          }}
        >
          Add New AboutMe
        </Button>
      )}
      <List
        dataSource={data?.findFirstAboutMe ? [data?.findFirstAboutMe] : []}
        renderItem={(aboutMe: IAboutMe) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(aboutMe)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => {
                  handleDelete(aboutMe.id);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                aboutMe.translations.find((t) => t.languageCode === "en")?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentAboutMe ? "Edit AboutMe" : "Create AboutMe"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentAboutMe) {
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
          onFinish={currentAboutMe ? handleUpdate : handleCreate}
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
              <div style={{ marginTop: 10 }}>
                <img
                  src={image}
                  alt={`image`}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Age" name="age" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="ProjectNum"
            name="projectNum"
            rules={[{ required: true }]}
          >
            <Input type="number" />
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
                label="English About"
                name="enAbout"
                rules={[{ required: true }]}
              >
                <TextArea style={{ height: "120px" }} />
              </Form.Item>
              <Form.Item
                label="English Role"
                name="enRole"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Country"
                name="enCountry"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English City"
                name="enCity"
                rules={[{ required: true }]}
              >
                <Input />
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
                label="Georgian About"
                name="kaAbout"
                rules={[{ required: true }]}
              >
                <TextArea style={{ height: "120px" }} />
              </Form.Item>
              <Form.Item
                label="Georgian Role"
                name="kaRole"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian Country"
                name="kaCountry"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian City"
                name="kaCity"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AboutMe;
