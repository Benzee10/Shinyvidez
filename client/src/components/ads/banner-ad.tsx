interface BannerAdProps {
  type: "horizontal" | "vertical" | "square";
  className?: string;
}

export function BannerAd({ type, className = "" }: BannerAdProps) {
  const handleAdClick = () => {
    window.open('https://shiny-mu.vercel.app/', '_blank');
  };

  const getAdConfig = () => {
    switch (type) {
      case "horizontal":
        return {
          title: "🔥 SHINY Premium",
          subtitle: "Exclusive Adult Content",
          cta: "Join Now",
          gradient: "from-red-500 via-pink-500 to-purple-600",
          height: "h-24",
          layout: "flex-row items-center justify-between"
        };
      case "vertical":
        return {
          title: "Premium Access",
          subtitle: "Unlimited streaming • 4K Quality • No Ads",
          cta: "Get Premium",
          gradient: "from-purple-600 via-red-500 to-pink-600",
          height: "h-64",
          layout: "flex-col justify-center text-center"
        };
      case "square":
        return {
          title: "SHINY",
          subtitle: "Premium Videos",
          cta: "Explore",
          gradient: "from-pink-600 to-red-600",
          height: "h-48",
          layout: "flex-col justify-center text-center"
        };
      default:
        return {
          title: "Premium",
          subtitle: "Content",
          cta: "Visit",
          gradient: "from-gray-600 to-gray-700",
          height: "h-32",
          layout: "flex-col justify-center text-center"
        };
    }
  };

  const config = getAdConfig();

  return (
    <div 
      className={`bg-gradient-to-r ${config.gradient} ${config.height} rounded-lg cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden ${className}`}
      onClick={handleAdClick}
      data-testid={`banner-ad-${type}`}
    >
      <div className={`flex ${config.layout} h-full p-4 relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white">
          <h3 className="font-bold text-lg mb-1">{config.title}</h3>
          <p className="text-sm opacity-90 mb-2">{config.subtitle}</p>
        </div>
        <button 
          className="relative z-10 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleAdClick();
          }}
        >
          {config.cta}
        </button>
      </div>
      <div className="absolute bottom-1 right-2 text-xs text-white/70">Ad</div>
    </div>
  );
}