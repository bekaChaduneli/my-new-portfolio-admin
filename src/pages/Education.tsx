import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IEducations } from "../types/Educations";
import { GET_EDUCATIONS } from "@graphql/query";
import {
  CREATE_EDUCATION,
  DELETE_EDUCATIONS,
  UPDATE_EDUCATIONS,
} from "@graphql/mutation";

const Educations = () => {
  const { data, loading, error } = useQuery(GET_EDUCATIONS);
  const [deleteOneEducation] = useMutation(DELETE_EDUCATIONS, {
    refetchQueries: [{ query: GET_EDUCATIONS }],
    onCompleted: () => {
      message.success("Educations deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneEducation({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentEducations, setCurrentEducations] =
    useState<IEducations | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneEducations] = useMutation(CREATE_EDUCATION, {
    refetchQueries: [{ query: GET_EDUCATIONS }],
    onCompleted: () => message.success("Education created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneEducations] = useMutation(UPDATE_EDUCATIONS, {
    refetchQueries: [{ query: GET_EDUCATIONS }],
    onCompleted: () => message.success("Education updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    try {
      await createOneEducations({
        variables: {
          input: {
            link: values.link,
            fromDate: values.fromDate,
            toDate: values.toDate,
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    degree: values.enDegree,
                    fieldOfStudy: values.enFieldOfStudy,
                    gpa: values.enGpa,
                    description: values.enDescription,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    degree: values.kaDegree,
                    fieldOfStudy: values.kaFieldOfStudy,
                    gpa: values.kaGpa,
                    description: values.kaDescription,
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
      console.error("Error creating education:", error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateOneEducations({
        variables: {
          id: currentEducations?.id,
          data: {
            link: { set: values.link },
            fromDate: { set: values.fromDate },
            toDate: { set: values.toDate },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    degree: { set: values.enDegree },
                    fieldOfStudy: { set: values.enFieldOfStudy },
                    gpa: { set: values.enGpa },
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    degree: { set: values.kaDegree },
                    fieldOfStudy: { set: values.kaFieldOfStudy },
                    gpa: { set: values.kaGpa },
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
      console.error("Error updating education:", error);
    }
  };

  const handleCancel = () => {
    setCurrentEducations(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (educations: IEducations) => {
    setCurrentEducations(educations);
    setIsModalVisible(true);

    const en = educations.translations.find((t) => t.languageCode === "en");
    const ka = educations.translations.find((t) => t.languageCode === "ka");

    const initialValues = {
      link: educations.link,
      fromDate: educations.fromDate,
      toDate: educations.toDate,
      enName: en?.name,
      kaName: ka?.name,
      enDegree: en?.degree,
      kaDegree: ka?.degree,
      enFieldOfStudy: en?.fieldOfStudy,
      kaFieldOfStudy: ka?.fieldOfStudy,
      enGpa: en?.gpa,
      kaGpa: ka?.gpa,
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
        Add New Education
      </Button>

      <List
        dataSource={data?.findManyEducations || []}
        renderItem={(educations: IEducations) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(educations)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(educations.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                educations.translations.find(
                  (t: any) => t.languageCode === "en"
                )?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentEducations ? "Edit Education" : "Create Education"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentEducations) {
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
          onFinish={currentEducations ? handleUpdate : handleCreate}
        >
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="FromDate"
            name="fromDate"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="ToDate" name="toDate" rules={[{ required: true }]}>
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
                label="English Degree"
                name="enDegree"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English FieldOfStudy"
                name="enFieldOfStudy"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Gpa"
                name="enGpa"
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
                label="Georgian Degree"
                name="kaDegree"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian FieldOfStudy"
                name="kaFieldOfStudy"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian Gpa"
                name="kaGpa"
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Educations;
