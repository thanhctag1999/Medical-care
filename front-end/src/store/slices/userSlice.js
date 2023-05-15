import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from '../../api/userApi';

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (userId) => {
  const response = await userApi.getByID(userId);
  return response;
});

const initialState = {
  user: null,
  isLogin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.user = { ...action.payload };
      state.isLogin = true;
    });
  },
});

export const { login, updateUser } = userSlice.actions;
export default userSlice.reducer;
