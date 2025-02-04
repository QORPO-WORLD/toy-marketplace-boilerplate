import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

import { Portal } from '../ui';
import clsx from 'clsx';

function ModalLayout({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Start animation when mounted

    // Disable scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = ''; // Re-enable scrolling
    };
  }, []);

  const closeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
      setTimeout(onClose, 300); // Delay unmounting for animation
    }
  };

  return (
    <Portal>
      <div
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeHandler}
      >
        <div
          className={clsx(
            'p-4 bg-main-gradient rounded-lg relative transform transition-transform duration-300',
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
            className,
          )}
        >
          <IoMdClose
            className="absolute top-2 right-2 w-8 h-8 text-white cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          />
          {children}
        </div>
      </div>
    </Portal>
  );
}

export default ModalLayout;
