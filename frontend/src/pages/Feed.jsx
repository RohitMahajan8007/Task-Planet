import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, clearPosts } from '../features/posts/postSlice';
import { Container, Box, CircularProgress, Typography, Button } from '@mui/material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message, hasMore, page } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(clearPosts());
    dispatch(fetchPosts(1));
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to fetch posts');
    }
  }, [isError, message]);

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchPosts(page + 1));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
        <CreatePost />

        {posts.length > 0 ? (
          <Box>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Box>
        ) : (
          !isLoading && (
            <Typography variant="body1" sx={{ color: '#9ca3af', py: 4, textAlign: 'center' }}>
              No posts in your feed yet. Start sharing!
            </Typography>
          )
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={36} sx={{ color: '#4f46e5' }} />
          </Box>
        )}

        {!isLoading && hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
            <Button
              variant="outlined"
              onClick={loadMorePosts}
              sx={{
                textTransform: 'none',
                borderRadius: '30px',
                px: 4,
                borderColor: '#4f46e5',
                color: '#4f46e5',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#4338ca',
                  backgroundColor: 'rgba(79, 70, 229, 0.04)',
                },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Feed;
