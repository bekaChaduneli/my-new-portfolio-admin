import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  List,
  Form,
  message,
  Modal,
  Input,
  Row,
  Col,
  Space,
  Upload,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ILinkedin, IPosts, ITopSkills } from "../types/Linkedin";
import {
  CREATE_LINKEDIN,
  DELETE_LINKEDIN,
  UPDATE_LINKEDIN,
} from "@graphql/mutation";
import { GET_LINKEDIN } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";

const Linkedin = () => {
  const { data, loading, error } = useQuery(GET_LINKEDIN);
  const [deleteOneLinkedin] = useMutation(DELETE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("Linkedin deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    deleteOneLinkedin({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentLinkedin, setCurrentLinkedin] = useState<ILinkedin | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const handleFileUpload = async (file: File, type: "image" | "banner") => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      const url = result.secure_url;
      switch (type) {
        case "image":
          setImage(url);
          break;
        case "banner":
          setBanner(url);
          break;
        default:
          message.error("Unsupported file type.");
      }
    } catch (error) {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };

  const [createOneLinkedin] = useMutation(CREATE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("Linkedin created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneLinkedin] = useMutation(UPDATE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("Linkedin updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    console.log(values);
    createOneLinkedin({
      variables: {
        input: {
          image: image,
          banner: banner,
          link: values.link,
          translations: {
            createMany: {
              data: [
                {
                  name: values.enName,
                  bio: values.enBio,
                  company: values.enCompany,
                  languageCode: "en",
                  university: values.enUniversity,
                },
                {
                  name: values.kaName,
                  bio: values.kaBio,
                  company: values.kaCompany,
                  languageCode: "ka",
                  university: values.kaUniversity,
                },
              ],
            },
          },
        },
      },
    });
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    updateOneLinkedin({
      variables: {
        id: currentLinkedin?.id,
        data: {
          image: { set: image },
          banner: { set: banner },
          link: { set: values.link },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  name: { set: values.enName },
                  bio: { set: values.enBio },
                  company: { set: values.enCompany },
                  university: { set: values.enUniversity },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  name: { set: values.kaName },
                  bio: { set: values.kaBio },
                  company: { set: values.kaCompany },
                  university: { set: values.kaUniversity },
                },
              },
            ],
          },
        },
      },
    });
  };

  const handleCancel = () => {
    setCurrentLinkedin(null);
    setImage(null);
    setBanner(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (linkedin: ILinkedin) => {
    setCurrentLinkedin(linkedin);
    setIsModalVisible(true);

    const en = linkedin.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = linkedin.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues = {
      image: image,
      banner: banner,
      link: linkedin.link,
      enName: en?.name,
      enBio: en?.bio,
      enCompany: en?.company,
      enUniversity: en?.university,
      kaName: ka?.name,
      kaBio: ka?.bio,
      kaCompany: ka?.company,
      kaUniversity: ka?.university,
    };
    form.setFieldsValue(initialValues);
  };

  console.log(data?.findFirstLinkedin);

  return (
    <div>
      {!data?.findFirstLinkedin && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Linkedin
        </Button>
      )}
      <List
        dataSource={data?.findFirstLinkedin ? [data?.findFirstLinkedin] : []}
        renderItem={(linkedin: any) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(linkedin)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => {
                  console.log(linkedin.id);
                  handleDelete(linkedin.id);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={linkedin.link}
              description={
                <>
                  <div>
                    {
                      linkedin.translations.find(
                        (t: any) => t.languageCode === "en"
                      )?.name
                    }
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentLinkedin ? "Edit Linkedin" : "Create Linkedin"}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentLinkedin) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
            setIsModalVisible(false);
          });
        }}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentLinkedin ? handleUpdate : handleCreate}
        >
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "image");
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
          <Form.Item label="Banner">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "banner");
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">Click or drag to upload banner</p>
            </Dragger>
            {banner && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={banner}
                  alt="banner"
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              </div>
            )}
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
                label="English Bio"
                name="enBio"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="English Company" name="enCompany">
                <Input />
              </Form.Item>
              <Form.Item label="English University" name="enUniversity">
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
                label="Georgian Bio"
                name="kaBio"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Georgian Company" name="kaCompany">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian University" name="kaUniversity">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Linkedin;
