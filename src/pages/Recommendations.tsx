import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IRecommendations } from "../types/Recommednations";
import { GET_RECOMMENDATIONS } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import {
  CREATE_RECOMMENDATION,
  DELETE_RECOMMENDATIONS,
  UPDATE_RECOMMENDATIONS,
} from "@graphql/mutation";

const Recommendations = () => {
  const [deleteOneRecommendation] = useMutation(DELETE_RECOMMENDATIONS, {
    refetchQueries: [{ query: GET_RECOMMENDATIONS }],
    onCompleted: () => {
      message.success("Recommendations deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneRecommendation({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentRecommendations, setCurrentRecommendations] =
    useState<IRecommendations | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null | undefined>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      setImage(result.secure_url);
    } catch {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };

  const { data, loading, error } = useQuery(GET_RECOMMENDATIONS);
  useEffect(() => {
    console.log(data);
    console.log(currentRecommendations);
    if (currentRecommendations) {
      currentRecommendations && setImage(currentRecommendations.image);
    } else {
      setImage(null);
    }
  }, [currentRecommendations]);
  const [createOneRecommendations] = useMutation(CREATE_RECOMMENDATION, {
    refetchQueries: [{ query: GET_RECOMMENDATIONS }],
    onCompleted: () => message.success("Recommendation created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneRecommendations] = useMutation(UPDATE_RECOMMENDATIONS, {
    refetchQueries: [{ query: GET_RECOMMENDATIONS }],
    onCompleted: () => message.success("Recommendation updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    try {
      await createOneRecommendations({
        variables: {
          input: {
            image: image,
            date: values.date,
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    bio: values.enBio,
                    role: values.enRole,
                    description: values.enDescription,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    bio: values.kaBio,
                    role: values.kaRole,
                    description: values.kaDescription,
                    languageCode: "ka",
                  },
                ],
              },
            },
          },
        },
      });
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating recommendation:", error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateOneRecommendations({
        variables: {
          id: currentRecommendations?.id,
          data: {
            image: { set: image },
            date: { set: values.date },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    bio: { set: values.enBio },
                    role: { set: values.enRole },
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    bio: { set: values.kaBio },
                    role: { set: values.kaRole },
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
      console.error("Error updating recommendation:", error);
    }
  };

  const handleCancel = () => {
    setCurrentRecommendations(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (recommendations: IRecommendations) => {
    setCurrentRecommendations(recommendations);
    setIsModalVisible(true);

    const en = recommendations.translations.find(
      (t) => t.languageCode === "en"
    );
    const ka = recommendations.translations.find(
      (t) => t.languageCode === "ka"
    );

    const initialValues = {
      date: recommendations?.date,
      enDescription: en?.description,
      enName: en?.name,
      enBio: en?.bio,
      enRole: en?.role,
      kaDescription: ka?.description,
      kaName: ka?.name,
      kaBio: ka?.bio,
      kaRole: ka?.role,
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
        Add New Recommendation
      </Button>

      <List
        dataSource={data?.findManyRecommendations || []}
        renderItem={(recommendations: IRecommendations) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(recommendations)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(recommendations.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                recommendations.translations.find(
                  (t: any) => t.languageCode === "en"
                )?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={
          currentRecommendations
            ? "Edit Recommendation"
            : "Create Recommendation"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentRecommendations) {
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
          onFinish={currentRecommendations ? handleUpdate : handleCreate}
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
              <img
                src={image}
                alt="uploaded"
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="English Name"
            name="enName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Georgian Name"
            name="kaName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="English Bio"
            name="enBio"
            rules={[{ required: true }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Georgian Bio"
            name="kaBio"
            rules={[{ required: true }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="English Role"
            name="enRole"
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
            label="English Description"
            name="enDescription"
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
        </Form>
      </Modal>
    </div>
  );
};

export default Recommendations;
