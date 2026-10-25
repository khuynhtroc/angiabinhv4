import os
import sys
import json
import urllib.request
from datetime import datetime

# Configure UTF-8 for console output on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def load_env(env_path):
    env = {}
    if not os.path.exists(env_path):
        return env
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"\'')
    return env

def send_telegram_update(title, details, tags=None):
    # Find .env.local or .env in project root
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(current_dir, '..'))
    env_file = os.path.join(project_dir, '.env.local')
    if not os.path.exists(env_file):
        env_file = os.path.join(project_dir, '.env')
    env = load_env(env_file)

    token = env.get('TELEGRAM_BOT_TOKEN', '8876120939:AAEpkh1zZKQu6bq23eLv5gE_encPuFFhsCc')
    chat_id = env.get('TELEGRAM_CHAT_ID', '8612893214')

    now_str = datetime.now().strftime('%H:%M:%S - %d/%m/%Y')
    
    msg_lines = [
        f"🏗 <b>[Bê Tông An Gia Bình] CẬP NHẬT HỆ THỐNG MỚI</b>",
        f"⏱ <i>Thời gian: {now_str}</i>",
        f"━━━━━━━━━━━━━━━━━━",
        f"📌 <b>Nội dung cập nhật:</b>",
        f"<b>{title}</b>\n",
    ]

    if isinstance(details, list):
        for item in details:
            msg_lines.append(f"• {item}")
    else:
        msg_lines.append(str(details))

    msg_lines.append(f"\n━━━━━━━━━━━━━━━━━━")
    msg_lines.append(f"🌐 <i>Website: https://www.betongangiabinh.vn</i>")
    if tags:
        msg_lines.append(f"🏷 {tags}")
    else:
        msg_lines.append(f"🏷 #betongangiabinh #angiabinhv4 #update #deployment")

    text = "\n".join(msg_lines)

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("ok"):
                print("✓ Đã gửi thông báo Telegram bot betongangiabinh thành công!")
                return True
            else:
                print("X Lỗi gửi Telegram:", data)
                return False
    except Exception as e:
        print("X Ngoại lệ khi gửi Telegram:", e)
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        title = sys.argv[1]
        details = sys.argv[2:] if len(sys.argv) > 2 else ["Hệ thống đã cập nhật thành công."]
        send_telegram_update(title, details)
    else:
        send_telegram_update(
            "Triển khai Tính năng Social Listening & Fast Trending News 24h",
            [
                "<b>Cấu trúc URL chuẩn:</b> Áp dụng thư mục con <code>/blog/tin-tuc/[slug].html</code> chuẩn SEO Google News.",
                "<b>Vận hành Auto-Pilot 24/7:</b> Tự động quét Google Trends VN, VnExpress, CafeF, Báo Giao Thông mỗi 4 giờ.",
                "<b>Kỹ thuật Newsjacking:</b> Phân tích thời sự thị trường, giá vật liệu, thời tiết kết nối góc nhìn kỹ thuật Bê Tông An Gia Bình.",
                "<b>Google Indexing API & IndexNow:</b> Tự động submit URL ngay khi bài viết được xuất bản.",
                "<b>Deploy Cloudflare Workers:</b> Đã đóng gói và cập nhật trực tiếp lên livesite https://www.betongangiabinh.vn."
            ]
        )
