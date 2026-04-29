import React from 'react';
import { createRoot } from 'react-dom/client';
import MainPage from './mainpage.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <MainPage />
  </ErrorBoundary>
);
