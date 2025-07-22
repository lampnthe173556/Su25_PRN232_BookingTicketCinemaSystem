import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  BankOutlined,
  HomeOutlined,
  OrderedListOutlined,
  CreditCardOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  userService,
  movieService,
  showService,
  cinemaService,
  cinemaHallService,
  paymentService,
  commentService,
  voteService,
} from "../../services";
import bookingService from '../../services/bookingService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Table } from 'antd';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    shows: 0,
    cinemas: 0,
    cinemaHalls: 0,
    bookings: 0,
    payments: 0,
    comments: 0,
    votes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRevenue();
    fetchTopMovies();
    fetchTopUsers();
    fetchRecentBookings();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [
        usersResponse,
        moviesResponse,
        showsResponse,
        cinemasResponse,
        cinemaHallsResponse,
        bookingsResponse,
        paymentsResponse,
        commentsResponse,
        votesResponse,
      ] = await Promise.allSettled([
        userService.getAll(),
        movieService.getAll(),
        showService.getAll(),
        cinemaService.getAll(),
        cinemaHallService.getAll(),
        bookingService.getAll(),
        ]);
      setStats({
        users: usersResponse.status === 'fulfilled' && Array.isArray(usersResponse.value) ? usersResponse.value.length : 0,
        movies: moviesResponse.status === 'fulfilled' && Array.isArray(moviesResponse.value) ? moviesResponse.value.length : 0,
        shows: showsResponse.status === 'fulfilled' && Array.isArray(showsResponse.value) ? showsResponse.value.length : 0,
        cinemas: cinemasResponse.status === 'fulfilled' && Array.isArray(cinemasResponse.value) ? cinemasResponse.value.length : 0,
        cinemaHalls: cinemaHallsResponse.status === 'fulfilled' && Array.isArray(cinemaHallsResponse.value) ? cinemaHallsResponse.value.length : 0,
        bookings: bookingsResponse.status === 'fulfilled' && Array.isArray(bookingsResponse.value) ? bookingsResponse.value.length : 0,
       });
    } catch (error) {
      message.error("Lỗi khi tải thống kê dashboard");
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu doanh thu thực tế
  const fetchRevenue = async () => {
    try {
      // Lấy 7 ngày gần nhất
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 6);
      const res = await bookingService.getDailyRevenue({ fromDate, toDate });
      setRevenueData(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      setRevenueData([]);
    }
  };

  // Lấy top phim doanh thu
  const fetchTopMovies = async () => {
    try {
      const res = await bookingService.getTopMovies();
      setTopMovies(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      setTopMovies([]);
    }
  };

  // Lấy top user mua vé
  const fetchTopUsers = async () => {
    try {
      const res = await bookingService.getTopUsers();
      setTopUsers(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      setTopUsers([]);
    }
  };

  // Lấy vé mới nhất
  const fetchRecentBookings = async () => {
    try {
      const res = await bookingService.getRecentBookings();
      setRecentBookings(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      setRecentBookings([]);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thống kê...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 0 }}>Admin Dashboard</h2>
        <p style={{ color: '#888', marginTop: 4 }}>Tổng quan hệ thống quản lý rạp chiếu phim</p>
      </div>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng người dùng" 
              value={stats.users} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng phim" 
              value={stats.movies} 
              prefix={<VideoCameraOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng suất chiếu" 
              value={stats.shows} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng rạp chiếu" 
              value={stats.cinemas} 
              prefix={<BankOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng phòng chiếu" 
              value={stats.cinemaHalls} 
              prefix={<HomeOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng đặt vé" 
              value={stats.bookings} 
              prefix={<OrderedListOutlined />} 
            />
          </Card>
        </Col>
        {/* Bỏ các card tổng thanh toán, bình luận, đánh giá */}
        {/*
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng thanh toán" 
              value={stats.payments} 
              prefix={<CreditCardOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng bình luận" 
              value={stats.comments} 
              prefix={<MessageOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Tổng đánh giá" 
              value={stats.votes} 
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
        */}
      </Row>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 16, minHeight: 340 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Biểu đồ doanh thu 7 ngày gần nhất</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={v => v.toLocaleString('vi-VN')} />
                <Tooltip formatter={v => v.toLocaleString('vi-VN') + ' VNĐ'} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 16, minHeight: 340 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Top phim doanh thu</h3>
            <Table
              columns={[
                { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle' },
                { title: 'Doanh thu', dataIndex: 'totalRevenue', key: 'totalRevenue', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
                { title: 'Vé', dataIndex: 'ticketsSold', key: 'ticketsSold' },
              ]}
              dataSource={topMovies.map((m, i) => ({ ...m, key: i }))}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Top user mua vé</h3>
            <Table
              columns={[
                { title: 'Người dùng', dataIndex: 'userName', key: 'userName' },
                { title: 'Số vé', dataIndex: 'ticketsBought', key: 'ticketsBought' },
                { title: 'Tổng chi', dataIndex: 'totalSpent', key: 'totalSpent', render: v => v.toLocaleString('vi-VN') + ' VNĐ' },
              ]}
              dataSource={topUsers.map((u, i) => ({ ...u, key: i }))}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        {/* Xóa bảng vé mới nhất */}
        {/*
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Vé mới nhất</h3>
            <Table
              columns={[
                { title: 'ID', dataIndex: 'bookingId', key: 'bookingId' },
                { title: 'User', dataIndex: 'userName', key: 'userName' },
                { title: 'Phim', dataIndex: 'movieTitle', key: 'movieTitle' },
                { title: 'Thời gian', dataIndex: 'showStartTime', key: 'showStartTime', render: v => new Date(v).toLocaleString('vi-VN') },
              ]}
              dataSource={recentBookings.map((b, i) => ({ ...b, key: i }))}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        */}
      </Row>
    </div>
  );
};

export default Dashboard; 