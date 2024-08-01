import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ARCHIVE,
  DELETE_ARCHIVE,
  UPDATE_ARCHIVE,
} from "@graphql/mutation";
import { Button, List, Form, message, Modal, Input, Tag, Row, Col } from "antd";
import {
  ArchiveInitialValues,
  IArchive,
  IArchivesResponse,
  IArchiveTranslation,
} from "../types/Archive";
import { PlusOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { GET_ARCHIVES } from "@graphql/query";
import Dragger from "antd/es/upload/Dragger";

const Archives = () => {
  const { data, loading, error } = useQuery<IArchivesResponse>(GET_ARCHIVES);
  const [deleteArchive] = useMutation(DELETE_ARCHIVE, {
    refetchQueries: [{ query: GET_ARCHIVES }],
    onCompleted: () => {
      message.success("Archive deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentArchive, setCurrentArchive] = useState<IArchive | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
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
    if (currentArchive) {
      currentArchive && setImage(currentArchive.background);
    } else {
      setImage(null);
    }
  }, [currentArchive]);

  const [createOneArchive] = useMutation(CREATE_ARCHIVE, {
    refetchQueries: [{ query: GET_ARCHIVES }],
    onCompleted: () => {
      message.success("Archive created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneArchive] = useMutation(UPDATE_ARCHIVE, {
    refetchQueries: [{ query: GET_ARCHIVES }],
    onCompleted: () => {
      message.success("Archive updated successfully!");
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

  const handleCreate = (values: ArchiveInitialValues) => {
    createOneArchive({
      variables: {
        input: {
          link: values.link,
          github: values.github,
          background: image,
          isReal: values.isReal,
          skills: { set: skills },
          translations: {
            create: [
              {
                languageCode: "en",
                name: values.enName,
                description: values.enDescription,
                location: values.enLocation,
              },
              {
                languageCode: "ka",
                name: values.kaName,
                description: values.kaDescription,
                location: values.kaLocation,
              },
            ],
          },
        },
      },
    });
    form.resetFields();
    setCurrentArchive(null);
    setIsModalVisible(false);
    setSkills([]);
    setSkillInput("");
    setImage(null);
  };

  const handleUpdate = (values: ArchiveInitialValues) => {
    updateOneArchive({
      variables: {
        id: currentArchive?.id,
        data: {
          link: { set: values.link },
          github: { set: values.github },
          background: { set: image },
          isReal: { set: values.isReal },
          skills: { set: skills },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  name: { set: values.enName },
                  description: { set: values.enDescription },
                  location: { set: values.enLocation },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  name: { set: values.kaName },
                  description: { set: values.kaDescription },
                  location: { set: values.kaLocation },
                },
              },
            ],
          },
        },
      },
    });
    form.resetFields();
    setCurrentArchive(null);
    setIsModalVisible(false);
    setSkills([]);
    setSkillInput("");
    setImage(null);
  };

  const handleCancel = () => {
    setCurrentArchive(null);
    form.resetFields();
    setSkills([]);
    setSkillInput("");
    setImage(null);
    setIsModalVisible(false);
  };

  const handleEdit = (archive: IArchive) => {
    setCurrentArchive(archive);
    setIsModalVisible(true);

    const en = archive.translations.find(
      (translation: IArchiveTranslation) => translation.languageCode === "en"
    );
    const ka = archive.translations.find(
      (translation: IArchiveTranslation) => translation.languageCode === "ka"
    );

    const initialValues: ArchiveInitialValues = {
      link: archive.link,
      github: archive.github,
      background: image,
      isReal: archive.isReal,
      enName: en?.name,
      enDescription: en?.description,
      enLocation: en?.location,
      kaName: ka?.name,
      kaDescription: ka?.description,
      kaLocation: ka?.location,
    };

    form.setFieldsValue(initialValues);
    setSkills(archive.skills);
  };

  const handleDelete = (id: string) => {
    deleteArchive({ variables: { id } });
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add New Archive
      </Button>
      <List
        dataSource={data?.archives}
        renderItem={(archive: IArchive) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(archive)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(archive.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                archive.translations.find((t) => t.languageCode === "en")?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        visible={isModalVisible}
        title={currentArchive ? "Edit Archive" : "Add Archive"}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentArchive) {
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
          onFinish={currentArchive ? handleUpdate : handleCreate}
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
          <Form.Item label="GitHub" name="github">
            <Input />
          </Form.Item>
          <Form.Item label="Is Real" name="isReal" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item label="Skills">
            <Input
              value={skillInput}
              style={{ marginBottom: "14px" }}
              onChange={(e) => setSkillInput(e.target.value)}
              onPressEnter={addSkill}
            />
            <Button
              style={{ marginRight: "14px", marginBottom: "14px" }}
              onClick={addSkill}
            >
              Add Skill
            </Button>
            {skills.map((skill) => (
              <Tag
                key={skill}
                closable
                onClose={() => setSkills(skills.filter((s) => s !== skill))}
              >
                {skill}
              </Tag>
            ))}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="English Name" name="enName">
                <Input />
              </Form.Item>
              <Form.Item label="English Description" name="enDescription">
                <Input />
              </Form.Item>
              <Form.Item label="English Location" name="enLocation">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Georgian Name" name="kaName">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian Description" name="kaDescription">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian Location" name="kaLocation">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Archives;
