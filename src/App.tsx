import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    setCurrentPage('video');
    setCurrentVideoId(videoId);
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setCurrentVideoId(null);
  };

  return (
    <ThemeProvider>
      <Layout onHomeClick={handleHomeClick}>
        {currentPage === 'home' ? (
          <HomePage onVideoClick={handleVideoClick} />
        ) : (
          <VideoPage videoId={currentVideoId} onVideoClick={handleVideoClick} />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;