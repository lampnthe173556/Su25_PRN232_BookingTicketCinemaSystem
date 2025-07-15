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
  TimePicker,
  InputNumber,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import showService from '../../services/showService';
import movieService from '../../services/movieService';
import cinemaHallService from '../../services/cinemaHallService';
import { Show } from '../../models/Show';
import Toast from '../../components/Toast';
import '../../styles/admin.css';

const { Title } = Typography;
const { Option } = Select;

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemaHalls, setCinemaHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailShow, setDetailShow] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [showtimesData, moviesData, hallsData] = await Promise.all([
        showService.getAll(),
        movieService.getAll(),
        cinemaHallService.getAll(),
      ]);
      setShowtimes(showtimesData.map(Show.fromApi));
      setMovies(moviesData);
      setCinemaHalls(hallsData);
    } catch (error) {
      Toast.error('Không thể tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingShow(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingShow(record);
    form.setFieldsValue({
      movieId: record.movieId,
      hallId: record.hallId,
      startTime: record.startTime,
      endTime: record.endTime,
      ticketPrice: record.ticketPrice
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      Toast.error('ID không hợp lệ');
      return;
    }
    try {
      await showService.delete(id);
      Toast.success('Xóa suất chiếu thành công');
      loadData();
    } catch (error) {
      Toast.error('Không thể xóa suất chiếu: ' + error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const showData = new Show({
        ...values,
        startTime: values.startTime ? values.startTime.format('HH:mm') : null,
        endTime: values.endTime ? values.endTime.format('HH:mm') : null,
        date: values.date ? values.date.format('YYYY-MM-DD') : null,
      });
      
      if (editingShow) {
        await showService.update(editingShow.showId, showData.toUpdateDto());
        Toast.success('Cập nhật suất chiếu thành công');
      } else {
        await showService.create(showData.toCreateDto());
        Toast.success('Thêm suất chiếu thành công');
      }
      
      setModalVisible(false);
      loadData();
    } catch (error) {
      Toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleViewDetail = (record) => {
    setDetailShow(record);
    setDetailVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'cancelled': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'showId',
      key: 'showId',
      width: 80,
    },
    {
      title: 'Phim',
      dataIndex: 'movieTitle',
      key: 'movieTitle',
      width: 200,
      render: (_, record) => record.movieTitle || '-',
    },
    {
      title: 'Phòng chiếu',
      dataIndex: 'hallName',
      key: 'hallName',
      width: 150,
      render: (_, record) => record.hallName || '-',
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120,
      render: (time) => time || '-',
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 120,
      render: (time) => time || '-',
    },
    {
      title: 'Giá vé',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      width: 100,
      render: (price) => price ? `${price.toLocaleString()} VNĐ` : '-',
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
            title="Bạn có chắc chắn muốn xóa suất chiếu này?"
            onConfirm={() => handleDelete(record.showId)}
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
          <Title level={3}>Quản lý suất chiếu</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm suất chiếu
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={showtimes.map((item, idx) => ({ ...item, key: item.showId ?? `row-${idx}` }))}
          rowKey="showId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} suất chiếu`,
          }}
          scroll={{ x: 1200 }}
        />

        {/* Modal thêm/sửa suất chiếu */}
        <Modal
          title={editingShow ? 'Sửa suất chiếu' : 'Thêm suất chiếu mới'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={500}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="movieId"
              label="Phim"
              rules={[
                { required: true, message: 'Vui lòng chọn phim!' }
              ]}
            >
              <Select placeholder="Chọn phim">
                {movies.map(movie => (
                  <Option key={movie.id} value={movie.id}>
                    {movie.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="hallId"
              label="Phòng chiếu"
              rules={[
                { required: true, message: 'Vui lòng chọn phòng chiếu!' }
              ]}
            >
              <Select placeholder="Chọn phòng chiếu">
                {cinemaHalls.map(hall => (
                  <Option key={hall.cinemaHallId} value={hall.cinemaHallId}>
                    {hall.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[
                { required: true, message: 'Vui lòng nhập giờ bắt đầu!' }
              ]}
            >
              <Input placeholder="Nhập giờ bắt đầu (HH:mm)" />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              rules={[
                { required: true, message: 'Vui lòng nhập giờ kết thúc!' }
              ]}
            >
              <Input placeholder="Nhập giờ kết thúc (HH:mm)" />
            </Form.Item>
            <Form.Item
              name="ticketPrice"
              label="Giá vé"
              rules={[
                { required: true, message: 'Vui lòng nhập giá vé!' },
                { type: 'number', min: 0, message: 'Giá vé phải lớn hơn hoặc bằng 0!' }
              ]}
            >
              <InputNumber min={0} placeholder="Nhập giá vé" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingShow ? 'Cập nhật' : 'Thêm'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết suất chiếu */}
        <Modal
          title="Chi tiết suất chiếu"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>
          ]}
          width={500}
        >
          {detailShow && (
            <div>
              <p><strong>Phim:</strong> {detailShow.movieTitle || '-'}</p>
              <p><strong>Phòng chiếu:</strong> {detailShow.hallName || '-'}</p>
              <p><strong>Giờ bắt đầu:</strong> {detailShow.startTime || '-'}</p>
              <p><strong>Giờ kết thúc:</strong> {detailShow.endTime || '-'}</p>
              <p><strong>Giá vé:</strong> {detailShow.ticketPrice ? `${detailShow.ticketPrice.toLocaleString()} VNĐ` : '-'}</p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Showtimes; 