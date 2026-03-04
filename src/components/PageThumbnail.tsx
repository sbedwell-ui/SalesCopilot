interface PageThumbnailProps {
  pageNumber: number;
  imageUrl: string;
  onClick: () => void;
}

export default function PageThumbnail({ pageNumber, imageUrl, onClick }: PageThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 focus:outline-none"
    >
      <div className="w-[120px] rounded-lg border-2 border-gray-200 overflow-hidden transition-colors group-hover:border-blue-400 group-focus:border-blue-400">
        <img
          src={imageUrl}
          alt={`PDF page ${pageNumber}`}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
      <span className="text-xs text-gray-500 group-hover:text-blue-600">p{pageNumber}</span>
    </button>
  );
}
