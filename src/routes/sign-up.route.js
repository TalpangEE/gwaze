import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 사용자 회원가입 API 
router.post('/', async (req, res, next) => { // Changed route path
    try {
        const { name, id, password, passwordConfirm } = req.body;

        const isExistUser = await prisma.users.findFirst({
            where: { id },
        });

        if (isExistUser) {
            return res.status(409).json({
                message: '이미 존재하는 아이디입니다.',
            });
        }

        if (password.length < 6) {
            return res.status(401).json({
                message: '비밀번호는 6자리 이상이어야 합니다.',
            });
        }

        if (password !== passwordConfirm) {
            return res.status(401).json({
                message: '비밀번호가 일치하지 않습니다.',
            });
        }

        const regex = /^[a-z][a-z0-9]+$/;

        if (!regex.test(id)) {
            return res.status(401).json({
                message: '아이디는 영어 소문자, 숫자만 입력해주십쇼.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                name,
                id,
                password: hashedPassword,
            },
        });

        const user = await prisma.users.findFirst({
            where: { id },
            select: {
                name: true,
                id: true,
            },
        });

        return res.status(201).json({
            data: user,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
