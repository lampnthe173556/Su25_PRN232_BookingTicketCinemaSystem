import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Card, Tag, Rate, List, Input, message, Avatar } from "antd";
import { UserOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentsByMovie, addComment, getAverageRating } from "../../services/comment";
import { useAuth } from "../../hooks/useAuth";
import { movieFavoriteService, movieService } from "../../services";
import Toast from "../../components/Toast";

const { Title, Paragraph } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const movieId = Number(id);
  
  // State cho phim
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // State cho comment và rating
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [commentValue, setCommentValue] = useState("");
  const [ratingValue, setRatingValue] = useState(5);

  useEffect(() => {
    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  useEffect(() => {
    if (user && movieId) {
      checkFavoriteStatus();
    }
  }, [user, movieId]);

  const loadMovieData = async () => {
    setLoading(true);
    try {
      const movieData = await movieService.getById(movieId);
      setMovie(movieData);
      
      // Load comments và rating (giả lập)
      setComments(getCommentsByMovie(movieId));
      setAvgRating(getAverageRating(movieId));
    } catch (error) {
      Toast.error('Không thể tải thông tin phim: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !movieId) return;
    
    try {
      const status = await movieFavoriteService.checkFavorite(movieId);
      setIsFavorite(status);
    } catch (error) {
      console.error('Không thể kiểm tra trạng thái yêu thích:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để yêu thích phim!');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await movieFavoriteService.removeFavorite(movieId);
        setIsFavorite(false);
        Toast.success('Đã xóa phim khỏi danh sách yêu thích');
      } else {
        await movieFavoriteService.addFavorite(movieId);
        setIsFavorite(true);
        Toast.success('Đã thêm phim vào danh sách yêu thích');
      }
    } catch (error) {
      Toast.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Card style={{ margin: "0 auto", maxWidth: 1000 }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải thông tin phim...</div>
        </div>
      </Card>
    );
  }

  if (!movie) {
    return (
      <Card style={{ margin: "0 auto", maxWidth: 1000 }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Không tìm thấy phim</div>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ margin: "0 auto", maxWidth: 1000 }}>
      <Row gutter={[32, 24]}>
        <Col xs={24} md={8}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{ width: "100%", borderRadius: 8, boxShadow: "0 2px 8px #ccc" }}
          />
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Rate allowHalf disabled value={avgRating} style={{ fontSize: 24 }} />
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4, color: avgRating > 0 ? '#faad14' : '#888' }}>
              {avgRating > 0 ? `${avgRating.toFixed(1)} / 5.0` : "Chưa có đánh giá"}
            </div>
            
            {/* Nút yêu thích */}
            <Button
              type={isFavorite ? "primary" : "default"}
              icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
              loading={favoriteLoading}
              onClick={handleToggleFavorite}
              style={{ 
                marginTop: 16,
                backgroundColor: isFavorite ? '#ff4d4f' : undefined,
                borderColor: isFavorite ? '#ff4d4f' : undefined
              }}
            >
              {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
            </Button>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Title level={2}>{movie.title}</Title>
          <Paragraph>{movie.description}</Paragraph>
          
          {/* Thông tin phim */}
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">{movie.duration} phút</Tag>
            <Tag color="green">{movie.language}</Tag>
            {movie.releaseDate && (
              <Tag color="orange">Ngày phát hành: {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</Tag>
            )}
            {movie.Genres && movie.Genres.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {movie.Genres.map(genre => (
                  <Tag key={genre.genreId} color="purple">{genre.name}</Tag>
                ))}
              </div>
            )}
          </div>

          {movie.trailerUrl && (
            <div style={{ margin: "16px 0" }}>
              <Title level={4}>Trailer</Title>
              <iframe
                width="100%"
                height="250"
                src={movie.trailerUrl}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8 }}
              ></iframe>
            </div>
          )}

          {/* Lịch chiếu (giả lập) */}
          <Title level={4}>Lịch chiếu</Title>
          <Row gutter={[8, 8]}>
            {[
              { id: 1, date: "2024-06-10", time: "18:00", room: "Phòng 1" },
              { id: 2, date: "2024-06-10", time: "20:30", room: "Phòng 2" },
              { id: 3, date: "2024-06-11", time: "17:00", room: "Phòng 1" },
            ].map((show) => (
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
                    onClick={() => navigate(`/booking?movieId=${movie.movieId}&showtimeId=${show.id}`)}
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