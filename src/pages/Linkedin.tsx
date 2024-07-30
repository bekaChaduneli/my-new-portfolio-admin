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
  Upload,
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

const Linkedin = () => {
  const { data, loading, error } = useQuery(GET_LINKEDIN);
  const [deleteOneLinkedin] = useMutation(DELETE_LINKEDIN, {
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

  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);

  const handleFileUpload = async (
    file: File,
    type: "image" | "banner" | "postImage"
  ) => {
    try {
      setLoadingImage(true);
      const result = await uploadToCloudinary(file);
      const url = result.secure_url;
      switch (type) {
        case "image":
          setImage(url);
          break;
        case "banner":
          setBanner(url);
          break;
        case "postImage":
          setPostImage(url);
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

  const [createOneLinkedin] = useMutation(CREATE_LINKEDIN, {
    refetchQueries: [{ query: GET_LINKEDIN }],
    onCompleted: () => {
      message.success("LinkedIn profile created successfully!");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const [updateOneLinkedin] = useMutation(UPDATE_LINKEDIN, {
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
    console.log(values);
    // createOneLinkedin({
    //   variables: {
    //     input: {
    //       image: uploadedImage,
    //       banner: uploadedBanner,
    //       link: values.link,
    //       translations: {
    //         createMany: {
    //           data: [
    //             {
    //               name: values.enName,
    //               bio: values.enBio,
    //               company: values.enCompany,
    //               languageCode: "en",
    //               university: values.enUniversity,
    //             },
    //             {
    //               name: values.kaName,
    //               bio: values.kaBio,
    //               company: values.kaCompany,
    //               languageCode: "ka",
    //               university: values.kaUniversity,
    //             },
    //           ],
    //         },
    //       },
    //       posts: {
    //         createMany: {
    //           data: values.posts.map((post: IPosts) => ({
    //             image: post.image,
    //             likes: post.likes,
    //             commentsSum: post.commentsSum,
    //             link: post.link,
    //             translations: {
    //               createMany: {
    //                 data: [
    //                   {
    //                     linkedinName: post.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.linkedinName,
    //                     description: post.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.description,
    //                     languageCode: "en",
    //                   },
    //                   {
    //                     linkedinName: post.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.linkedinName,
    //                     description: post.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.description,
    //                     languageCode: "ka",
    //                   },
    //                 ],
    //               },
    //             },
    //           })),
    //         },
    //       },
    //       topSkills: {
    //         createMany: {
    //           data: values.topSkills.map((skill: ITopSkills) => ({
    //             translations: {
    //               createMany: {
    //                 data: [
    //                   {
    //                     linkedinName: skill.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.linkedinName,
    //                     name: skill.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.name,
    //                     languageCode: "en",
    //                   },
    //                   {
    //                     linkedinName: skill.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.linkedinName,
    //                     name: skill.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.name,
    //                     languageCode: "ka",
    //                   },
    //                 ],
    //               },
    //             },
    //           })),
    //         },
    //       },
    //     },
    //   },
    // });
  };

  const handleUpdate = async (values: any) => {
    console.log(values);
    // updateOneLinkedin({
    //   variables: {
    //     id: currentLinkedin?.id,
    //     data: {
    //       image: uploadedImage || currentLinkedin?.image,
    //       banner: uploadedBanner || currentLinkedin?.banner,
    //       link: values.link,
    //       translations: {
    //         updateMany: [
    //           {
    //             where: { languageCode: { equals: "en" } },
    //             data: {
    //               name: values.enName,
    //               bio: values.enBio,
    //               company: values.enCompany,
    //               university: values.enUniversity,
    //             },
    //           },
    //           {
    //             where: { languageCode: { equals: "ka" } },
    //             data: {
    //               name: values.kaName,
    //               bio: values.kaBio,
    //               company: values.kaCompany,
    //               university: values.kaUniversity,
    //             },
    //           },
    //         ],
    //       },
    //       posts: {
    //         updateMany: values.posts.map((post: IPosts) => ({
    //           where: { id: { equals: post.id } },
    //           data: {
    //             image: post.image,
    //             likes: post.likes,
    //             commentsSum: post.commentsSum,
    //             link: post.link,
    //             translations: {
    //               updateMany: [
    //                 {
    //                   where: { languageCode: { equals: "en" } },
    //                   data: {
    //                     linkedinName: post.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.linkedinName,
    //                     description: post.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.description,
    //                   },
    //                 },
    //                 {
    //                   where: { languageCode: { equals: "ka" } },
    //                   data: {
    //                     linkedinName: post.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.linkedinName,
    //                     description: post.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.description,
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         })),
    //       },
    //       topSkills: {
    //         updateMany: values.topSkills.map((skill: ITopSkills) => ({
    //           where: { id: { equals: skill.id } },
    //           data: {
    //             translations: {
    //               updateMany: [
    //                 {
    //                   where: { languageCode: { equals: "en" } },
    //                   data: {
    //                     linkedinName: skill.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.linkedinName,
    //                     name: skill.translations.find(
    //                       (t) => t.languageCode === "en"
    //                     )?.name,
    //                   },
    //                 },
    //                 {
    //                   where: { languageCode: { equals: "ka" } },
    //                   data: {
    //                     linkedinName: skill.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.linkedinName,
    //                     name: skill.translations.find(
    //                       (t) => t.languageCode === "ka"
    //                     )?.name,
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         })),
    //       },
    //     },
    //   },
    // });
  };

  const handleCancel = () => {
    setCurrentLinkedin(null);
    setImage(null);
    setBanner(null);
    setPostImage(null);
    setIsModalVisible(false);
    form.resetFields();
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
      posts: linkedin.posts,
      topSkills: linkedin.topSkills,
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
        Add New LinkedIn Profile
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={data?.linkedin || []}
        renderItem={(linkedin: any) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(linkedin)}>
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() =>
                  deleteOneLinkedin({ variables: { id: linkedin.id } })
                }
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={linkedin.link}
              description={
                <>
                  <div>
                    {
                      linkedin.translations.find(
                        (t: any) => t.languageCode === "en"
                      )?.name
                    }
                  </div>
                  <div>
                    {
                      linkedin.translations.find(
                        (t: any) => t.languageCode === "en"
                      )?.bio
                    }
                  </div>
                </>
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
        width={1200}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentLinkedin ? handleUpdate : handleCreate}
        >
          <Form.Item label="Link" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Form.Item name="image" valuePropName="file" noStyle>
              <Upload name="image" listType="picture">
                <Button icon={<PlusOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Banner">
            <Form.Item name="banner" valuePropName="file" noStyle>
              <Upload name="banner" listType="picture">
                <Button icon={<PlusOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
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
                label="English Bio"
                name="enBio"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="English Company" name="enCompany">
                <Input />
              </Form.Item>
              <Form.Item label="English University" name="enUniversity">
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
                label="Georgian Bio"
                name="kaBio"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Georgian Company" name="kaCompany">
                <Input />
              </Form.Item>
              <Form.Item label="Georgian University" name="kaUniversity">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="posts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <>
                    <Form.Item
                      {...restField}
                      name={[name, "image"]}
                      fieldKey={fieldKey ? [fieldKey, "image"] : ""}
                      label="Post Image"
                      valuePropName="file"
                    >
                      <Upload name="image" listType="picture">
                        <Button icon={<PlusOutlined />}>Upload</Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "link"]}
                      fieldKey={fieldKey ? [fieldKey, "link"] : ""}
                      label="Post Link"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "likes"]}
                      fieldKey={fieldKey ? [fieldKey, "likes"] : ""}
                      label="Likes"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "commentsSum"]}
                      fieldKey={fieldKey ? [fieldKey, "commentsSum"] : ""}
                      label="Comments"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      fieldKey={fieldKey ? [fieldKey, "enDescription"] : ""}
                      label="English Description"
                      name="enDescription"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      fieldKey={fieldKey ? [fieldKey, "kaDescription"] : ""}
                      label="Georgian Description"
                      name="kaDescription"
                    >
                      <Input />
                    </Form.Item>

                    <MinusCircleOutlined
                      style={{ marginBottom: "16px", color: "red" }}
                      onClick={() => remove(name)}
                    />
                  </>
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
                  <>
                    <Form.Item
                      {...restField}
                      name={[name, "kaName"]}
                      fieldKey={fieldKey ? [fieldKey, "kaName"] : ""}
                      label="Georgian Name"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "enName"]}
                      fieldKey={fieldKey ? [fieldKey, "enName"] : ""}
                      label="English Name"
                    >
                      <Input />
                    </Form.Item>
                    <MinusCircleOutlined
                      style={{ color: "red", marginBottom: "16px" }}
                      onClick={() => remove(name)}
                    />
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Skill
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

export default Linkedin;
