🌸 Waifu Card Game - Hướng Dẫn Setup Đầy Đủ
📋 Yêu Cầu Hệ Thống
IntelliJ IDEA 2025 (Ultimate hoặc Community)

Java 17 hoặc cao hơn

Node.js 18+ và npm

Docker Desktop

Git

🚀 Bước 1: Tạo Project Structure
Tạo thư mục dự án với cấu trúc như sau:

text
waifu-card-game/
├── docker-compose.yml
├── database/
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/waifucardgame/
│       ├── WaifuCardGameApplication.java
│       ├── model/
│       ├── repository/
│       ├── service/
│       ├── controller/
│       ├── dto/
│       └── config/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── App.css
        └── components/
🔧 Bước 2: Setup Backend trong IntelliJ
2.1 Tạo Spring Boot Project
Mở IntelliJ IDEA 2025

Chọn File → New → Project

Chọn Spring Boot từ danh sách bên trái

Cấu hình project:

Name: waifu-card-backend

Location: [path-to-project]/waifu-card-game/backend

Language: Java

Type: Maven

Group: com.waifucardgame

Artifact: waifu-card-backend

Package name: com.waifucardgame

Java Version: 17

Click Next, chọn dependencies:

Spring Web

Spring Data JPA

Spring Security

PostgreSQL Driver

Spring Boot DevTools

Click Create

2.2 Copy Files vào Project
Thay thế pom.xml bằng nội dung từ file backend-pom.xml

Copy file application.yml vào src/main/resources/

Copy tất cả Java files vào các package tương ứng:

Main class vào root package

Entities vào package model

Repositories vào package repository

Services vào package service

Controllers vào package controller

DTOs vào package dto

Configs vào package config

2.3 Setup Run Configuration
Trong IntelliJ, mở class WaifuCardGameApplication.java

Click vào mũi tên xanh bên cạnh method main

Chọn Run 'WaifuCardGameApplication'

Hoặc: Run → Edit Configurations

Click + → Spring Boot

Name: Waifu Card Backend

Main class: com.waifucardgame.WaifuCardGameApplication

Active profiles: default

🐳 Bước 3: Setup Docker
3.1 Tạo các Docker files
Copy docker-compose.yml vào root project

Copy backend-dockerfile thành backend/Dockerfile

Copy frontend-dockerfile thành frontend/Dockerfile

Copy database-init.sql thành database/init.sql

3.2 Start PostgreSQL và Redis
bash
# Trong thư mục root project
docker-compose up postgres redis -d
Chờ khoảng 30 giây để database khởi động hoàn toàn.

🌐 Bước 4: Setup Frontend
4.1 Tạo React App
bash
# Di chuyển vào thư mục frontend
cd frontend

# Tạo React app (nếu chưa có)
npx create-react-app . --template typescript

# Hoặc nếu đã có folder:
npm init -y
4.2 Copy Frontend Files
Thay thế package.json bằng nội dung từ file tương ứng

Copy App.js và App.css vào src/

Tạo thư mục src/components/ và copy tất cả component files vào đó

4.3 Install Dependencies
bash
npm install
▶️ Bước 5: Chạy Ứng Dụng
5.1 Chạy Backend
Cách 1: Từ IntelliJ

Click Run → Run 'WaifuCardGameApplication'

Hoặc nhấn Ctrl+Shift+F10

Cách 2: Từ Terminal

bash
cd backend
./mvnw spring-boot:run
5.2 Chạy Frontend
bash
cd frontend
npm start
Frontend sẽ chạy trên http://localhost:3000
Backend sẽ chạy trên http://localhost:8080

🔐 Bước 6: Test Ứng Dụng
6.1 Tạo Tài Khoản
Mở http://localhost:3000

Click Đăng ký ngay

Nhập thông tin:

Username: testuser

Email: test@example.com

Password: 123456

6.2 Test Các Chức Năng
Dashboard: Xem thông tin user và thống kê

Bộ sưu tập: Xem các thẻ đã có

Gacha: Mở thẻ mới

Đấu thẻ: (Đang phát triển)

🐛 Troubleshooting
Lỗi Database Connection
bash
# Kiểm tra PostgreSQL đang chạy
docker-compose ps

# Xem logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
Lỗi Port Already in Use
bash
# Tìm process đang sử dụng port 8080
netstat -tulpn | grep 8080

# Kill process (Linux/Mac)
kill -9 <PID>

# Hoặc đổi port trong application.yml
server:
  port: 8081
Lỗi Maven Dependencies
Trong IntelliJ: View → Tool Windows → Maven

Click Reload All Maven Projects (icon làm mới)

Hoặc: File → Invalidate Caches and Restart

Lỗi CORS
Đảm bảo frontend chạy trên port 3000 và backend có cấu hình CORS đúng trong SecurityConfig.java.

🔨 Development Workflow
1. Thay đổi Backend
Sửa code Java trong IntelliJ

Spring Boot DevTools sẽ tự động reload

Hoặc restart manually: Ctrl+F5 trong IntelliJ

2. Thay đổi Frontend
Sửa React components

Webpack dev server tự động reload browser

3. Thay đổi Database Schema
Sửa Entity classes

Set spring.jpa.hibernate.ddl-auto=update trong application.yml

Restart backend để apply changes

📦 Production Build
Build Backend
bash
cd backend
./mvnw clean package -DskipTests
Build Frontend
bash
cd frontend
npm run build
Run with Docker
bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy in background
docker-compose up -d --build
🎯 Các Tính Năng Đã Implement
✅ User Management: Đăng ký, đăng nhập
✅ Card System: CRUD operations cho cards
✅ Gacha System: Single và 10-pull với rates
✅ Collection Management: Xem bộ sưu tập
✅ Database: PostgreSQL với relationships
✅ Frontend: Responsive React UI
✅ Docker: Containerized deployment

🚧 Tính Năng Sắp Tới
🔲 Battle System: Real-time PvP battles
🔲 Deck Building: Tạo và quản lý deck
🔲 JWT Authentication: Secure token-based auth
🔲 WebSocket: Real-time notifications
🔲 Admin Panel: Quản lý game content
🔲 Mobile Responsive: Tối ưu cho mobile

📞 Hỗ Trợ
Nếu gặp vấn đề:

Kiểm tra logs trong IntelliJ Console

Kiểm tra Network tab trong browser DevTools

Xem logs Docker: docker-compose logs [service-name]

Restart tất cả services: docker-compose restart

Chúc bạn code vui vẻ với Waifu Card Game! 🌸✨