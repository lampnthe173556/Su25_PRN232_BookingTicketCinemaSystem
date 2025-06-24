import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  const onFinish = (values) => {
    const user = loginService(values);
    if (user) {
      login(user);
      message.success("Đăng nhập thành công!");
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin");
        else if (redirect) navigate(redirect);
        else navigate("/");
      }, 1000);
    } else {
      message.error("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "40px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>Đăng nhập</Title>
      <Form layout="vertical" onFinish={onFinish}>
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
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </Form>
      <div style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
        <b>Tài khoản demo:</b><br/>
        User: user@gmail.com / 123456<br/>
        Admin: admin@gmail.com / 123456
      </div>
    </Card>
  );
};

export default Login; 