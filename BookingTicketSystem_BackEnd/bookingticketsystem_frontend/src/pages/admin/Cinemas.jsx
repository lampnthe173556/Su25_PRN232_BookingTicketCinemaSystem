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
  message,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import cinemaService from '../../services/cinemaService';
import cityService from '../../services/cityService';
import { Cinema } from '../../models/Cinema';
import Toast from '../../components/Toast';
import '../../styles/admin.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailCinema, setDetailCinema] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cinemasData, citiesData] = await Promise.all([
        cinemaService.getAll(),
        cityService.getAll(),
      ]);
      
      setCinemas(cinemasData);
      setCities(citiesData);
    } catch (error) {
      Toast.error('Không thể tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCinema(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCinema(record);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
      description: record.description,
      cityId: record.cityId
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      Toast.error('ID không hợp lệ');
      return;
    }
    try {
      await cinemaService.delete(id);
      Toast.success('Xóa rạp chiếu thành công');
      loadData();
    } catch (error) {
      Toast.error('Không thể xóa rạp chiếu: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const cinemaData = new Cinema(values);
      
      if (editingCinema) {
        await cinemaService.update(editingCinema.id, cinemaData.toUpdateDto());
        Toast.success('Cập nhật rạp chiếu thành công');
      } else {
        await cinemaService.create(cinemaData.toCreateDto());
        Toast.success('Thêm rạp chiếu thành công');
      }
      
      setModalVisible(false);
      loadData();
    } catch (error) {
      Toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleViewDetail = (record) => {
    setDetailCinema(record);
    setDetailVisible(true);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadData();
      return;
    }
    
    setLoading(true);
    try {
      const results = await cinemaService.searchByName(searchText);
      setCinemas(results);
    } catch (error) {
      Toast.error('Không thể tìm kiếm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên rạp',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      width: 120,
      render: (city) => city ? city.name : '-',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: 'Số phòng chiếu',
      dataIndex: 'cinemaHalls',
      key: 'cinemaHalls',
      width: 120,
      render: (halls) => halls ? halls.length : 0,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa rạp chiếu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
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
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>Quản lý rạp chiếu</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm rạp chiếu
          </Button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm rạp chiếu..."
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
            {searchText && (
              <Button onClick={() => { setSearchText(''); loadData(); }}>
                Xóa tìm kiếm
              </Button>
            )}
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={cinemas.map((item, idx) => ({ ...item, key: item.id ?? `row-${idx}` }))}
          rowKey="key"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} rạp chiếu`,
          }}
          scroll={{ x: 1200 }}
        />

        {/* Modal thêm/sửa rạp chiếu */}
        <Modal
          title={editingCinema ? 'Sửa rạp chiếu' : 'Thêm rạp chiếu mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên rạp chiếu"
              rules={[
                { required: true, message: 'Vui lòng nhập tên rạp chiếu!' },
                { min: 2, message: 'Tên rạp chiếu phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập tên rạp chiếu" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ!' }
              ]}
            >
              <TextArea rows={3} placeholder="Nhập địa chỉ rạp chiếu" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
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
              name="cityId"
              label="Thành phố"
              rules={[
                { required: true, message: 'Vui lòng chọn thành phố!' }
              ]}
            >
              <Select placeholder="Chọn thành phố">
                {cities.map(city => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={3} placeholder="Nhập mô tả (không bắt buộc)" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingCinema ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết rạp chiếu */}
        <Modal
          title="Chi tiết rạp chiếu"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>
          ]}
          width={600}
        >
          {detailCinema && (
            <div>
              <p><strong>Tên rạp:</strong> {detailCinema.name}</p>
              <p><strong>Địa chỉ:</strong> {detailCinema.address}</p>
              <p><strong>Thành phố:</strong> {detailCinema.city?.name || '-'}</p>
              <p><strong>Số điện thoại:</strong> {detailCinema.phone}</p>
              <p><strong>Email:</strong> {detailCinema.email}</p>
              <p><strong>Mô tả:</strong> {detailCinema.description || 'Không có'}</p>
              <p><strong>Số phòng chiếu:</strong> {detailCinema.cinemaHalls?.length || 0}</p>
              <p><strong>Ngày tạo:</strong> {detailCinema.createdAt ? new Date(detailCinema.createdAt).toLocaleDateString('vi-VN') : '-'}</p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Cinemas; 