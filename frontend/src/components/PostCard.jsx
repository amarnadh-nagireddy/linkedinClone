import React, { useState } from "react";
import api from "@/api";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "react-toastify";

const PostCard = ({ post, onChange, editable = true }) => {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content || "");
  const [newImage, setNewImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [viewImgHidden, setViewImgHidden] = useState(false);
  const [editImgHidden, setEditImgHidden] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const isOwner = user?._id === (post.user?._id || post.user);
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");
  const liked = Array.isArray(post?.likes)
    ? post.likes.some((l) => l === user?._id || l?._id === user?._id)
    : false;

  const like = async () => {
    setLiking(true);
    try {
      await api.put(`/post/${post._id}/like`);
      onChange && onChange();
    } catch (e) {
    } finally {
      setLiking(false);
    }
  };

  const remove = async () => {
    if (!isOwner) return;
    try {
      await api.delete(`/post/${post._id}`);
      onChange && onChange();
      toast.success("Post deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const saveEdit = async () => {
    try {
      const fd = new FormData();
      fd.append("content", content);
      if (newImage) fd.append("image", newImage);
      await api.put(`/post/${post._id}`, fd);
      setIsEditing(false);
      if (editPreview) URL.revokeObjectURL(editPreview);
      setNewImage(null);
      setEditPreview(null);
      onChange && onChange();
      toast.success("Post updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/post/${post._id}/comments`);
      setComments(res.data || []);
    } catch {
      setComments(post.comments || []);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await api.post(`/post/${post._id}/comment`, { text: commentText.trim() });
      setCommentText("");
      await fetchComments();
      onChange && onChange();
      toast.success("Comment added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to comment");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <div className="flex items-center gap-3">
        <img src={post.user?.profileImage?.url || "/default.png"} onError={(e)=> { e.currentTarget.onerror=null; e.currentTarget.src="/default.png"; }} className="w-9 h-9 rounded-full object-cover" />
        <div>
          <div className="font-semibold">{cap(post.user?.firstname)} {cap(post.user?.lastname)}</div>
          <div className="text-xs text-gray-500">@{post.user?.username}</div>
        </div>
      </div>
      {isEditing ? (
        <div className="mt-3 space-y-3">
          <textarea value={content} onChange={(e)=> setContent(e.target.value)} className="w-full border rounded p-2" rows={3} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e)=> { const f = e.target.files[0]; if (!f) return; if (editPreview) URL.revokeObjectURL(editPreview); setNewImage(f); setEditPreview(URL.createObjectURL(f)); }} />
              {editPreview && (
                <button type="button" className="text-sm border px-2 py-1 rounded" onClick={()=> { if (editPreview) URL.revokeObjectURL(editPreview); setEditPreview(null); setNewImage(null); }}>Clear image</button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveEdit} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Save</button>
              <button onClick={() => { setIsEditing(false); setContent(post.content || ""); setNewImage(null); }} className="text-sm border px-3 py-1 rounded">Cancel</button>
            </div>
          </div>
          {(editPreview || post.image?.url || post.image) && (
            <div className="mt-1">
              {editPreview ? (
                <img src={editPreview} className="block mx-auto rounded border max-h-96 object-contain w-full sm:w-auto" onError={()=> { if (editPreview) { URL.revokeObjectURL(editPreview); setEditPreview(null); } }} />
              ) : (
                !editImgHidden && (
                  <img src={post.image?.url || post.image} className="block mx-auto rounded border max-h-96 object-contain w-full sm:w-auto" onError={()=> setEditImgHidden(true)} />
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-line">{post.content}</p>
          {post.image?.url || post.image ? (
            !viewImgHidden && (
              <div className="mt-3">
                <img src={post.image?.url || post.image} className="block mx-auto rounded border max-h-96 object-contain w-full sm:w-auto" onError={()=> setViewImgHidden(true)} />
              </div>
            )
          ) : null}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={like}
              disabled={liking}
              className={`text-sm inline-flex items-center gap-2 ${liked ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
            >
              <span>Like</span>
              <span className={`${liked ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'} px-2 py-0.5 rounded-full text-xs`}>{post.likes?.length || 0}</span>
            </button>
            {isOwner && editable && <button onClick={() => setIsEditing(true)} className="text-sm text-gray-700">Edit</button>}
            {isOwner && editable && <button onClick={remove} className="text-sm text-red-600">Delete</button>}
            <button
              onClick={async () => {
                const opening = !showComments;
                setShowComments(opening);
                if (opening) await fetchComments();
              }}
              className="text-sm text-gray-700"
            >
              Comments ({comments?.length || post.comments?.length || 0})
            </button>
          </div>
          {showComments && (
            <div className="mt-3 border-t pt-3 space-y-3">
              <div className="space-y-2">
                {(comments || []).map((c) => (
                  <div key={c._id || c.id || Math.random()} className="text-sm">
                    <span className="font-medium">{cap(c.user?.firstname)} {cap(c.user?.lastname)}</span>
                    <span className="text-gray-700">: {c.text || c.content}</span>
                  </div>
                ))}
                {(!comments || comments.length === 0) && (
                  <div className="text-xs text-gray-500">No comments yet</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={commentText}
                  onChange={(e)=> setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded px-3 py-1.5"
                />
                <button onClick={addComment} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded">Post</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostCard;

