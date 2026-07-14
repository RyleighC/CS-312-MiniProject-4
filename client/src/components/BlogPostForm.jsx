import { useState } from 'react';

export default function BlogPostForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleContentChange(e) {
    setContent(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onCreated({ title, content });
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message || 'Unable to save your post.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card create-form-card">
      <h2>Write a New Post</h2>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Post Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="My first blog post"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your story here..."
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Publishing…' : 'Publish Post'}
        </button>
      </form>
    </section>
  );
}
