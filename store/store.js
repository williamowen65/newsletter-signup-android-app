import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app";
import subscriptionQueue from "./subscriptionQueue";

export const store = configureStore({
    reducer: {
        app: appReducer,
        subscriptionQueue: subscriptionQueue,
    },
});
