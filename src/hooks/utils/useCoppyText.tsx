import { useState } from 'react';

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  return { copied, copyToClipboard };
};

export default useCopyToClipboard;
