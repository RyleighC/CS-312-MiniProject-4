import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createBlog, deleteBlog, getBlogs } from '../api';
import { useAuth } from '../AuthContext';
import BlogPostForm from '../components/BlogPostForm';
import PostList from '../components/PostList';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    try {
      const data = await getBlogs();
      console.log('Fetched blogs from backend:', data);
      setPosts(data.posts || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreate(formData) {
    const data = await createBlog(formData);
    setPosts((current) => [data.post, ...current]);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this post?')) return;

    try {
      await deleteBlog(id);
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete this post.');
    }
  }

  return (
    <>
      <section className="hero">
        <h1>Welcome to Inked</h1>
        <p>Create, read, edit, and delete blog posts — all in one place.</p>
      </section>

      {user ? (
        <BlogPostForm onCreated={handleCreate} />
      ) : (
        <section className="card auth-prompt">
          <p>
            <Link to="/signin">Sign in</Link> to create, edit, or delete your own posts.
          </p>
        </section>
      )}

      <section className="posts-section">
        <div className="section-header">
          <h2>All Posts</h2>
          <span className="post-count">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state card">
            <p>Loading posts…</p>
          </div>
        ) : (
          <PostList posts={posts} user={user} onDelete={handleDelete} />
        )}
      </section>
    </>
  );
}
