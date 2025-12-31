import React, { SetStateAction } from 'react';

interface PopupProps {
  children: React.ReactNode;
  header: string;
  toggle: boolean; 
  setToggle: React.Dispatch<SetStateAction<boolean>>
  useMask?: boolean;
  hideReset?: boolean
}

function Popup({ children, header, toggle, setToggle, useMask, hideReset=false }: PopupProps) {

  return (
    <>
    <div className={`absolute top-0 left-0 w-full h-full z-50 bg-gray-200 opacity-75 ${
        toggle ? '' : 'hidden'
        }`}
        onClick={()=>{useMask && setToggle(false)}}
    ></div>
    
    <div
        className={`h-[calc(100vh-150px)] bg-white fixed bottom-0 md:max-w-[650px] mx-auto left-1/2 transform -translate-x-1/2 w-full md:mx-auto rounded-t-3xl px-6 pb-6 ease-linear transition-transform z-50 overflow-y-auto ${
          toggle ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
        <div className="sticky top-0 bg-white pt-6">
          <div className="h-px w-16 mx-auto bg-black mb-4"></div>
          <div className="flex items-center justify-between">
            <p className="font-[Raleway] font-bold">{header}</p>
            { !hideReset && <button className="px-4 py-2 rounded-full bg-[#234F68] text-white text-sm">reset</button>}
          </div>
        </div>
      {children}
    </div>
    </>
  );
}

export default Popup;