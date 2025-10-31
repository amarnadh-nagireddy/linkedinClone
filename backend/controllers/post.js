import Post from "../models/post.js";
import {cloudinary,storage} from "../config/cloudinary.js";
import multer from "multer";

const upload = multer({ storage });

const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const uploadedImage = req.file
      ? {
          public_id: req.file.filename,
          url: req.file.path,
        }
      : null;

    const newPost = new Post({
      user: userId,
      content,
      image: uploadedImage,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.status(200).json({
        message: "Comment added",
        comments: post.comments,
    });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstname lastname username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("user", "firstname lastname username profileImage")
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to edit this post" });
    }

    
    if (content) post.content = content;

    
    if (req.file) {
      
      if (post.image?.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

     
      post.image = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    
    if (post.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(post.image.public_id);
      } catch (err) {
        console.warn("Cloudinary image deletion failed:", err.message);
      }
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne(); 
    await post.save();

    res.status(200).json({
      message: "Comment deleted",
      commentsCount: post.comments.length,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {createPost, getAllPosts, getPostById, updatePost, deletePost, updateLike, createComment, deleteComment,upload};
