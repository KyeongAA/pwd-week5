const express = require('express');
const router = express.Router();

// ✅ 회원가입
router.post('/register', (req, res) => {
    res.set('Cache-Control', 'no-store'); // 캐시 방지

    const { email, password, name } = req.body;

    // 간단한 유효성 검사
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '이메일과 비밀번호를 입력해주세요.',
        });
    }

    // 성공 응답
    return res.status(201).json({
        success: true,
        message: '회원가입 성공!',
        user: {
            id: Date.now(),
            email,
            name: name || '새 유저',
        },
    });
});

// ✅ 로그인
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

    return res.json({
        success: true,
        message: '로그인 상태 확인 성공!',
        user: { id: 1, email: 'test@test.com', name: '테스트 유저' },
    });
});

module.exports = router;
