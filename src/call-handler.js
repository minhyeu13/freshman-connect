/**
 * Call Handler - Xử lý cuộc gọi Twilio
 */

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const { analyzeIntent } = require('./ai-service');
const { findBestMatch } = require('./matching');
const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Xử lý cuộc gọi đến
 */
async function handleIncomingCall(req, res) {
    const twiml = new VoiceResponse();
    
    // Lời chào
    twiml.say({
        language: 'vi-VN',
        voice: 'Polly.Linh'
    }, 'Xin chào! Đây là đường dây hỗ trợ sinh viên năm nhất.');
    
    twiml.pause({ length: 1 });
    
    // Thu thập giọng nói
    const gather = twiml.gather({
        input: 'speech',
        action: '/call/process-speech',
        method: 'POST',
        timeout: 5,
        language: 'vi-VN',
        speechTimeout: 'auto'
    });
    
    gather.say({
        language: 'vi-VN',
        voice: 'Polly.Linh'
    }, 'Bạn đang gặp khó khăn gì? Hãy chia sẻ với tôi.');
    
    // Nếu không nói gì
    twiml.say({
        language: 'vi-VN',
        voice: 'Polly.Linh'
    }, 'Tôi không nghe thấy. Xin hãy gọi lại.');
    
    res.type('text/xml');
    res.send(twiml.toString());
}

/**
 * Xử lý sau khi sinh viên nói
 */
async function handleSpeechInput(req, res) {
    const twiml = new VoiceResponse();
    const speechResult = req.body.SpeechResult;
    const callerPhone = req.body.From;
    
    console.log(`📞 Caller: ${callerPhone}`);
    console.log(`🗣️ Speech: ${speechResult}`);
    
    if (!speechResult) {
        twiml.say({
            language: 'vi-VN',
            voice: 'Polly.Linh'
        }, 'Xin lỗi, tôi không nghe rõ. Vui lòng thử lại.');
        twiml.redirect('/call/incoming');
        res.type('text/xml');
        return res.send(twiml.toString());
    }
    
    try {
        // Phân tích ý định bằng AI
        twiml.say({
            language: 'vi-VN',
            voice: 'Polly.Linh'
        }, 'Tôi hiểu rồi. Để tôi tìm người phù hợp giúp bạn.');
        
        const analysis = await analyzeIntent(speechResult);
        console.log('🧠 AI Analysis:', analysis);
        
        // Tìm mentor/tutor phù hợp
        const match = await findBestMatch(analysis);
        
        if (match) {
            console.log(`✅ Found match: ${match.name} (${match.phone})`);
            
            twiml.say({
                language: 'vi-VN',
                voice: 'Polly.Linh'
            }, `Tôi đã tìm được ${match.role === 'tutor' ? 'gia sư' : 'mentor'} ${match.name} có thể giúp bạn. Đang kết nối...`);
            
            // Kết nối cuộc gọi
            const dial = twiml.dial({
                callerId: process.env.TWILIO_PHONE_NUMBER,
                action: '/call/connect',
                timeout: 30
            });
            dial.number(match.phone);
            
        } else {
            twiml.say({
                language: 'vi-VN',
                voice: 'Polly.Linh'
            }, 'Xin lỗi, hiện tại không có ai sẵn sàng. Chúng tôi sẽ gọi lại cho bạn trong 30 phút.');
            
            // TODO: Lưu vào queue để gọi lại sau
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        twiml.say({
            language: 'vi-VN',
            voice: 'Polly.Linh'
        }, 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
}

/**
 * Xử lý sau khi kết nối
 */
async function handleConnectCall(req, res) {
    const twiml = new VoiceResponse();
    const dialStatus = req.body.DialCallStatus;
    
    console.log(`📞 Call status: ${dialStatus}`);
    
    if (dialStatus !== 'completed') {
        twiml.say({
            language: 'vi-VN',
            voice: 'Polly.Linh'
        }, 'Người hỗ trợ không bắt máy. Chúng tôi sẽ liên hệ lại với bạn sớm nhất.');
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
}

module.exports = {
    handleIncomingCall,
    handleSpeechInput,
    handleConnectCall
};
