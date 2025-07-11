import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, VideoCameraOutlined, CalendarOutlined } from "@ant-design/icons";

const Dashboard = () => (
  <div style={{ maxWidth: 900, margin: "0 auto" }}>
    <h2>Admin Dashboard</h2>
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Tổng số user" value={120} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Tổng số phim" value={35} prefix={<VideoCameraOutlined />} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Tổng suất chiếu" value={80} prefix={<CalendarOutlined />} />
        </Card>
      </Col>
    </Row>
  </div>
);

export default Dashboard; 