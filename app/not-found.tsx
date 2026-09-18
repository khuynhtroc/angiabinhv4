import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        Không Tìm Thấy Trang
      </h1>
      <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi đường dẫn.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-sm inline-block"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
}
