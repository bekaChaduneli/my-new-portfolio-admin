import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Button,
  List,
  Form,
  message,
  Modal,
  Input,
  Tag,
  Upload,
  Row,
  Col,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined } from "@ant-design/icons";

import {
  IMainProjects,
  IMainProjectsResponse,
  MainProjectsInitialValues,
} from "../types/MainProjects";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { GET_MAINPROJECTS } from "@graphql/query";
import {
  CREATE_MAINPROJECT,
  DELETE_MAINPROJECTS,
  UPDATE_MAINPROJECT,
} from "@graphql/mutation";
import styled from "styled-components";

const { Dragger } = Upload;

const MainProjectsPage: React.FC = () => {
  const { data, loading, error } =
    useQuery<IMainProjectsResponse>(GET_MAINPROJECTS);
  const [createOneMainProjects] = useMutation(CREATE_MAINPROJECT, {
    refetchQueries: [{ query: GET_MAINPROJECTS }],
    onCompleted: () => {
      message.success("Main project created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const StyledReactQuill = styled(ReactQuill)`
    height: 300px;
    margin-bottom: 30px;
    width: 100%;
  `;

  const [updateOneMainProjects] = useMutation(UPDATE_MAINPROJECT, {
    refetchQueries: [{ query: GET_MAINPROJECTS }],
    onCompleted: () => {
      message.success("Main project updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [deleteOneMainProjects] = useMutation(DELETE_MAINPROJECTS, {
    refetchQueries: [{ query: GET_MAINPROJECTS }],
    onCompleted: () => {
      message.success("Main project deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentProject, setCurrentProject] = useState<IMainProjects | null>(
    null
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [mobileBackgrounds, setMobileBackgrounds] = useState<string[]>([]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleFileUpload = async (
    file: File,
    type: "image" | "video" | "mobileBackground"
  ) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      const url = result.secure_url;
      switch (type) {
        case "image":
          setImages((prev) => [...prev, url]);
          break;
        case "video":
          setVideos((prev) => [...prev, url]);
          break;
        case "mobileBackground":
          setMobileBackgrounds((prev) => [...prev, url]);
          break;
        default:
          message.error("Unsupported file type.");
      }
    } catch (error) {
      message.error("Error uploading file.");
    } finally {
      setLoadingImage(false);
    }
  };
  const handleCreate = (values: MainProjectsInitialValues) => {
    createOneMainProjects({
      variables: {
        input: {
          link: values.link,
          github: values.github,
          background: images[0] || null,
          isReal: values.isReal,
          skills: { set: skills },
          images: { set: images },
          video: { set: videos },
          mobileBackgrounds: { set: mobileBackgrounds },
          translations: {
            create: [
              {
                languageCode: "en",
                name: values.enName,
                description: values.enDescription,
                markdown: values.enMarkdown,
                about: values.enAbout,
                location: values.enLocation,
              },
              {
                languageCode: "ka",
                name: values.kaName,
                description: values.kaDescription,
                markdown: values.kaMarkdown,
                about: values.kaAbout,
                location: values.kaLocation,
              },
            ],
          },
        },
      },
    });
  };

  const handleUpdate = (values: MainProjectsInitialValues) => {
    updateOneMainProjects({
      variables: {
        id: currentProject?.id,
        data: {
          link: { set: values.link },
          github: { set: values.github },
          background: { set: images[0] || null },
          isReal: { set: values.isReal },
          skills: { set: skills },
          images: { set: images },
          video: { set: videos },
          mobileBackgrounds: { set: mobileBackgrounds },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  name: { set: values.enName },
                  description: { set: values.enDescription },
                  markdown: { set: values.enMarkdown },
                  about: { set: values.enAbout },
                  location: { set: values.enLocation },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  name: { set: values.kaName },
                  description: { set: values.kaDescription },
                  markdown: { set: values.kaMarkdown },
                  about: { set: values.kaAbout },
                  location: { set: values.kaLocation },
                },
              },
            ],
          },
        },
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteOneMainProjects({ variables: { id } });
  };

  const handleCancel = () => {
    setCurrentProject(null);
    form.resetFields();
    setSkills([]);
    setSkillInput("");
    setImages([]);
    setVideos([]);
    setMobileBackgrounds([]);
    setIsModalVisible(false);
  };

  const handleEdit = (project: IMainProjects) => {
    setCurrentProject(project);
    setIsModalVisible(true);

    const en = project.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = project.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues: MainProjectsInitialValues = {
      link: project.link,
      github: project.github,
      background: project.background || "",
      isReal: project.isReal,
      images: project.images,
      video: project.video,
      mobileBackgrounds: project.mobileBackgrounds,
      enName: en?.name || "",
      enDescription: en?.description || "",
      enMarkdown: en?.markdown || "",
      enAbout: en?.about || "",
      enLocation: en?.location || "",
      kaName: ka?.name || "",
      kaDescription: ka?.description || "",
      kaMarkdown: ka?.markdown || "",
      kaAbout: ka?.about || "",
      kaLocation: ka?.location || "",
    };

    form.setFieldsValue(initialValues);
    setSkills(project.skills);
    setImages(project.images);
    setVideos(project.video);
    setMobileBackgrounds(project.mobileBackgrounds);
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
          setCurrentProject(null);
          form.resetFields();
          setSkills([]);
          setSkillInput("");
          setImages([]);
          setVideos([]);
          setMobileBackgrounds([]);
          setIsModalVisible(true);
        }}
      >
        Add Main Project
      </Button>

      <List
        dataSource={data?.findManyMainProjects}
        renderItem={(project) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(project)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta title={project.link} />
          </List.Item>
        )}
      />

      <Modal
        visible={isModalVisible}
        title={currentProject ? "Edit Main Project" : "Add Main Project"}
        onCancel={handleCancel}
        width={1200}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentProject) {
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

          <Form.Item label="GitHub Link" name="github">
            <Input />
          </Form.Item>

          <Form.Item label="Background Image">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "image");
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag to upload background image
              </p>
            </Dragger>

            {images.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`background-${index}`}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                ))}
              </div>
            )}
          </Form.Item>

          <Form.Item label="Video">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "video");
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">Click or drag to upload video</p>
            </Dragger>
            {videos.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {videos.map((url, index) => (
                  <video
                    key={index}
                    src={url}
                    controls
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                ))}
              </div>
            )}
          </Form.Item>

          <Form.Item label="Mobile Background Images">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "mobileBackground");
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag to upload mobile background images
              </p>
            </Dragger>
            {mobileBackgrounds.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {mobileBackgrounds.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`mobile-background-${index}`}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                ))}
              </div>
            )}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="English Name" name="enName">
                <Input />
              </Form.Item>
              <Form.Item label="English Description" name="enDescription">
                <Input />
              </Form.Item>
              <Form.Item label="English Markdown" name="enMarkdown">
                <StyledReactQuill />
              </Form.Item>
              <Form.Item label="English About" name="enAbout">
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
              <Form.Item label="Georgian Markdown" name="kaMarkdown">
                <StyledReactQuill />
              </Form.Item>
              <Form.Item label="Georgian About" name="kaAbout">
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

export default MainProjectsPage;
