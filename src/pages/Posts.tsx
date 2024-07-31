import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IPosts } from "../types/Posts";
import { GET_POSTS } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import { CREATE_POST, DELETE_POSTS, UPDATE_POSTS } from "@graphql/mutation";

const Posts = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [deleteOnePost] = useMutation(DELETE_POSTS, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      message.success("Posts deleted successfully!");
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
  const [currentPosts, setCurrentPosts] = useState<IPosts | null>(null);
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

  const [createOnePosts] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      message.success("Posts created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOnePosts] = useMutation(UPDATE_POSTS, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      message.success("Posts updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    console.log(values);
    createOnePosts({
      variables: {
        input: {
          image: image,
          link: values.link,
          likes: values.likes,
          commentsSum: values.commentsSum,
          translations: {
            createMany: {
              data: [
                {
                  description: values?.enDescription,
                  linkedinName: values?.enLinkedinName,
                  languageCode: "en",
                },
                {
                  description: values?.kaDescription,
                  linkedinName: values?.kaLinkedinName,
                  languageCode: "ka",
                },
              ],
            },
          },
          linkedin: { connect: { id: "1" } },
        },
      },
    });
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    updateOnePosts({
      variables: {
        id: "1",
        data: {
          image: { set: image },
          link: { set: values.link },
          likes: { set: values.likes },
          commentsSum: { set: values.commentsSum },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  description: { set: values.enDescription },
                  linkedinName: { set: values.enLinkedinName },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  description: { set: values.kaDescription },
                  linkedinName: { set: values.kaLinkedinName },
                },
              },
            ],
          },
        },
      },
    });
  };

  const handleCancel = () => {
    setCurrentPosts(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (posts: IPosts) => {
    setCurrentPosts(posts);
    setIsModalVisible(true);

    const en = posts.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = posts.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues = {
      image: image,
      link: posts.link,
      likes: posts.likes,
      commentsSum: posts.commentsSum,
      kaDescriptions: ka?.description,
      enDescriptions: en?.description,
      kaLinkedinName: ka?.linkedinName,
      enLinkedinName: en?.linkedinName,
    };
    form.setFieldsValue(initialValues);
  };

  console.log(data?.findManyPosts);

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Add New Posts
      </Button>

      <List
        dataSource={data?.findManyPosts ? [data?.findManyPosts] : []}
        renderItem={(posts: any, index: any) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(posts)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => {
                  console.log(posts.id);
                  handleDelete(posts.id);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={`Post ${index + 1}`} />
          </List.Item>
        )}
      />

      <Modal
        title={currentPosts ? "Edit Posts" : "Create Posts"}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentPosts) {
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
          onFinish={currentPosts ? handleUpdate : handleCreate}
        >
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Link" name="link" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="commentsSum"
                name="commentsSum"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="likes"
                name="likes"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="enDescription"
                name="enDescription"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="kaDescription"
                name="kaDescription"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="enLinkedinName"
                name="enLinkedinName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="kaLinkedinName"
                name="kaLinkedinName"
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

export default Posts;
