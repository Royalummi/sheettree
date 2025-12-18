import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sheetsReducer from "./slices/sheetsSlice";
import formsReducer from "./slices/formsSlice";
import adminReducer from "./slices/adminSlice";
import notificationsReducer from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    sheets: sheetsReducer,
    forms: formsReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
