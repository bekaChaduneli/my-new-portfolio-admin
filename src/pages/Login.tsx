import { Button, Form, Input, Row, Col, Typography, Card } from "antd";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../graphql/mutation";
import adminStore from "@store/admin-store";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";

const { Title } = Typography;

type FieldType = {
  email?: string;
  password?: string;
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { error }] = useMutation(LOGIN);
  const { login: loginStore, isAuthenticated } = adminStore();

  if (isAuthenticated) {
    navigate("/");
  }

  const onFinish = (values: FieldType) => {
    login({ variables: { ...values } }).then((res) => {
      console.log(res);
      const token = res.data.loginAdmin.token;
      loginStore(token, res.data.loginAdmin.admin);
      navigate("/");
    });
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<FieldType>) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        maxWidth: "550px",
        width: "90%",
      }}
    >
      <Col style={{ width: "100%" }}>
        <Card
          style={{
            padding: 20,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
            Login
          </Title>
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {error && (
              <div
                style={{ color: "red", textAlign: "center", marginBottom: 16 }}
              >
                {error.message}
              </div>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
