import React from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  VideoCameraOutlined,
  TagsOutlined,
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content, Header } = Layout;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
  { key: "users", icon: <UserOutlined />, label: <Link to="/admin/users">Quản lý user</Link> },
  { key: "movies", icon: <VideoCameraOutlined />, label: <Link to="/admin/movies">Quản lý phim</Link> },
  { key: "genres", icon: <TagsOutlined />, label: <Link to="/admin/genres">Quản lý thể loại</Link> },
  { key: "actors", icon: <TeamOutlined />, label: <Link to="/admin/actors">Quản lý actor/director</Link> },
  { key: "showtimes", icon: <CalendarOutlined />, label: <Link to="/admin/showtimes">Quản lý suất chiếu</Link> },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const selectedKey = location.pathname.split("/")[2] || "dashboard";
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#001529" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 22, textAlign: "center", padding: 24 }}>
          🎬 Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ fontSize: 16 }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "flex-end", boxShadow: "0 2px 8px #eee" }}>
          <Avatar style={{ backgroundColor: "#faad14", marginRight: 12 }} icon={<UserOutlined />} />
          <span style={{ fontWeight: 600, marginRight: 24 }}>{user?.name || "Admin"}</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>Đăng xuất</Button>
        </Header>
        <Content style={{ margin: 0, background: "#f5f6fa", minHeight: "100vh", width: "100%", padding: "32px 32px 0 32px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 