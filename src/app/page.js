"use client";

import { Button, DatePicker, Space, Typography } from "antd";

const { Title } = Typography;

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Space direction="vertical" size="large">
        <Title level={2}>Chào mừng đến với yyt</Title>

        <Space>
          <Button type="primary">Đăng nhập</Button>
        </Space>
      </Space>
    </main>
  );
}
