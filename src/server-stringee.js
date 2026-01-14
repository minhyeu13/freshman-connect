/**
 * FRESHMAN CONNECT - Stringee Version
 * Hotline AI hỗ trợ sinh viên năm nhất
 */

require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const https = require('https');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Stringee credentials
const API_KEY_SID = process.env.STRINGEE_API_KEY_SID;
const API_KEY_SECRET = process.env.STRINGEE_API_KEY_SECRET;

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'running',
        service: 'Freshman Connect Hotline (Stringee)',
        version: '1.0.0'
    });
});

// Stringee webhook: Khi có cuộc gọi đến
app.post('/stringee/answer', (req, res) => {
    console.log('📞 Incoming call:', req.body);
    
    const response = [
        {
            action: "talk",
            text: "Xin chào! Đây là đường dây hỗ trợ sinh viên năm nhất. Bạn đang gặp khó khăn gì? Hãy chia sẻ với tôi.",
            voice: "female",
            speed: 1,
            loop: 1
        },
        {
            action: "record",
            format: "mp3",
            maxLength: 30,
            eventUrl: `${process.env.BASE_URL}/stringee/process`
        }
    ];
    
    res.json(response);
});

// Xử lý sau khi ghi âm
app.post('/stringee/process', async (req, res) => {
    console.log('🎤 Recording received:', req.body);
    
    // TODO: Integrate với OpenAI để phân tích giọng nói
    // TODO: Match với mentor
    
    const response = [
        {
            action: "talk",
            text: "Tôi đã nhận được yêu cầu của bạn. Chúng tôi sẽ kết nối bạn với người hỗ trợ phù hợp. Xin vui lòng chờ.",
            voice: "female",
            speed: 1
        }
    ];
    
    res.json(response);
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('');
    console.log('🎓 ====================================');
    console.log('   FRESHMAN CONNECT HOTLINE');
    console.log('   (Stringee Version)');
    console.log('====================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📞 Webhook URL: ${process.env.BASE_URL}/stringee/answer`);
    console.log('====================================');
});
