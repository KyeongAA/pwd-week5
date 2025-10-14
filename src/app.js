// src/app.js
const express = require('express');
const cors = require('cors');
const restaurantsRouter = require('./routes/restaurants.routes');
const submissionsRouter = require('./routes/submissions.routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const mongoose = require('mongoose');

function createApp() {
    const app = express();

    // ✅ CORS 설정
    const allowedOrigins = [
        'http://localhost:5173',             // 로컬 개발용
        'https://pwd-week6.netlify.app',     // Netlify 배포 도메인
    ];

    app.use(
        cors({
            origin: function (origin, callback) {
                // 요청이 없는 경우 (예: Postman, 서버 내부 요청)
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                } else {
                    return callback(new Error('Not allowed by CORS'));
                }
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

    app.use('/api/restaurants', restaurantsRouter);
    app.use('/api/submissions', submissionsRouter);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
