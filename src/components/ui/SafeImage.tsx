import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function SafeImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback = "/file.svg"; // fallback image in public/

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
      {...props}
    />
  );
} 