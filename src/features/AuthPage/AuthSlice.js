import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicRequest } from "@/shared/api/request";


let userId;
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await publicRequest.post(
        'checkauth',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data) {
        userId = response.data;
        localStorage.setItem('userId', response.data._id);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTotalIncome = createAsyncThunk(
  'auth/getTotalIncome',
  async ({ userId, year, month }, { rejectWithValue }) => {
    try {
      const response = await publicRequest.get(`/income/summary/${userId}/${year}/${month}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTotalExpense = createAsyncThunk(
  'auth/getTotalExpense', 
  async({userId, year, month}, {rejectWithValue}) => {
    try {
      const response = await publicRequest.get(`/expense/monthly/${userId}/${year}/${month}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    status: 'idle',
    userId,
    error: null,
    incomeData: null,
    expenseData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getTotalIncome.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalIncome.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.incomeData = action.payload;
      })
      .addCase(getTotalIncome.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getTotalExpense.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTotalExpense.fulfilled, (state, action)=> {
        state.status = 'succeeded';
        state.expenseData = action.payload;
      })
      .addCase(getTotalExpense.rejected, (state, action) =>{
        state.status = 'failed';
        state.error = action.payload
      });
  },
});

export default authSlice.reducer;
