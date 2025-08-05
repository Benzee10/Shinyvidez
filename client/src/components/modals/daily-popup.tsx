import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      const today = new Date().toDateString();
      const lastShownDate = localStorage.getItem('dailyPopupLastShown');
      
      // Show popup if it hasn't been shown today
      if (lastShownDate !== today) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
      }
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as shown today
    const today = new Date().toDateString();
    localStorage.setItem('dailyPopupLastShown', today);
  };

  const handleJoinNow = () => {
    window.open('https://shindollop.vercel.app/', '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      data-testid="daily-popup-overlay"
    >
      <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 p-8 rounded-2xl shadow-2xl max-w-md mx-4 relative animate-bounce">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          data-testid="close-popup-button"
        >
          <X size={24} />
        </button>

        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">🚨 LIMITED TIME OFFER!</h2>
          
          <div className="mb-6">
            <p className="text-lg font-semibold mb-2">URGENT: Only 24 Hours Left!</p>
            <p className="text-sm opacity-90 mb-4">
              Don't miss out on exclusive premium content. Join thousands of satisfied members who have unlocked unlimited access to our premium library.
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium">✨ What you get:</p>
              <ul className="text-xs text-left mt-2 space-y-1">
                <li>• Unlimited HD streaming</li>
                <li>• Exclusive premium videos</li>
                <li>• No advertisements</li>
                <li>• Mobile & desktop access</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleJoinNow}
              className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold py-3 text-lg"
              data-testid="join-now-button"
            >
              🔥 JOIN NOW - LIMITED TIME!
            </Button>
            
            <button
              onClick={handleClose}
              className="w-full text-white/80 text-sm hover:text-white transition-colors"
              data-testid="maybe-later-button"
            >
              Maybe later
            </button>
          </div>
        </div>

        {/* Pulsing border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-pulse pointer-events-none"></div>
      </div>
    </div>
  );
}