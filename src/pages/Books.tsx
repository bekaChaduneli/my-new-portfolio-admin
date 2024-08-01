import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_BOOKS } from "@graphql/query";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { IBook, IBooksResponse, IBookTranslation } from "../types/Books";
import { CREATE_BOOK, DELETE_BOOKS, UPDATE_BOOK } from "@graphql/mutation";
import { PlusOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";

export const Books = () => {
  const { data, loading, error } = useQuery<IBooksResponse>(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOKS, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      message.success("Book deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentBook, setCurrentBook] = useState<IBook | null>(null);
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
    if (currentBook) {
      currentBook && setImage(currentBook.image);
    } else {
      setImage(null);
    }
  }, [currentBook]);

  const [createOneBooks] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      message.success("Book created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneBooks] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      message.success("Book updated successfully!");
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
    createOneBooks({
      variables: {
        data: {
          index: values.id,
          pages: values.pages,
          readedPages: values.readedPages,
          type: values.type,
          image: image,
          link: values.link,
          finished: values.finished,
          translations: {
            createMany: {
              data: [
                {
                  title: values.kaTitle,
                  description: values.kaDescription,
                  author: values.kaAuthor,
                  languageCode: "ka",
                },
                {
                  title: values.enTitle,
                  description: values.enDescription,
                  author: values.enAuthor,
                  languageCode: "en",
                },
              ],
            },
          },
        },
      },
    });
    form.resetFields();
    setCurrentBook(null);
    setIsModalVisible(false);
  };

  const handleUpdate = (values: any) => {
    updateOneBooks({
      variables: {
        id: currentBook?.id,
        data: {
          index: { set: values.id },
          pages: { set: values.pages },
          readedPages: { set: values.readedPages },
          type: { set: values.type },
          image: { set: image },
          link: { set: values.link },
          finished: { set: values.finished },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  title: { set: values.kaTitle },
                  description: { set: values.kaDescription },
                  author: { set: values.kaAuthor },
                },
              },
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  title: { set: values.enTitle },
                  description: { set: values.enDescription },
                  author: { set: values.enAuthor },
                },
              },
            ],
          },
        },
      },
    });
    form.resetFields();
    setCurrentBook(null);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setCurrentBook(null);
    form.resetFields();
    setValue("");
    setImage(null);
    setIsModalVisible(false);
  };

  const handleEdit = (book: IBook) => {
    setCurrentBook(book);
    setIsModalVisible(true);

    const en = book.translations.find(
      (translation: IBookTranslation) => translation.languageCode === "en"
    );
    const ka = book.translations.find(
      (translation: IBookTranslation) => translation.languageCode === "ka"
    );

    const initialValues = {
      id: book.id,
      image: image,
      link: book.link,
      pages: book.pages,
      readedPages: book.readedPages,
      type: book.type,
      finished: book.finished,
      enTitle: en?.title,
      enDescription: en?.description,
      enAuthor: en?.author,
      kaTitle: ka?.title,
      kaDescription: ka?.description,
      kaAuthor: ka?.author,
    };

    form.setFieldsValue(initialValues);
  };

  const handleDelete = (id: string) => {
    deleteBook({ variables: { id } });
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Add New Book
      </Button>
      <List
        dataSource={data?.findManyBooks}
        renderItem={(item: IBook) => (
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
            {item.translations.find((t) => t.languageCode === "en")?.title}
          </List.Item>
        )}
      />
      <Modal
        title={currentBook ? "Edit Book" : "Create Book"}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentBook) {
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
          onFinish={currentBook ? handleUpdate : handleCreate}
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
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Form.Item label="ID" name="id">
            <Input />
          </Form.Item>
          <Form.Item label="Pages" name="pages">
            <Input />
          </Form.Item>
          <Form.Item label="Readed Pages" name="readedPages">
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Input />
          </Form.Item>
          <Form.Item label="Finished" name="finished" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="English Title" name="enTitle">
                <Input />
              </Form.Item>
              <Form.Item label="English Description" name="enDescription">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="English Author" name="enAuthor">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Georgian Title" name="kaTitle">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian Description" name="kaDescription">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Georgian Author" name="kaAuthor">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
