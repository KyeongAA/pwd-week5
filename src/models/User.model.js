const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        name: {
            type: String,
            default: '새 유저',
        },
        userType: {
            type: String,
            enum: ['basic', 'admin'],
            default: 'basic',
        },
    },
    { timestamps: true }
);

// 비밀번호 해시
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
