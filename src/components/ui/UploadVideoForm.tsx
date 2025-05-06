import { useState } from 'react';
import { createVideo, Video } from '../../data/api/app/api';

interface UploadVideoFormProps {
  channelId: string;
  onClose: () => void;
  onUploadSuccess: (video: Video) => void;
}

const UploadVideoForm: React.FC<UploadVideoFormProps> = ({ channelId, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadChunks = async (file: File, filename: string) => {
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('filename', filename);
      formData.append('chunkIndex', i.toString());

      await fetch('http://localhost:5000/upload-chunk', {
        method: 'POST',
        body: formData,
      });
    }

    return totalChunks;
  };

  const mergeChunks = async (filename: string, totalChunks: number): Promise<string> => {
    const res = await fetch('http://localhost:5000/merge-chunks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, totalChunks }),
    });

    const data = await res.json();
    return data.videoUrl;
  };

  const handleUpload = async () => {
    if (!selectedFile || !title || !description) {
      alert('Vui lòng nhập đầy đủ thông tin video!');
      return;
    }

    setUploading(true);

    try {
      const filename = `${Date.now()}_${selectedFile.name}`;
      const totalChunks = await uploadChunks(selectedFile, filename);
      const videoUrl = await mergeChunks(filename, totalChunks);

      const newVideo: Video = {
        title,
        description,
        videoUrl,
        channelId,
      };

      const savedVideo = await createVideo(newVideo);
      alert('Video đã được tải lên thành công!');
      onUploadSuccess(savedVideo);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Tải lên video thất bại!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Tải lên Video mới</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
      />

      <input
        type="text"
        placeholder="Tiêu đề video"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
      />

      <textarea
        placeholder="Mô tả video"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-zinc-700 dark:text-white"
        rows={3}
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={uploading}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Hủy
        </button>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Đang tải...' : 'Tải lên'}
        </button>
      </div>
    </div>
  );
};

export default UploadVideoForm;