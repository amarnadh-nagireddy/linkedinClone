import React from "react";
import { useEffect, useState } from "react";
import api from "@/api";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await api.get("/post");
      setPosts(res.data || []);
    } catch (e) {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CreatePost onCreated={fetchPosts} />
      {loading && <p className="text-gray-500 mt-4">Loading…</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-4 space-y-4">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onChange={fetchPosts} editable={false} />
        ))}
      </div>
    </div>
  );
};

export default Home;