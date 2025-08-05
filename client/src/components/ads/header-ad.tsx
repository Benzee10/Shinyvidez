interface HeaderAdProps {
  className?: string;
}

export function HeaderAd({ className = "" }: HeaderAdProps) {
  const handleAdClick = () => {
    window.open('https://shiny-mu.vercel.app/', '_blank');
  };

  return (
    <div 
      className={`bg-gradient-to-r from-red-600 to-pink-600 text-white h-16 flex items-center justify-between px-6 cursor-pointer hover:from-red-700 hover:to-pink-700 transition-all duration-300 ${className}`}
      onClick={handleAdClick}
      data-testid="header-ad"
    >
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">🔥 SHINY</span>
        <span className="text-sm opacity-90">Premium Adult Entertainment • Unlimited Access</span>
      </div>
      <button 
        className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
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