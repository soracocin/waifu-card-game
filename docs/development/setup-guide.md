# Development Setup Guide

## Yêu cầu hệ thống

### Phần mềm bắt buộc
- ✅ **Java 17+** (OpenJDK được khuyến nghị)
- ✅ **Node.js 18+** và npm/yarn
- ✅ **Docker Desktop** (với Docker Compose)
- ✅ **Git** (phiên bản mới nhất)

### IDE được khuyến nghị
- **IntelliJ IDEA** (Ultimate hoặc Community) - cho backend
- **VS Code** hoặc **WebStorm** - cho frontend

### Extension/Plugin hữu ích
**IntelliJ IDEA:**
- Spring Boot plugin
- Lombok plugin
- Docker plugin
- Database Navigator

**VS Code:**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- Thunder Client (API testing)

## Quick Start 🚀

### 1. Clone Repository
```bash
git clone https://github.com/soracocin/waifu-card-game.git
cd waifu-card-game
```

### 2. Kiểm tra yêu cầu hệ thống
```bash
# Kiểm tra Java version
java -version
# Kết quả mong muốn: openjdk version "17.x.x"

# Kiểm tra Node.js
node -v
# Kết quả mong muốn: v18.x.x hoặc cao hơn

# Kiểm tra Docker
docker --version
docker-compose --version
```

### 3. Chạy script tự động setup (Khuyến nghị)
```bash
# Cấp quyền thực thi cho script
chmod +x scripts/dev-setup.sh

# Chạy script setup
./scripts/dev-setup.sh
```

Script sẽ tự động:
- Kiểm tra các yêu cầu hệ thống
- Khởi động PostgreSQL và Redis
- Cài đặt dependencies cho backend và frontend
- Tầo các file cấu hình cần thiết

### 4. Khởi động ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
./gradlew bootRun
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Kết quả:**
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Database: localhost:5433
- Redis: localhost:6379

## Setup thủ công (Manual Setup)

### Backend Setup (Spring Boot)

#### 1. Mở project trong IntelliJ
```bash
# Mở IntelliJ IDEA
# Chọn File → Open → Chọn thư mục backend/
# IntelliJ sẽ tự động nhận diện Gradle project
```

#### 2. Cấu hình JDK
```bash
# File → Project Structure → Project Settings → Project
# Chọn Project SDK: 17 (hoặc Java version 17)
# Chọn Project language level: 17
```

#### 3. Khởi động database
```bash
# Từ thư mục gốc dự án
docker-compose up postgres redis -d

# Chờ 30 giây để database khởi động hoàn tất
sleep 30

# Kiểm tra trạng thái
docker-compose ps
```

#### 4. Chạy backend
```bash
# Cách 1: Từ IntelliJ
# Mở file WaifuCardGameApplication.java
# Click vào nút Run hoặc Ctrl+Shift+F10

# Cách 2: Từ terminal
cd backend
./gradlew bootRun

# Cách 3: Với profile cụ thể
./gradlew bootRun --args='--spring.profiles.active=development'
```

### Frontend Setup (React + TypeScript)

#### 1. Cài đặt dependencies
```bash
cd frontend

# Sử dụng npm
npm install

# Hoặc sử dụng yarn (nếu ưa thích)
yarn install
```

#### 2. Cấu hình VS Code (nếu sử dứng)
```bash
# Tạo .vscode/settings.json
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
EOF
```

#### 3. Chạy frontend
```bash
# Development mode với hot reload
npm run dev

# Sẽ mở trình duyệt tự động tại http://localhost:3000
```

## Cấu hình môi trường

### Backend Configuration

**application-development.yml** (đã được tạo tự động):
```yaml
# backend/src/main/resources/application-development.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/waifu_card_game
    username: gameuser
    password: gamepass123
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Tự động cập nhật schema
    show-sql: true      # Hiện thị SQL queries
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  redis:
    host: localhost
    port: 6379
    timeout: 60000
    jedis:
      pool:
        max-active: 10
        max-idle: 8
        min-idle: 2

server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always

# JWT Configuration
jwt:
  secret: waifu-card-game-secret-key-for-development-only
  expiration: 86400  # 24 hours in seconds

# Logging
logging:
  level:
    com.cocin.waifuwar: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### Frontend Configuration

**vite.config.ts** (đã có sẵn):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## Development Workflow

### 1. Code Changes - Backend
```bash
# IntelliJ IDEA với Spring Boot DevTools sẽ tự động reload
# Hoặc restart thủ công: Ctrl+F5

# Kiểm tra code quality
./gradlew check

# Chạy tests
./gradlew test

