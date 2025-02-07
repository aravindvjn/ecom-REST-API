import express from 'express';
import { signin, signup, verifyEmail } from '../controllers/auth.js'

const router = express.Router()

router.post("/signup",signup)

router.post("/verify/:token",verifyEmail)

router.post("/signin",signin)


export default router;