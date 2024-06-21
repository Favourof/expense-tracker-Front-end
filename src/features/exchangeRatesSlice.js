import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchExchangeRates = createAsyncThunk('exchangeRates/fetchExchangeRates', async (baseCurrency) => {
  const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`);
  return response.data;
});

const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState: {
    rates: {},
    baseCurrency: 'USD',
    status: 'idle',
    error: null,
  },
  reducers: {
    setBaseCurrency(state, action) {
      state.baseCurrency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rates = action.payload.rates;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setBaseCurrency } = exchangeRatesSlice.actions;

export default exchangeRatesSlice.reducer;