# Build project
./gradlew build
```

### 2. Code Changes - Frontend
```bash
# Vite sẽ tự động hot reload khi có thay đổi

# Kiểm tra linting
npm run lint

# Chạy tests
npm run test

# Build production
npm run build
```

### 3. Database Changes
```bash
# 1. Cập nhật Entity classes trong backend
# 2. Restart backend app (Hibernate sẽ tự động cập nhật schema)
# 3. Hoặc thực hiện migration thủ công:

./scripts/db-migrate.sh status    # Kiểm tra trạng thái
./scripts/db-migrate.sh backup   # Backup trước khi thay đổi
```

## Testing

### Backend Testing
```bash
cd backend

# Chạy tất cả tests
./gradlew test

# Chạy test cụ thể
./gradlew test --tests="*UserServiceTest*"

# Chạy với coverage report
./gradlew test jacocoTestReport
# Xem kết quả: build/reports/jacoco/test/html/index.html
```

### Frontend Testing
```bash
cd frontend

# Chạy unit tests
npm run test

# Chạy tests với coverage
npm run test -- --coverage

# Chạy tests cụ thể
npm run test -- UserProfile.test.tsx
```

### API Testing
```bash
# Sử dụng Thunder Client trong VS Code
# Hoặc Postman với collection trong docs/api/

# Test thủ công với curl
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting 🔧

### Lỗi thường gặp

#### 1. Database Connection Failed
```bash
# Kiểm tra Docker containers
docker-compose ps

# Nếu PostgreSQL không chạy
docker-compose up postgres -d

# Xem logs nếu có lỗi
docker-compose logs postgres

# Reset database (cẩn thận!)
docker-compose down
docker-compose up postgres -d
```

#### 2. Port Already in Use
```bash
# Tìm process đang sử dụng port
# Linux/Mac:
netstat -tulpn | grep 8080
lsof -i :8080

# Windows:
netstat -ano | findstr :8080

# Kill process
kill -9 <PID>

# Hoặc đổi port trong application.yml
```

#### 3. Gradle Build Failed
```bash
# Làm sạch và build lại
./gradlew clean build

# Xóa cache Gradle
rm -rf ~/.gradle/caches/

# Trong IntelliJ: File → Invalidate Caches and Restart
```

#### 4. NPM Install Failed
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install

# Hoặc sử dụng yarn
npm install -g yarn
yarn install
```

#### 5. CORS Error
```bash
# Kiểm tra cấu hình CORS trong SecurityConfig.java
# Đảm bảo frontend chạy trên port 3000
# Kiểm tra proxy config trong vite.config.ts
```

### Debug Tips

#### Backend Debugging
```bash
# Chạy với debug mode
./gradlew bootRun --debug-jvm

# Hoặc trong IntelliJ: Debug 'WaifuCardGameApplication'
# Set breakpoints và debug bình thường
```

#### Frontend Debugging
```bash
# Mở Developer Tools trong browser (F12)
# Sử dụng React Developer Tools extension
# Kiểm tra Network tab cho API calls
# Console tab cho JavaScript errors
```

## IDE Configuration

### IntelliJ IDEA Setup

#### 1. Import project
```bash
# File → Open → Chọn thư mục backend/
# Chọn "Import Gradle project"
# Chờ IntelliJ download dependencies
```

#### 2. Cấu hình Run Configuration
```bash
# Run → Edit Configurations
# Click + → Spring Boot
# Name: Waifu Card Backend
# Main class: com.cocin.waifuwar.WaifuCardGameApplication
# Active profiles: development
# VM options: -Dspring.profiles.active=development
```

#### 3. Database Tool Window
```bash
# View → Tool Windows → Database
# Click + → PostgreSQL
# Host: localhost
# Port: 5433
# Database: waifu_card_game
# User: gameuser
# Password: gamepass123
```

### VS Code Setup

#### 1. Workspace settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### 2. Launch configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/vite",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Production Build

### Build tất cả services
```bash
# Sử dụng script tự động
./scripts/deploy.sh staging

# Hoặc build thủ công
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Kiểm tra health
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:3000

# Database
docker exec waifu-card-db pg_isready -U gameuser
```

---

## Next Steps

Sau khi hoàn thành setup:

1. 📚 Đọc [API Documentation](../api/README.md)
2. 🏗️ Tìm hiểu [System Architecture](../architecture/system-design.md)
3. 🧪 Xem [Testing Guide](./testing.md)
4. 🚀 Thử [Deployment Guide](../deployment/docker.md)

**Happy coding! 🌸✨**

---
*Nếu gặp vấn đề, check [Troubleshooting](#troubleshooting) hoặc tạo issue trên GitHub.*