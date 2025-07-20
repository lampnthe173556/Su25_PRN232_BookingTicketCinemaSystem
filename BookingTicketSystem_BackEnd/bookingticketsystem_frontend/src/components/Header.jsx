import React from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LoginOutlined, LogoutOutlined, DashboardOutlined, HeartOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";

const { Header } = Layout;

const menuItems = [
  { key: "home", label: <Link to="/">Trang chủ</Link> },
  { key: "movies", label: <Link to="/">Phim</Link> },
  { key: "booking", label: <Link to="/booking">Đặt vé</Link> },
  { key: "favorites", label: <Link to="/favorites">Yêu thích</Link> },
];

const adminMenuItems = [
  { key: "dashboard", label: <Link to="/admin">Dashboard</Link>, icon: <DashboardOutlined /> },
  { key: "manage-users", label: <Link to="/admin/users">Quản lý user</Link> },
  { key: "manage-movies", label: <Link to="/admin/movies">Quản lý phim</Link> },
  { key: "manage-genres", label: <Link to="/admin/genres">Quản lý thể loại</Link> },
  { key: "manage-actors", label: <Link to="/admin/actors">Quản lý actor/director</Link> },
  { key: "manage-showtimes", label: <Link to="/admin/showtimes">Quản lý suất chiếu</Link> },
];

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Tài khoản</Link>
      </Menu.Item>
      <Menu.Item key="favorites" icon={<HeartOutlined />}>
        <Link to="/favorites">Phim yêu thích</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: "#001529", padding: 0, position: "sticky", top: 0, zIndex: 100, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", height: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 24, marginRight: 32 }}>
          <Link to="/" style={{ color: "#fff" }}>🎬 MovieTicket</Link>
        </div>
        {user && user.role === "admin" ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname.split("/")[2] || "dashboard"]}
            items={adminMenuItems}
            style={{ flex: 1, minWidth: 0 }}
          />
        ) : (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname.split("/")[1] || "home"]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0 }}
          />
        )}
        <div style={{ marginLeft: 16 }}>
          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <span style={{ color: "#fff", cursor: "pointer" }}>
                <Avatar style={{ backgroundColor: user.role === "admin" ? "#faad14" : "#87d068" }} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button icon={<LoginOutlined />} type="primary">Đăng nhập</Button>
            </Link>
          )}
        </div>
      </div>
    </Header>
  );
};

export default AppHeader; 