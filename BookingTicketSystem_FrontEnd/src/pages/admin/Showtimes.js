import React, { useState } from "react";
import { Table, Input, Button, Modal, Form, message, Popconfirm } from "antd";

const initialShowtimes = [
  { id: 1, movie: "Avengers: Endgame", date: "2024-06-10", time: "18:00", room: "Phòng 1" },
  { id: 2, movie: "Joker", date: "2024-06-11", time: "20:00", room: "Phòng 2" },
];

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState(initialShowtimes);
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
    setShowtimes(showtimes.filter(s => s.id !== id));
    message.success("Xóa suất chiếu thành công!");
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setShowtimes(showtimes.map(s => s.id === editing.id ? { ...editing, ...values } : s));
        message.success("Cập nhật suất chiếu thành công!");
      } else {
        setShowtimes([...showtimes, { ...values, id: Date.now() }]);
        message.success("Thêm suất chiếu thành công!");
      }
      setModalOpen(false);
    });
  };

  const columns = [
    { title: "Phim", dataIndex: "movie", key: "movie" },
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    { title: "Phòng", dataIndex: "room", key: "room" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Xóa suất chiếu này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý suất chiếu</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm suất chiếu</Button>
      <Table columns={columns} dataSource={showtimes} rowKey="id" pagination={{ pageSize: 6 }} style={{ width: "100%" }} scroll={{ x: true }} />
      <Modal
        title={editing ? "Cập nhật suất chiếu" : "Thêm suất chiếu"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="movie" label="Phim" rules={[{ required: true, message: "Nhập tên phim!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: "Nhập ngày!" }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{ required: true, message: "Nhập giờ!" }]}>
            <Input type="time" />
          </Form.Item>
          <Form.Item name="room" label="Phòng" rules={[{ required: true, message: "Nhập phòng!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Showtimes; 