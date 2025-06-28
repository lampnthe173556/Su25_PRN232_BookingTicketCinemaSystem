import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    // Giả lập đăng ký thành công
    message.success("Đăng ký thành công!");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <Card style={{ maxWidth: 400, margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>Đăng ký</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Đăng ký</Button>
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </Form>
    </Card>
  );
};

export default Register; 