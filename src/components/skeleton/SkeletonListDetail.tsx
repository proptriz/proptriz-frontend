import React from "react";

function SkeletonListDetail() {
  return (
    <>
      <div className="pt-5 pb-16 px-4 my-bg-trans skeleton">
        <div className="flex w-full items-center py-3 my-bg-trans">
          <div className="flex-1 my-bg-trans"></div>
          <div className="flex-1 my-bg-trans ">
            {/* <div className="w-[135px] ml-auto mr-auto h-14 rounded-lg"></div> */}
          </div>
          <div className="flex-1 my-bg-trans flex items-center">
            {/* <div className="w-10 h-10 rounded-full mr-3"></div> */}
            <div className="w-8 h-8 rounded-full ml-auto"></div>
            <div className="w-8 h-8 rounded-full ml-2"></div>
          </div>
        </div>
        <div className="mt-56 w-[106px] h-[32px] rounded-full"></div>
        <div className="w-full my-bg-trans flex justify-between">
          <div className="my-bg-trans mt-4">
            <div className="w-[264px] h-[26px] rounded-xl mb-2"></div>
            <div className="w-[179px] h-[17px] rounded-xl"></div>
          </div>
          <div className="my-bg-trans">
            <div className="w-[78px] h-[32px] rounded-xl mb-2"></div>
            <div className="w-[65px] h-[20px] rounded-xl"></div>
          </div>
        </div>
        <div className="w-full my-bg-trans flex justify-between mt-5">
          <div className="w-[65px] h-[44px] rounded-xl mb-2"></div>
          <div className="w-[55px] h-[55px] rounded-full"></div>
        </div>

        <div className="w-full h-[72px] px-5 py-3 rounded-lg mt-5 flex justify-between items-center">
          <div className="flex my-bg-trans gap-2 items-center">
            <div
              className="w-[48px] h-[48px] rounded-full"
              style={{ backgroundColor: "#e9e9e9" }}
            ></div>
            <div className="">
              <div
                className="w-[80px] h-[15px] rounded-xl mb-2"
                style={{ backgroundColor: "#e9e9e9" }}
              ></div>
              <div
                className="w-[108px] h-[15px] rounded-xl mb-2"
                style={{ backgroundColor: "#e9e9e9" }}
              ></div>
            </div>
          </div>
          <div
            className="w-[35px] h-[35px] rounded-full"
            style={{ backgroundColor: "#e9e9e9" }}
          ></div>
        </div>

        <div className="flex w-full mt-9 overflow-x-auto space-x-6 my-bg-trans">
        {Array(9)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="min-w-[133px] h-[44px] rounded-full"></div>
              ))}
        </div>
        <div className="w-[60%] h-5 rounded-xl mt-9"></div>
        <div className="w-full h-[80px] rounded-full mt-3"></div>

        <div className="flex w-full mt-9 overflow-x-auto space-x-6 my-bg-trans">
        {Array(2)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="min-w-[133px] h-[44px] rounded-full"></div>
              ))}
        </div>

        <div className="w-full h-[200px] mt-3 rounded-2xl shadow-md"></div>

        <div className="w-[50%] h-5 rounded-xl mt-9"></div>
        <div className="w-full h-[52px] rounded-xl shadow-md mt-3"></div>
        <div className="w-full h-[136px] rounded-xl shadow-md mt-4"></div>


        <div className="w-[50%] h-5 rounded-xl mt-20 mb-3"></div>

        <div className="w-full grid grid-cols-2 gap-4 mt-4  my-bg-trans">
            {Array(2)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="flex-1 shadow-sm rounded-2xl p-3">
                  <div
                    className="h-[190px] w-full bg-[#e9e9e9] rounded-xl"
                    style={{ backgroundColor: "#e9e9e9" }}
                  ></div>
                  <div
                    className="my-2 w-2/3 h-5 rounded-xl"
                    style={{ backgroundColor: "#e9e9e9" }}
                  ></div>
                  <div
                    className="my-2 w-3/4 h-5 rounded-xl"
                    style={{ backgroundColor: "#e9e9e9" }}
                  ></div>
                </div>
              ))}
          </div>
      </div>
    </>
  );
}

export default SkeletonListDetail;
