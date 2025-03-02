import React from "react";
import "./Skeleton.css";
import Footer from "../shared/Footer";
function SkeletonLandingPage() {
  return (
    <>
      <div className="pt-5 pb-16 px-4 my-bg-trans skeleton">
        {/* <div className="flex w-full items-center py-3 my-bg-trans">
          <div className="flex-1 my-bg-trans"></div>
          <div className="flex-1 my-bg-trans">
            <div className="w-[135px] h-14 rounded-lg"></div>
          </div>
          <div className="my-bg-trans flex items-center">
            <div className="w-10 h-10 rounded-full mr-3"></div>
            <div className="w-8 h-8 rounded-full"></div>
          </div>
        </div>
        <div className="px-8 mt-2 w-[90%] m-auto h-12 rounded-full"></div>
        <div className="px-4 py-4 flex gap-6 my-bg-trans overflow-x-auto">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className=" h-10 min-w-[77px] flex items-center px-4 py-2 rounded-lg shadow-md"
              ></div>
            ))}
        </div> */}
        <div className="mt-10 mb-10  my-bg-trans">
          <div className="w-[60%] h-5 rounded-xl"></div>
          <div className="w-full grid grid-cols-2 gap-4 mt-4  my-bg-trans">
            {Array(6)
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
          {/* <div className="mt-4 h-5 w-[160px]"></div> */}
        </div>
        <div className="my-bg-trans">
          <div className="w-[55%] h-5 rounded-xl"></div>
          <div className="flex space-x-4 mt-4 overflow-x-auto my-bg-trans">
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-2xl shadow-md p-2 space-x-4 min-w-[70%] md:min-w-[40%] max-w-lg"
                >
                  <div
                    className="relative w-32 h-32 rounded-lg overflow-hidden"
                    style={{ backgroundColor: "#e9e9e9" }}
                  ></div>
                  <div className="h-full flex flex-col justify-between">
                    <div
                      className="w-[90%] h-4 rounded-xl"
                      style={{ backgroundColor: "#e9e9e9" }}
                    ></div>
                    <div
                      className="w-[97px] h-4 rounded-xl"
                      style={{ backgroundColor: "#e9e9e9" }}
                    ></div>
                    {/* <div
                      className="w-[75%] h-8"
                      style={{ backgroundColor: "#e9e9e9" }}
                    ></div> */}
                    <div
                      className="w-[70%] h-5 rounded-xl"
                      style={{ backgroundColor: "#e9e9e9" }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="my-bg-trans mt-20">
          <div className="w-[60%] h-5 rounded-xl"></div>
          <div className="flex mt-4 overflow-x-auto space-x-6 my-bg-trans">
            {Array(10)
              .fill(null)
              .map((_, index) => (
            <div key={index} className="flex items-center min-w-[130px] min-h-[72px] space-x-2 rounded-full p-2">
              <div className="min-w-14 min-h-14 rounded-full flex items-center justify-between" style={{ backgroundColor: "#e9e9e9" }}></div>
              <div className="my-bg-trans my-1 flex w-full flex-col justify-between">
              <div className="w-[95%] h-2 mb-2 rounded-xl" style={{ backgroundColor: "#e9e9e9" }}></div>
                <div className="w-[80%] h-2 rounded-xl" style={{ backgroundColor: "#e9e9e9" }}></div>
              </div>
            </div>
              ))}
          </div>
        </div>
        <div className="my-bg-trans mt-20">
          <div className="flex space-x-4 my-bg-trans overflow-x-auto">
          {Array(10)
              .fill(null)
              .map((_, index) => (
            <div key={index} className="min-w-[190px] min-h-[160px] rounded-xl relative">
              <div className="my-bg-trans absolute w-full bottom-2 left-2">
              <div className="w-[70%] h-3 rounded-xl mb-2" style={{ backgroundColor: "#e9e9e9" }}></div>
              <div className="w-[60%] h-3 rounded-xl" style={{ backgroundColor: "#e9e9e9" }}></div>
              </div>
            </div>
              ))}
          </div>
        </div>
        <div className="my-bg-trans mt-20">
          <div className="w-[60%] h-5 rounded-xl"></div>
          <div className="flex mt-4 space-x-8 overflow-y-auto my-bg-trans">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col justify-center my-bg-trans">
              <div className="min-w-20 min-h-20 rounded-full"></div>
              <div className="min-w-24 h-5 rounded-xl mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Navigation */}
      <Footer />
    </>
  );
}

export default SkeletonLandingPage;
