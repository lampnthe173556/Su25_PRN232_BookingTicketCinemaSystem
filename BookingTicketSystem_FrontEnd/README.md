# Hệ thống Quản lý Phim - Frontend

## Mô tả
Hệ thống quản lý phim với các chức năng:
- Quản lý phim (thêm, sửa, xóa, xem danh sách)
- Quản lý thể loại phim
- Quản lý diễn viên/đạo diễn
- Upload ảnh poster và ảnh đại diện
- Giao diện responsive với Ant Design

## Cài đặt

### Yêu cầu hệ thống
- Node.js (version 14 trở lên)
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình API
Tạo file `.env.local` trong thư mục gốc với nội dung:
```
REACT_APP_BASE_URL_API=https://localhost:7262/api
```

### Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Cấu trúc thư mục

```
src/
├── components/          # Components chung
│   └── Toast.js        # Component hiển thị thông báo
├── config/             # Cấu hình
│   └── api.js          # Cấu hình API endpoints
├── models/             # Models dữ liệu
│   ├── Movie.js        # Model phim
│   ├── Genre.js        # Model thể loại
│   └── Person.js       # Model diễn viên/đạo diễn
├── pages/              # Các trang
│   └── admin/          # Trang quản trị
│       ├── Movies.js   # Quản lý phim
│       ├── Genres.js   # Quản lý thể loại
│       └── Actors.js   # Quản lý diễn viên/đạo diễn
├── services/           # Services gọi API
│   ├── movieService.js
│   ├── genreService.js
│   └── personService.js
└── utils/              # Utilities
```

## Tính năng

### Quản lý Phim
- **Xem danh sách**: Hiển thị tất cả phim với thông tin cơ bản
- **Thêm phim**: Form với các trường:
  - Tên phim (bắt buộc)
  - Mô tả (bắt buộc)
  - Thời lượng (bắt buộc)
  - Ngôn ngữ (bắt buộc)
  - Ngày phát hành
  - Link trailer
  - Điểm đánh giá (0-10)
  - Thể loại (chọn nhiều)
  - Diễn viên (chọn nhiều)
  - Đạo diễn (chọn nhiều)
  - Poster phim (upload file)
- **Sửa phim**: Cập nhật thông tin phim
- **Xóa phim**: Xác nhận trước khi xóa

### Quản lý Thể loại
- **Xem danh sách**: Hiển thị tất cả thể loại
- **Thêm thể loại**: Form đơn giản với tên thể loại
- **Sửa thể loại**: Cập nhật tên thể loại
- **Xóa thể loại**: Xác nhận trước khi xóa

### Quản lý Diễn viên/Đạo diễn
- **Xem danh sách**: Hiển thị tất cả diễn viên/đạo diễn
- **Thêm**: Form với các trường:
  - Tên (bắt buộc)
  - Ngày sinh
  - Quốc tịch (bắt buộc)
  - Tiểu sử
  - Ảnh đại diện (upload file)
- **Sửa**: Cập nhật thông tin
- **Xóa**: Xác nhận trước khi xóa

## Công nghệ sử dụng

- **React**: Framework frontend
- **Ant Design**: UI component library
- **Axios**: HTTP client
- **React Router**: Routing

## API Endpoints

### Movies
- `GET /api/Movie` - Lấy danh sách phim
- `GET /api/Movie/{id}` - Lấy phim theo ID
- `POST /api/Movie` - Thêm phim mới
- `PUT /api/Movie/{id}` - Cập nhật phim
- `DELETE /api/Movie/{id}` - Xóa phim
- `GET /api/Movie/by-genre/{genreId}` - Lấy phim theo thể loại
- `GET /api/Movie/by-person/{personId}` - Lấy phim theo diễn viên/đạo diễn

### Genres
- `GET /api/Genre` - Lấy danh sách thể loại
- `GET /api/Genre/{id}` - Lấy thể loại theo ID
- `POST /api/Genre` - Thêm thể loại mới
- `PUT /api/Genre/{id}` - Cập nhật thể loại
- `DELETE /api/Genre/{id}` - Xóa thể loại

### Persons
- `GET /api/Person` - Lấy danh sách diễn viên/đạo diễn
- `GET /api/Person/{id}` - Lấy diễn viên/đạo diễn theo ID
- `POST /api/Person` - Thêm diễn viên/đạo diễn mới
- `PUT /api/Person/{id}` - Cập nhật diễn viên/đạo diễn
- `DELETE /api/Person/{id}` - Xóa diễn viên/đạo diễn
- `GET /api/Person/actors` - Lấy danh sách diễn viên
- `GET /api/Person/directors` - Lấy danh sách đạo diễn

## Lưu ý

1. **Upload ảnh**: Ảnh được upload lên cloud storage, database chỉ lưu URL
2. **Validation**: Tất cả form đều có validation client-side
3. **Error handling**: Xử lý lỗi và hiển thị thông báo phù hợp
4. **Responsive**: Giao diện responsive cho mobile và desktop
5. **Loading states**: Hiển thị loading khi đang tải dữ liệu

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra backend có đang chạy không
- Kiểm tra URL API trong file config
- Kiểm tra CORS configuration

### Lỗi upload ảnh
- Kiểm tra kích thước file (khuyến nghị < 5MB)
- Kiểm tra định dạng file (jpg, png, gif)
- Kiểm tra quyền upload trên server

### Lỗi validation
- Kiểm tra các trường bắt buộc đã được điền
- Kiểm tra định dạng dữ liệu (email, số điện thoại, v.v.) 