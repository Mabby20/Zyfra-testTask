import { configureStore } from '@reduxjs/toolkit';
import { sliceApi } from './sliceApi.ts';

export const store = configureStore({
  reducer: {
    [sliceApi.reducerPath]: sliceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sliceApi.middleware),
});
