"use client";

import Image from "next/image";
import { useState } from "react";

type PortfolioCardMediaProps = {
  image?: string | null;
  title: string;
};

/**
 * Cover media for portfolio cards. Hides broken URLs and shows a branded fallback instead of an empty box.
 */
export function PortfolioCardMedia({ image, title }: PortfolioCardMediaProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  if (!showImage) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-end bg-gradient-to-br from-[#182635] via-[#1e3a5f] to-[#1860F0] p-4"
        aria-hidden
      >
        <p className="line-clamp-2 text-sm font-semibold text-white/90">{title}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full bg-zinc-100">
      <Image
        src={image!}
        alt=""
        fill
        unoptimized={!image!.includes("images.unsplash.com")}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
