// src/app.js
const express = require('express');
const cors = require('cors');
const restaurantsRouter = require('./routes/restaurants.routes');
const submissionsRouter = require('./routes/submissions.routes');
const authRouter = require('./routes/auth.routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const mongoose = require('mongoose');

function createApp() {
    const app = express();

    // ✅ CORS 설정
    const allowedOrigins = [
        'http://localhost:5173',             // 로컬 개발용
        'https://pwd-week6.netlify.app',     // Netlify 배포 도메인
        'https://pwd-week6-client-phi.vercel.app/'
    ];
    app.use(
        cors({
            origin: function (origin, callback) {
                // Postman, 서버 내부 요청 등 origin이 없는 경우 허용
                if (!origin) return callback(null, true);

                // ✅ Vercel, Netlify 도메인 전체 허용
                if (
                    origin.includes('vercel.app') ||
                    origin.includes('netlify.app') ||
                    origin.includes('localhost')
                ) {
                    return callback(null, true);
                }

                // 나머지는 거부
                return callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/health', (req, res) => {
        const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
        res.json({ status: 'ok', db: state });
    });

    app.use('/api/auth', authRouter);
    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/submissions', submissionsRouter);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
