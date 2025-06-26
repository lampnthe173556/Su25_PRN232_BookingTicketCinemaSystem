import React, { useState } from "react";
import { Row, Col, Card, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    description: "Biệt đội siêu anh hùng đối đầu Thanos để cứu vũ trụ.",
    genre: "Hành động",
    director: "Anthony Russo",
    actor: "Robert Downey Jr.",
  },
  {
    id: 2,
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "Câu chuyện về nguồn gốc của Joker - kẻ thù truyền kiếp của Batman.",
    genre: "Tâm lý",
    director: "Todd Phillips",
    actor: "Joaquin Phoenix",
  },
];

const genres = ["Tất cả", ...Array.from(new Set(movies.map(m => m.genre)))];
const actors = ["Tất cả", ...Array.from(new Set(movies.map(m => m.actor)))];
const directors = ["Tất cả", ...Array.from(new Set(movies.map(m => m.director)))];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Tất cả");
  const [actor, setActor] = useState("Tất cả");
  const [director, setDirector] = useState("Tất cả");

  const filteredMovies = movies.filter((movie) => {
    return (
      movie.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre === "Tất cả" || movie.genre === genre) &&
      (actor === "Tất cả" || movie.actor === actor) &&
      (director === "Tất cả" || movie.director === director)
    );
  });

  return (
    <div>
      <h2>Danh sách phim</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Input.Search
            placeholder="Tìm kiếm phim..."
            allowClear
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={24} md={5}>
          <Select
            value={genre}
            onChange={setGenre}
            style={{ width: "100%" }}
          >
            {genres.map(g => <Option key={g} value={g}>{g}</Option>)}
          </Select>
        </Col>
        <Col xs={24} md={5}>
          <Select
            value={actor}
            onChange={setActor}
            style={{ width: "100%" }}
          >
            {actors.map(a => <Option key={a} value={a}>{a}</Option>)}
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Select
            value={director}
            onChange={setDirector}
            style={{ width: "100%" }}
          >
            {directors.map(d => <Option key={d} value={d}>{d}</Option>)}
          </Select>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {filteredMovies.length === 0 ? (
          <Col span={24} style={{ textAlign: "center" }}>
            Không tìm thấy phim phù hợp.
          </Col>
        ) : (
          filteredMovies.map((movie) => (
            <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
              <Card
                hoverable
                cover={<img alt={movie.title} src={movie.poster} style={{ height: 320, objectFit: "cover" }} />}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                <Card.Meta title={movie.title} description={movie.description} />
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Home; 