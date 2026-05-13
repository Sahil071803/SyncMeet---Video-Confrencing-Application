import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { styled } from "@mui/system";

import LoginPage from "./authPages/LoginPage/LoginPage";
import RegisterPage from "./authPages/RegisterPage/RegisterPage";
import Dashboard from "./Dashboard/Dashboard";
import WelcomeScreen from "./pages/WelcomeScreen";

import AlertNotification from "./shared/components/AlertNotification";

import "./App.css";

const AppContainer = styled("div")({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(180deg,#020617,#0F172A)",
  overflow: "hidden",
});

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomeScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>

      <AlertNotification />
    </AppContainer>
  );
}

export default App;