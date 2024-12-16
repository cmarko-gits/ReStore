import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/contact/counterSlice"; // Use the default export from the slice
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../features/basket/basketSlice";
import { catalogSlice } from "../features/catalog/catalogSlice";
import logger from "redux-logger";
import { accountSlice } from "../model/accountSlice";

// Check if the environment is development
const isDev = process.env.NODE_ENV === "development";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
    account : accountSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: isDev, // This automatically enables DevTools in development mode
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
