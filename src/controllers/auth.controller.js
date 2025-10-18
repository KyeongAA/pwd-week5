const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const JWT_SECRET = process.env.JWT_SECRET || 'ajou-foodmap-secret';

// ✅ 회원가입
exports.register = async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: '이미 존재하는 이메일입니다.' });
        }

        const user = await User.create({ email, password, name, userType });

        res.status(201).json({
            success: true,
            message: '회원가입 성공!',
            user: { id: user._id, email: user.email, name: user.name, userType: user.userType },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

// ✅ 로그인
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

        // JWT 토큰 발급
        const token = jwt.sign({ id: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: '로그인 성공!',
            token,
            user: { id: user._id, email: user.email, name: user.name, userType: user.userType },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

// ✅ 내 정보 확인 (JWT 인증 필요)
exports.me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: '토큰이 유효하지 않습니다.' });
    }
};
