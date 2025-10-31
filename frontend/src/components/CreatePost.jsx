import React, { useState } from "react";
import api from "@/api";
import { toast } from "react-toastify";

const CreatePost = ({ onCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const onPickImage = (file) => {
    if (!file) {
      if (preview) URL.revokeObjectURL(preview);
      setImage(null);
      setPreview(null);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("content", content);
      if (image) fd.append("image", image);
      await api.post("/post", fd);
      setContent("");
      if (preview) URL.revokeObjectURL(preview);
      setImage(null);
      setPreview(null);
      onCreated && onCreated();
      toast.success("Post created");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Create Post</h2>
      <div className="flex items-start">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e)=> setContent(e.target.value)}
            placeholder="Start a post..."
            className="w-full border rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Preview" className="block mx-auto max-h-64 rounded border object-contain w-full sm:w-auto" />
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <label className="text-sm text-gray-600 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e)=> onPickImage(e.target.files[0])} />
              <span className="border px-3 py-1.5 rounded hover:bg-gray-50">Attach image</span>
            </label>
            {preview && (
              <button type="button" onClick={()=> onPickImage(null)} className="text-sm border px-3 py-1.5 rounded hover:bg-gray-50 mr-auto ml-3">Clear</button>
            )}
            <button disabled={submitting} className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 disabled:opacity-60">Share</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
