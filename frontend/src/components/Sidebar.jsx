import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ImageIcon from '@mui/icons-material/Image';
import PeopleIcon from '@mui/icons-material/People';
import { useAuthStore } from '../store/authStore';

function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: DashboardIcon },
    { label: 'Posts', path: '/posts', icon: ArticleIcon },
    { label: 'Comments', path: '/comments', icon: CommentIcon },
    { label: 'Categories', path: '/categories', icon: CategoryIcon },
    { label: 'Tags', path: '/tags', icon: LocalOfferIcon },
    { label: 'Media Library', path: '/media', icon: ImageIcon },
  ];

  // Add Users option for admin only
  if (user?.role === 'admin') {
    menuItems.push({
      label: 'Users',
      path: '/users',
      icon: PeopleIcon,
    });
  }

  return (
    <List sx={{ pt: 2 }}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        );
      })}
      <Divider sx={{ my: 2 }} />
    </List>
  );
}

export default Sidebar;
