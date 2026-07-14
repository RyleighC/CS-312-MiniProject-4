import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function EditPostForm({ post, onSave }) {
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onSave({ title, content });
    } catch (err) {
      setError(err.message || 'Unable to update this post.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card edit-form-card">
      <div className="section-header">
        <h1>Edit Post</h1>
        <Link to="/" className="btn btn-ghost">
          ← Back to Home
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Post Title</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-content">Content</label>
          <textarea
            id="edit-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <p className="form-note">
          Posted by {post.author} on{' '}
          {new Date(post.createdAt).toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
        </p>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
