'use client';

import { motion } from 'framer-motion';

function VideoModal({
  videoPath,
  closeModal,
}: {
  videoPath: string;
  closeModal: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
      onClick={closeModal}
    >
      <motion.div
        className="bg-[#483F51] p-4 rounded-lg shadow-lg mb:p-1"
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{
          type: 'spring',
          stiffness: 100,
          duration: 1,
        }}
      >
        <video
          src={videoPath}
          controls
          autoPlay
          className="w-full h-auto max-h-[88dvh] rounded-lg"
        />
      </motion.div>
    </div>
  );
}

export default VideoModal;
