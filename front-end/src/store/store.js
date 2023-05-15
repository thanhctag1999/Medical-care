import { configureStore } from '@reduxjs/toolkit';
import notificationSlice from './slices/NotificationSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    notification: notificationSlice,
  },
});
