import React from "react";
import { List, Avatar, Tag } from "antd";

const tickets = [
  {
    id: 1,
    movie: "Avengers: Endgame",
    time: "2024-06-10 18:00",
    seats: ["A1", "A2"],
    room: "Phòng 1",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
  },
  {
    id: 2,
    movie: "Joker",
    time: "2024-06-11 20:00",
    seats: ["B3"],
    room: "Phòng 2",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
  },
];

const BookingHistory = () => (
  <div>
    <h3>Lịch sử đặt vé</h3>
    <List
      itemLayout="horizontal"
      dataSource={tickets}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar shape="square" size={64} src={item.poster} />}
            title={<b>{item.movie}</b>}
            description={
              <>
                <div><Tag color="blue">{item.time}</Tag> <Tag color="purple">{item.room}</Tag></div>
                <div>Ghế: {item.seats.join(", ")}</div>
              </>
            }
          />
        </List.Item>
      )}
    />
  </div>
);

export default BookingHistory; 