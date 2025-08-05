interface AdSlotProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const handleAdClick = () => {
    window.open('https://shiny-mu.vercel.app/', '_blank');
  };

  const getAdConfig = () => {
    switch (position) {
      case "top":
        return {
          title: "Premium Adult Entertainment",
          subtitle: "Discover exclusive content and premium experiences",
          cta: "Visit Shiny",
          gradient: "from-red-600 to-pink-600",
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=728&h=90"
        };
      case "middle":
        return {
          title: "Exclusive Premium Videos",
          subtitle: "High-quality content waiting for you",
          cta: "Explore Now", 
          gradient: "from-purple-600 to-red-600",
          image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
        };
      case "bottom":
        return {
          title: "Join Premium Community",
          subtitle: "Access thousands of exclusive videos",
          cta: "Get Started",
          gradient: "from-pink-600 to-red-600",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
        };
      default:
        return {
          title: "Premium Content",
          subtitle: "Exclusive access",
          cta: "Learn More",
          gradient: "from-gray-600 to-gray-700",
          image: ""
        };
    }
  };

  const config = getAdConfig();

  return (
    <div 
      className={`bg-gradient-to-r ${config.gradient} text-white rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg ${className}`}
      onClick={handleAdClick}
      data-testid={`ad-slot-${position}`}
    >
      <div className="relative p-6">
        {config.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${config.image})` }}
          />
        )}
        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-2">{config.title}</h3>
          <p className="text-sm opacity-90 mb-4">{config.subtitle}</p>
          <button 
            className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleAdClick();
            }}
          >
            {config.cta}
          </button>
          <div className="text-xs opacity-70 mt-3">Sponsored Content</div>
        </div>
      </div>
    </div>
  );
}
