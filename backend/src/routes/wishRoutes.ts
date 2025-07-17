import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'
import * as wishController from '../controllers/wishController'

const router = Router()

// Validation rules
const createWishValidation = [
  body('content')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Content must be between 10 and 500 characters'),
  body('category')
    .isIn(['health', 'career', 'love', 'study', 'family', 'wealth', 'other'])
    .withMessage('Invalid category'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
]

// Routes
router.get('/', wishController.getWishes)
router.post('/', createWishValidation, validate, wishController.createWish)
router.get('/:id', wishController.getWishById)
router.post('/:id/like', wishController.toggleLike)

export default router 