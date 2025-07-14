import React from "react";
import { Form, Input, Button, message } from "antd";

const ChangePassword = () => {
  const onFinish = (values) => {
    // Giả lập đổi mật khẩu thành công
    message.success("Đổi mật khẩu thành công!");
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h3>Đổi mật khẩu</h3>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="oldPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword; 