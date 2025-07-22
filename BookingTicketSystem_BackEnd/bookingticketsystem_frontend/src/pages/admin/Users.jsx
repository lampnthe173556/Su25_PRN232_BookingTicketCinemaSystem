import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  Card,
  Typography,
  Select,
  DatePicker,
  Tag,
  InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import userService from '../../services/userService';
import { User } from '../../models/User';
import Toast from '../../components/Toast';
import '../../styles/admin.css';

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      // Chỉ giữ lại các trường đúng với DTO UserDisplayDTOs
      const filtered = (data || []).map(u => ({
        userId: u.userId,
        name: u.name,
        email: u.email,
        phone: u.phone,
        loyaltyPoints: u.loyaltyPoints,
        createdAt: u.createdAt,
        modifiedAt: u.modifiedAt,
        isActive: u.isActive,
        roleId: u.roleId,
        roleName: u.roleName,
      }));
      setUsers(filtered);
    } catch (error) {
      Toast.error('Không thể tải danh sách người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      address: record.address,
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
      gender: record.gender,
      role: record.role
    });
    setModalVisible(true);
  };

  const handleDelete = async (email) => {
    if (!email) {
      Toast.error('Email không hợp lệ');
      return;
    }
    try {
      await userService.delete(email);
      Toast.success('Xóa người dùng thành công');
      loadUsers();
    } catch (error) {
      Toast.error('Không thể xóa người dùng: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const userData = new User({
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString().split('T')[0] : null
      });
      
      if (editingUser) {
        await userService.update(editingUser.email, userData.toUpdateDto());
        Toast.success('Cập nhật người dùng thành công');
      } else {
        await userService.create(userData.toCreateDto());
        Toast.success('Thêm người dùng thành công');
      }
      
      setModalVisible(false);
      loadUsers();
    } catch (error) {
      Toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleViewDetail = (record) => {
    setDetailUser(record);
    setDetailVisible(true);
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      loadUsers();
      return;
    }
    
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase()) || 
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filtered);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red';
      case 'user': return 'blue';
      default: return 'default';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'user': return 'Người dùng';
      default: return role;
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return gender;
    }
  };

  // Hàm toggle trạng thái hoạt động user
  const handleToggleActive = async (user) => {
    try {
      await userService.update(user.email, { isActive: !user.isActive });
      Toast.success(`${user.isActive ? 'Khóa' : 'Mở khóa'} người dùng thành công`);
      loadUsers();
    } catch (error) {
      Toast.error('Không thể cập nhật trạng thái: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    // Bỏ cột giới tính
    // {
    //   title: 'Giới tính',
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   width: 100,
    //   render: (gender) => getGenderText(gender),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Xem
          </Button>
          {/* Không cho phép sửa hoặc khóa admin */}
          {record.roleId !== 1 && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="small"
              >
                Sửa
              </Button>
              <Button
                type={record.isActive ? 'default' : 'primary'}
                danger={record.isActive}
                icon={record.isActive ? <LockOutlined /> : <UnlockOutlined />}
                onClick={() => handleToggleActive(record)}
                size="small"
              >
                {record.isActive ? 'Khóa' : 'Mở khóa'}
              </Button>
            </>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.email)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.roleId === 1}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ borderRadius: 16, boxShadow: '0 2px 12px #e0e0e0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Quản lý người dùng</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            Thêm người dùng
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên hoặc email..."
            allowClear
            style={{ width: 320, borderRadius: 8 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
          />
          {searchText && (
            <Button onClick={() => { setSearchText(''); loadUsers(); }}>
              Xóa tìm kiếm
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={users.map((item, idx) => ({ ...item, key: item.userId ?? `row-${idx}` }))}
          rowKey="userId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          scroll={{ x: 1200 }}
          style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}
        />

        {/* Modal thêm/sửa người dùng */}
        <Modal
          title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={480}
          destroyOnClose
          style={{ top: 80 }}
          bodyStyle={{ padding: 24 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ maxWidth: 400, margin: '0 auto' }}
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            {/* Nếu cần nhập mật khẩu khi tạo user mới */}
            {!editingUser && (
              <Form.Item
                name="passwordHash"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingUser ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết người dùng */}
        <Modal
          title="Chi tiết người dùng"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>
          ]}
          width={600}
        >
          {detailUser && (
            <div>
              <p><strong>Họ và tên:</strong> {detailUser.name}</p>
              <p><strong>Email:</strong> {detailUser.email}</p>
              <p><strong>Số điện thoại:</strong> {detailUser.phone || 'Không có'}</p>
              <p><strong>Điểm tích lũy:</strong> {detailUser.loyaltyPoints ?? 0}</p>
              <p><strong>Trạng thái:</strong> <Tag color={detailUser.isActive ? 'green' : 'red'}>{detailUser.isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag></p>
              <p><strong>Ngày tạo:</strong> {detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
              <p><strong>Ngày sửa:</strong> {detailUser.modifiedAt ? new Date(detailUser.modifiedAt).toLocaleDateString('vi-VN') : '-'}</p>
              <p><strong>Vai trò:</strong> {detailUser.roleName || detailUser.roleId}</p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Users; 