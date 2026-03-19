import { createBrowserRouter } from 'react-router';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/map',
    Component: MapPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
]);