import express from 'express';
import dotenv from 'dotenv';
import signUpRouter from './routes/sign-up.route.js';
import signInRouter from './routes/sign-in.route.js';
import characterRouter from './routes/character.route.js';
import itemRouter from './routes/item.route.js'; // 아이템 라우터 추가

dotenv.config();

const app = express();
const PORT =  3019;

app.use(express.json());

// 라우터 미들웨어 추가
app.use('/api/signUp', signUpRouter);
app.use('/api/signIn', signInRouter);
app.use('/api/character', characterRouter);
app.use('/api/item', itemRouter); // 아이템 라우터 추가

app.listen(PORT, () => {
    console.log(PORT,'포트로 서버가 열렸어요!');
});
