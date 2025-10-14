// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();

// 임시 회원가입
router.post('/register', (req, res) => {
    const { email, password, name } = req.body;

    // 기본 유효성 체크
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: '이메일과 비밀번호를 입력해주세요.',
        });
    }

    // 임시로 회원가입 성공 처리 (DB는 아직 없음)
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

module.exports = router;
