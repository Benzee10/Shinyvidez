interface ImageAdProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  className?: string;
}

export function ImageAd({ imageUrl, title, subtitle, cta = "Visit Shiny", className = "" }: ImageAdProps) {
  const handleAdClick = () => {
    window.open('https://shiny-mu.vercel.app/', '_blank');
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg ${className}`}
      onClick={handleAdClick}
      data-testid="image-ad"
    >
      <img 
        src={imageUrl} 
        alt="Advertisement"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
          {subtitle && <p className="text-sm opacity-90 mb-3">{subtitle}</p>}
          <button 
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAdClick();
            }}
          >
            {cta}
          </button>
        </div>
      </div>
      <div className="absolute top-2 right-2 text-xs text-white/70 bg-black/50 px-2 py-1 rounded">Sponsored</div>
    </div>
  );
}