# Waifu Card Game API Documentation

## Overview
REST API cho hệ thống game thẻ bài waifu với Spring Boot 3.2.0 và JWT authentication.

## Base URL
- **Development:** `http://localhost:8080/api`
- **Staging:** `https://staging-api.waifu-card-game.com/api`
- **Production:** `https://api.waifu-card-game.com/api`

## Authentication
API sử dụng JWT Bearer token authentication.

### Request Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Login Endpoint
```http
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2025-06-24T10:30:00Z"
    }
  }
}
```

## API Endpoints

### 🔐 Authentication
- `POST /auth/register` - Đăng ký tài khoản mới
- `POST /auth/login` - Đăng nhập và nhận JWT token
- `POST /auth/refresh` - Làm mới JWT token
- `POST /auth/logout` - Đăng xuất (invalidate token)

### 👤 User Management
- `GET /users/profile` - Xem thông tin profile của user hiện tại
- `PUT /users/profile` - Cập nhật thông tin profile
- `GET /users/{id}` - Xem thông tin public của user khác
- `DELETE /users/account` - Xóa tài khoản

### 🃏 Card System
- `GET /cards` - Danh sách tất cả thẻ bài (có pagination)
- `GET /cards/{id}` - Chi tiết một thẻ bài
- `POST /cards` - Tạo thẻ bài mới (Admin only)
- `PUT /cards/{id}` - Cập nhật thẻ bài (Admin only)
- `DELETE /cards/{id}` - Xóa thẻ bài (Admin only)

### 📚 Collection Management
- `GET /users/{id}/collection` - Xem bộ sưu tập thẻ của user
- `GET /users/collection/my` - Xem bộ sưu tập của chính mình
- `POST /users/collection/favorite` - Đánh dấu thẻ yêu thích
- `GET /users/collection/stats` - Thống kê bộ sưu tập

### 🎰 Gacha System
- `POST /gacha/single` - Mở 1 thẻ (single pull)
- `POST /gacha/ten-pull` - Mở 10 thẻ (10+1 pull)
- `GET /gacha/rates` - Xem tỷ lệ drop các thẻ
- `GET /gacha/history` - Lịch sử mở thẻ của user
- `GET /gacha/pity-counter` - Đếm số lần mở thẻ (pity system)

### ⚔️ Battle System (Future)
- `POST /battles/create` - Tạo trận đấu mới
- `POST /battles/{id}/join` - Tham gia trận đấu
- `GET /battles/{id}` - Chi tiết trận đấu
- `POST /battles/{id}/action` - Thực hiện hành động trong trận đấu

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-10-17T06:44:01Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "username",
        "message": "Username is required"
      }
    ]
  },
  "timestamp": "2025-10-17T06:44:01Z"
}
```

## HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| `200` | OK | Request thành công |
| `201` | Created | Tạo resource mới thành công |
| `400` | Bad Request | Dữ liệu đầu vào không hợp lệ |
| `401` | Unauthorized | Chưa xác thực hoặc token không hợp lệ |
| `403` | Forbidden | Không có quyền truy cập |
| `404` | Not Found | Resource không tồn tại |
| `409` | Conflict | Conflict dữ liệu (ví dụ: username đã tồn tại) |
| `429` | Too Many Requests | Rate limiting |
| `500` | Internal Server Error | Lỗi server |

## Rate Limiting

- **Guest users:** 100 requests/hour
- **Authenticated users:** 1000 requests/hour
- **Gacha pulls:** 50 pulls/hour (để tránh spam)

## Testing

### Postman Collection
Import file `docs/api/postman-collection.json` vào Postman để test API.

### cURL Examples
```bash
# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser", 
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Get user profile (with JWT token)
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Gacha single pull
curl -X POST http://localhost:8080/api/gacha/single \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Changelog

### v1.0.0 (Current)
- ✅ User authentication & registration
- ✅ Card management system
- ✅ Basic gacha system
- ✅ Collection management

### v1.1.0 (Planned)
- 🔲 Battle system implementation
- 🔲 Real-time notifications via WebSocket
- 🔲 Advanced pity system
- 🔲 Trading system between users

---
*Để biết thêm chi tiết về từng endpoint, xem các file tương ứng trong thư mục này.*