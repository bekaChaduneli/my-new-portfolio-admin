import { useEffect } from "react";
import { Button, Layout, Menu } from "antd";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import adminStore from "@store/admin-store";
import { menuItems } from "../../lib/siteData";

const { Sider } = Layout;

const NewSideBar = ({
  onCollapse,
  collapsed,
}: {
  onCollapse: (collapsed: boolean) => void;
  collapsed: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = adminStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        onCollapse(true);
      }
    };

    handleResize(); // Check initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onCollapse]);

  return (
    <CustomSider
      style={{ marginLeft: "10px", paddingTop: "20px" }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <CustomMenu
        mode="inline"
        style={{
          maxHeight: "83vh",
          overflowY: "scroll",
        }}
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          key: item.href,
          icon: item.icon,
          label: item.label,
          onClick: () => navigate(item.href),
        }))}
      />
      <Footer>
        <LogoutButton onClick={logout}>Log Out</LogoutButton>
        <div className="arrow">
          <ToggleArrow
            onClick={() => {
              onCollapse(!collapsed);
            }}
            $collapsed={collapsed}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.21415 12.0502L11.4572 16.2932C11.8476 16.6836 11.8476 17.3167 11.4572 17.7072C11.0667 18.0976 10.4336 18.0976 10.0432 17.7072L5.09326 12.7573C4.70273 12.3667 4.70273 11.7336 5.09326 11.343L10.0432 6.39315C10.4336 6.00268 11.0667 6.00268 11.4572 6.39315C11.8476 6.78362 11.8476 7.41668 11.4572 7.80715L7.21415 12.0502Z"
                fill="#1A1A1A"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 12C20 12.5523 19.5523 13 19 13H6.5C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11H19C19.5523 11 20 11.4477 20 12Z"
                fill="#1A1A1A"
              />
            </svg>
          </ToggleArrow>
        </div>
      </Footer>
    </CustomSider>
  );
};

export default NewSideBar;

const CustomSider = styled(Sider)`
  background: transparent;
  color: #fff;
  height: 100vh;
  position: fixed;
  left: 0;
  overflow: auto;
`;

const CustomMenu = styled(Menu)`
  background: transparent;
  color: #fff;

  .ant-menu-item-selected {
    background-color: blue !important;
    color: #fff !important;

    .anticon {
      color: #fff !important;
    }
  }

  .ant-menu-item {
    &:hover {
      background-color: blue !important;
      color: #fff !important;

      .anticon {
        color: #fff !important;
      }
    }
  }

  .anticon {
    color: #fff;
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 10px 0;
`;

const LogoutButton = styled(Button)`
  width: 90%;
  border-radius: 0;
  margin-bottom: 10px;
`;

const ToggleArrow = styled.div<{ $collapsed: boolean }>`
  cursor: pointer;
  svg {
    transform: ${(props) =>
      props.$collapsed ? "rotate(180deg)" : "rotate(0)"};
    transition: transform 0.3s ease;
  }
`;
