import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_BLOG, DELETE_BLOGS, UPDATE_BLOGS } from "@graphql/mutation";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { IBlog, IBlogsResponse, IBlogTranslation } from "../types/Blogs";
import { PlusOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { GET_BLOGS } from "@graphql/query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import Dragger from "antd/es/upload/Dragger";

const StyledReactQuill = styled(ReactQuill)`
  height: 300px;
  margin-bottom: 30px;
  width: 100%;
`;

const Blogs = () => {
  const { data, loading, error } = useQuery<IBlogsResponse>(GET_BLOGS);
  const [deleteBlog] = useMutation(DELETE_BLOGS, {
    refetchQueries: [{ query: GET_BLOGS }],
    onCompleted: () => {
      message.success("Blog deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentBlog, setCurrentBlog] = useState<IBlog | null>(null);
  const [value, setValue] = useState<string>("");

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
    if (currentBlog) {
      currentBlog && setImage(currentBlog.background);
    } else {
      setImage(null);
    }
  }, [currentBlog]);

  const [createOneBlogs] = useMutation(CREATE_BLOG, {
    refetchQueries: [{ query: GET_BLOGS }],
    onCompleted: () => {
      message.success("Blog created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneBlog] = useMutation(UPDATE_BLOGS, {
    refetchQueries: [{ query: GET_BLOGS }],
    onCompleted: () => {
      message.success("Blog updated successfully!");
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
    createOneBlogs({
      variables: {
        data: {
          link: values.link,
          background: image,
          translations: {
            createMany: {
              data: [
                {
                  headline: values.kaHeadline,
                  about: values.kaAbout,
                  markdown: values.kaMarkdown,
                  languageCode: "ka",
                },
                {
                  headline: values.enHeadline,
                  about: values.enAbout,
                  markdown: values.enMarkdown,
                  languageCode: "en",
                },
              ],
            },
          },
        },
      },
    });
    form.resetFields();
    setCurrentBlog(null);
    setIsModalVisible(false);
  };

  const handleUpdate = (values: any) => {
    updateOneBlog({
      variables: {
        id: currentBlog?.id,
        data: {
          link: { set: values.link },
          background: { set: image },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  headline: { set: values.kaHeadline },
                  about: { set: values.kaAbout },
                  markdown: { set: values.kaMarkdown },
                },
              },
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  headline: { set: values.enHeadline },
                  about: { set: values.enAbout },
                  markdown: { set: values.enMarkdown },
                },
              },
            ],
          },
        },
      },
    });
    form.resetFields();
    setCurrentBlog(null);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCurrentBlog(null);
    form.resetFields();
    setValue("");
    setImage(null);
    setIsModalVisible(false);
  };

  const handleEdit = (blog: IBlog) => {
    setCurrentBlog(blog);
    setIsModalVisible(true);

    const en = blog.translations.find(
      (translation: IBlogTranslation) => translation.languageCode === "en"
    );
    const ka = blog.translations.find(
      (translation: IBlogTranslation) => translation.languageCode === "ka"
    );

    const initialValues = {
      link: blog.link,
      background: image,
      enHeadline: en?.headline,
      enAbout: en?.about,
      enMarkdown: en?.markdown,
      kaHeadline: ka?.headline,
      kaAbout: ka?.about,
      kaMarkdown: ka?.markdown,
    };

    form.setFieldsValue(initialValues);
  };

  const handleDelete = (id: string) => {
    deleteBlog({ variables: { id } });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add New Blog
      </Button>
      <List
        dataSource={data?.findManyBlogs}
        renderItem={(blog: IBlog) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(blog)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(blog.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                blog.translations.find((t) => t.languageCode === "en")?.headline
              }
            />
          </List.Item>
        )}
      />
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentBlog) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
            setIsModalVisible(false);
          });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentBlog ? handleUpdate : handleCreate}
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
              <p className="ant-upload-text">
                Click or drag to upload background
              </p>
            </Dragger>
            {image && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={image}
                  alt={`background`}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="English Headline" name="enHeadline">
                <Input />
              </Form.Item>
              <Form.Item label="English About" name="enAbout">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="English Markdown" name="enMarkdown">
                <StyledReactQuill theme="snow" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Georgian Headline" name="kaHeadline">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian About" name="kaAbout">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Georgian Markdown" name="kaMarkdown">
                <StyledReactQuill theme="snow" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Blogs;
