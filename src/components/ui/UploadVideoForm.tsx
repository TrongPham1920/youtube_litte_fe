import { useState } from 'react';
import { createVideo, Video } from '../../data/api/app/api';
import { X } from 'lucide-react';
import Notification from '../../components/ui/Notification';

interface UploadVideoFormProps {
  channelId: string;
  onClose: () => void;
  onUploadSuccess: (video: Video) => void;
  onUploadError: (error: string) => void;
}

const UploadVideoForm: React.FC<UploadVideoFormProps> = ({
  channelId,
  onClose,
  onUploadSuccess,
  onUploadError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

      // Cập nhật tiến trình
      const progress = Math.round(((i + 1) / totalChunks) * 100);
      setUploadProgress(progress);
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
      setNotification({ message: 'Vui lòng nhập đầy đủ thông tin video!', type: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setNotification(null);

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
      setNotification({ message: 'Video đã được tải lên thành công!', type: 'success' });
      onUploadSuccess(savedVideo);
      setTimeout(() => {
        onClose();
      }, 2000); // Delay closing to show success notification
    } catch (err) {
      console.error(err);
      const errorMessage = 'Tải lên video thất bại!';
      setNotification({ message: errorMessage, type: 'error' });
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setNotification(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-700 p-4">
          <h2 className="text-xl font-bold">Tải lên Video mới</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chọn video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white text-sm"
              disabled={uploading}
            />
            {selectedFile && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiêu đề video
            </label>
            <input
              type="text"
              placeholder="Nhập tiêu đề video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              disabled={uploading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả video
            </label>
            <textarea
              placeholder="Nhập mô tả video"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              rows={3}
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
                {uploadProgress}% đã hoàn thành
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !title || !description}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {uploading ? 'Đang tải...' : 'Tải lên'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoForm;