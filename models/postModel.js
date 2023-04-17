import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imagePath: { type: String, required: true },
    cloudinary_id: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }


  },
  {
    timestamps: true,
  }
)






const Posts = mongoose.model('Posts', postSchema)

export default Posts
