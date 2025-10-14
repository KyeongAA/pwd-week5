const express = require('express');
const router = express.Router();

// 회원가입
router.post('/register', (req, res) => {
    res.set('Cache-Control', 'no-store');

    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '이메일과 비밀번호를 입력해주세요.',
        });
    }

    return res.status(201).json({
        success: true,
        message: '회원가입 성공!',
        user: {
            id: Date.now(),
            email,
            name: name || 'New User',
        },
    });
});

// 로그인
router.post('/login', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const { email, password } = req.body;

    if (email === 'test@test.com' && password === '1234') {
        return res.json({
            success: true,
            message: '로그인 성공!',
            user: { id: 1, email, name: '테스트 유저' },
        });
    } else {
        return res.status(401).json({
            success: false,
            message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
    }
});

// ✅ 로그인 상태 확인
router.get('/me', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    // 실제로는 쿠키나 토큰으로 인증해야 하지만, 지금은 mock 데이터로
    return res.json({
        success: true,
        message: '로그인 상태 확인 성공!',
        user: { id: 1, email: 'test@test.com', name: '테스트 유저' },
    });
});

module.exports = router;
