// src/app.js
require('dotenv').config(); // ✅ .env 불러오기 (맨 위 추가)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const restaurantsRouter = require('./routes/restaurants.routes');
const submissionsRouter = require('./routes/submissions.routes');
const authRouter = require('./routes/auth.routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

function createApp() {
    const app = express();

    // ✅ MongoDB 연결
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('✅ MongoDB connected'))
        .catch((err) => console.error('❌ MongoDB connection error:', err));

    // ✅ CORS 설정
    app.use(
        cors({
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                if (
                    origin.includes('vercel.app') ||
                    origin.includes('netlify.app') ||
                    origin.includes('localhost')
                ) {
                    return callback(null, true);
                }
                return callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ 연결 상태 테스트
    app.get('/health', (req, res) => {
        const state = mongoose.connection.readyState; // 0~3
        res.json({ status: 'ok', db: state });
    });

    // ✅ 라우트 등록
    app.use('/api/auth', authRouter);
    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/submissions', submissionsRouter);

    // ✅ 에러 핸들러
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
