# YTT App - Your Time Tracking Application

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/              # Group route cho các trang xác thực
│   │   ├── login/          # Trang đăng nhập
│   │   │   └── page.js
│   │   └── register/      # Trang đăng ký
│   │       └── page.js
│   │
│   ├── (dashboard)/        # Group route cho các trang dashboard
│   │   ├── dashboard/     # Trang tổng quan
│   │   │   └── page.js
│   │   ├── profile/      # Trang hồ sơ
│   │   │   └── page.js
│   │   └── settings/     # Trang cài đặt
│   │       └── page.js
│   │
│   ├── layout.js          # Layout chính
│   └── page.js           # Trang chủ
│
├── components/            # Các components có thể tái sử dụng
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   └── shared/          # Shared components (header, footer, etc.)
│
└── styles/               # CSS và Less files
    ├── antd.less        # Tùy chỉnh Ant Design
    └── globals.css      # CSS toàn cục

```

## Quy ước đặt tên và cấu trúc

### 1. Group Routes (thư mục trong ngoặc đơn)

- `(auth)`: Nhóm các trang liên quan đến xác thực
- `(dashboard)`: Nhóm các trang trong dashboard

### 2. Pages

- Mỗi trang phải có file `page.js`
- Đường dẫn URL sẽ tương ứng với cấu trúc thư mục
- Ví dụ: `/login` sẽ trỏ đến `src/app/(auth)/login/page.js`

### 3. Components

- Components dùng chung đặt trong thư mục `components`
- `ui/`: Chứa các UI components cơ bản
- `shared/`: Chứa các components dùng chung trong ứng dụng

### 4. Styles

- `antd.less`: Tùy chỉnh theme Ant Design
- `globals.css`: CSS toàn cục cho ứng dụng

## Hướng dẫn tạo trang mới

1. Tạo thư mục mới trong `src/app` hoặc trong group route phù hợp
2. Tạo file `page.js` trong thư mục đó
3. Export một React component mặc định
4. Thêm 'use client' ở đầu file nếu sử dụng client components

Ví dụ tạo trang mới:

```javascript
"use client";

import { Component } from "antd";

export default function NewPage() {
  return <div>// Nội dung trang</div>;
}
```
