import React from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import BlogLanding from './pages/BlogLanding.jsx';
import BlogPostDetail from './pages/BlogPostDetail.jsx';
import { Toaster } from '@/components/ui/toaster';

// This app is ONLY the blog. It is built with base "/blog/" and deployed into
// the /blog/ directory of fisayo.org, where it is served as static files —
// WordPress handles every other page on the domain. Routes therefore keep
// their full "/blog/..." paths (basename stays "/") so <Link to="/blog/x">
// produces correct absolute URLs.
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/blog" element={<BlogLanding />} />
        <Route path="/blog/:slug" element={<BlogPostDetail />} />
        {/* Anything else under /blog/ goes back to the index */}
        <Route path="*" element={<Navigate to="/blog" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
