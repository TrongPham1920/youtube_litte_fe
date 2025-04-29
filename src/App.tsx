// import React, { useState } from "react";
// import Layout from "./components/layout/Layout";
// import HomePage from "./pages/HomePage";
// import VideoPage from "./pages/VideoPage";
// import { ThemeProvider } from "./context/ThemeContext";
// import UploadVideo from "../src/components/UploadVideo";
// function App() {
//   const [currentPage, setCurrentPage] = useState("home");
//   const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

//   const [videoUrl, setVideoUrl] = useState("");

//   const handleVideoClick = (videoId: string) => {
//     setCurrentPage("video");
//     setCurrentVideoId(videoId);
//   };

//   const handleHomeClick = () => {
//     setCurrentPage("home");
//     setCurrentVideoId(null);
//   };

//   return (
//     <ThemeProvider>
//       <Layout onHomeClick={handleHomeClick}>
//         {currentPage === "home" ? (
//           <HomePage onVideoClick={handleVideoClick} />
//         ) : (
//           <VideoPage videoId={currentVideoId} onVideoClick={handleVideoClick} />
//         )}
//       </Layout>
//       <UploadVideo />
//     </ThemeProvider>
//   );
// }

// export default App;
import React, { useState } from "react";
import UploadVideo from "./components/UploadVideo";
import API from "./api";

const App: React.FC = () => {
  const [videos, setVideos] = useState<string[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await API.get("/videos");
      setVideos(response.data); // Lấy danh sách video từ backend
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div>
      <h1>Video Upload</h1>
      <UploadVideo setVideoUrl={console.log} fetchVideos={fetchVideos} />
      <h2>Uploaded Videos</h2>
      <ul>
        {videos?.map((video, index) => (
          <li key={index}>
            <a href={video} target="_blank" rel="noopener noreferrer">
              {video}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
