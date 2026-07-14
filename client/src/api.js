const API_BASE = '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getMe() {
  return request('/api/auth/me');
}

export function signup(payload) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signin(payload) {
  return request('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

export function getBlogs() {
  return request('/api/blogs');
}

export function getBlog(id) {
  return request(`/api/blogs/${id}`);
}

export function createBlog(payload) {
  return request('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBlog(id, payload) {
  return request(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteBlog(id) {
  return request(`/api/blogs/${id}`, { method: 'DELETE' });
}
