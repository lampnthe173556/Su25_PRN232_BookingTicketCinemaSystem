import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Tag, Button, Steps, Select, message, Spin, Empty } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import movieService from "../../services/movieService";
import showService from "../../services/showService";
import publicSeatService from "../../services/publicSeatService";
import bookingService from "../../services/bookingService";
import Toast from "../../components/Toast";

const { Title } = Typography;
const { Step } = Steps;
const { Option } = Select;

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = new URLSearchParams(location.search);
  const movieIdParam = params.get("movieId");
  const showtimeIdParam = params.get("showtimeId");

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatAvailability, setSeatAvailability] = useState(null);
  const [seatMap, setSeatMap] = useState([]);

  // Load movies khi component mount
  useEffect(() => {
    loadMovies();
  }, []);

  // Xử lý tự động chọn phim, suất chiếu nếu có query
  useEffect(() => {
    if (movieIdParam && movies.length > 0) {
      const movie = movies.find(m => m.movieId === Number(movieIdParam));
      if (movie) {
        setSelectedMovie(movie);
        if (showtimeIdParam) {
          loadShowtimes(movie.movieId);
        } else {
          setCurrent(1); // Nhảy đến bước chọn suất chiếu
        }
      }
    }
  }, [movieIdParam, showtimeIdParam, movies]);

  const loadMovies = async () => {
    try {
      const moviesData = await movieService.getAll();
      setMovies(moviesData);
    } catch (error) {
      Toast.error('Không thể tải danh sách phim: ' + error.message);
    }
  };

  const loadShowtimes = async (movieId) => {
    try {
      const showtimesData = await showService.getByMovie(movieId);
      setSelectedMovie(prev => ({ ...prev, showtimes: showtimesData }));
      
      if (showtimeIdParam) {
        const show = showtimesData.find(s => s.showId === Number(showtimeIdParam));
        if (show) {
          setSelectedShowtime(show);
          await loadSeatAvailability(show.showId);
          setCurrent(2); // Nhảy đến bước chọn ghế
        } else {
          setCurrent(1); // Nhảy đến bước chọn suất chiếu
        }
      }
    } catch (error) {
      Toast.error('Không thể tải suất chiếu: ' + error.message);
    }
  };

  const loadSeatAvailability = async (showId) => {
    try {
      setLoading(true);
      const availability = await publicSeatService.getSeatAvailability(showId);
      setSeatAvailability(availability);
      
      // Tạo seat map từ available seats
      const seats = availability.allSeats;
      const rows = [...new Set(seats.map(s => s.rowNumber))].sort();
      const seatMapData = rows.map(row => 
        seats.filter(s => s.rowNumber === row).sort((a, b) => a.columnNumber - b.columnNumber)
      );
      setSeatMap(seatMapData);
    } catch (error) {
      Toast.error('Không thể tải thông tin ghế: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Bước 1: Chọn phim
  const handleSelectMovie = async (movieId) => {
    const movie = movies.find(m => m.movieId === movieId);
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setSeatAvailability(null);
    setSeatMap([]);
    
    if (movie) {
      await loadShowtimes(movie.movieId);
    }
  };

  // Bước 2: Chọn suất chiếu
  const handleSelectShowtime = async (showId) => {
    const show = selectedMovie.showtimes.find(s => s.showId === showId);
    setSelectedShowtime(show);
    setSelectedSeats([]);
    
    if (show) {
      await loadSeatAvailability(show.showId);
    }
  };

  // Bước 3: Chọn ghế
  const handleSelectSeat = (seat) => {
    if (!seatAvailability || seatAvailability.bookedSeatIds.includes(seat.seatId)) return;
    
    setSelectedSeats((prev) =>
      prev.find(s => s.seatId === seat.seatId)
        ? prev.filter((s) => s.seatId !== seat.seatId)
        : [...prev, seat]
    );
  };

  // Bước 4: Xác nhận đặt vé
  const handleBooking = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để đặt vé!");
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        userId: user.userId,
        showId: selectedShowtime.showId,
        seatIds: selectedSeats.map(s => s.seatId),
        qrCodeData: `BOOKING_${Date.now()}_${user.userId}`
      };

      const result = await bookingService.create(bookingData);
      
      Toast.success("Đặt vé thành công!");
      message.success(`Mã đặt vé: ${result.bookingId}`);
      
      // Reset form
      setCurrent(0);
      setSelectedMovie(null);
      setSelectedShowtime(null);
      setSelectedSeats([]);
      setSeatAvailability(null);
      setSeatMap([]);
      
      // Chuyển đến trang lịch sử đặt vé
      navigate('/booking-history');
    } catch (error) {
      Toast.error('Không thể đặt vé: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Chọn phim",
      content: (
        <div>
          <Select
            placeholder="Chọn phim..."
            style={{ width: 300 }}
            value={selectedMovie?.movieId}
            onChange={handleSelectMovie}
            loading={movies.length === 0}
          >
            {movies.map(m => (
              <Option key={m.movieId} value={m.movieId}>{m.title}</Option>
            ))}
          </Select>
          {selectedMovie && (
            <div style={{ marginTop: 24 }}>
              <img 
                src={selectedMovie.posterUrl} 
                alt={selectedMovie.title} 
                style={{ width: 180, borderRadius: 8, boxShadow: "0 2px 8px #ccc" }} 
              />
              <div style={{ marginTop: 16 }}>
                <Title level={4}>{selectedMovie.title}</Title>
                <p>{selectedMovie.description}</p>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Chọn suất chiếu",
      content: selectedMovie ? (
        <div>
          <Select
            placeholder="Chọn suất chiếu..."
            style={{ width: 300 }}
            value={selectedShowtime?.showId}
            onChange={handleSelectShowtime}
            loading={!selectedMovie.showtimes}
          >
            {selectedMovie.showtimes?.map(s => (
              <Option key={s.showId} value={s.showId}>
                {`${new Date(s.startTime).toLocaleDateString('vi-VN')} - ${new Date(s.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (${s.hallName})`}
              </Option>
            ))}
          </Select>
          {selectedShowtime && (
            <div style={{ marginTop: 16 }}>
              <Tag color="blue">{new Date(selectedShowtime.startTime).toLocaleDateString('vi-VN')}</Tag>
              <Tag color="green">{new Date(selectedShowtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</Tag>
              <Tag color="purple">{selectedShowtime.hallName}</Tag>
              <Tag color="orange">{selectedShowtime.ticketPrice.toLocaleString('vi-VN')} VNĐ</Tag>
            </div>
          )}
        </div>
      ) : <div>Vui lòng chọn phim trước.</div>,
    },
    {
      title: "Chọn ghế",
      content: selectedShowtime ? (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Đang tải thông tin ghế...</div>
            </div>
          ) : seatAvailability ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>MÀN HÌNH</div>
                  <div style={{ height: 2, backgroundColor: '#ccc', marginBottom: 24 }}></div>
                </div>
                
                {seatMap.map((row, i) => (
                  <div key={i} style={{ marginBottom: 8, textAlign: 'center' }}>
                    <span style={{ marginRight: 8, fontWeight: 'bold', minWidth: 20, display: 'inline-block' }}>
                      {row[0]?.rowNumber}
                    </span>
                    {row.map((seat) => {
                      const isBooked = seatAvailability.bookedSeatIds.includes(seat.seatId);
                      const isSelected = selectedSeats.find(s => s.seatId === seat.seatId);
                      return (
                        <Button
                          key={seat.seatId}
                          type={isSelected ? "primary" : "default"}
                          disabled={isBooked}
                          style={{ 
                            marginRight: 4, 
                            marginBottom: 4, 
                            width: 48,
                            height: 40,
                            fontSize: 12,
                            backgroundColor: isBooked ? '#ff4d4f' : isSelected ? '#1890ff' : '#fff',
                            color: isBooked ? '#fff' : isSelected ? '#fff' : '#222',
                            borderColor: isBooked ? '#ff4d4f' : isSelected ? '#1890ff' : '#d9d9d9',
                            cursor: isBooked ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => handleSelectSeat(seat)}
                        >
                          {seat.columnNumber}
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 20, height: 20, backgroundColor: '#d9d9d9', border: '1px solid #ccc' }}></div>
                    <span>Ghế trống</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 20, height: 20, backgroundColor: '#1890ff', border: '1px solid #1890ff' }}></div>
                    <span>Ghế đã chọn</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 20, height: 20, backgroundColor: '#ff4d4f', border: '1px solid #ff4d4f' }}></div>
                    <span>Ghế đã đặt</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <b>Ghế đã chọn:</b> {selectedSeats.map(s => `${s.rowNumber}${s.columnNumber}`).join(", ") || "Chưa chọn"}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <b>Tổng tiền:</b> {(selectedSeats.length * selectedShowtime.ticketPrice).toLocaleString('vi-VN')} VNĐ
                </div>
                <div style={{ marginBottom: 16 }}>
                  <b>Thống kê:</b> {seatAvailability.availableSeatsCount} ghế trống / {seatAvailability.totalSeats} tổng số ghế
                </div>
              </div>
            </>
          ) : (
            <Empty description="Không có thông tin ghế" />
          )}
        </div>
      ) : <div>Vui lòng chọn suất chiếu trước.</div>,
    },
    {
      title: "Xác nhận",
      content: (
        <div>
          <Title level={4}>Xác nhận đặt vé</Title>
          <div style={{ marginBottom: 16 }}>
            <b>Phim:</b> {selectedMovie?.title}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Suất chiếu:</b> {selectedShowtime ? 
              `${new Date(selectedShowtime.startTime).toLocaleDateString('vi-VN')} - ${new Date(selectedShowtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} (${selectedShowtime.hallName})` : 
              ""
            }
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Ghế:</b> {selectedSeats.map(s => `${s.rowNumber}${s.columnNumber}`).join(", ")}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Tổng tiền:</b> {selectedShowtime ? (selectedSeats.length * selectedShowtime.ticketPrice).toLocaleString('vi-VN') : 0} VNĐ
          </div>
          <Button 
            type="primary" 
            size="large" 
            style={{ marginTop: 16 }} 
            onClick={handleBooking}
            loading={loading}
            disabled={selectedSeats.length === 0}
          >
            Xác nhận đặt vé
          </Button>
        </div>
      ),
    },
  ];

  const next = () => {
    if (current === 0 && !selectedMovie) {
      message.warning("Vui lòng chọn phim!");
      return;
    }
    if (current === 1 && !selectedShowtime) {
      message.warning("Vui lòng chọn suất chiếu!");
      return;
    }
    if (current === 2 && selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ghế!");
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Card style={{ maxWidth: 800, margin: "32px auto" }}>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item, idx) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ minHeight: 400, marginBottom: 32 }}>{steps[current].content}</div>
      <div style={{ textAlign: "right" }}>
        {current > 0 && (
          <Button style={{ marginRight: 8 }} onClick={prev}>
            Quay lại
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Tiếp tục
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Booking; 