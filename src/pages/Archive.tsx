import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ARCHIVE,
  DELETE_ARCHIVE,
  UPDATE_ARCHIVE,
} from "@graphql/mutation";
import { Button, List, Form, message, Modal, Input, Tag } from "antd";
import {
  IArchive,
  IArchivesResponse,
  IArchiveTranslation,
} from "../types/Archive";
import { FileUpload } from "@components/FileUpload";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { GET_ARCHIVES } from "@graphql/query";

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

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
    createOneArchive({
      variables: {
        input: {
          link: values.link,
          github: values.github,
          background: values.background,
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
  };

  const handleUpdate = (values: any) => {
    updateOneArchive({
      variables: {
        id: currentArchive?.id,
        data: {
          link: { set: values.link },
          github: { set: values.github },
          background: { set: values.background },
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
  };

  const handleCancel = () => {
    setCurrentArchive(null);
    form.resetFields();
    setSkills([]);
    setSkillInput("");
    setImageUrl(null);
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

    const initialValues = {
      link: archive.link,
      github: archive.github,
      background: archive.background,
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
      <Button
        type="primary"
        onClick={() => {
          setCurrentArchive(null);
          form.resetFields();
          setSkills([]);
          setSkillInput("");
          setImageUrl(null);
          setIsModalVisible(true);
        }}
      >
        Add Archive
      </Button>
      <List
        dataSource={data?.archives}
        renderItem={(archive) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(archive)}>
                Edit
              </Button>,
              <Button type="link" onClick={() => handleDelete(archive.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={archive.link} description={archive.github} />
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
        <Form form={form} layout="vertical">
          <Form.Item label="Link" name="link">
            <Input />
          </Form.Item>
          <Form.Item label="GitHub" name="github">
            <Input />
          </Form.Item>
          <Form.Item label="Background" name="background">
            <FileUpload onUpload={handleImageUpload} />
            {loadingImage && <p>Loading...</p>}
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
            <Button onClick={addSkill}>Add Skill</Button>
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
          <Form.Item label="English Name" name="enName">
            <Input />
          </Form.Item>
          <Form.Item label="English Description" name="enDescription">
            <Input />
          </Form.Item>
          <Form.Item label="English Location" name="enLocation">
            <Input />
          </Form.Item>
          <Form.Item label="Georgian Name" name="kaName">
            <Input />
          </Form.Item>
          <Form.Item label="Georgian Description" name="kaDescription">
            <Input />
          </Form.Item>
          <Form.Item label="Georgian Location" name="kaLocation">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Archives;
