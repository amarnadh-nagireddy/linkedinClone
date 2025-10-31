import express from "express";
import {userSignup,userLogin,getUser,updateUser,upload} from "../controllers/user.js";
import verifyToken from "../middleware/auth.js";

const router=express.Router();

router.post("/signup",upload.single("profileImage"),userSignup);
router.post("/login",userLogin);
router.get("/:id",verifyToken,getUser);
router.put("/update",verifyToken,upload.single("profileImage"),updateUser);


export default router;