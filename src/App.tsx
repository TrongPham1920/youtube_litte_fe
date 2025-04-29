import { useState } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import YourChannelPage from './pages/YourChannelPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'video' | 'your-channel'>('home');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    setCurrentPage('video');
    setCurrentVideoId(videoId);
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setCurrentVideoId(null);
  };

  const handleGoToYourChannel = () => {
    setCurrentPage('your-channel');
  };

  return (
    <AuthProvider> {/* Bọc toàn bộ App trong AuthProvider */}
      <ThemeProvider>
        <Layout onHomeClick={handleHomeClick} onGoToYourChannel={handleGoToYourChannel}>
          {currentPage === 'home' && <HomePage onVideoClick={handleVideoClick} />}
          {currentPage === 'video' && currentVideoId && (
            <VideoPage videoId={currentVideoId} onVideoClick={handleVideoClick} />
          )}
          {currentPage === 'your-channel' && <YourChannelPage />}
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
