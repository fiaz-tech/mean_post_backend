import asyncHandler from 'express-async-handler'
import Posts from '../models/postModel.js'

import {cloudinary} from '../config/cloudinary.js'




// @desc    Create Post
// @route   POST /api/posts
// @access  Public
const createPost = asyncHandler(async (req, res) => {

  const result = await cloudinary.uploader.upload(req.file.path)

  const { title, content } = req.body
  const user = req.user._id

  const imagePath = result.secure_url
  const cloudinary_id  = result.public_id

  const post = await Posts.create({
    title, content, imagePath, cloudinary_id, user  })

  if (post) {
    res.status(201).json({

      message: "Successfully created a post",
      post: post
    })
  } else {
    res.status(400)
    throw new Error('Invalid post data')
  }
})


// @desc    Get Posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {

  const pageSize = 2
  const currentPage = Number(req.query.page) || 1
  const postQuery = Posts.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Posts.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });


})

// @desc    Get Posts ById
// @route   GET /api/posts/:id
// @access  Public

const getPostById = asyncHandler(async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if(post){
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      user: post.user._id,
    })
  }else {
    res.status(404)
    throw new Error('Post not found')
  }

})

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost= asyncHandler(async (req, res) => {
  
  const post = await Posts.findById(req.params.id)
  await cloudinary.uploader.destroy(post.cloudinary_id)
  const postDelete = await Posts.findByIdAndDelete(req.params.id)

  if(postDelete){
    res.status(201).json({message: "Post deleted successfully"})
  }else {
    res.status(404)
    throw new Error('Post delete failed')
  }

})




// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {

  const post = await Posts.findById(req.params.id)

  await cloudinary.uploader.destroy(post.cloudinary_id)

  const result = await cloudinary.uploader.upload(req.file.path)

  if (post) {

      post.title = req.body.title || post.title
      post.content = req.body.content || post.content
      post.imagePath = result.secure_url || post.imagePath
      post.cloudinary_id =  result.public_id || post.cloudinary_id

    const updatedPost = await post.save()

    res.json({
      title: updatedPost.title,
      content: updatedPost.content,
      imagePath: updatePost.imagePath,
      cloudinary_id: updatePost.cloudinary_id,
      
    })
  } else {
    console.log("enteredError")
    res.status(404)
    throw new Error('Post not found')
  }
})


export {
 createPost,
 getPosts,
 getPostById,
 deletePost,
 updatePost,
}



