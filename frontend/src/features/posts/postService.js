import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/`;

const getPosts = async (page = 1, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}?page=${page}&limit=10`, config);
  return response.data;
};

const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, postData, config);
  return response.data;
};

const likePost = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}${postId}/like`, {}, config);
  return response.data;
};

const commentPost = async (postId, commentText, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${postId}/comment`,
    { text: commentText },
    config
  );
  return response.data;
};

const postService = {
  getPosts,
  createPost,
  likePost,
  commentPost,
};

export default postService;
