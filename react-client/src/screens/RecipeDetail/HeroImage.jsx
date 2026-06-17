import { useState } from 'react';

export default function HeroImage({ image, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="w-full aspect-[4/3] bg-gray-100">
      {image && !imageFailed ? (
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🍽</div>
      )}
    </div>
  );
}
