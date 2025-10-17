#!/bin/bash

# Waifu Card Game - Development Setup Script
# Author: soracocin
# Description: Automated setup for development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis for better UX
echo -e "${PURPLE}🌸 Setting up Waifu Card Game Development Environment...${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check prerequisites
check_requirements() {
    print_status "Checking prerequisites..."
    
    # Check Java 17
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | grep -oP 'version "(1\.)?\K\d+' | head -1)
        if [[ $JAVA_VERSION -ge 17 ]]; then
            print_success "Java $JAVA_VERSION found"
        else
            print_error "Java 17+ required. Current version: $JAVA_VERSION"
            echo "Please install OpenJDK 17: https://adoptopenjdk.net/"
            exit 1
        fi
    else
        print_error "Java not found. Please install OpenJDK 17."
        exit 1
    fi
    
    # Check Node.js 18+
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | grep -oP 'v\K\d+' | head -1)
        if [[ $NODE_VERSION -ge 18 ]]; then
            print_success "Node.js v$NODE_VERSION found"
        else
            print_error "Node.js 18+ required. Current version: v$NODE_VERSION"
            echo "Please update Node.js: https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+."
        exit 1
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            print_success "Docker found and running"
        else
            print_error "Docker found but not running. Please start Docker Desktop."
            exit 1
        fi
    else
        print_error "Docker not found. Please install Docker Desktop."
        exit 1
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose found"
    else
        print_error "Docker Compose not found. Please install Docker Compose."
        exit 1
    fi
    
    # Check Git
    if command -v git &> /dev/null; then
        print_success "Git found"
    else
        print_error "Git not found. Please install Git."
        exit 1
    fi
}

# Setup infrastructure services
setup_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Stop any existing containers
    docker-compose down &> /dev/null || true
    
    # Start PostgreSQL and Redis
    print_status "Starting PostgreSQL and Redis..."
    docker-compose up postgres redis -d
    
    print_status "Waiting for database to initialize..."
    sleep 30
    
    # Verify services are running
    if docker-compose ps | grep -q "waifu-card-db.*Up"; then
        print_success "PostgreSQL started successfully"
    else
        print_error "PostgreSQL failed to start"
        docker-compose logs postgres
        exit 1
    fi
    
    if docker-compose ps | grep -q "waifu-card-redis.*Up"; then
        print_success "Redis started successfully"
    else
        print_error "Redis failed to start"
        docker-compose logs redis
        exit 1
    fi
    
    # Test database connection
    print_status "Testing database connection..."
    if docker exec waifu-card-db pg_isready -U gameuser &> /dev/null; then
        print_success "Database connection verified"
    else
        print_warning "Database connection test failed, but continuing..."
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend (Spring Boot)..."
    
    cd backend
    
    # Make gradlew executable
    chmod +x gradlew
    
    # Check if Gradle wrapper works
    if ./gradlew --version &> /dev/null; then
        print_success "Gradle wrapper is working"
    else
        print_error "Gradle wrapper failed"
        exit 1
    fi
    
    # Download dependencies and compile (skip tests for faster setup)
    print_status "Downloading dependencies and compiling..."
    ./gradlew build -x test
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed and compiled"
    else
        print_error "Backend setup failed"
        exit 1
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend (React + TypeScript)..."
    
    cd frontend
    
    # Check package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    # Install npm dependencies
    print_status "Installing npm dependencies..."
    npm ci --silent
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Frontend setup failed"
        exit 1
    fi
    
    # Verify TypeScript compilation
    print_status "Verifying TypeScript setup..."
    npm run build --silent &> /dev/null
    
    if [ $? -eq 0 ]; then
        print_success "TypeScript compilation verified"
    else
        print_warning "TypeScript compilation has issues, but continuing..."
    fi
    
    cd ..
}

# Create environment files
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Create backend development config
    cat > backend/src/main/resources/application-development.yml << 'EOF'
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/waifu_card_game
    username: gameuser
    password: gamepass123
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
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
  secret: waifu-card-game-secret-key-for-development-only-please-change-in-production
  expiration: 86400  # 24 hours

# Logging
logging:
  level:
    com.cocin.waifuwar: DEBUG
    org.springframework.security: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
EOF

    print_success "Backend configuration file created"
    
    # Create frontend environment file
    cat > frontend/.env.development << 'EOF'
