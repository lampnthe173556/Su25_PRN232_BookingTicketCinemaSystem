import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Tag, Button, Steps, Select, message } from "antd";
import { useLocation } from "react-router-dom";

const { Title } = Typography;
const { Step } = Steps;
const { Option } = Select;

// Dữ liệu mẫu
const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    showtimes: [
      { id: 1, date: "2024-06-10", time: "18:00", room: "Phòng 1" },
      { id: 2, date: "2024-06-10", time: "20:30", room: "Phòng 2" },
    ],
  },
  {
    id: 2,
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    showtimes: [
      { id: 3, date: "2024-06-11", time: "17:00", room: "Phòng 1" },
      { id: 4, date: "2024-06-11", time: "20:00", room: "Phòng 2" },
    ],
  },
];
const seatMap = [
  ["A1", "A2", "A3", "A4", "A5", "A6"],
  ["B1", "B2", "B3", "B4", "B5", "B6"],
  ["C1", "C2", "C3", "C4", "C5", "C6"],
];
const bookedSeats = ["A3", "B2", "C5"];
const seatPrice = 70000;

const Booking = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const movieIdParam = params.get("movieId");
  const showtimeIdParam = params.get("showtimeId");

  const [current, setCurrent] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Xử lý tự động chọn phim, suất chiếu nếu có query
  useEffect(() => {
    if (movieIdParam) {
      const movie = movies.find(m => m.id === Number(movieIdParam));
      if (movie) {
        setSelectedMovie(movie);
        if (showtimeIdParam) {
          const show = movie.showtimes.find(s => s.id === Number(showtimeIdParam));
          if (show) {
            setSelectedShowtime(show);
            setCurrent(2); // Nhảy đến bước chọn ghế
          } else {
            setCurrent(1); // Nhảy đến bước chọn suất chiếu
          }
        } else {
          setCurrent(1); // Nhảy đến bước chọn suất chiếu
        }
      }
    }
  }, [movieIdParam, showtimeIdParam]);

  // Bước 1: Chọn phim
  const handleSelectMovie = (movieId) => {
    setSelectedMovie(movies.find(m => m.id === movieId));
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  // Bước 2: Chọn suất chiếu
  const handleSelectShowtime = (showId) => {
    setSelectedShowtime(selectedMovie.showtimes.find(s => s.id === showId));
    setSelectedSeats([]);
  };

  // Bước 3: Chọn ghế
  const handleSelectSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  // Bước 4: Xác nhận đặt vé
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }
    message.success("Đặt vé thành công!");
    setCurrent(0);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const steps = [
    {
      title: "Chọn phim",
      content: (
        <div>
          <Select
            placeholder="Chọn phim..."
            style={{ width: 300 }}
            value={selectedMovie?.id}
            onChange={handleSelectMovie}
          >
            {movies.map(m => (
              <Option key={m.id} value={m.id}>{m.title}</Option>
            ))}
          </Select>
          {selectedMovie && (
            <div style={{ marginTop: 24 }}>
              <img src={selectedMovie.poster} alt={selectedMovie.title} style={{ width: 180, borderRadius: 8, boxShadow: "0 2px 8px #ccc" }} />
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
            value={selectedShowtime?.id}
            onChange={handleSelectShowtime}
          >
            {selectedMovie.showtimes.map(s => (
              <Option key={s.id} value={s.id}>{`${s.date} - ${s.time} (${s.room})`}</Option>
            ))}
          </Select>
          {selectedShowtime && (
            <div style={{ marginTop: 16 }}>
              <Tag color="blue">{selectedShowtime.date}</Tag>
              <Tag color="green">{selectedShowtime.time}</Tag>
              <Tag color="purple">{selectedShowtime.room}</Tag>
            </div>
          )}
        </div>
      ) : <div>Vui lòng chọn phim trước.</div>,
    },
    {
      title: "Chọn ghế",
      content: selectedShowtime ? (
        <div>
          <div style={{ marginBottom: 16 }}>
            {seatMap.map((row, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                {row.map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <Button
                      key={seat}
                      type={isSelected ? "primary" : "default"}
                      danger={isBooked}
                      disabled={isBooked}
                      style={{ marginRight: 8, marginBottom: 4, width: 48 }}
                      onClick={() => handleSelectSeat(seat)}
                    >
                      {seat}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Ghế đã chọn:</b> {selectedSeats.join(", ") || "Chưa chọn"}
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Tổng tiền:</b> {selectedSeats.length * seatPrice} VNĐ
          </div>
        </div>
      ) : <div>Vui lòng chọn suất chiếu trước.</div>,
    },
    {
      title: "Xác nhận",
      content: (
        <div>
          <Title level={4}>Xác nhận đặt vé</Title>
          <div><b>Phim:</b> {selectedMovie?.title}</div>
          <div><b>Suất chiếu:</b> {selectedShowtime ? `${selectedShowtime.date} - ${selectedShowtime.time} (${selectedShowtime.room})` : ""}</div>
          <div><b>Ghế:</b> {selectedSeats.join(", ")}</div>
          <div><b>Tổng tiền:</b> {selectedSeats.length * seatPrice} VNĐ</div>
          <Button type="primary" size="large" style={{ marginTop: 16 }} onClick={handleBooking}>
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
    <Card style={{ maxWidth: 700, margin: "32px auto" }}>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item, idx) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ minHeight: 250, marginBottom: 32 }}>{steps[current].content}</div>
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