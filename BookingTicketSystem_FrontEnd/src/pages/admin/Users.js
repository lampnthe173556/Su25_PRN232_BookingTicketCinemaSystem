import React, { useState } from "react";
import { Table, Input, Button, Popconfirm, message } from "antd";

const initialUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "user@gmail.com", role: "user" },
  { id: 2, name: "Admin Demo", email: "admin@gmail.com", role: "admin" },
  { id: 3, name: "Trần Thị B", email: "tranb@gmail.com", role: "user" },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    message.success("Xóa user thành công!");
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Quyền", dataIndex: "role", key: "role" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm title="Xóa user này?" onConfirm={() => handleDelete(record.id)}>
          <Button danger size="small">Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý user</h2>
      <Input.Search
        placeholder="Tìm kiếm theo tên hoặc email..."
        allowClear
        style={{ maxWidth: 300, marginBottom: 16 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 6 }} style={{ width: "100%" }} scroll={{ x: true }} />
    </div>
  );
};

export default Users; 