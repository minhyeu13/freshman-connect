/**
 * Cipher Service - Giải mã mật mã sinh viên
 * Mật mã: 5c 58 50 17 56 21 47 46
 * Khóa: 2017
 */

/**
 * Khóa XOR mặc định
 */
const DEFAULT_KEY = '2017';

/**
 * Giải mã hex string bằng XOR với key dạng string
 * @param {string} hexString - Chuỗi hex cách nhau bằng dấu cách
 * @param {string} key - Khóa XOR (mặc định '2017')
 * @returns {string} Chuỗi đã giải mã
 */
function decodeCipher(hexString, key = DEFAULT_KEY) {
    if (typeof hexString !== 'string' || !hexString.trim()) {
        return '';
    }
    const hexValues = hexString.split(' ').map(h => parseInt(h, 16));
    if (hexValues.some(isNaN)) {
        return '';
    }
    const keyStr = String(key);
    return hexValues.map((h, i) => String.fromCharCode(h ^ keyStr.charCodeAt(i % keyStr.length))).join('');
}

/**
 * Mã hóa string thành hex
 * @param {string} text - Chuỗi cần mã hóa
 * @param {string} key - Khóa XOR (mặc định '2017')
 * @returns {string} Chuỗi hex đã mã hóa
 */
function encodeCipher(text, key = DEFAULT_KEY) {
    const keyStr = String(key);
    return text.split('').map((c, i) => (c.charCodeAt(0) ^ keyStr.charCodeAt(i % keyStr.length)).toString(16).padStart(2, '0')).join(' ');
}

/**
 * Mật mã mặc định của hệ thống
 */
const DEFAULT_CIPHER = '5c 58 50 17 56 21 47 46';

/**
 * Giải mã mật mã mặc định
 * @returns {string} Kết quả giải mã
 */
function decodeDefaultCipher() {
    return decodeCipher(DEFAULT_CIPHER);
}

module.exports = {
    decodeCipher,
    encodeCipher,
    decodeDefaultCipher,
    DEFAULT_CIPHER,
    DEFAULT_KEY
};
