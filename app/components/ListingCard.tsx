import Image from "next/image";

interface ListingCardProps {
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export default function ListingCard({
  title,
  location,
  price,
  rating,
  imageUrl
}: ListingCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square w-full relative overflow-hidden rounded-xl">
        <Image
          fill
          className="object-cover w-full h-full group-hover:scale-110 transition"
          src={imageUrl}
          alt={title}
        />
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{location}</h3>
          <div className="flex items-center gap-1">
            <span>★</span>
            <span>{rating}</span>
          </div>
        </div>
        <p className="text-gray-500">{title}</p>
        <p className="mt-1">
          <span className="font-semibold">${price}</span> night
        </p>
      </div>
    </div>
  );
} 