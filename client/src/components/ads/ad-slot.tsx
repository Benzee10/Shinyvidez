interface AdSlotProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const getAdConfig = () => {
    switch (position) {
      case "top":
        return {
          title: "Advertisement Slot - Top Position",
          subtitle: "728x90 Banner or Custom Content",
          icon: "⚡",
        };
      case "middle":
        return {
          title: "Advertisement Slot - Middle Position", 
          subtitle: "Native Ad Content or Banner",
          icon: "🎯",
        };
      case "bottom":
        return {
          title: "Advertisement Slot - Bottom Position",
          subtitle: "Recommended Content or Sponsored Videos", 
          icon: "📱",
        };
      default:
        return {
          title: "Advertisement Slot",
          subtitle: "Ad Content",
          icon: "📢",
        };
    }
  };

  const config = getAdConfig();

  return (
    <div 
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 ${className}`}
      data-testid={`ad-slot-${position}`}
    >
      <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
        <span className="text-lg">{config.icon}</span>
        <span className="font-medium">{config.title}</span>
      </div>
      <p className="text-center text-sm text-gray-400 mt-2">{config.subtitle}</p>
    </div>
  );
}
