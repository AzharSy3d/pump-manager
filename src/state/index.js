import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  userId: null, // Initialize userId as null when the user is not authenticated
  isAuthenticated: false, // Add an isAuthenticated field
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
