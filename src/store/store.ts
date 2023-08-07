import { configureStore } from '@reduxjs/toolkit';
import { sliceApi } from './sliceApi.ts';
import modalReducer from './modals/modalSlice.ts'

export const store = configureStore({
  reducer: {
    [sliceApi.reducerPath]: sliceApi.reducer,
    modals: modalReducer

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sliceApi.middleware),
});

export type IAppDispatch = typeof store.dispatch;
