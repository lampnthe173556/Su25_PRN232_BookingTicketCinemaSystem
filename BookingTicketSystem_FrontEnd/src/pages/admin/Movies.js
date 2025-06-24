import React, { useState } from "react";
import { Table, Input, Button, Modal, Form, message, Popconfirm } from "antd";

const initialMovies = [
  { id: 1, title: "Avengers: Endgame", genre: "Hành động", director: "Anthony Russo", actor: "Robert Downey Jr.", year: 2019 },
  { id: 2, title: "Joker", genre: "Tâm lý", director: "Todd Phillips", actor: "Joaquin Phoenix", year: 2019 },
];

const Movies = () => {
  const [movies, setMovies] = useState(initialMovies);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

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
    setMovies(movies.filter(m => m.id !== id));
    message.success("Xóa phim thành công!");
  };
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setMovies(movies.map(m => m.id === editing.id ? { ...editing, ...values } : m));
        message.success("Cập nhật phim thành công!");
      } else {
        setMovies([...movies, { ...values, id: Date.now() }]);
        message.success("Thêm phim thành công!");
      }
      setModalOpen(false);
    });
  };

  const columns = [
    { title: "Tên phim", dataIndex: "title", key: "title" },
    { title: "Thể loại", dataIndex: "genre", key: "genre" },
    { title: "Đạo diễn", dataIndex: "director", key: "director" },
    { title: "Diễn viên", dataIndex: "actor", key: "actor" },
    { title: "Năm", dataIndex: "year", key: "year" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Xóa phim này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý phim</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm phim</Button>
      <Input.Search
        placeholder="Tìm kiếm theo tên phim..."
        allowClear
        style={{ maxWidth: 300, marginBottom: 16, marginLeft: 16 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 6 }} style={{ width: "100%" }} scroll={{ x: true }} />
      <Modal
        title={editing ? "Cập nhật phim" : "Thêm phim"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên phim" rules={[{ required: true, message: "Nhập tên phim!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="genre" label="Thể loại" rules={[{ required: true, message: "Nhập thể loại!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="director" label="Đạo diễn" rules={[{ required: true, message: "Nhập đạo diễn!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="actor" label="Diễn viên" rules={[{ required: true, message: "Nhập diễn viên!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Năm" rules={[{ required: true, message: "Nhập năm!" }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Movies; 