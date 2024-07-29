import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_BLOG, DELETE_BLOGS, UPDATE_BLOGS } from "@graphql/mutation";
import { Button, List, Form, message, Modal, Input } from "antd";
import { IBlog, IBlogsResponse, IBlogTranslation } from "../types/Blogs";
import { FileUpload } from "@components/FileUpload";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { GET_BLOGS } from "@graphql/query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  const handleImageUpload = async (file: File) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      setImageUrl(result.secure_url);
      form.setFieldsValue({ background: result.secure_url });
    } catch (error) {
      message.error("Error uploading image.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleCreate = (values: any) => {
    createOneBlogs({
      variables: {
        data: {
          link: values.link,
          background: values.background,
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
  };

  const handleUpdate = (values: any) => {
    updateOneBlog({
      variables: {
        id: currentBlog?.id,
        data: {
          link: { set: values.link },
          background: { set: values.background },
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
  };

  const handleCancel = () => {
    setCurrentBlog(null);
    form.resetFields();
    setValue("");
    setImageUrl(null);
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
      background: blog.background,
      enHeadline: en?.headline,
      enAbout: en?.about,
      enMarkdown: en?.markdown,
      kaHeadline: ka?.headline,
      kaAbout: ka?.about,
      kaMarkdown: ka?.markdown,
    };

    form.setFieldsValue(initialValues);
    setValue(en?.about || "");
  };

  const handleDelete = (id: string) => {
    deleteBlog({ variables: { id } });
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setCurrentBlog(null);
          form.resetFields();
          setValue("");
          setImageUrl(null);
          setIsModalVisible(true);
        }}
      >
        Add Blog
      </Button>
      <List
        dataSource={data?.findManyBlogs}
        renderItem={(item: IBlog) => (
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
            {item.translations.find((t) => t.languageCode === "en")?.headline}
          </List.Item>
        )}
      />
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1200}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (currentBlog) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
            handleCancel();
          }}
        >
          <Form.Item label="Background Image" name="background">
            <FileUpload onUpload={handleImageUpload} />
            {loadingImage && <p>Loading...</p>}
          </Form.Item>
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Form.Item label="English Headline" name="enHeadline">
            <Input />
          </Form.Item>
          <Form.Item label="English About" name="enAbout">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="English Markdown" name="enMarkdown">
            <StyledReactQuill theme="snow" />
          </Form.Item>
          <Form.Item label="Georgian Headline" name="kaHeadline">
            <Input />
          </Form.Item>
          <Form.Item label="Georgian About" name="kaAbout">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Georgian Markdown" name="kaMarkdown">
            <StyledReactQuill theme="snow" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Blogs;
