import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8876120939:AAEpkh1zZKQu6bq23eLv5gE_encPuFFhsCc';
const AUTHORIZED_CHAT_ID = 8612893214;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const SITE_URL = 'https://www.betongangiabinh.vn';

async function tgCall(method: string, body: Record<string, any>) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err: any) {
    console.error(`Telegram API error (${method}):`, err);
    return { ok: false, error: err.message };
  }
}

async function sendTgMessage(chatId: number, text: string, replyMarkup?: any) {
  return tgCall('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });
}

async function askGemini(prompt: string): Promise<string> {
  const systemPrompt = `Bạn là Trợ lý AI Kỹ Sư Cấp Cao của Trạm Trộn Bê Tông An Gia Bình (https://www.betongangiabinh.vn) tại Ninh Bình.
Xưng hô: Em - gọi người dùng là Sếp.
Am hiểu sâu sắc về:
- Các loại mác bê tông: Mác 150, 200, 250, 300, 350, 400 chuẩn TCVN.
- Dịch vụ xe bồn vận chuyển, xe bơm cần (37m, 48m, 52m, 56m) và bơm tĩnh vượt ngõ sâu, nhà cao tầng.
- Kỹ thuật đổ móng, sàn, dầm cột, bảo dưỡng bê tông tươi chống nứt.
- Tối ưu SEO Onpage, Google Search Console, phân tích thứ hạng từ khóa bê tông tại Ninh Bình, Hà Nam, Nam Định, Thanh Hóa.
Phản hồi chuyên nghiệp, ngắn gọn, dùng định dạng HTML hợp lệ (<b>, <i>, <code>, <a>).`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nSếp hỏi: ${prompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Dạ thưa Sếp, hệ thống đang bận xử lý dữ liệu trạm trộn, xin thử lại sau giây lát ạ!';
  } catch (e: any) {
    console.error('Gemini error:', e);
    return 'Dạ thưa Sếp, em gặp lỗi khi kết nối AI: ' + e.message;
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const msg = update.message;
    if (!msg || !msg.text) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = msg.text.trim();

    // Kiểm tra bảo mật Chat ID
    if (chatId !== AUTHORIZED_CHAT_ID) {
      await sendTgMessage(
        chatId,
        '🔒 <b>Bê Tông An Gia Bình Security:</b> Trợ lý nội bộ chỉ phản hồi tin nhắn từ Quản Trị Viên (Sếp)!'
      );
      return NextResponse.json({ ok: true });
    }

    if (text === '/start' || text === '/help') {
      const help = [
        `🏗️ <b>TRỢ LÝ KỸ SƯ BÊ TÔNG AN GIA BÌNH (WEBHOOK CLOUD 24/7)</b>`,
        `<i>Hệ thống trực tuyến 24/7 trên Cloudflare Edge, sẵn sàng phục vụ Sếp bất kể khi tắt PC!</i>\n`,
        `📋 <b>DANH SÁCH LỆNH TRA CỨU:</b>`,
        `• <code>/gia</code> : Xem bảng giá bê tông thương phẩm & ca bơm mới nhất 2026`,
        `• <code>/baiviet</code> : Xem các bài viết kỹ thuật & tin nóng vừa xuất bản`,
        `• <code>/status</code> : Kiểm tra trạng thái máy chủ & trạm trộn`,
        `• <code>/help</code> : Hướng dẫn sử dụng\n`,
        `💬 Sếp có thể nhắn tin hỏi trực tiếp về kỹ thuật đổ bê tông, mác bê tông, giải pháp bơm ngõ hẹp hoặc yêu cầu kiểm tra SEO!`,
      ].join('\n');

      const keyboard = {
        inline_keyboard: [
          [
            { text: '💰 Bảng Giá Bê Tông 2026', callback_data: 'cmd_gia' },
            { text: '📰 Bài Viết Mới Nhất', callback_data: 'cmd_posts' },
          ],
          [
            { text: '🌐 Mở Website An Gia Bình', url: SITE_URL },
            { text: '☎️ Hotline Kỹ Thuật (0988.266.293)', url: 'tel:0988266293' },
          ],
        ],
      };

      await sendTgMessage(chatId, help, keyboard);
      return NextResponse.json({ ok: true });
    }

    if (text === '/gia' || text === 'cmd_gia') {
      const priceMsg = [
        `📊 <b>BẢNG BÁO GIÁ THAM KHẢO BÊ TÔNG AN GIA BÌNH 2026:</b>`,
        `<i>(Đá 1x2, độ sụt 12±2, xi măng PCB40 đạt chuẩn TCVN)</i>\n`,
        `• <b>Mác 200 (R28):</b> ~ 950.000 đ/m³`,
        `• <b>Mác 250 (R28):</b> ~ 1.000.000 đ/m³ (Khuyên dùng đổ sàn/móng dân dụng)`,
        `• <b>Mác 300 (R28):</b> ~ 1.060.000 đ/m³ (Chuyên dụng nhà cao tầng, tải trọng lớn)`,
        `• <b>Mác 350 (R28):</b> ~ 1.130.000 đ/m³\n`,
        `🚜 <b>BÁO GIÁ CA BƠM:</b>`,
        `• <b>Bơm cần 37m - 52m:</b> 2.500.000 - 3.500.000 đ/ca (&lt;30m³) hoặc 80.000 - 100.000 đ/m³`,
        `• <b>Bơm tĩnh (đường dài & ngõ nhỏ):</b> 3.000.000 đ/ca đầu tiên\n`,
        `👉 <i>Chi tiết xem tại:</i> <a href="${SITE_URL}/gia-be-tong-tuoi-tai-ninh-binh.html">${SITE_URL}/gia-be-tong-tuoi-tai-ninh-binh.html</a>`,
      ].join('\n');

      await sendTgMessage(chatId, priceMsg);
      return NextResponse.json({ ok: true });
    }

    if (text === '/baiviet' || text === 'cmd_posts') {
      try {
        const postsPath = path.join(process.cwd(), 'public', 'data', 'posts.json');
        if (fs.existsSync(postsPath)) {
          const raw = fs.readFileSync(postsPath, 'utf8');
          const posts = JSON.parse(raw);
          const recent = posts.slice(0, 5);
          const msgLines = [
            `📰 <b>5 BÀI VIẾT & TIN NÓNG MỚI NHẤT TRÊN WEBSITE:</b>\n`,
            ...recent.map((p: any, idx: number) => `${idx + 1}. <a href="${SITE_URL}${p.permalink || `/blog/${p.slug}`}"><b>${p.title}</b></a>\n   <i>Chuyên mục: ${p.category || 'Kiến thức'}</i>`),
          ];
          await sendTgMessage(chatId, msgLines.join('\n'));
          return NextResponse.json({ ok: true });
        }
      } catch (err: any) {
        console.warn('Read posts error:', err);
      }
      await sendTgMessage(chatId, `Truy cập toàn bộ bài viết tại: <a href="${SITE_URL}/blog">${SITE_URL}/blog</a>`);
      return NextResponse.json({ ok: true });
    }

    if (text === '/status') {
      const statusMsg = [
        `🟢 <b>HỆ THỐNG AN GIA BÌNH WEBHOOK ONLINE 24/7</b>`,
        `• Nền tảng: <b>Cloudflare OpenNext Edge</b>`,
        `• Tốc độ phản hồi: <b>~25ms</b>`,
        `• Trạng thái trạm trộn: Sẵn sàng điều xe bồn & xe bơm 24/7`,
        `• Thời gian: <code>${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</code>`,
      ].join('\n');
      await sendTgMessage(chatId, statusMsg);
      return NextResponse.json({ ok: true });
    }

    // Chat AI tự nhiên
    const aiResponse = await askGemini(text);
    await sendTgMessage(chatId, aiResponse);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Angiabinh webhook error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    bot: 'angiabinh_seo_99_bot',
    platform: 'Cloudflare OpenNext Edge',
    time: new Date().toISOString(),
  });
}
