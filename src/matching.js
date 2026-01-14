/**
 * Matching Service - Tìm mentor/tutor phù hợp
 */

// ============================================
// DEMO DATA - Thay bằng database thật sau
// ============================================
const helpers = [
    {
        id: 1,
        name: 'Anh Minh',
        phone: '+84912345678', // Thay bằng số thật
        role: 'tutor',
        skills: ['math', 'physics', 'programming'],
        languages: ['vietnamese', 'english'],
        available: true,
        rating: 4.8,
        totalCalls: 25
    },
    {
        id: 2,
        name: 'Chị Hương',
        phone: '+84923456789', // Thay bằng số thật
        role: 'mentor',
        skills: ['career', 'social', 'mental'],
        languages: ['vietnamese'],
        available: true,
        rating: 4.9,
        totalCalls: 42
    },
    {
        id: 3,
        name: 'Anh Tuấn',
        phone: '+84934567890', // Thay bằng số thật
        role: 'tutor',
        skills: ['english', 'chemistry'],
        languages: ['vietnamese', 'english'],
        available: true,
        rating: 4.7,
        totalCalls: 18
    },
    {
        id: 4,
        name: 'Chị Linh',
        phone: '+84945678901', // Thay bằng số thật
        role: 'mentor',
        skills: ['financial', 'career'],
        languages: ['vietnamese'],
        available: false, // Đang bận
        rating: 4.6,
        totalCalls: 30
    }
];

// Map problem type to skills
const problemToSkills = {
    'academic': ['math', 'physics', 'programming', 'english', 'chemistry', 'other'],
    'financial': ['financial'],
    'social': ['social'],
    'career': ['career'],
    'mental': ['mental', 'social']
};

/**
 * Tìm helper phù hợp nhất
 * @param {Object} analysis - Kết quả phân tích từ AI
 * @returns {Object|null} Helper phù hợp hoặc null
 */
async function findBestMatch(analysis) {
    const { problem, subject, urgency } = analysis;
    
    // Lọc những người available
    let candidates = helpers.filter(h => h.available);
    
    if (candidates.length === 0) {
        console.log('⚠️ Không có ai available');
        return null;
    }
    
    // Lọc theo problem type
    const relevantSkills = problemToSkills[problem] || ['other'];
    candidates = candidates.filter(h => 
        h.skills.some(skill => relevantSkills.includes(skill))
    );
    
    // Nếu là academic, ưu tiên người có skill môn học cụ thể
    if (problem === 'academic' && subject) {
        const exactMatch = candidates.filter(h => h.skills.includes(subject));
        if (exactMatch.length > 0) {
            candidates = exactMatch;
        }
    }
    
    if (candidates.length === 0) {
        // Fallback: trả về bất kỳ ai available
        candidates = helpers.filter(h => h.available);
    }
    
    // Tính điểm và sắp xếp
    const scored = candidates.map(c => ({
        ...c,
        score: calculateScore(c, analysis)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    console.log('🔍 Candidates:', scored.map(s => `${s.name}: ${s.score.toFixed(2)}`));
    
    return scored[0] || null;
}

/**
 * Tính điểm phù hợp
 */
function calculateScore(helper, analysis) {
    let score = 0;
    
    // Rating (40%)
    score += (helper.rating / 5) * 0.4;
    
    // Experience (20%)
    score += (Math.min(helper.totalCalls, 50) / 50) * 0.2;
    
    // Skill match (30%)
    const relevantSkills = problemToSkills[analysis.problem] || [];
    const skillMatch = helper.skills.filter(s => relevantSkills.includes(s)).length;
    score += (skillMatch / Math.max(relevantSkills.length, 1)) * 0.3;
    
    // Role preference (10%)
    if (analysis.problem === 'academic' && helper.role === 'tutor') {
        score += 0.1;
    } else if (['social', 'mental', 'career'].includes(analysis.problem) && helper.role === 'mentor') {
        score += 0.1;
    }
    
    return score;
}

/**
 * Cập nhật trạng thái available
 */
async function setAvailability(helperId, available) {
    const helper = helpers.find(h => h.id === helperId);
    if (helper) {
        helper.available = available;
    }
}

/**
 * Lấy danh sách tất cả helpers
 */
async function getAllHelpers() {
    return helpers;
}

module.exports = {
    findBestMatch,
    setAvailability,
    getAllHelpers
};
