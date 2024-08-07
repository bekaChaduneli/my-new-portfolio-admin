import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ISkills, SkillsInitialValues } from "../types/Skills";
import { GET_SKILLS } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";
import { CREATE_SKILLS, DELETE_SKILLS, UPDATE_SKILLS } from "@graphql/mutation";
import TextArea from "antd/es/input/TextArea";

const Skills = () => {
  const [deleteOneSkill] = useMutation(DELETE_SKILLS, {
    refetchQueries: [{ query: GET_SKILLS }],
    onCompleted: () => {
      message.success("Skills deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });
  const handleDelete = (id: string) => {
    deleteOneSkill({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentSkills, setCurrentSkills] = useState<ISkills | null>(null);
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

  const { data, loading, error } = useQuery(GET_SKILLS);
  useEffect(() => {
    if (currentSkills) {
      currentSkills && setImage(currentSkills.image);
    } else {
      setImage(null);
    }
  }, [currentSkills, isModalVisible]);
  const [createOneSkills] = useMutation(CREATE_SKILLS, {
    refetchQueries: [{ query: GET_SKILLS }],
    onCompleted: () => message.success("Skill created successfully!"),
    onError: (error) => message.error(error.message),
  });

  const [updateOneSkills] = useMutation(UPDATE_SKILLS, {
    refetchQueries: [{ query: GET_SKILLS }],
    onCompleted: () => message.success("Skill updated successfully!"),
    onError: (error) => message.error(error.message),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: SkillsInitialValues) => {
    try {
      await createOneSkills({
        variables: {
          input: {
            link: values.link,
            color: values.color,
            image: image,
            translations: {
              createMany: {
                data: [
                  {
                    name: values.enName,
                    about: values.enAbout,
                    languageCode: "en",
                  },
                  {
                    name: values.kaName,
                    about: values.kaAbout,
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
      console.error("Error creating skill:", error);
    }
  };

  const handleUpdate = async (values: SkillsInitialValues) => {
    try {
      await updateOneSkills({
        variables: {
          id: currentSkills?.id,
          data: {
            link: { set: values.link },
            image: { set: image },
            color: { set: values.color },
            translations: {
              updateMany: [
                {
                  where: { languageCode: { equals: "en" } },
                  data: {
                    name: { set: values.enName },
                    about: { set: values.enAbout },
                  },
                },
                {
                  where: { languageCode: { equals: "ka" } },
                  data: {
                    name: { set: values.kaName },
                    about: { set: values.kaAbout },
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
      console.error("Error updating skill:", error);
    }
  };

  const handleCancel = () => {
    setCurrentSkills(null);
    setImage(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (skills: ISkills) => {
    setCurrentSkills(skills);
    setIsModalVisible(true);

    const en = skills.translations.find((t) => t.languageCode === "en");
    const ka = skills.translations.find((t) => t.languageCode === "ka");

    const initialValues: SkillsInitialValues = {
      link: skills?.link,
      color: skills?.color,
      enName: en?.name,
      kaName: ka?.name,
      enAbout: en?.about,
      kaAbout: ka?.about,
    };
    form.setFieldsValue(initialValues);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{
          maxWidth: "208px",
        }}
      >
        Add New Skill
      </Button>

      <List
        dataSource={data?.findManySkills || []}
        renderItem={(skills: ISkills) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(skills)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(skills.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                skills.translations.find((t) => t.languageCode === "en")?.name
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentSkills ? "Edit Skill" : "Create Skill"}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentSkills) {
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
          onFinish={currentSkills ? handleUpdate : handleCreate}
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
          <Form.Item label="Color" name="color" rules={[{ required: true }]}>
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
                label="English about"
                name="enAbout"
                rules={[{ required: true }]}
              >
                <TextArea />
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
                label="Georgian about"
                name="kaAbout"
                rules={[{ required: true }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Skills;
