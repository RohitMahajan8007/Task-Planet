import { useState } from 'react';
import { Card, CardHeader, CardContent, CardActions, CardMedia, Avatar, Typography, IconButton, Box, Button, TextField, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Comment as CommentIcon, Send as SendIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, commentPost, toggleLikeOptimistic } from '../features/posts/postSlice';
import moment from 'moment';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likes.includes(currentUser?._id);

  const handleLike = () => {
    if (!currentUser) return;
    dispatch(toggleLikeOptimistic({ postId: post._id, userId: currentUser._id }));
    dispatch(likePost(post._id));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dispatch(commentPost({ postId: post._id, text: commentText }));
    setCommentText('');
  };

  const imageUrl = post.image ? `${import.meta.env.VITE_API_URL || ''}${post.image}` : null;

  return (
    <Card sx={{
      mb: 3,
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#4f46e5', fontWeight: 600 }}>
            {post.user?.username ? post.user.username[0].toUpperCase() : 'U'}
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
            {post.user?.username || 'Unknown User'}
          </Typography>
        }
        subheader={moment(post.createdAt).fromNow()}
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 1, pb: 1 }}>
        {post.content && (
          <Typography variant="body1" sx={{ color: '#4b5563', whiteSpace: 'pre-wrap', mb: post.image ? 2 : 0 }}>
            {post.content}
          </Typography>
        )}
      </CardContent>

      {imageUrl && (
        <CardMedia
          component="img"
          image={imageUrl}
          alt="Post media"
          sx={{
            maxHeight: 450,
            objectFit: 'cover',
            width: '100%',
            borderTop: '1px solid rgba(0, 0, 0, 0.03)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
          }}
        />
      )}

      <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleLike}
            startIcon={isLiked ? <FavoriteIcon sx={{ color: '#ef4444' }} /> : <FavoriteBorderIcon />}
            sx={{
              textTransform: 'none',
              color: isLiked ? '#ef4444' : '#6b7280',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              '&:hover': {
                backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
          </Button>
        </Box>

        <Button
          onClick={() => setShowComments(!showComments)}
          startIcon={<CommentIcon />}
          sx={{
            textTransform: 'none',
            color: '#6b7280',
            fontWeight: 600,
            borderRadius: '20px',
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
        </Button>
      </CardActions>

      {showComments && (
        <Box sx={{ px: 3, pb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: '#f9fafb',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.05)',
                  },
                },
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!commentText.trim()}
              sx={{
                backgroundColor: '#4f46e5',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#4338ca',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  color: 'rgba(0, 0, 0, 0.25)',
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </form>

          {post.comments.length > 0 ? (
            <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {post.comments.map((comment) => (
                <ListItem
                  key={comment._id || Math.random()}
                  alignItems="flex-start"
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#374151' }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      {moment(comment.createdAt).fromNow()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#4b5563', wordBreak: 'break-word' }}>
                    {comment.text}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center', py: 1 }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard;
