import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';

const initialState = {
  posts: [],
  page: 1,
  pages: 1,
  hasMore: true,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const fetchPosts = createAsyncThunk(
  'posts/getAll',
  async (page, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getPosts(page, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.createPost(postData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async (postId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.likePost(postId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const commentPost = createAsyncThunk(
  'posts/comment',
  async ({ postId, text }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.commentPost(postId, text, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetPostsState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    clearPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.pages = 1;
      state.hasMore = true;
    },
    toggleLikeOptimistic: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        const likedIndex = post.likes.indexOf(userId);
        if (likedIndex === -1) {
          post.likes.push(userId);
        } else {
          post.likes.splice(likedIndex, 1);
        }
      }
    },
    addCommentOptimistic: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { posts, page, pages } = action.payload;
        if (page === 1) {
          state.posts = posts;
        } else {
          const existingIds = new Set(state.posts.map((p) => p._id));
          const uniqueNewPosts = posts.filter((p) => !existingIds.has(p._id));
          state.posts = [...state.posts, ...uniqueNewPosts];
        }
        state.page = page;
        state.pages = pages;
        state.hasMore = page < pages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
      });
  },
});

export const { resetPostsState, clearPosts, toggleLikeOptimistic, addCommentOptimistic } = postSlice.actions;
export default postSlice.reducer;
