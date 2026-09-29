'use client';

import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, ShieldAlert, Sparkles, PhoneCall } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';

const GRADE_PRICES: Record<string, number> = {
  'Mác 150 (M150)': 870000,
  'Mác 200 (M200)': 940000,
  'Mác 250 (M250 - Phổ biến sàn nhà)': 1000000,
  'Mác 300 (M300 - Biệt thự, xưởng)': 1080000,
  'Mác 350 (M350 - Chống thấm cao)': 1160000,
  'Mác 400 (M400 - Cọc, dầm dự ứng lực)': 1240000,
};

const PUMP_PRICES: Record<string, { type: string; price: number; desc: string }> = {
  'none': { type: 'Tự xả từ xe bồn (Không cần bơm)', price: 0, desc: 'Xe bồn tiếp cận mép công trình < 3m' },
  'can37': { type: 'Xe bơm cần 37m - 43m', price: 2800000, desc: 'Nhà dân dụng, biệt thự 1 - 4 tầng' },
  'can52': { type: 'Xe bơm cần 52m - 56m', price: 4200000, desc: 'Sàn xưởng rộng, công trình cao tầng' },
  'tinh': { type: 'Bơm tĩnh áp lực cao (nối ống)', price: 3200000, desc: 'Ngõ sâu xe bồn không vào được (đường ống 50m - 150m)' },
};

