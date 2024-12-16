'use client';

import { useState, useRef, useEffect } from 'react';

function FAQBox() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // To measure the height of the content

  return (
    <div
      className="py-[1.5rem] px-[2rem] bg-[#4035061A] rounded-[1.25rem] border border-[#403545] cursor-pointer"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <div className="flex items-center justify-between">
        <p className="text-[2rem] font-DMSans font-bold text-[#00000099]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit?
        </p>
        <img
          className="transition duration-150 ease-out"
          src="/icons/arrow-icon.svg"
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-[655ms] ease-out `}
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          marginTop: isOpen ? '1rem' : '0rem',
        }}
      >
        <div ref={contentRef}>
          <p className="font-DMSans text-[1.75rem] font-normal text-[#00000099]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in leo
            sit amet dolor dignissim thoncus. Fusce et fermentum dolor. Etiam
            vulputate nunc vitae tortor mollis, ut blandit ipsum egestas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQBox;
