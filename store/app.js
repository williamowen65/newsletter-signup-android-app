import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        loggedIn: false,
        clearQueue: false,
        showHeader: true
    },
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setShowHeader: (state, action) => {
            state.showHeader = action.payload;
        },
    },
});

export const setLoggedIn =
    appSlice.actions.setLoggedIn;
export const setShowHeader =
    appSlice.actions.setShowHeader;
export default appSlice.reducer;
