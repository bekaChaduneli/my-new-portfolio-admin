import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  CertificatesInitialValues,
  ICertificates,
} from "../types/Certificates";
import { GET_CERTIFICATES } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import {
  CREATE_CERTIFICATE,
  DELETE_CERTIFICATES,
  UPDATE_CERTIFICATES,
} from "@graphql/mutation";

const Certificates = () => {
  const { data, loading, error } = useQuery(GET_CERTIFICATES);
  const [deleteOneCertificate] = useMutation(DELETE_CERTIFICATES, {
    refetchQueries: [{ query: GET_CERTIFICATES }],
    onCompleted: () => {
      message.success("Certificates deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneCertificate({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentCertificates, setCurrentCertificates] =
    useState<ICertificates | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

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

  const [createOneCertificates] = useMutation(CREATE_CERTIFICATE, {
    refetchQueries: [{ query: GET_CERTIFICATES }],
    onCompleted: () => message.success("Certificate created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneCertificates] = useMutation(UPDATE_CERTIFICATES, {
    refetchQueries: [{ query: GET_CERTIFICATES }],
    onCompleted: () => message.success("Certificate updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  useEffect(() => {
    if (currentCertificates) {
      currentCertificates && setImage(currentCertificates.image);
    } else {
      setImage(null);
    }
  }, [currentCertificates, isModalVisible]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: CertificatesInitialValues) => {
    try {
      await createOneCertificates({
        variables: {
          input: {
            image: image,
            link: values.link,
            issueDate: values.issueDate,
            expirationDate: values.expirationDate,
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    organiation: values.enOrganization,
                    description: values.enDescription,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    organiation: values.kaOrganization,
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
      setImage(null);
    } catch (error) {
      console.error("Error creating certificate:", error);
    }
  };

  const handleUpdate = async (values: CertificatesInitialValues) => {
    try {
      await updateOneCertificates({
        variables: {
          id: currentCertificates?.id,
          data: {
            image: { set: image },
            link: { set: values.link },
            issueDate: { set: values.issueDate },
            expirationDate: { set: values.expirationDate },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    organiation: { set: values.enOrganization },
                    description: { set: values.enDescription },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    organiation: { set: values.kaOrganization },
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
      setImage(null);
    } catch (error) {
      console.error("Error updating certificate:", error);
    }
  };

  const handleCancel = () => {
    setCurrentCertificates(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (certificates: ICertificates) => {
    setCurrentCertificates(certificates);
    setIsModalVisible(true);

    const en = certificates.translations.find((t) => t.languageCode === "en");
    const ka = certificates.translations.find((t) => t.languageCode === "ka");

    const initialValues: CertificatesInitialValues = {
      link: certificates.link,
      issueDate: certificates.issueDate,
      expirationDate: certificates.expirationDate,
      enName: en?.name,
      kaName: ka?.name,
      enOrganization: en?.organiation,
      kaOrganization: ka?.organiation,
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
        Add New Certificate
      </Button>

      <List
        dataSource={data?.findManyCertificates || []}
        renderItem={(certificates: ICertificates) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(certificates)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(certificates.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                certificates.translations.find((t) => t.languageCode === "en")
                  ?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentCertificates ? "Edit Certificate" : "Create Certificate"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentCertificates) {
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
          onFinish={currentCertificates ? handleUpdate : handleCreate}
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
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Issue Date"
            name="issueDate"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expirationDate"
            rules={[{ required: true }]}
          >
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
                label="English Organization"
                name="enOrganization"
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
                label="Georgian Organization"
                name="kaOrganization"
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

export default Certificates;
