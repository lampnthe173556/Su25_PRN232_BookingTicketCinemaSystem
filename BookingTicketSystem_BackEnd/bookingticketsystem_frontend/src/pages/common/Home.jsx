import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Input, Select, Typography, Spin, Carousel, Tag, Button, Rate, Divider, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { movieService, genreService, movieFavoriteService } from "../../services";
import Footer from "../../components/Footer";
import MovieCard from "../../components/MovieCard";
import { useAuth } from "../../hooks/useAuth";
import Toast from "../../components/Toast";

const { Option } = Select;
const { Title } = Typography;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Debug: kiểm tra trạng thái user
        console.log('Current user:', user);
        console.log('localStorage user:', localStorage.getItem('user'));
        console.log('localStorage token:', localStorage.getItem('token'));
        
        const [movieList, genreList, topList] = await Promise.all([
          movieService.getAll(),
          genreService.getAll(),
          movieFavoriteService.getTopMovies(8)
        ]);
        setMovies(movieList);
        setGenres(genreList);
        setTopMovies(topList);
        
        // Lấy danh sách phim yêu thích nếu đã đăng nhập
        if (user) {
          console.log('User is logged in, fetching favorites...');
          const favs = await movieFavoriteService.getFavoritesByUser();
          setFavoriteIds(favs.map(f => f.movieId));
        } else {
          console.log('User is not logged in');
          setFavoriteIds([]);
        }
      } catch (error) {
        Toast.error('Không thể tải dữ liệu: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Phân loại phim đang chiếu/sắp chiếu
  const today = getToday();
  const nowShowing = useMemo(() => movies.filter(m => m.releaseDate && m.releaseDate <= today), [movies, today]);
  const comingSoon = useMemo(() => movies.filter(m => m.releaseDate && m.releaseDate > today), [movies, today]);

  // Lọc phim theo tìm kiếm và thể loại
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchTitle = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchGenre = !genre || movie.Genres?.some(g => g.genreId === parseInt(genre));
      return matchTitle && matchGenre;
    });
  }, [movies, search, genre]);

  // Banner: lấy 4 phim nổi bật (top yêu thích hoặc random)
  const bannerMovies = topMovies.length > 0 ? topMovies.slice(0, 4) : movies.slice(0, 4);

  // Xử lý toggle yêu thích
  const handleToggleFavorite = async (movie) => {
    if (!user) {
      Toast.warning('Vui lòng đăng nhập để yêu thích phim!');
      navigate('/login');
      return;
    }
    
    setLoadingFavoriteId(movie.movieId);
    try {
      if (favoriteIds.includes(movie.movieId)) {
        await movieFavoriteService.removeFavorite(movie.movieId);
        setFavoriteIds(favoriteIds.filter(id => id !== movie.movieId));
        Toast.success('Đã xóa phim khỏi danh sách yêu thích');
      } else {
        await movieFavoriteService.addFavorite(movie.movieId);
        setFavoriteIds([...favoriteIds, movie.movieId]);
        Toast.success('Đã thêm phim vào danh sách yêu thích');
      }
    } catch (error) {
      Toast.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoadingFavoriteId(null);
    }
  };

  // Xử lý đặt vé
  const handleBook = (movie) => {
    if (!user) {
      Toast.warning('Vui lòng đăng nhập để đặt vé!');
      navigate('/login');
      return;
    }
    navigate(`/movie/${movie.movieId}`);
  };

  // Xử lý xem chi tiết phim
  const handleViewMovie = (movie) => {
    navigate(`/movie/${movie.movieId}`);
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Banner/Slider */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <Carousel autoplay dots>
          {bannerMovies.map((movie, idx) => (
            <div key={movie.movieId || idx} style={{ position: 'relative', height: 360, cursor: 'pointer' }} onClick={() => handleViewMovie(movie)}>
              <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }} />
              <div style={{ position: 'absolute', left: 40, bottom: 40, color: '#fff', textShadow: '0 2px 8px #000', maxWidth: 600 }}>
                <Title level={2} style={{ color: '#fff', marginBottom: 0 }}>{movie.title}</Title>
                <div style={{ fontSize: 16 }}>{movie.description?.slice(0, 120)}...</div>
                <div style={{ marginTop: 8 }}>
                  {movie.Genres?.map(g => <Tag key={g.genreId}>{g.name}</Tag>)}
                  <Rate disabled value={movie.rating} count={5} style={{ marginLeft: 12 }} />
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        {/* Top phim yêu thích */}
        <Title level={3} style={{ marginTop: 24 }}>Top phim được yêu thích</Title>
        <Row gutter={[24, 24]}>
          {topMovies.length === 0 ? <Col span={24}><Empty description="Không có dữ liệu" /></Col> : topMovies.map(movie => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie.movieId}>
              <MovieCard 
                movie={movie} 
                isFavorite={favoriteIds.includes(movie.movieId)} 
                loadingFavorite={loadingFavoriteId === movie.movieId} 
                onToggleFavorite={handleToggleFavorite} 
                onBook={handleBook} 
              />
            </Col>
          ))}
        </Row>

        {/* Phim đang chiếu */}
        <Divider orientation="left" style={{ marginTop: 40 }}>Phim đang chiếu</Divider>
        <Row gutter={[24, 24]}>
          {nowShowing.length === 0 ? <Col span={24}><Empty description="Không có phim đang chiếu" /></Col> : nowShowing.slice(0, 8).map(movie => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie.movieId}>
              <MovieCard 
                movie={movie} 
                isFavorite={favoriteIds.includes(movie.movieId)} 
                loadingFavorite={loadingFavoriteId === movie.movieId} 
                onToggleFavorite={handleToggleFavorite} 
                onBook={handleBook} 
              />
            </Col>
          ))}
        </Row>

        {/* Phim sắp chiếu */}
        <Divider orientation="left" style={{ marginTop: 40 }}>Phim sắp chiếu</Divider>
        <Row gutter={[24, 24]}>
          {comingSoon.length === 0 ? <Col span={24}><Empty description="Không có phim sắp chiếu" /></Col> : comingSoon.slice(0, 8).map(movie => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie.movieId}>
              <MovieCard 
                movie={movie} 
                isFavorite={favoriteIds.includes(movie.movieId)} 
                loadingFavorite={loadingFavoriteId === movie.movieId} 
                onToggleFavorite={handleToggleFavorite} 
                onBook={handleBook} 
              />
            </Col>
          ))}
        </Row>

        {/* Tìm kiếm & filter thể loại */}
        <Divider orientation="left" style={{ marginTop: 40 }}>Tất cả phim</Divider>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Tìm kiếm phim..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              value={genre}
              onChange={setGenre}
              style={{ width: "100%" }}
              allowClear
              placeholder="Chọn thể loại"
            >
              <Option value="">Tất cả</Option>
              {genres.map(g => <Option key={g.genreId} value={g.genreId.toString()}>{g.name}</Option>)}
            </Select>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          {loading ? <Col span={24} style={{ textAlign: 'center' }}><Spin size="large" /></Col> :
            filteredMovies.length === 0 ? <Col span={24}><Empty description="Không tìm thấy phim phù hợp." /></Col> :
              filteredMovies.map((movie) => (
                <Col xs={24} sm={12} md={8} lg={6} key={movie.movieId}>
                  <MovieCard 
                    movie={movie} 
                    isFavorite={favoriteIds.includes(movie.movieId)} 
                    loadingFavorite={loadingFavoriteId === movie.movieId} 
                    onToggleFavorite={handleToggleFavorite} 
                    onBook={handleBook} 
                  />
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );
};

export default Home; 