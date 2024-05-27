import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

/** 로그인 API **/
router.post('/', async (req, res, next) => { // Changed route path
    try {
        const { username, password } = req.body;
        const user = await prisma.users.findFirst({
            where: {
                signId: username
            },
        });

        if (!user) {
            return res.status(404).json({
                message: '존재하지 않는 아이디입니다.',
            });
        }
        // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교
        else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: '비밀번호가 일치하지 않습니다.',
            });
        }

        const token = jwt.sign(
            {
                userId: user.userId,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
        res.header('authorization', `Bearer ${token}`);
        return res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
        next(err);
    }
});

export default router;
