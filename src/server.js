/**
 * FRESHMAN CONNECT - Main Server
 * Hotline AI hỗ trợ sinh viên năm nhất
 */

require('dotenv').config();
const express = require('express');
const { handleIncomingCall, handleSpeechInput, handleConnectCall } = require('./call-handler');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'running',
        service: 'Freshman Connect Hotline',
        version: '1.0.0'
    });
});

// Twilio webhook: Khi có cuộc gọi đến
app.post('/call/incoming', handleIncomingCall);

// Twilio webhook: Xử lý giọng nói của sinh viên
app.post('/call/process-speech', handleSpeechInput);

// Twilio webhook: Kết nối với mentor/tutor
app.post('/call/connect', handleConnectCall);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('');
    console.log('🎓 ====================================');
    console.log('   FRESHMAN CONNECT HOTLINE');
    console.log('   "One call away from help"');
    console.log('====================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📞 Webhook URL: ${process.env.BASE_URL}/call/incoming`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Chạy ngrok: ngrok http 3000');
    console.log('   2. Copy URL vào .env (BASE_URL)');
    console.log('   3. Cấu hình Twilio webhook');
    console.log('====================================');
});
