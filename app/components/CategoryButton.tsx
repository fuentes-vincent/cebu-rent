interface CategoryButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function CategoryButton({
  label,
  selected,
  onClick
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 
        py-2 
        border 
        rounded-full 
        transition
        whitespace-nowrap
        ${selected ? 'border-black bg-gray-100' : 'hover:border-black'}
      `}
    >
      {label}
    </button>
  );
} 