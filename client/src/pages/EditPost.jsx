import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBlog, updateBlog } from '../api';
import { useAuth } from '../AuthContext';
import EditPostForm from '../components/EditPostForm';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/signin');
      return;
    }

    getBlog(id)
      .then((data) => {
        if (data.post.creatorUserId !== user.userId) {
          setError('You can only edit posts you created.');
          setPost(null);
          return;
        }
        setPost(data.post);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load this post.');
      })
      .finally(() => setLoading(false));
  }, [id, user, authLoading, navigate]);

  async function handleSave(formData) {
    await updateBlog(id, formData);
    navigate('/');
  }

  if (authLoading || loading) {
    return (
      <div className="empty-state card">
        <p>Loading post…</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="card empty-state">
        <h1>Unable to edit</h1>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </section>
    );
  }

  if (!post) return null;

  return <EditPostForm post={post} onSave={handleSave} />;
}
