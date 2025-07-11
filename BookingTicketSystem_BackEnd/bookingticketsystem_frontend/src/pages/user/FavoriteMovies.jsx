import React from "react";
import { List, Avatar, Button } from "antd";

const favorites = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  },
  {
    id: 2,
    title: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
];

const FavoriteMovies = () => (
  <div>
    <h3>Danh sách phim yêu thích</h3>
    <List
      itemLayout="horizontal"
      dataSource={favorites}
      renderItem={item => (
        <List.Item
          actions={[<Button danger size="small">Bỏ thích</Button>]}
        >
          <List.Item.Meta
            avatar={<Avatar shape="square" size={64} src={item.poster} />}
            title={<b>{item.title}</b>}
          />
        </List.Item>
      )}
    />
  </div>
);

export default FavoriteMovies; 