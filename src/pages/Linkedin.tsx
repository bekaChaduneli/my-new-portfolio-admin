import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  List,
  Form,
  message,
  Modal,
  Input,
  Row,
  Col,
  Space,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { ILinkedin, IPosts, ITopSkills } from "../types/Linkedin";
import {
  CREATE_LINKEDIN,
  DELETE_LINKEDIN,
  UPDATE_LINKEDIN,
} from "@graphql/mutation";
import { GET_LINKEDIN } from "@graphql/query";
import { uploadToCloudinary } from "../services/cloudinaryService";

const LinkedinPage = () => {
  const { data, loading, error } = useQuery(GET_LINKEDIN);
  const [deleteLinkedin] = useMutation(DELETE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("LinkedIn profile deleted successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [form] = Form.useForm();
  const [currentLinkedin, setCurrentLinkedin] = useState<ILinkedin | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [createLinkedin] = useMutation(CREATE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("LinkedIn profile created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateLinkedin] = useMutation(UPDATE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("LinkedIn profile updated successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = async (values: any) => {
    // Upload images to Cloudinary
    const uploadedImage = await uploadToCloudinary(values.image);
    const uploadedBanner = await uploadToCloudinary(values.banner);

    createLinkedin({
      variables: {
        input: {
          image: uploadedImage.url,
          banner: uploadedBanner.url,
          link: values.link,
          translations: {
            createMany: {
              data: [
                {
                  name: values.enName,
                  bio: values.enBio,
                  company: values.enCompany,
                  languageCode: "en",
                  university: values.enUniversity,
                },
                {
                  name: values.kaName,
                  bio: values.kaBio,
                  company: values.kaCompany,
                  languageCode: "ka",
                  university: values.kaUniversity,
                },
              ],
            },
          },
          posts: {
            createMany: {
              data: values.posts.map((post: IPosts) => ({
                image: post.image,
                likes: post.likes,
                commentsSum: post.commentsSum,
                link: post.link,
                translations: {
                  createMany: {
                    data: [
                      {
                        linkedinName: post.translations.find(
                          (t) => t.languageCode === "en"
                        )?.linkedinName,
                        description: post.translations.find(
                          (t) => t.languageCode === "en"
                        )?.description,
                        languageCode: "en",
                      },
                      {
                        linkedinName: post.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.linkedinName,
                        description: post.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.description,
                        languageCode: "ka",
                      },
                    ],
                  },
                },
              })),
            },
          },
          topSkills: {
            createMany: {
              data: values.topSkills.map((skill: ITopSkills) => ({
                translations: {
                  createMany: {
                    data: [
                      {
                        linkedinName: skill.translations.find(
                          (t) => t.languageCode === "en"
                        )?.linkedinName,
                        name: skill.translations.find(
                          (t) => t.languageCode === "en"
                        )?.name,
                        languageCode: "en",
                      },
                      {
                        linkedinName: skill.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.linkedinName,
                        name: skill.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.name,
                        languageCode: "ka",
                      },
                    ],
                  },
                },
              })),
            },
          },
        },
      },
    });
  };

  const handleUpdate = async (values: any) => {
    // Upload images to Cloudinary if changed
    const uploadedImage = values.image
      ? await uploadToCloudinary(values.image)
      : undefined;
    const uploadedBanner = values.banner
      ? await uploadToCloudinary(values.banner)
      : undefined;

    updateLinkedin({
      variables: {
        id: currentLinkedin?.id,
        data: {
          image: uploadedImage?.url || currentLinkedin?.image,
          banner: uploadedBanner?.url || currentLinkedin?.banner,
          link: values.link,
          translations: {
            updateMany: [
              {
                where: { languageCode: { equals: "en" } },
                data: {
                  name: values.enName,
                  bio: values.enBio,
                  company: values.enCompany,
                  university: values.enUniversity,
                },
              },
              {
                where: { languageCode: { equals: "ka" } },
                data: {
                  name: values.kaName,
                  bio: values.kaBio,
                  company: values.kaCompany,
                  university: values.kaUniversity,
                },
              },
            ],
          },
          posts: {
            updateMany: values.posts.map((post: IPosts) => ({
              where: { id: { equals: post.id } },
              data: {
                image: post.image,
                likes: post.likes,
                commentsSum: post.commentsSum,
                link: post.link,
                translations: {
                  updateMany: [
                    {
                      where: { languageCode: { equals: "en" } },
                      data: {
                        linkedinName: post.translations.find(
                          (t) => t.languageCode === "en"
                        )?.linkedinName,
                        description: post.translations.find(
                          (t) => t.languageCode === "en"
                        )?.description,
                      },
                    },
                    {
                      where: { languageCode: { equals: "ka" } },
                      data: {
                        linkedinName: post.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.linkedinName,
                        description: post.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.description,
                      },
                    },
                  ],
                },
              },
            })),
          },
          topSkills: {
            updateMany: values.topSkills.map((skill: ITopSkills) => ({
              where: { id: { equals: skill.id } },
              data: {
                translations: {
                  updateMany: [
                    {
                      where: { languageCode: { equals: "en" } },
                      data: {
                        linkedinName: skill.translations.find(
                          (t) => t.languageCode === "en"
                        )?.linkedinName,
                        name: skill.translations.find(
                          (t) => t.languageCode === "en"
                        )?.name,
                      },
                    },
                    {
                      where: { languageCode: { equals: "ka" } },
                      data: {
                        linkedinName: skill.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.linkedinName,
                        name: skill.translations.find(
                          (t) => t.languageCode === "ka"
                        )?.name,
                      },
                    },
                  ],
                },
              },
            })),
          },
        },
      },
    });
  };

  const handleCancel = () => {
    setCurrentLinkedin(null);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleEdit = (linkedin: ILinkedin) => {
    setCurrentLinkedin(linkedin);
    setIsModalVisible(true);

    const en = linkedin.translations.find(
      (translation) => translation.languageCode === "en"
    );
    const ka = linkedin.translations.find(
      (translation) => translation.languageCode === "ka"
    );

    const initialValues = {
      image: linkedin.image,
      banner: linkedin.banner,
      link: linkedin.link,
      enName: en?.name,
      enBio: en?.bio,
      enCompany: en?.company,
      enUniversity: en?.university,
      kaName: ka?.name,
      kaBio: ka?.bio,
      kaCompany: ka?.company,
      kaUniversity: ka?.university,
      posts: linkedin.posts.map((post: IPosts) => ({
        id: post.id,
        image: post.image,
        likes: post.likes,
        commentsSum: post.commentsSum,
        link: post.link,
        enLinkedinName: post.translations.find((t) => t.languageCode === "en")
          ?.linkedinName,
        enDescription: post.translations.find((t) => t.languageCode === "en")
          ?.description,
        kaLinkedinName: post.translations.find((t) => t.languageCode === "ka")
          ?.linkedinName,
        kaDescription: post.translations.find((t) => t.languageCode === "ka")
          ?.description,
      })),
      topSkills: linkedin.topSkills.map((skill: ITopSkills) => ({
        id: skill.id,
        enLinkedinName: skill.translations.find((t) => t.languageCode === "en")
          ?.linkedinName,
        enName: skill.translations.find((t) => t.languageCode === "en")?.name,
        kaLinkedinName: skill.translations.find((t) => t.languageCode === "ka")
          ?.linkedinName,
        kaName: skill.translations.find((t) => t.languageCode === "ka")?.name,
      })),
    };

    form.setFieldsValue(initialValues);
    setIsModalVisible(true);
  };

  const handleDelete = (linkedin: ILinkedin) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will permanently delete the LinkedIn profile.",
      onOk: () => deleteLinkedin({ variables: { id: linkedin.id } }),
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create New LinkedIn Profile
      </Button>

      <List
        itemLayout="horizontal"
        dataSource={data?.linkedin || []}
        renderItem={(linkedin: ILinkedin) => (
          <List.Item
            actions={[
              <Button onClick={() => handleEdit(linkedin)}>Edit</Button>,
              <Button danger onClick={() => handleDelete(linkedin)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <img
                  src={linkedin.image}
                  alt="Profile"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
              }
              title={
                linkedin.translations.find((t: any) => t.languageCode === "en")
                  ?.name
              }
              description={
                linkedin.translations.find((t: any) => t.languageCode === "en")
                  ?.bio
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title={
          currentLinkedin ? "Edit LinkedIn Profile" : "Create LinkedIn Profile"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentLinkedin ? handleUpdate : handleCreate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="image" label="Profile Image">
                <Input type="file" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="banner" label="Banner Image">
                <Input type="file" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="link" label="LinkedIn Profile Link">
            <Input />
          </Form.Item>

          <Form.Item name="enName" label="English Name">
            <Input />
          </Form.Item>
          <Form.Item name="enBio" label="English Bio">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="enCompany" label="English Company">
            <Input />
          </Form.Item>
          <Form.Item name="enUniversity" label="English University">
            <Input />
          </Form.Item>

          <Form.Item name="kaName" label="Georgian Name">
            <Input />
          </Form.Item>
          <Form.Item name="kaBio" label="Georgian Bio">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="kaCompany" label="Georgian Company">
            <Input />
          </Form.Item>
          <Form.Item name="kaUniversity" label="Georgian University">
            <Input />
          </Form.Item>

          <Form.List name="posts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "image"]}
                        fieldKey={fieldKey ? [fieldKey, "image"] : ""}
                        label="Post Image"
                      >
                        <Input type="file" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "likes"]}
                        fieldKey={fieldKey ? [fieldKey, "likes"] : ""}
                        label="Likes"
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "commentsSum"]}
                        fieldKey={fieldKey ? [fieldKey, "commentsSum"] : ""}
                        label="Comments Sum"
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "link"]}
                        fieldKey={fieldKey ? [fieldKey, "link"] : ""}
                        label="Post Link"
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "enLinkedinName"]}
                        fieldKey={fieldKey ? [fieldKey, "enLinkedinName"] : ""}
                        label="English LinkedIn Name"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "enDescription"]}
                        fieldKey={fieldKey ? [fieldKey, "enDescription"] : ""}
                        label="English Description"
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "kaLinkedinName"]}
                        fieldKey={fieldKey ? [fieldKey, "kaLinkedinName"] : ""}
                        label="Georgian LinkedIn Name"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "kaDescription"]}
                        fieldKey={fieldKey ? [fieldKey, "kaDescription"] : ""}
                        label="Georgian Description"
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Button
                        type="dashed"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Post
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.List name="topSkills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "enLinkedinName"]}
                        fieldKey={fieldKey ? [fieldKey, "enLinkedinName"] : ""}
                        label="English LinkedIn Name"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "enName"]}
                        fieldKey={fieldKey ? [fieldKey, "enName"] : ""}
                        label="English Skill Name"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "kaLinkedinName"]}
                        fieldKey={fieldKey ? [fieldKey, "kaLinkedinName"] : ""}
                        label="Georgian LinkedIn Name"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "kaName"]}
                        fieldKey={fieldKey ? [fieldKey, "kaName"] : ""}
                        label="Georgian Skill Name"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Button
                        type="dashed"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Top Skill
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentLinkedin ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LinkedinPage;
