import { Router } from 'express'
import * as userController from '../controllers/userController'

const router = Router()

// Routes
router.get('/profile', userController.getUserProfile)
router.get('/:id/wishes', userController.getUserWishes)

export default router 