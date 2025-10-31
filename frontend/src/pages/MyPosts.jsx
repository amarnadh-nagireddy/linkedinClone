import React, { useEffect, useState } from "react";
import api from "@/api";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/context/AuthContext.jsx";

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/post");
      const all = res.data || [];
      const mine = all.filter((p) => (p.user?._id || p.user) === user?._id);
      setPosts(mine);
    } catch (e) {
      setError("Failed to load your posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">My Posts</h1>
      {loading && <p className="text-gray-500 mt-2">Loading…</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-2 space-y-4">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onChange={fetchPosts} editable={true} />
        ))}
        {!loading && posts.length === 0 && (
          <p className="text-sm text-gray-500">You haven't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
