import CryptoJS from 'crypto-js';

export default {
  methods: {
    randomKey () {
      return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    },
    encrypt (text, encryptionKey) {
      return CryptoJS.AES.encrypt(JSON.stringify(text), encryptionKey).toString();
    },
    decrypt (text, encryptionKey) {
      const bytes = CryptoJS.AES.decrypt(text.toString(), encryptionKey);
      return bytes.toString();
    },
  },
};
