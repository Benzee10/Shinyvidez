import { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX } from "lucide-react";

const videoUrls = [
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b99880ff529.06142108.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9964d538f7.59762869.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b996f8e2100.68901658.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9991c5d4f2.73297277.mp4"
];

export function StickyVideoWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Set random video on mount
    setCurrentVideoIndex(Math.floor(Math.random() * videoUrls.length));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // Play next random video
      const nextIndex = Math.floor(Math.random() * videoUrls.length);
      setCurrentVideoIndex(nextIndex);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, [currentVideoIndex]);

  const handleClick = () => {
    window.open('https://shindollop.vercel.app/', '_blank');
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const closeWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="relative w-64 h-36 bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={handleClick}
        data-testid="sticky-video-widget"
      >
        <video
          ref={videoRef}
          src={videoUrls[currentVideoIndex]}
          autoPlay
          muted={isMuted}
          loop={false}
          className="w-full h-full object-cover"
        onError={() => {
          // If video fails to load, try next one
          const nextIndex = Math.floor(Math.random() * videoUrls.length);
          setCurrentVideoIndex(nextIndex);
        }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm mb-1">🔥 Exclusive Premium Content</h3>
            <p className="text-white/90 text-xs">Click to explore more videos</p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={toggleMute}
            className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            data-testid="mute-button"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            onClick={closeWidget}
            className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            data-testid="close-widget-button"
          >
            <X size={14} />
          </button>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-2 right-2">
          <div className="text-xs text-white/70 bg-black/50 px-2 py-1 rounded">Sponsored</div>
        </div>
      </div>
    </div>
  );
}