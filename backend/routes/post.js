import express from "express";
import {createPost, getAllPosts, getPostById, updatePost, deletePost, updateLike, createComment, deleteComment, upload} from "../controllers/post.js";
import verifyToken from "../middleware/auth.js";

const router=express.Router();

router.post("/", verifyToken,upload.single("image"), createPost);
router.get("/",verifyToken, getAllPosts);
router.get("/:id", getPostById);
router.put("/:id",verifyToken, upload.single("image"), updatePost);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id/like", verifyToken,  updateLike);
router.post("/:id/comment", verifyToken, createComment);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

export default router;