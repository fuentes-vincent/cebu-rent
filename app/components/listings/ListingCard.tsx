import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ListingCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  image_url: string;
  rating?: number;
  category: string;
  user_id: string;
  created_at: string;
}

export default function ListingCard({
  id,
  title,
  location,
  price,
  rating,
  image_url,
}: ListingCardProps) {
  const router = useRouter();
  // Random Unsplash property image as fallback
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070";

  const [imgSrc, setImgSrc] = useState(image_url || FALLBACK_IMAGE);

  const handleClick = () => {
    console.log('Clicking listing with ID:', id); // Debug log
    if (id) {
      router.push(`/listings/${id}`);
    } else {
      console.error('No ID provided for listing:', title);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="col-span-1 cursor-pointer group"
    >
      <div className="aspect-square w-full relative overflow-hidden rounded-xl">
        <Image
          fill
          src={imgSrc}
          alt={title}
          className="object-cover w-full h-full transition group-hover:scale-110"
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
          }}
        />
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{location}</h3>
          <div className="flex items-center gap-1">
            <span>★</span>
            <span>{rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2">
          <span className="font-semibold">₱{price.toLocaleString()}</span>
          <span className="text-gray-500"> night</span>
        </p>
      </div>
    </div>
  );
} 