import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const user = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
};

const ProfileInfo = () => (
  <div>
    <Title level={3}>Thông tin tài khoản</Title>
    <div><b>Họ tên:</b> {user.name}</div>
    <div><b>Email:</b> {user.email}</div>
  </div>
);

export default ProfileInfo; 