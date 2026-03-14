"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingView = () => {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/20">
      <div className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-xl bg-white p-4">
        <div className="h-16 w-16">
          <DotLottieReact
            src="/animation/loading.lottie"
            loop
            autoplay
            speed={1.25}
          />
        </div>
        <div className="text-center text-xs">CPC1HN Shop...</div>
      </div>
    </div>
  );
};

export default LoadingView;
