import React, { useState } from "react";
import { Table, Input, Button, Modal, Form, message, Popconfirm } from "antd";

const initialGenres = [
  { id: 1, name: "Hành động" },
  { id: 2, name: "Tâm lý" },
  { id: 3, name: "Kinh dị" },
];

const Genres = () => {
  const [genres, setGenres] = useState(initialGenres);
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
    setGenres(genres.filter(g => g.id !== id));
    message.success("Xóa thể loại thành công!");
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setGenres(genres.map(g => g.id === editing.id ? { ...editing, ...values } : g));
        message.success("Cập nhật thể loại thành công!");
      } else {
        setGenres([...genres, { ...values, id: Date.now() }]);
        message.success("Thêm thể loại thành công!");
      }
      setModalOpen(false);
    });
  };

  const columns = [
    { title: "Tên thể loại", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Xóa thể loại này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý thể loại</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm thể loại</Button>
      <Table columns={columns} dataSource={genres} rowKey="id" pagination={false} style={{ width: "100%" }} scroll={{ x: true }} />
      <Modal
        title={editing ? "Cập nhật thể loại" : "Thêm thể loại"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên thể loại" rules={[{ required: true, message: "Nhập tên thể loại!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Genres; 