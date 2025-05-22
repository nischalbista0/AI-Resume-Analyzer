import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import JobReducer from "./slices/JobSlice";
import ApplicationReducer from "./slices/ApplicationSlice";
import AdminReducer from "./slices/AdminSlice";
import CompanyReducer from "./slices/CompanySlice";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    job: JobReducer,
    application: ApplicationReducer,
    admin: AdminReducer,
    company: CompanyReducer,
  },
});
