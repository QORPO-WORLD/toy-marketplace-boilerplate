import { BlinkBlur } from 'react-loading-indicators';

function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <BlinkBlur color="#E7E6FB33" size="medium" text="" textColor="" />
    </div>
  );
}

export default Loading;