# Development Environment Variables
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME="Waifu Card Game (Dev)"
VITE_APP_VERSION=1.0.0-dev
VITE_DEBUG=true
EOF

    print_success "Frontend environment file created"
    
    # Create VS Code settings for better development experience
    mkdir -p .vscode
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "java.home": "/usr/lib/jvm/java-17-openjdk",
  "java.configuration.updateBuildConfiguration": "automatic",
  "spring-boot.ls.checkJVM": false
}
EOF

    print_success "VS Code settings created"
}

# Create helper scripts
create_helper_scripts() {
    print_status "Creating helper scripts..."
    
    # Create start script
    cat > scripts/start-dev.sh << 'EOF'
#!/bin/bash

# Start development servers
echo "🚀 Starting Waifu Card Game development servers..."

# Start backend in background
echo "Starting backend..."
cd backend
./gradlew bootRun > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

# Wait a bit for backend to start
sleep 10

# Start frontend
echo "Starting frontend..."
cd frontend
npm run dev
cd ..

# Cleanup function
cleanup() {
    echo "Stopping servers..."
    if [ -f logs/backend.pid ]; then
        kill $(cat logs/backend.pid) 2>/dev/null
        rm logs/backend.pid
    fi
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

echo "Development servers started!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop all servers"

wait
EOF

    chmod +x scripts/start-dev.sh
    print_success "Development start script created"
    
    # Create logs directory
    mkdir -p logs
    touch logs/.gitkeep
    
    # Create stop script
    cat > scripts/stop-dev.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping all development services..."

# Stop backend if running
if [ -f logs/backend.pid ]; then
    PID=$(cat logs/backend.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "Stopping backend (PID: $PID)..."
        kill $PID
        rm logs/backend.pid
    fi
fi

# Stop any gradle processes
pkill -f "gradle.*bootRun" || true

# Stop Docker services
echo "Stopping Docker services..."
docker-compose down

echo "✅ All services stopped"
EOF

    chmod +x scripts/stop-dev.sh
    print_success "Development stop script created"
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check if all services are responsive
    print_status "Testing database connectivity..."
    if docker exec waifu-card-db psql -U gameuser -d waifu_card_game -c "SELECT 1;" &> /dev/null; then
        print_success "Database is accessible"
    else
        print_warning "Database connection test failed"
    fi
    
    # Check Redis
    print_status "Testing Redis connectivity..."
    if docker exec waifu-card-redis redis-cli ping | grep -q "PONG"; then
        print_success "Redis is accessible"
    else
        print_warning "Redis connection test failed"
    fi
    
    print_success "Installation verification completed"
}

# Main execution function
main() {
    echo "${PURPLE}================================${NC}"
    echo "${PURPLE}  Waifu Card Game Dev Setup     ${NC}"
    echo "${PURPLE}================================${NC}"
    echo ""
    
    check_requirements
    echo ""
    
    setup_infrastructure
    echo ""
    
    setup_backend
    echo ""
    
    setup_frontend
    echo ""
    
    create_env_files
    echo ""
    
    create_helper_scripts
    echo ""
    
    verify_installation
    echo ""
    
    echo "${GREEN}🎉 Development environment setup complete!${NC}"
    echo ""
    echo "${YELLOW}Next steps:${NC}"
    echo "1. ${BLUE}Start development servers:${NC}"
    echo "   ${PURPLE}./scripts/start-dev.sh${NC}"
    echo ""
    echo "2. ${BLUE}Or start manually:${NC}"
    echo "   ${PURPLE}Terminal 1:${NC} cd backend && ./gradlew bootRun"
    echo "   ${PURPLE}Terminal 2:${NC} cd frontend && npm run dev"
    echo ""
    echo "3. ${BLUE}Open your browser:${NC}"
    echo "   ${PURPLE}Frontend:${NC} http://localhost:3000"
    echo "   ${PURPLE}Backend API:${NC} http://localhost:8080/api"
    echo ""
    echo "4. ${BLUE}Stop all services:${NC}"
    echo "   ${PURPLE}./scripts/stop-dev.sh${NC}"
    echo ""
    echo "${GREEN}Happy coding! 🌸✨${NC}"
    echo ""
    echo "${YELLOW}📖 For more information:${NC}"
    echo "   - Setup Guide: docs/development/setup-guide.md"
    echo "   - API Docs: docs/api/README.md"
    echo "   - Architecture: docs/architecture/system-design.md"
}

# Run main function
main "$@"