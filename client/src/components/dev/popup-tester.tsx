import { Button } from "@/components/ui/button";

interface PopupTesterProps {
  className?: string;
}

export function PopupTester({ className = "" }: PopupTesterProps) {
  const triggerPopup = () => {
    // Clear the localStorage to force popup to show
    localStorage.removeItem('dailyPopupLastShown');
    // Reload the page to trigger the popup
    window.location.reload();
  };

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className={`fixed top-4 left-4 z-40 ${className}`}>
      <Button
        onClick={triggerPopup}
        className="bg-yellow-500 text-black hover:bg-yellow-400 text-xs px-3 py-1"
        data-testid="test-popup-button"
      >
        Test Popup
      </Button>
    </div>
  );
}