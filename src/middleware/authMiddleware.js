import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    const token =req.headers.authorization?.split(' ')[1];
    if (!token) {
        // 토큰이 없는 경우, 다음 미들웨어로 넘어갑니다.
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
    }
};

export default authMiddleware;
