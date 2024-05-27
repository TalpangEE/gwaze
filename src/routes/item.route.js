import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

/** 아이템 생성 API **/
router.post('/createItem', async (req, res, next) => {
    try {
        const { item_code, item_name, item_stat, item_price } = req.body;

        // 아이템 생성
        const newItem = await prisma.item.create({
            data: {
                item_code,
                item_name,
                item_stat,
                item_price
            }
        });

        return res.status(201).json({ message: '아이템이 성공적으로 생성되었습니다.', data: newItem });
    } catch (err) {
        next(err);
    }
});

/** 아이템 수정 API **/
router.put('/:itemId', async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { item_name, item_stat } = req.body;

        // 아이템 조회
        const existingItem = await prisma.item.findFirst({
            where: { item_code: parseInt(itemId) }
        });

        if (!existingItem) {
            return res.status(404).json({ message: '해당 아이템을 찾을 수 없습니다.' });
        }

        // 아이템 수정
        const updatedItem = await prisma.item.update({
            where: { item_code: parseInt(itemId) },
            data: {
                item_name,
                item_stat
            }
        });

        return res.status(200).json({ message: '아이템이 성공적으로 수정되었습니다.', data: updatedItem });
    } catch (err) {
        next(err);
    }
});

/** 아이템 목록 조회 API **/
router.get('/itemList', async (req, res, next) => {
    try {
        // 모든 아이템 조회
        const items = await prisma.item.findMany({
            select: {
                item_code: true,
                item_name: true,
                item_price: true
            }
        });

        return res.status(200).json(items);
    } catch (err) {
        next(err);
    }
});

/** 아이템 상세 조회 API **/
router.get('/:itemId', async (req, res, next) => {
    try {
        const { itemId } = req.params;

        // 아이템 조회
        const item = await prisma.ites.findFirst({
            where: { item_code: parseInt(itemId) }
        });

        if (!item) {
            return res.status(404).json({ message: '해당 아이템을 찾을 수 없습니다.' });
        }

        return res.status(200).json(item);
    } catch (err) {
        next(err);
    }
});

export default router;
