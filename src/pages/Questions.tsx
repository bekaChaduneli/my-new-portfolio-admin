import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IQuestions } from "../types/Questions";
import { GET_QUESTIONS } from "@graphql/query";
import Dragger from "antd/es/upload/Dragger";
import {
  CREATE_QUESTION,
  DELETE_QUESTIONS,
  UPDATE_QUESTIONS,
} from "@graphql/mutation";

const Questions = () => {
  const { data, loading, error } = useQuery(GET_QUESTIONS);
  const [deleteOneQuestion] = useMutation(DELETE_QUESTIONS, {
    refetchQueries: [{ query: GET_QUESTIONS }],
    onCompleted: () => {
      message.success("Questions deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneQuestion({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentQuestions, setCurrentQuestions] = useState<IQuestions | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneQuestions] = useMutation(CREATE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
    onCompleted: () => message.success("Question created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneQuestions] = useMutation(UPDATE_QUESTIONS, {
    refetchQueries: [{ query: GET_QUESTIONS }],
    onCompleted: () => message.success("Question updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    try {
      await createOneQuestions({
        variables: {
          input: {
            translations: {
              createMany: {
                data: [
                  {
                    question: values.enQuestion,
                    answer: values.enAnswer,
                    languageCode: "en",
                  },
                  {
                    question: values.kaQuestion,
                    answer: values.kaAnswer,
                    languageCode: "ka",
                  },
                ],
              },
            },
            Profile: { connect: { id: "1" } },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateOneQuestions({
        variables: {
          id: currentQuestions?.id,
          data: {
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    question: { set: values.enQuestion },
                    answer: { set: values.enAnswer },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    question: { set: values.kaQuestion },
                    answer: { set: values.kaAnswer },
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
      console.error("Error updating question:", error);
    }
  };

  const handleCancel = () => {
    setCurrentQuestions(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (questions: IQuestions) => {
    setCurrentQuestions(questions);
    setIsModalVisible(true);

    const en = questions.translations.find((t) => t.languageCode === "en");
    const ka = questions.translations.find((t) => t.languageCode === "ka");

    const initialValues = {
      enQuestion: en?.question,
      kaQuestion: ka?.question,
      enAnswer: en?.answer,
      kaAnswer: ka?.answer,
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
        Add New Question
      </Button>

      <List
        dataSource={data?.findManyQuestions || []}
        renderItem={(questions: IQuestions) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(questions)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(questions.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                questions.translations.find((t: any) => t.languageCode === "en")
                  ?.question
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentQuestions ? "Edit Question" : "Create Question"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentQuestions) {
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
          onFinish={currentQuestions ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="English Question"
            name="enQuestion"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Georgian Question"
            name="kaQuestion"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="English Answer"
            name="enAnswer"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Georgian Answer"
            name="kaAnswer"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Questions;
