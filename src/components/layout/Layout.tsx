import { ConfigProvider, Layout, ThemeConfig } from "antd";
import SideBar from "./SideBar";
import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { Login } from "@pages/Login";
import { useMutation } from "@apollo/client";
import { VALIDATE_TOKEN } from "@graphql/mutation";
import { useEffect, useState } from "react";
import adminStore from "@store/admin-store";

const { Content } = Layout;

const config: ThemeConfig = {
  components: {
    Button: {
      colorError: "rgb(252, 40, 40)",
      colorErrorBorderHover: "rgb(252, 40, 40)",
    },
  },
  token: {
    colorPrimary: "#4caf50",
    colorInfo: "#4caf50",
    colorSuccess: "#2dedb3",
    colorWarning: "#fca728",
    colorError: "#fc2828",
    colorLink: "#4caf50",
  },
};

export const CustomLayout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("collapsed") === "true"
  );

  const onCollapse = (collapsed: boolean) => {
    localStorage.setItem("collapsed", collapsed.toString());
    setCollapsed(collapsed);
  };

  const [validateToken] = useMutation(VALIDATE_TOKEN);
  const { logout, login, isAuthenticated } = adminStore();

  useEffect(() => {
    const validate = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await validateToken({ variables: { token } });
        if (data.validateToken.isValid) {
          login(token, data.validateToken.admin);
        } else {
          logout();
        }
      }
      setLoading(false);
    };

    validate();
  }, [validateToken, navigate, logout, login]);

  if (loading) return <LoadingWrapper>Loading...</LoadingWrapper>;

  return isAuthenticated ? (
    <ConfigProvider theme={config}>
      <StyledLayout>
        <SideBar onCollapse={onCollapse} collapsed={collapsed} />
        <MainLayout>
          <StyledContent $collapsed={collapsed}>
            <Outlet />
          </StyledContent>
        </MainLayout>
      </StyledLayout>
    </ConfigProvider>
  ) : (
    <LoginWrapper>
      <Login />
    </LoginWrapper>
  );
};

const StyledLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

const MainLayout = styled(Layout)`
  flex: 1;
  background: linear-gradient(to right, #ece9e6, #ffffff);
`;

const StyledContent = styled(Content)<{ $collapsed: boolean }>`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: margin-left 0.2s ease;
  margin-left: ${(props) => (props.$collapsed ? "80px" : "250px")};
`;

const LoginWrapper = styled.div`
  background-color: #f0f2f5;
  text-align: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
`;

export default CustomLayout;
