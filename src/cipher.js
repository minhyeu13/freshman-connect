/**
 * Cipher Service - Giải mã mật mã sinh viên
 * Mật mã: 5c 58 50 17 56 21 47 46
 */

/**
 * Giải mã hex string bằng XOR
 * @param {string} hexString - Chuỗi hex cách nhau bằng dấu cách
 * @param {number} key - Khóa XOR (mặc định 0x31 = '1')
 * @returns {string} Chuỗi đã giải mã
 */
function decodeCipher(hexString, key = 0x31) {
    if (typeof hexString !== 'string' || !hexString.trim()) {
        return '';
    }
    const hexValues = hexString.split(' ').map(h => parseInt(h, 16));
    if (hexValues.some(isNaN)) {
        return '';
    }
    return hexValues.map(h => String.fromCharCode(h ^ key)).join('');
}

/**
 * Mã hóa string thành hex
 * @param {string} text - Chuỗi cần mã hóa
 * @param {number} key - Khóa XOR (mặc định 0x31 = '1')
 * @returns {string} Chuỗi hex đã mã hóa
 */
function encodeCipher(text, key = 0x31) {
    return text.split('').map(c => (c.charCodeAt(0) ^ key).toString(16).padStart(2, '0')).join(' ');
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
    DEFAULT_CIPHER
};
