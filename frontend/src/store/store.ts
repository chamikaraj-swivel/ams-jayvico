import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './slices/vehicleSlice';
import customerReducer from './slices/customerSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
    customers: customerReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

