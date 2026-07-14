import { Link } from 'react-router-dom';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function PostList({ posts, user, onDelete }) {
  if (!posts.length) {
    return (
      <div className="empty-state card">
        <p>No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => {
        const isOwner = user && user.userId === post.creatorUserId;

        return (
          <article key={post.id} className="card post-card">
            <header className="post-header">
              <h3 className="post-title">{post.title}</h3>
              <div className="post-meta">
                <span className="meta-author">By {post.author}</span>
                <span className="meta-date">{formatDate(post.createdAt)}</span>
                {post.updatedAt && (
                  <span className="meta-edited">(edited {formatDate(post.updatedAt)})</span>
                )}
              </div>
            </header>

            <div className="post-content">
              <p>{post.content}</p>
            </div>

            {isOwner && (
              <footer className="post-actions">
                <Link to={`/posts/${post.id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onDelete(post.id)}
                >
                  Delete
                </button>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
}
