import type { Metadata } from 'next';
import NotFoundContent from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 - Không Tìm Thấy Trang | Bê Tông An Gia Bình',
  description: 'Đường dẫn bạn truy cập không tồn tại hoặc đã được cập nhật sang vị trí mới.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
