import React from "react";
import { Tabs, Card } from "antd";
import { UserOutlined, HistoryOutlined, HeartOutlined, LockOutlined } from "@ant-design/icons";
import ProfileInfo from "./ProfileInfo";
import BookingHistory from "./BookingHistory";
import FavoriteMovies from "./FavoriteMovies";
import ChangePassword from "./ChangePassword";

const Profile = () => {
  return (
    <Card style={{ maxWidth: 900, margin: "32px auto" }}>
      <Tabs
        defaultActiveKey="info"
        tabPosition="left"
        items={[
          {
            key: "info",
            label: (
              <span><UserOutlined /> Thông tin cá nhân</span>
            ),
            children: <ProfileInfo />,
          },
          {
            key: "history",
            label: (
              <span><HistoryOutlined /> Lịch sử đặt vé</span>
            ),
            children: <BookingHistory />,
          },
          {
            key: "favorite",
            label: (
              <span><HeartOutlined /> Yêu thích</span>
            ),
            children: <FavoriteMovies />,
          },
          {
            key: "changepass",
            label: (
              <span><LockOutlined /> Đổi mật khẩu</span>
            ),
            children: <ChangePassword />,
          },
        ]}
      />
    </Card>
  );
};

export default Profile; 