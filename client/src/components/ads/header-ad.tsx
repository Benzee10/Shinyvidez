interface HeaderAdProps {
  className?: string;
}

export function HeaderAd({ className = "" }: HeaderAdProps) {
  const handleAdClick = () => {
    window.open('https://shiny-mu.vercel.app/', '_blank');
  };

  return (
    <div 
      className={`relative h-16 flex items-center justify-between px-6 cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden ${className}`}
      onClick={handleAdClick}
      data-testid="header-ad"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 flex items-center space-x-4 text-white">
        <span className="text-xl font-bold">🔥 SHINY</span>
        <span className="text-sm opacity-90">Premium Adult Entertainment • Unlimited Access</span>
      </div>
      <button 
        className="relative z-10 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleAdClick();
        }}
      >
        Try Free
      </button>
    </div>
  );
}