import React from "react";
import { Card, Tag, Rate, Button, Tooltip } from "antd";
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const POSTER_HEIGHT = 320;
const CARD_WIDTH = 240;
const POSTER_PLACEHOLDER = '/default-poster.png';

export default function MovieCard({ movie, isFavorite, loadingFavorite, onToggleFavorite, onBook, onViewDetail }) {
  // Lấy tối đa 2 thể loại, làm nổi bật
  const genreStr = movie.Genres && movie.Genres.length > 0
    ? movie.Genres.slice(0, 2).map(g => g.name).join(', ') + (movie.Genres.length > 2 ? ' ...' : '')
    : '';
    
  return (
    <Card
      hoverable
      style={{
        width: CARD_WIDTH,
        minHeight: 240,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 8px #f0f1f2',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        background: '#fff',
        position: 'relative',
        cursor: 'default'
      }}
      // Không gán onClick cho Card nữa
      cover={
        <img
          alt={movie.title}
          src={movie.posterUrl || POSTER_PLACEHOLDER}
          style={{
            width: '100%',
            height: POSTER_HEIGHT,
            objectFit: 'cover',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            background: '#eee',
            display: 'block',
            cursor: 'pointer'
          }}
          onClick={e => { e.stopPropagation(); onViewDetail && onViewDetail(movie); }}
          onError={e => { e.target.onerror = null; e.target.src = POSTER_PLACEHOLDER; }}
        />
      }
    >
      {/* Nút yêu thích */}
      <Tooltip title={isFavorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}>
        <Button
          type="text"
          shape="circle"
          icon={isFavorite ? <HeartFilled style={{ color: '#eb2f96', fontSize: 22 }} /> : <HeartOutlined style={{ color: '#888', fontSize: 22 }} />}
          onClick={e => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(movie); }}
          loading={loadingFavorite}
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
        />
      </Tooltip>
      {/* Tên phim */}
      <div style={{
        minHeight: 28,
        fontWeight: 700,
        fontSize: 16,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '8px 12px 0 12px',
        color: '#222'
      }}>{movie.title}</div>
      {/* Thể loại nổi bật */}
      <div style={{
        minHeight: 22,
        margin: '0 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        {movie.Genres && movie.Genres.length > 0 ? (
          movie.Genres.slice(0, 2).map(g => (
            <Tag color="geekblue" key={g.genreId} style={{ fontWeight: 600, fontSize: 12, padding: '0 8px' }}>{g.name}</Tag>
          ))
        ) : <span style={{ opacity: 0 }}>NoTag</span>}
        {movie.Genres && movie.Genres.length > 2 && <span style={{ color: '#888', fontSize: 13 }}>...</span>}
      </div>
      {/* Mô tả */}
      <div style={{
        minHeight: 22,
        color: '#666',
        fontSize: 13,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '0 12px'
      }}>
        {movie.description?.slice(0, 60) || <span style={{ opacity: 0 }}>NoDesc</span>}
      </div>
      {/* Vote */}
      <div style={{
        minHeight: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: '0 12px 8px 12px'
      }}>
        <Rate disabled value={movie.rating} count={5} style={{ fontSize: 16 }} />
      </div>
      {/* Nút đặt vé */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 14,
        marginTop: 4
      }}>
        <Button type="primary" size="middle" onClick={e => { e.stopPropagation(); onBook && onBook(movie); }}>
          Đặt vé
        </Button>
      </div>
    </Card>
  );
} 