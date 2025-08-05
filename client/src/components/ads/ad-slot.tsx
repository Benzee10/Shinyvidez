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
          image: "https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg"
        };
      case "middle":
        return {
          title: "Exclusive Premium Videos",
          subtitle: "High-quality content waiting for you",
          cta: "Explore Now", 
          gradient: "from-purple-600 to-red-600",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-m-_6OOa20rzN5-qUcyeQQU2i04HmI10_0o1rM2soZjnFlGWjzv7XlQ3mAH1fimkcg&usqp=CAU"
        };
      case "bottom":
        return {
          title: "Join Premium Community",
          subtitle: "Access thousands of exclusive videos",
          cta: "Get Started",
          gradient: "from-pink-600 to-red-600",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlmkMnipC8GGooa81DxOipkMvk78sGbVk1FA&s"
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
            className="absolute inset-0 bg-cover bg-center opacity-30"
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
