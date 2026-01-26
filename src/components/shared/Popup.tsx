import { useEffect } from "react";

export default function Popup({
  header,
  toggle,
  setToggle,
  useMask = true,
  hideReset = false,
  children,
}: any) {
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
        onClick={(e) => e.stopPropagation()} // prevent clicks closing when interacting inside
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
