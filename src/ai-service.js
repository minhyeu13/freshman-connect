/**
 * AI Service - Phân tích ý định sinh viên bằng OpenAI
 */

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Phân tích câu nói của sinh viên
 * @param {string} userSpeech - Nội dung sinh viên nói
 * @returns {Object} Kết quả phân tích
 */
async function analyzeIntent(userSpeech) {
    const prompt = `
Bạn là AI phân tích vấn đề của sinh viên đại học năm nhất.

Phân tích câu nói sau và trả về JSON với các trường:
- problem: loại vấn đề (academic/financial/social/career/mental)
- subject: môn học cụ thể nếu là academic (math/physics/english/programming/chemistry/other)
- urgency: mức độ khẩn cấp (high/medium/low)
- emotion: cảm xúc (stressed/anxious/sad/confused/calm)
- keywords: các từ khóa quan trọng (array)
- summary: tóm tắt ngắn gọn vấn đề (1 câu tiếng Việt)

Câu nói của sinh viên: "${userSpeech}"

Chỉ trả về JSON, không giải thích gì thêm.
`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Dùng model rẻ hơn cho MVP
            messages: [
                { role: 'system', content: 'Bạn là AI phân tích vấn đề sinh viên. Luôn trả về JSON hợp lệ.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result;
        
    } catch (error) {
        console.error('❌ OpenAI Error:', error.message);
        
        // Fallback nếu AI lỗi
        return {
            problem: 'other',
            subject: 'other',
            urgency: 'medium',
            emotion: 'confused',
            keywords: [],
            summary: userSpeech
        };
    }
}

/**
 * Tạo tin nhắn SMS tóm tắt cho mentor
 */
async function generateSummaryForMentor(analysis, studentPhone) {
    return `🆕 Sinh viên cần hỗ trợ!
📞 SĐT: ${studentPhone}
📋 Vấn đề: ${analysis.summary}
🏷️ Loại: ${analysis.problem}
⚡ Mức độ: ${analysis.urgency}
Hãy gọi lại cho họ sớm nhất có thể!`;
}

module.exports = {
    analyzeIntent,
    generateSummaryForMentor
};
