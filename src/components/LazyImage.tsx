/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      {/* Elegant Shimmering Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-900/60 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          <div className="z-10 w-8 h-8 rounded-full border-2 border-white/5 border-t-[#2cc3e6] animate-spin" />
        </div>
      )}

      {/* Actual lazy-loaded image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all duration-750 ease-out ${
          isLoaded 
            ? 'opacity-100 scale-100 blur-0' 
            : 'opacity-0 scale-105 blur-md'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
