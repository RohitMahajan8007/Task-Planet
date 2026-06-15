import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../features/posts/postSlice';
import { Card, CardContent, Button, TextField, Box, IconButton, Typography } from '@mui/material';
import { Image as ImageIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Post content or image is required');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (content.trim()) {
      formData.append('content', content);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      await dispatch(createPost(formData)).unwrap();
      setContent('');
      handleClearImage();
      toast.success('Post created successfully!');
    } catch (err) {
      toast.error(err || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{
      mb: 3,
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
          Share something
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="What's on your mind?..."
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.05)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(79, 70, 229, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4f46e5',
                },
              },
            }}
          />

          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 2, borderRadius: '12px', overflow: 'hidden', maxHeight: 300 }}>
              <img
                src={imagePreview}
                alt="Upload preview"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
              <IconButton
                onClick={handleClearImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                component="span"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<ImageIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '30px',
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  color: '#4b5563',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#4f46e5',
                    color: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.04)',
                  },
                }}
              >
                Add Image
              </Button>
            </Box>

            <Button
              type="submit"
              disabled={isSubmitting || (!content.trim() && !image)}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: '30px',
                px: 3,
                backgroundColor: '#4f46e5',
                '&:hover': {
                  backgroundColor: '#4338ca',
                },
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              }}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
