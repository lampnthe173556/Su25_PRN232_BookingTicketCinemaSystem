import React, { useState } from "react";
import { Row, Col, Typography, Button, Card, Tag, Rate, List, Input, message, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentsByMovie, addComment, getAverageRating } from "../../services/comment";
import { useAuth } from "../../hooks/useAuth";

const { Title, Paragraph } = Typography;

// Dữ liệu phim mẫu
const movieData = {
  id: 1,
  title: "Avengers: Endgame",
  poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  description: "Biệt đội siêu anh hùng đối đầu Thanos để cứu vũ trụ.",
  trailer: "https://www.youtube.com/embed/TcMBFSGVi1c",
  showtimes: [
    { id: 1, date: "2024-06-10", time: "18:00", room: "Phòng 1" },
    { id: 2, date: "2024-06-10", time: "20:30", room: "Phòng 2" },
    { id: 3, date: "2024-06-11", time: "17:00", room: "Phòng 1" },
  ],
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const movieId = Number(id) || movieData.id;
  // Lấy comment và điểm trung bình
  const [comments, setComments] = useState(getCommentsByMovie(movieId));
  const [avgRating, setAvgRating] = useState(getAverageRating(movieId));
  const [commentValue, setCommentValue] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  // Thực tế sẽ fetch dữ liệu theo id, ở đây dùng mẫu
  const movie = movieData;

  const handleComment = () => {
    if (!commentValue.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    const newComment = addComment({
      movieId,
      user: user?.name || "Khách",
      content: commentValue,
      rating: ratingValue,
    });
    setComments(getCommentsByMovie(movieId));
    setAvgRating(getAverageRating(movieId));
    setCommentValue("");
    setRatingValue(5);
    message.success("Gửi bình luận thành công!");
  };

  return (
    <Card style={{ margin: "0 auto", maxWidth: 1000 }}>
      <Row gutter={[32, 24]}>
        <Col xs={24} md={8}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: "100%", borderRadius: 8, boxShadow: "0 2px 8px #ccc" }}
          />
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Rate allowHalf disabled value={avgRating} style={{ fontSize: 24 }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4, color: avgRating > 0 ? '#faad14' : '#888' }}>
              {avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : "Chưa có đánh giá"}
            </div>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Title level={2}>{movie.title}</Title>
          <Paragraph>{movie.description}</Paragraph>
          <div style={{ margin: "16px 0" }}>
            <iframe
              width="100%"
              height="250"
              src={movie.trailer}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 8 }}
            ></iframe>
          </div>
          <Title level={4}>Lịch chiếu</Title>
          <Row gutter={[8, 8]}>
            {movie.showtimes.map((show) => (
              <Col key={show.id} xs={24} sm={12} md={8}>
                <Card size="small" bordered>
                  <div>
                    <Tag color="blue">{show.date}</Tag>
                    <Tag color="green">{show.time}</Tag>
                  </div>
                  <div>{show.room}</div>
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: 8 }}
                    onClick={() => navigate(`/booking?movieId=${movie.id}&showtimeId=${show.id}`)}
                  >
                    Đặt vé
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
          {/* Vote & Comment */}
          <div style={{ marginTop: 32 }}>
            <Title level={4}>Đánh giá & Bình luận</Title>
            {user ? (
              <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
                <Rate value={ratingValue} onChange={setRatingValue} />
                <Input.TextArea
                  value={commentValue}
                  onChange={e => setCommentValue(e.target.value)}
                  placeholder="Nhập bình luận..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  style={{ width: 300 }}
                />
                <Button type="primary" onClick={handleComment}>Gửi</Button>
              </div>
            ) : (
              <div style={{ marginBottom: 16, color: '#888' }}>
                <b>Đăng nhập để đánh giá và bình luận về phim này.</b>
              </div>
            )}
            <List
              dataSource={comments}
              locale={{ emptyText: "Chưa có bình luận nào." }}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                    title={<span><b>{item.user}</b> <Rate value={item.rating} disabled style={{ fontSize: 14, marginLeft: 8 }} /></span>}
                    description={<span>{item.content} <span style={{ color: '#aaa', marginLeft: 8 }}>{item.createdAt}</span></span>}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MovieDetail; 