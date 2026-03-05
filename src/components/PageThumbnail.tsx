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
      <div className="w-[120px] rounded-lg border-2 border-data3-border overflow-hidden transition-colors group-hover:border-data3-accent group-focus:border-data3-accent">
        <img
          src={imageUrl}
          alt={`PDF page ${pageNumber}`}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
      <span className="text-xs text-data3-text-muted group-hover:text-data3-accent">p{pageNumber}</span>
    </button>
  );
}
