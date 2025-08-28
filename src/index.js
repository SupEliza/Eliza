import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './hooks/Authentication/authContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/index.js';
import DashRoute from './routes/DashRoute.js';
import LoginRoute from './routes/LoginRoute.js';
import ViewNote from './pages/ViewNote/index.js';
import ViewTransfer from './pages/ViewTransfer/index.js';
import { NotifyProvider } from './hooks/Notify/notifyContext.js';
import Notify from './components/Notify/index.js';

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #0b2361;
    --total-background: #e43636ff;
    --primary-color: #4763E4;
    --secondary-color: rgb(255, 255, 255);
    --text-color: rgb(32,34,36);
  }

  * {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  body {
    background-color: var(--background);
    overflow: hidden;
  }

  ::-webkit-scrollbar {
      width: 12px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--primary-color); 
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--background);
    border-radius: 0.5rem;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <GlobalStyle />
    <BrowserRouter>
      <AuthProvider>
        <NotifyProvider>
          <Notify/>
          <Routes>
            <Route path="/"
              element={
                <LoginRoute>
                  <Login/>
                </LoginRoute>
              }
            />
            <Route path="/login"
              element={
                <LoginRoute>
                  <Login/>
                </LoginRoute>
              }
            />
            <Route path="/dashboard" 
              element={
                <DashRoute>
                  <Dashboard/>
                </DashRoute>
              }
            />
            <Route path="/dashboard/view/note/:noteID" 
              element={
                <DashRoute>
                  <ViewNote/>
                </DashRoute>
              }
            />
            <Route path="/dashboard/view/transfer/:transferID" 
              element={
                <DashRoute>
                  <ViewTransfer/>
                </DashRoute>
              }
            />
          </Routes>
        </NotifyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);