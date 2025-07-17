import mongoose, { Document, Schema } from 'mongoose'

export type WishCategory = 'health' | 'career' | 'love' | 'study' | 'family' | 'wealth' | 'other'

export interface IWish extends Document {
  content: string
  category: WishCategory
  isAnonymous: boolean
  author?: mongoose.Types.ObjectId
  likes: number
  likedBy: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const wishSchema = new Schema<IWish>({
  content: {
    type: String,
    required: [true, 'Wish content is required'],
    trim: true,
    minlength: [10, 'Wish must be at least 10 characters long'],
    maxlength: [500, 'Wish must not exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['health', 'career', 'love', 'study', 'family', 'wealth', 'other'],
      message: 'Category must be one of: health, career, love, study, family, wealth, other'
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function(this: IWish) {
      return !this.isAnonymous
    }
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
wishSchema.index({ category: 1 })
wishSchema.index({ createdAt: -1 })
wishSchema.index({ likes: -1 })
wishSchema.index({ author: 1 })

// Virtual for author details when not anonymous
wishSchema.virtual('authorDetails', {
  ref: 'User',
  localField: 'author',
  foreignField: '_id',
  justOne: true,
  select: 'name avatar'
})

// Hide sensitive fields in JSON output
wishSchema.methods.toJSON = function() {
  const wishObject = this.toObject()
  
  if (this.isAnonymous) {
    delete wishObject.author
    delete wishObject.authorDetails
  }
  
  delete wishObject.likedBy
  return wishObject
}

// Static method to get wishes with pagination
wishSchema.statics.findWithPagination = function(
  filter: any = {},
  page: number = 1,
  limit: number = 10,
  sort: any = { createdAt: -1 }
) {
  const skip = (page - 1) * limit
  
  return Promise.all([
    this.find(filter)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    this.countDocuments(filter)
  ]).then(([wishes, total]) => ({
    wishes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }))
}

export const Wish = mongoose.model<IWish>('Wish', wishSchema) 