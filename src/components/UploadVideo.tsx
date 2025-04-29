import React, { useState } from "react";
import axios from "axios";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const uploadChunks = async () => {
    if (!videoFile) return;

    const filename = videoFile.name.split(".")[0] + "-" + Date.now();
    const totalChunks = Math.ceil(videoFile.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(videoFile.size, (i + 1) * CHUNK_SIZE);
      const chunk = videoFile.slice(start, end);

      const formData = new FormData();
      formData.append("filename", filename);
      formData.append("chunkIndex", i.toString());
      formData.append("chunk", chunk);

      await axios.post("http://localhost:5000/upload-chunk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    // Merge
    const response = await axios.post("http://localhost:5000/merge-chunks", {
      filename,
      totalChunks,
    });

    setVideoUrl(response.data.videoUrl);
  };

  return (
    <div>
      <h1>Upload Video</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={uploadChunks}>Upload</button>

      {videoUrl && (
        <div>
          <h2>Uploaded Video:</h2>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
