const express = require('express');
const router = express.Router();

// 임시: 로그인
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'test@test.com' && password === '1234') {
        res.json({ message: '로그인 성공', user: { id: 1, name: 'Test User' } });
    } else {
        res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
});

// 임시: 회원가입
router.post('/register', (req, res) => {
    res.json({ message: '회원가입 성공 (mock)' });
});

// 임시: 로그인 상태 확인
router.get('/me', (req, res) => {
    res.json({ message: '로그인 상태 OK', user: { id: 1, name: 'Test User' } });
});

module.exports = router;
