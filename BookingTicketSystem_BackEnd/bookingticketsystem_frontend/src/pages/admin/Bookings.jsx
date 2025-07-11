import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Space, 
  Popconfirm, 
  Card,
  Typography,
  Tag,
  Descriptions,
  Badge
} from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import bookingService from '../../services/bookingService';
import Toast from '../../components/Toast';
import '../../styles/admin.css';

const { Title } = Typography;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailBooking, setDetailBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      Toast.error('Không thể tải danh sách đặt vé: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!id) {
      Toast.error('ID không hợp lệ');
      return;
    }
    try {
      await bookingService.cancel(id);
      Toast.success('Hủy đặt vé thành công');
      loadBookings();
    } catch (error) {
      Toast.error('Không thể hủy đặt vé: ' + error.message);
    }
  };

  const handleViewDetail = (record) => {
    setDetailBooking(record);
    setDetailVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'confirmed': return 'green';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status;
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
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (user) => user ? user.name : '-',
    },
    {
      title: 'Phim',
      dataIndex: 'show',
      key: 'show',
      width: 200,
      render: (show) => show?.movie ? show.movie.title : '-',
    },
    {
      title: 'Phòng chiếu',
      dataIndex: 'show',
      key: 'cinemaHall',
      width: 150,
      render: (show) => show?.cinemaHall ? show.cinemaHall.name : '-',
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'show',
      key: 'date',
      width: 120,
      render: (show) => show?.date ? new Date(show.date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Giờ chiếu',
      dataIndex: 'show',
      key: 'startTime',
      width: 100,
      render: (show) => show?.startTime || '-',
    },
    {
      title: 'Số ghế',
      dataIndex: 'seats',
      key: 'seats',
      width: 100,
      render: (seats) => seats ? seats.length : 0,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => amount ? `${amount.toLocaleString()} VNĐ` : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
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
          {record.status === 'pending' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy đặt vé này?"
              onConfirm={() => handleCancel(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                size="small"
              >
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>Quản lý đặt vé</Title>
        </div>

        <Table
          columns={columns}
          dataSource={bookings.map((item, idx) => ({ ...item, key: item.id ?? `row-${idx}` }))}
          rowKey="key"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đặt vé`,
          }}
          scroll={{ x: 1400 }}
        />

        {/* Modal chi tiết đặt vé */}
        <Modal
          title="Chi tiết đặt vé"
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Đóng
            </Button>
          ]}
          width={800}
        >
          {detailBooking && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID đặt vé" span={2}>
                {detailBooking.id}
              </Descriptions.Item>
              
              <Descriptions.Item label="Người dùng">
                {detailBooking.user?.name || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                {detailBooking.user?.email || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Phim" span={2}>
                {detailBooking.show?.movie?.title || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Phòng chiếu">
                {detailBooking.show?.cinemaHall?.name || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày chiếu">
                {detailBooking.show?.date ? new Date(detailBooking.show.date).toLocaleDateString('vi-VN') : '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Giờ bắt đầu">
                {detailBooking.show?.startTime || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Giờ kết thúc">
                {detailBooking.show?.endTime || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Số ghế" span={2}>
                {detailBooking.seats?.map(seat => `${seat.rowNumber}${seat.seatNumber}`).join(', ') || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Tổng tiền">
                {detailBooking.totalAmount ? `${detailBooking.totalAmount.toLocaleString()} VNĐ` : '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(detailBooking.status)}>
                  {getStatusText(detailBooking.status)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày đặt" span={2}>
                {detailBooking.bookingDate ? new Date(detailBooking.bookingDate).toLocaleString('vi-VN') : '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày tạo" span={2}>
                {detailBooking.createdAt ? new Date(detailBooking.createdAt).toLocaleString('vi-VN') : '-'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default Bookings; 