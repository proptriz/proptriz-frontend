import React from "react";

function SkeletonProfile() {
  return (
    <>
      <div className="pt-5 pb-16 px-4 my-bg-trans skeleton">
        <div className="flex w-full items-center py-3 my-bg-trans">
          <div className="flex-1 my-bg-trans"></div>
          <div className="flex-1 my-bg-trans">
            <div className="w-[135px] h-14 rounded-lg"></div>
          </div>
          <div className="flex-1 my-bg-trans flex items-center">
            <div className="w-10 h-10 rounded-full ml-auto"></div>
          </div>
        </div>

        <div className="w-32 h-32 rounded-full p-1 mt-12 ml-auto mr-auto"></div>
        <div className="w-[100px] h-6 rounded-xl mt-2 mx-auto"></div>
        <div className="w-[150px] h-5 rounded-xl mt-2 mx-auto"></div>

        <div className="grid grid-cols-3 space-x-6 text-center mb-5 mt-4 my-bg-trans">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex-1 h-[84px] rounded-xl"></div>
            ))}
        </div>

        <div className="flex bg-gray-200 rounded-full shadow-lg text-white mb-7 mt-3 p-4 space-x-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex-1 h-[36px] rounded-full" style={{ backgroundColor: "#e9e9e9" }}></div>
            ))}
        </div>


        <div className="my-bg-trans flex justify-between items-center mt-4">
          <div className="w-[128px] rounded-xl h-7"></div>
          <div className="w-16 h-16 rounded-full"></div>
        </div>

        
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

          <div className="w-full h-[52px] mt-14 rounded-xl"></div>
      </div>
    </>
  );
}

export default SkeletonProfile;
