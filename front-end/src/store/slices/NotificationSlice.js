import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  isOpen: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openNotification: (state, action) => {
      state.isOpen = true;
      state.message = action.payload;
    },
    closeNotification: (state) => {
      state.isOpen = false;
      state.message = '';
    },
  },
});

export const { openNotification, closeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
