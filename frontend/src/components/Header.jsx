import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Container } from '@mui/material';
import { Logout as LogoutIcon, Forum as FeedIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { clearPosts } from '../features/posts/postSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(clearPosts());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      color: '#1a1a1a',
    }}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <FeedIcon sx={{ mr: 1, color: '#4f46e5' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskPlanet
            </Typography>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  {user.email}
                </Typography>
              </Box>
              <Avatar sx={{
                bgcolor: '#4f46e5',
                fontWeight: 600,
                width: 38,
                height: 38,
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              }}>
                {user.username ? user.username[0].toUpperCase() : 'U'}
              </Avatar>
              <IconButton onClick={onLogout} color="inherit" sx={{
                '&:hover': {
                  color: '#dc2626',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                },
                transition: 'all 0.2s',
              }}>
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
