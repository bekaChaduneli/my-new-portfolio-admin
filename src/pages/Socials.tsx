import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ISocials, SocialsInitialValues } from "../types/Socials";
import { GET_SOCIALS } from "@graphql/query";
import {
  CREATE_SOCIAL,
  DELETE_SOCIALS,
  UPDATE_SOCIALS,
} from "@graphql/mutation";

const Socials = () => {
  const { data, loading, error } = useQuery(GET_SOCIALS);
  const [deleteOneSocial] = useMutation(DELETE_SOCIALS, {
    refetchQueries: [{ query: GET_SOCIALS }],
    onCompleted: () => {
      message.success("Socials deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneSocial({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentSocials, setCurrentSocials] = useState<ISocials | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createOneSocials] = useMutation(CREATE_SOCIAL, {
    refetchQueries: [{ query: GET_SOCIALS }],
    onCompleted: () => message.success("Social created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneSocials] = useMutation(UPDATE_SOCIALS, {
    refetchQueries: [{ query: GET_SOCIALS }],
    onCompleted: () => message.success("Social updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: SocialsInitialValues) => {
    try {
      await createOneSocials({
        variables: {
          input: {
            name: values.name,
            link: values.link,
            profile: { connect: { id: "1" } },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating social:", error);
    }
  };

  const handleUpdate = async (values: SocialsInitialValues) => {
    try {
      await updateOneSocials({
        variables: {
          id: currentSocials?.id,
          data: {
            name: { set: values.name },
            link: { set: values.link },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
      setCurrentSocials(null);
    } catch (error) {
      console.error("Error updating social:", error);
    }
  };

  const handleCancel = () => {
    setCurrentSocials(null);
    setIsModalVisible(false);

    form.resetFields();
  };

  const handleEdit = (socials: ISocials) => {
    setCurrentSocials(socials);
    setIsModalVisible(true);

    const initialValues = {
      name: socials.name,
      link: socials.link,
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
        Add New Social
      </Button>

      <List
        dataSource={data?.findManySocials || []}
        renderItem={(socials: ISocials) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(socials)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(socials.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={socials.name} />
          </List.Item>
        )}
      />

      <Modal
        title={currentSocials ? "Edit Social" : "Create Social"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentSocials) {
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
          onFinish={currentSocials ? handleUpdate : handleCreate}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Socials;
