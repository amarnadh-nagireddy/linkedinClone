import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage: {
      public_id: { type: String },
      url: { type: String },
    },
});
export default mongoose.model("User",userSchema);