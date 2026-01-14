# 🎓 FRESHMAN CONNECT

> "One call away from help" - Hotline AI hỗ trợ sinh viên năm nhất

## 🚀 Hướng dẫn cài đặt (5 phút)

### Bước 1: Đăng ký API (FREE trial)

#### 1.1 Twilio (Số điện thoại)
1. Vào https://www.twilio.com/try-twilio
2. Đăng ký tài khoản (được $15 free credit)
3. Lấy **Account SID** và **Auth Token** từ Console
4. Mua 1 số điện thoại (Phone Numbers → Buy a Number)

#### 1.2 OpenAI (AI)
1. Vào https://platform.openai.com/signup
2. Đăng ký tài khoản
3. Vào API Keys → Create new secret key
4. Copy key (bắt đầu bằng `sk-...`)

### Bước 2: Cài đặt project

```bash
# Mở Terminal trong VS Code (Ctrl + `)

# Di chuyển vào thư mục project
cd "c:\Users\PiuPiu\Documents\project phone number\freshman-connect"

# Cài đặt dependencies
npm install

# Copy file env mẫu
copy .env.example .env
```

### Bước 3: Điền API keys

Mở file `.env` và điền:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxx

PORT=3000
BASE_URL=https://your-ngrok-url.ngrok.io
```

### Bước 4: Chạy ngrok (để Twilio gọi được vào máy bạn)

```bash
# Cài ngrok (1 lần duy nhất)
# Tải từ: https://ngrok.com/download

# Chạy ngrok
ngrok http 3000
```

Copy URL (ví dụ: `https://abc123.ngrok.io`) vào `.env` (BASE_URL)

### Bước 5: Cấu hình Twilio Webhook

1. Vào Twilio Console → Phone Numbers → Manage → Active Numbers
2. Click vào số điện thoại của bạn
3. Trong phần **Voice & Fax**:
   - **A call comes in**: Webhook
   - **URL**: `https://your-ngrok-url.ngrok.io/call/incoming`
   - **HTTP Method**: POST
4. Click **Save**

### Bước 6: Chạy server

```bash
npm start
```

### Bước 7: Test!

📞 Gọi vào số Twilio của bạn và nói vấn đề của bạn!

---

## 📁 Cấu trúc project

```
freshman-connect/
├── src/
│   ├── server.js        # Main server
│   ├── call-handler.js  # Xử lý cuộc gọi Twilio
│   ├── ai-service.js    # OpenAI integration
│   └── matching.js      # Matching algorithm
├── .env                 # API keys (KHÔNG commit lên git!)
├── .env.example         # Mẫu env
├── package.json
└── README.md
```

---

## ⚙️ Cấu hình Mentors/Tutors

Mở file `src/matching.js` và sửa danh sách `helpers`:

```javascript
const helpers = [
    {
        id: 1,
        name: 'Tên mentor',
        phone: '+84xxxxxxxxx', // Số điện thoại thật
        role: 'tutor',        // 'tutor' hoặc 'mentor'
        skills: ['math', 'programming'], // Kỹ năng
        available: true       // Có sẵn sàng không
    },
    // Thêm người khác...
];
```

---

## 💰 Chi phí ước tính

| Service | Free Tier | Sau đó |
|---------|-----------|--------|
| Twilio | $15 credit (~150 phút gọi) | ~$0.02/phút |
| OpenAI | $5 credit | ~$0.01/request |
| ngrok | Free (giới hạn session) | $8/tháng |

**MVP 1 tháng: ~$20-30 (500k-750k VND)**

---

## 🛠️ Troubleshooting

### Lỗi "Cannot connect"
- Kiểm tra ngrok đang chạy
- Kiểm tra URL trong Twilio webhook đúng chưa

### Lỗi "OpenAI error"
- Kiểm tra API key đúng chưa
- Kiểm tra còn credit không

### Không nghe được giọng nói
- Twilio Speech Recognition chỉ hỗ trợ một số ngôn ngữ
- Thử nói tiếng Anh để test

---

## 📞 Cần hỗ trợ?

Hỏi mình (GitHub Copilot) bất cứ lúc nào!
