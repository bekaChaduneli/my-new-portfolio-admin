import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IWorks, WorksInitialValues } from "../types/Works";
import { GET_WORKS } from "@graphql/query";
import { CREATE_WORK, DELETE_WORKS, UPDATE_WORKS } from "@graphql/mutation";

const Works = () => {
  const { data, loading, error } = useQuery(GET_WORKS);
  const [deleteOneWork] = useMutation(DELETE_WORKS, {
    refetchQueries: [{ query: GET_WORKS }],
    onCompleted: () => {
      message.success("Works deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneWork({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentWorks, setCurrentWorks] = useState<IWorks | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneWorks] = useMutation(CREATE_WORK, {
    refetchQueries: [{ query: GET_WORKS }],
    onCompleted: () => message.success("Work created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneWorks] = useMutation(UPDATE_WORKS, {
    refetchQueries: [{ query: GET_WORKS }],
    onCompleted: () => message.success("Work updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: WorksInitialValues) => {
    try {
      await createOneWorks({
        variables: {
          input: {
            link: values.link,
            fromDate: values.fromDate,
            toDate: values.toDate,
            translations: {
              createMany: {
                data: [
                  {
                    company: values.enCompany,
                    role: values.enRole,
                    description: values.enDescription,
                    location: values.enLocation,
                    locationType: values.enLocationType,
                    employmentType: values.enEmploymentType,
                    languageCode: "en",
                  },
                  {
                    company: values.kaCompany,
                    role: values.kaRole,
                    description: values.kaDescription,
                    location: values.kaLocation,
                    locationType: values.kaLocationType,
                    employmentType: values.kaEmploymentType,
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
      console.error("Error creating work:", error);
    }
  };

  const handleUpdate = async (values: WorksInitialValues) => {
    try {
      await updateOneWorks({
        variables: {
          id: currentWorks?.id,
          data: {
            link: { set: values.link },
            fromDate: { set: values.fromDate },
            toDate: { set: values.toDate },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    company: { set: values.enCompany },
                    role: { set: values.enRole },
                    description: { set: values.enDescription },
                    location: { set: values.enLocation },
                    locationType: { set: values.enLocationType },
                    employmentType: { set: values.enEmploymentType },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    company: { set: values.kaCompany },
                    role: { set: values.kaRole },
                    description: { set: values.kaDescription },
                    location: { set: values.kaLocation },
                    locationType: { set: values.kaLocationType },
                    employmentType: { set: values.kaEmploymentType },
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
      console.error("Error updating work:", error);
    }
  };

  const handleCancel = () => {
    setCurrentWorks(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (works: IWorks) => {
    setCurrentWorks(works);
    setIsModalVisible(true);

    const en = works.translations.find((t) => t.languageCode === "en");
    const ka = works.translations.find((t) => t.languageCode === "ka");

    const initialValues: WorksInitialValues = {
      link: works.link,
      fromDate: works.fromDate,
      toDate: works.toDate,
      enCompany: en?.company,
      kaCompany: ka?.company,
      enRole: en?.role,
      kaRole: ka?.role,
      enDescription: en?.description,
      kaDescription: ka?.description,
      enLocation: en?.location,
      kaLocation: ka?.location,
      enLocationType: en?.locationType,
      kaLocationType: ka?.locationType,
      enEmploymentType: en?.employmentType,
      kaEmploymentType: ka?.employmentType,
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
        Add New Work
      </Button>

      <List
        dataSource={data?.findManyWorks || []}
        renderItem={(works: IWorks) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(works)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => handleDelete(works.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                works.translations.find((t) => t.languageCode === "en")?.company
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentWorks ? "Edit Work" : "Create Work"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentWorks) {
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
          onFinish={currentWorks ? handleUpdate : handleCreate}
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
                label="English Company"
                name="enCompany"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Role"
                name="enRole"
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
              <Form.Item
                label="English Location"
                name="enLocation"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English LocationType"
                name="enLocationType"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English EmploymentType"
                name="enEmploymentType"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Georgian Company"
                name="kaCompany"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian Role"
                name="kaRole"
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
              <Form.Item
                label="Georgian Location"
                name="kaLocation"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian LocationType"
                name="kaLocationType"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian EmploymentType"
                name="kaEmploymentType"
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

export default Works;
