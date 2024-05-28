import jwt from 'jsonwebtoken';

const optionalAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // 토큰이 없는 경우, 다음 미들웨어로 넘어갑니다.
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
    } catch (error) {
        // 토큰이 유효하지 않은 경우, 아무 작업도 하지 않음
    }
    next();
};

export default optionalAuthMiddleware;
