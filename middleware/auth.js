function attachUser(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }
  next();
}

function requireOwnership(post, user) {
  return post && user && post.creatorUserId === user.userId;
}

module.exports = {
  attachUser,
  requireAuth,
  requireOwnership,
};
