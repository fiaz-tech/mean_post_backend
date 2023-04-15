import asyncHandler from 'express-async-handler'
import Posts from '../models/postModel.js'
import multer from 'multer'



const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/imageuploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});





// @desc    Create Post
// @route   POST /api/posts
// @access  Public
const createPost = asyncHandler(async (req, res) => {

  const url = req.protocol + "://" + req.get("host");
  const imagePath = url + "/imageuploads/" + req.file.filename

  const { title, content } = req.body
  const user = req.user._id

  const post = await Posts.create({
    title, content, imagePath, user  })

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
// @access  Private/Admin
const deletePost= asyncHandler(async (req, res) => {

  const postDelete =await Posts.findByIdAndDelete(req.params.id)
  if(postDelete){
    res.status(201).json({message: "Post deleted"})
  }else {
    res.status(404)
    throw new Error('Post delete failed')
  }

})




// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Admin
const updatePost = asyncHandler(async (req, res) => {

  let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/imageuploads/" + req.file.filename
    }


  const post = await Posts.findById(req.params.id)

  if (post) {

    post.title = req.body.title || post.title
    post.content = req.body.content || post.content
    post.imagePath =  imagePath || post.imagePath

    const updatedPost = await post.save()

    res.json({
      //_id: updatedPost._id,
      title: updatedPost.title,
      content: updatedPost.content,
      imagePath: updatePost.imagePath,
      //user: updatePost.user._id
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
 storage,
}



