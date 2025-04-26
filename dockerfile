# Stage 1: Build Vite app
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Copy file build từ stage 1 vào thư mục nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy cấu hình nginx custom nếu cần (tùy chọn)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
