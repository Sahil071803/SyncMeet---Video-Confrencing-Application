import React from "react";

import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import {
  ThemeProvider,
  CssBaseline,
} from "@mui/material";

import store from "./store/store";

import App from "./App";

import "./index.css";

import theme from "./theme/theme";

// ======================================
// ROOT RENDER
// ======================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);