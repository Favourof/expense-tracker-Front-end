import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "@/shared/api/request";
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('checkauth');
      if (response.data) {
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTotalIncome = createAsyncThunk(
  'auth/getTotalIncome',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/income/summary/${year}/${month}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTotalExpense = createAsyncThunk(
  'auth/getTotalExpense', 
  async({ year, month }, {rejectWithValue}) => {
    try {
      const response = await apiClient.get(`/expense/monthly/${year}/${month}`)
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
