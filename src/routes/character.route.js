import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middleware/authMiddleware.js';
import characterIdAuthMiddleware from '../middleware/characterIdAuthMiddleware.js';

const router = express.Router();

// 캐릭터 생성 API
router.post('/:create', authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingCharacter = await prisma.characters.findFirst({
      where: {
        UserId: req.userId,
        name
      }
    });

    if (existingCharacter) {
      return res.status(409).json({ message: '이미 존재하는 캐릭터 명입니다.' });
    }

    const newCharacter = await prisma.characters.create({
      data: {
        name,
        health: 500,
        power: 100,
        money: 10000,
        user: { connect: { userId: req.userId } } //필드연결
      }
    });

    return res.status(201).json({ characterId: newCharacter.characterId });
  } catch (err) {
    next(err);
  }
});


// 캐릭터 삭제 
router.delete('/delete/:characterId', authMiddleware, async (req, res, next) => {
  try {
    const { characterId } = req.params;

    // characterId가 유효한지 확인
    if (isNaN(parseInt(characterId))) {
      return res.status(400).json({ message: '올바르지 않은 characterId입니다.' });
    }

    // 캐릭터가 현재 사용자 소유인지 확인
    const character = await prisma.characters.findFirst({
      where: { characterId: parseInt(characterId), UserId: req.userId }
    });

    if (!character) {
      return res.status(404).json({ message: '존재하지 않거나 권한이 없는 캐릭터입니다.' });
    }

    // 캐릭터 삭제
    await prisma.characters.delete({
      where: { characterId: parseInt(characterId) }
    });

    return res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
  } catch (err) {
    next(err); // 예외 발생 시 미들웨어로 전달
  }
});


// 캐릭터 상세 조회 
router.get('/:characterId', characterIdAuthMiddleware, async (req, res, next) => {
  try {
    const { characterId } = req.params;

    // 캐릭터 조회
    const character = await prisma.characters.findFirst({
      where: { characterId: parseInt(characterId), UserId: req.userId }
    });

    if (!character) {
      return res.status(404).json({ message: '캐릭터를 찾을 수 없습니다.' });
    }

    // 내 캐릭터인지 확인
    const isMyCharacter = character.UserId === req.userId;

    // 내 캐릭터이거나 로그인하지 않은 경우
    if (isMyCharacter) {
      return res.status(200).json({
        name: character.name,
        health: character.health,
        power: character.power,
        money: character.money
      });
    }

    // 다른 유저의 캐릭터인 경우 제한된 정보 반환
    return res.status(200).json({
      name: character.name,
      health: character.health,
      power: character.power
    });
  } catch (err) {
    next(err);
  }
});
export default router;
