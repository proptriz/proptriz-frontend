import { useEffect, useRef } from "react";

export default function Popup({
  header,
  toggle,
  setToggle,
  useMask = true,
  hideReset = false,
  children,
}: any) {
  // Swipe refs
  const startY = useRef<number | null>(null);
  const endY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  const SWIPE_CLOSE_THRESHOLD = 90; // px
  const SWIPE_HORIZONTAL_TOLERANCE = 60; // px (avoid closing on sideways swipe)

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [toggle]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!toggle) return;
    startY.current = e.touches[0].clientY;
    startX.current = e.touches[0].clientX;
    endY.current = null;
    endX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!toggle) return;
    endY.current = e.touches[0].clientY;
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!toggle) return;
    if (startY.current === null || endY.current === null) return;

    const deltaY = endY.current - startY.current; // positive = down
    const deltaX =
      startX.current !== null && endX.current !== null
        ? Math.abs(endX.current - startX.current)
        : 0;

    // Swipe down to close (only if mostly vertical)
    if (deltaY > SWIPE_CLOSE_THRESHOLD && deltaX < SWIPE_HORIZONTAL_TOLERANCE) {
      setToggle(false);
    }
  };

  return (
    <>
      {/* Mask / Overlay */}
      <div
        className={`fixed inset-0 w-full h-full bg-black/40 z-[9998] transition-opacity ${
          toggle ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          if (useMask) setToggle(false);
        }}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-[650px] bg-white rounded-t-3xl px-6 pb-6 z-[9999]
        h-[calc(100vh-150px)] overflow-y-auto transition-transform duration-200 ease-linear
        ${toggle ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sticky top-0 bg-white pt-6 z-10">
          <div className="h-px w-16 mx-auto bg-black mb-4"></div>

          <div className="flex items-center justify-between">
            <p className="font-[Raleway] font-bold">{header}</p>

            {!hideReset && (
              <button className="px-4 py-2 rounded-full bg-[#234F68] text-white text-sm">
                reset
              </button>
            )}
          </div>
        </div>

        {children}
      </div>
    </>
  );
}