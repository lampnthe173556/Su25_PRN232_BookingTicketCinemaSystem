import React, { useState } from "react";
import { Table, Input, Button, Modal, Form, message, Popconfirm } from "antd";

const initialActors = [
  { id: 1, name: "Robert Downey Jr.", type: "Actor" },
  { id: 2, name: "Anthony Russo", type: "Director" },
  { id: 3, name: "Joaquin Phoenix", type: "Actor" },
];

const Actors = () => {
  const [actors, setActors] = useState(initialActors);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };
  const handleDelete = (id) => {
    setActors(actors.filter(a => a.id !== id));
    message.success("Xóa thành công!");
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setActors(actors.map(a => a.id === editing.id ? { ...editing, ...values } : a));
        message.success("Cập nhật thành công!");
      } else {
        setActors([...actors, { ...values, id: Date.now() }]);
        message.success("Thêm thành công!");
      }
      setModalOpen(false);
    });
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Loại", dataIndex: "type", key: "type" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý Actor/Director</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm</Button>
      <Table columns={columns} dataSource={actors} rowKey="id" pagination={false} style={{ width: "100%" }} scroll={{ x: true }} />
      <Modal
        title={editing ? "Cập nhật" : "Thêm"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: "Nhập tên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true, message: "Chọn loại!" }]}
            initialValue="Actor">
            <Input placeholder="Actor hoặc Director" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Actors; 