export default function ConcreteCalculator() {
  const { addLead } = useAppStore();

  const [structureType, setStructureType] = useState<'slab' | 'strip_footing' | 'column' | 'road'>('slab');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(8);
  const [depth, setDepth] = useState<number>(0.12);
  const [grade, setGrade] = useState<string>('Mác 250 (M250 - Phổ biến sàn nhà)');
  const [pumpKey, setPumpKey] = useState<string>('can37');

  // Contact modal state
  const [showModal, setShowModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [pourDate, setPourDate] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Math
  const rawVolume = Math.max(0, length * width * depth);
  const wastageFactor = 1.04; // 4% safety allowance
  const finalVolume = Number((rawVolume * wastageFactor).toFixed(1));

  const concreteUnitPrice = GRADE_PRICES[grade] || 1000000;
  const concreteTotalCost = finalVolume * concreteUnitPrice;
  const pumpCost = PUMP_PRICES[pumpKey]?.price || 0;
  const grandTotal = concreteTotalCost + pumpCost;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone || !clientName) return;

    addLead({
      name: clientName,
      phone: clientPhone,
      address: clientAddress || 'Ninh Bình',
      concreteGrade: grade,
      estimatedM3: finalVolume,
      pumpNeeded: pumpKey !== 'none',
      pumpType: PUMP_PRICES[pumpKey]?.type,
      pourDate: pourDate || undefined,
      notes: `Hạng mục: ${structureType} (${length}m x ${width}m x ${depth}m). ${clientNotes}`
    });

    import('canvas-confetti')
      .then((module) => {
        const confettiFn = module.default || module;
        confettiFn({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      })
      .catch(() => {});

    setIsSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setIsSubmitted(false);
      setClientName('');
      setClientPhone('');
      setClientAddress('');
      setClientNotes('');
    }, 2800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-8" id="concrete-calculator-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Công Cụ Dự Toán Trực Tuyến
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Tính Khối Lượng & Dự Toán Chi Phí Bê Tông Ninh Bình
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tính chuẩn xác số khối m³ theo kích thước thực tế kèm hệ số nở hao hụt 4% chuẩn kỹ thuật xây dựng.
          </p>
        </div>

        <a
          href="tel:0988266293"
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Kỹ sư đo tận nơi: 0988 2662 93</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Structure Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Chọn Loại Cấu Kiện Cần Đổ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setStructureType('slab');
                  setDepth(0.12);
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  structureType === 'slab'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sàn Tầng / Mái (10 - 15cm)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStructureType('strip_footing');
                  setDepth(0.4);
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  structureType === 'strip_footing'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Móng Băng / Bè (30 - 50cm)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStructureType('column');
                  setDepth(3.5);
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  structureType === 'column'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cột / Vách Chịu Lực
              </button>
              <button
                type="button"
                onClick={() => {
                  setStructureType('road');
                  setDepth(0.18);
                }}
                className={`p-3 rounded-xl border text-center transition ${
                  structureType === 'road'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Sân Bãi / Nền Đường
              </button>
            </div>
          </div>

          {/* Dimension Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Kích Thước Hình Học (Đơn vị: Mét)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">Chiều Dài (m)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold text-slate-900 text-sm"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">Chiều Rộng (m)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold text-slate-900 text-sm"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">Độ Dày / Cao (m)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  value={depth}
                  onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Concrete Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Chọn Mác Bê Tông Phù Hợp
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold text-slate-900 text-sm bg-white"
            >
              {Object.keys(GRADE_PRICES).map((g) => (
                <option key={g} value={g}>
                  {g} - Đơn giá: {formatNumber(GRADE_PRICES[g])} đ/m³
                </option>
              ))}
            </select>
          </div>

          {/* Pump Option */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. Dịch Vụ Xe Bơm Bê Tông
            </label>
            <div className="space-y-2">
              {Object.entries(PUMP_PRICES).map(([key, val]) => (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-xs ${
                    pumpKey === key
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="pumpOption"
                    checked={pumpKey === key}
                    onChange={() => setPumpKey(key)}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{val.type}</span>
                      <span className="text-amber-700">
                        {val.price === 0 ? 'Miễn phí' : `${formatNumber(val.price)} đ/ca`}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{val.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Result & Quick Action */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider pb-3 border-b border-slate-800">
              <span>Kết Quả Dự Toán</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="my-6 text-center">
              <span className="text-xs text-slate-400 font-medium block">Thể tích bê tông khuyến nghị (đã gồm 4% hao hụt):</span>
              <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight my-2">
                {finalVolume} <span className="text-2xl font-bold text-slate-300">m³</span>
              </div>
              <span className="text-xs text-slate-400">
                (Tương đương khoảng <strong className="text-white">{Math.ceil(finalVolume / 10)} xe bồn</strong> loại 10m³ của An Gia Bình)
              </span>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-300">
                <span>Tiền bê tông ({finalVolume}m³ x {formatNumber(concreteUnitPrice)}đ):</span>
                <span className="font-semibold text-white">{formatNumber(concreteTotalCost)} đ</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Chi phí ca xe bơm:</span>
                <span className="font-semibold text-white">{formatNumber(pumpCost)} đ</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-sm font-bold">
                <span className="text-amber-400">Tổng tạm tính:</span>
                <span className="text-amber-400 text-lg font-black">{formatNumber(grandTotal)} đ</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Giá thực tế có thể chiết khấu tốt hơn tùy theo cự ly từ trạm trộn KCN Khánh Phú/Kim Sơn tới công trình.</span>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              id="calc-open-quote-modal"
            >
              <Send className="w-4 h-4" />
              <span>Nhận Báo Giá Chính Xác & Lịch Đổ</span>
            </button>
            <a
              href="tel:0988266293"
              className="w-full bg-amber-50 hover:bg-amber-100 text-slate-900 font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 border border-amber-200 shadow-2xs"
            >
              <span>Hoặc gọi trực tiếp: <strong className="text-amber-700">0988 2662 93</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Quote Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              ✕
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900">Tiếp Nhận Thành Công!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Kỹ sư phụ trách khu vực của <strong>Bê Tông An Gia Bình</strong> sẽ gọi lại cho quý khách trong vòng 10 phút để xác nhận mặt bằng và gửi lịch xe bồn.
                </p>
                <div className="text-xs text-amber-700 font-bold">
                  Hotline hỗ trợ gấp: 0988 2662 93
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Gửi Yêu Cầu Khảo Sát & Đặt Lịch Đổ Bê Tông
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dự kiến: <strong className="text-amber-600">{finalVolume} m³ {grade}</strong> ({PUMP_PRICES[pumpKey]?.type})
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên của bạn / Công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Anh Tuấn (Chủ thầu)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0988 123 456"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Địa chỉ công trình (Huyện/TP Ninh Bình)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: TP Ninh Bình, Gia Viễn..."
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ngày dự kiến đổ
                    </label>
                    <input
                      type="date"
                      value={pourDate}
                      onChange={(e) => setPourDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ghi chú thêm (Đường xe bồn, độ sụt, giờ vàng...)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Ngõ 4 mét, muốn đổ sáng sớm 5h..."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm flex items-center gap-1.5"
                    id="calc-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Yêu Cầu Báo Giá</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
