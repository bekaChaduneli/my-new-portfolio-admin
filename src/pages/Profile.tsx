import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, List, Form, message, Modal, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IProfile } from "../types/Profile";
import {
  CREATE_PROFILE,
  DELETE_PROFILE,
  UPDATE_PROFILE,
} from "@graphql/mutation";
import { GET_PROFILE } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";
import Dragger from "antd/es/upload/Dragger";

const Profile = () => {
  const { data, loading, error } = useQuery(GET_PROFILE);
  const [deleteOneProfile] = useMutation(DELETE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: () => {
      message.success("Profile deleted successfully!");
    },
    onError: (error) => {
      console.log(error.message);
      message.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    deleteOneProfile({ variables: { id } });
  };

  const [form] = Form.useForm();
  const [currentProfile, setCurrentProfile] = useState<IProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);

  const handleFileUpload = async (file: File, type: "image" | "resume") => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      const url = result.secure_url;
      switch (type) {
        case "image":
          setImage(url);
          break;
        case "resume":
          setResume(url);
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

  const [createOneProfile] = useMutation(CREATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: () => {
      message.success("Profile created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE }],
    onCompleted: () => {
      message.success("Profile updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    console.log(values);
    createOneProfile({
      variables: {
        input: {
          id: "1",
          age: values.age,
          image: image,
          resume: resume,
          mail: values.mail,
          translations: {
            createMany: {
              data: [
                {
                  name: values.enName,
                  surname: values.enSurname,
                  profession: values.enProfession,
                  location: values.enLocation,
                  experience: values.enExperience,
                  university: values.enUniversity,
                  universityAbout: values.enUniversityAbout,
                  aboutMe: values.enAboutMe,
                  languageCode: "en",
                },
                {
                  name: values.kaName,
                  surname: values.kaSurname,
                  profession: values.kaProfession,
                  location: values.kaLocation,
                  experience: values.kaExperience,
                  university: values.kaUniversity,
                  universityAbout: values.kaUniversityAbout,
                  aboutMe: values.kaAboutMe,
                  languageCode: "ka",
                },
              ],
            },
          },
        },
      },
    });
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    updateOneProfile({
      variables: {
        id: "1",
        data: {
          image: { set: image },
          resume: { set: resume },
          age: { set: values.age },
          mail: { set: values.mail },
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  name: { set: values.enName },
                  surname: { set: values.enSurname },
                  profession: { set: values.enProfession },
                  location: { set: values.enLocation },
                  experience: { set: values.enExperience },
                  university: { set: values.enUniversity },
                  universityAbout: { set: values.enUniversityAbout },
                  aboutMe: { set: values.enAboutMe },
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  name: { set: values.kaName },
                  surname: { set: values.kaSurname },
                  profession: { set: values.kaProfession },
                  location: { set: values.kaLocation },
                  experience: { set: values.kaExperience },
                  university: { set: values.kaUniversity },
                  universityAbout: { set: values.kaUniversityAbout },
                  aboutMe: { set: values.kaAboutMe },
                },
              },
            ],
          },
        },
      },
    });
  };

  const handleCancel = () => {
    setCurrentProfile(null);
    setImage(null);
    setResume(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEdit = (profile: IProfile) => {
    setCurrentProfile(profile);
    setIsModalVisible(true);

    const en = profile.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = profile.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues = {
      image: image,
      resume: resume,
      age: profile.age,
      mail: profile.mail,
      enName: en?.name,
      kaName: ka?.name,
      enSurname: en?.surname,
      kaSurname: ka?.surname,
      enProfession: en?.profession,
      kaProfession: ka?.profession,
      enLocation: en?.location,
      kaLocation: ka?.location,
      enExperience: en?.experience,
      kaExperience: ka?.experience,
      enUniversity: en?.university,
      kaUniversity: ka?.university,
      enUniversityAbout: en?.universityAbout,
      kaUniversityAbout: ka?.universityAbout,
      enAboutMe: en?.aboutMe,
      kaAboutMe: ka?.aboutMe,
    };
    form.setFieldsValue(initialValues);
  };

  console.log(data?.findFirstProfile);

  return (
    <div>
      {!data?.findFirstProfile && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Profile
        </Button>
      )}
      <List
        dataSource={data?.findFirstProfile ? [data?.findFirstProfile] : []}
        renderItem={(profile: any) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(profile)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => {
                  console.log(profile.id);
                  handleDelete(profile.id);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={profile.link}
              description={
                <>
                  <div>
                    {
                      profile.translations.find(
                        (t: any) => t.languageCode === "en"
                      )?.name
                    }
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={currentProfile ? "Edit Profile" : "Create Profile"}
        onOk={() => {
          form.validateFields().then((values) => {
            if (currentProfile) {
              handleUpdate(values);
            } else {
              handleCreate(values);
            }
            setIsModalVisible(false);
          });
        }}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1200}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentProfile ? handleUpdate : handleCreate}
        >
          <Form.Item label="image">
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
              <p className="ant-upload-text">Click or drag to upload image</p>
            </Dragger>
            {image && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={image}
                  alt={`image`}
                  style={{ width: 100, height: 100, marginRight: 10 }}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="Resume">
            <Dragger
              name="file"
              customRequest={({ file, onSuccess }) => {
                handleFileUpload(file as File, "resume");
                onSuccess?.({});
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">Click or drag to upload resume</p>
            </Dragger>
            {resume && (
              <div style={{ marginTop: 10 }}>
                <h1 style={{ width: 100, height: 100, marginRight: 10 }}>
                  resume
                </h1>
              </div>
            )}
          </Form.Item>
          <Form.Item label="Age" name="age" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mail" name="mail" rules={[{ required: true }]}>
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
                label="English Surname"
                name="enSurname"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English Profession"
                name="enProfession"
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
                label="English Experience"
                name="enExperience"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="English Company" name="enCompany">
                <Input />
              </Form.Item>
              <Form.Item label="English University" name="enUniversity">
                <Input />
              </Form.Item>
              <Form.Item
                label="English UniversityAbout"
                name="enUniversityAbout"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="English AboutMe"
                name="enAboutMe"
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
                label="Georgian Surname"
                name="kaSurname"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian Profession"
                name="kaProfession"
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
                label="Georgian Experience"
                name="kaExperience"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Georgian Company" name="kaCompany">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian University" name="kaUniversity">
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian UniversityAbout"
                name="kaUniversityAbout"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Georgian AboutMe"
                name="kaAboutMe"
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

export default Profile;
