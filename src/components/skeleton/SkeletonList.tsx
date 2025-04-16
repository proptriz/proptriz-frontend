import React from 'react'

function SkeletonList() {
  return (
    <>
      <div className="pt-5 pb-16 px-4 my-bg-trans skeleton">
        {/* <div className="flex w-full items-center py-3 my-bg-trans">
          <div className="flex-1 my-bg-trans"></div>
          <div className="flex-1 my-bg-trans ">
            <div className="w-[135px] ml-auto mr-auto h-14 rounded-lg"></div>
          </div>
          <div className="flex-1 my-bg-trans flex items-center">
            <div className="w-8 h-8 rounded-full ml-auto"></div>
          </div>
        </div> */}
        <div className="mt-10 mb-10  my-bg-trans">
          <div className="w-[60%] h-5 rounded-xl"></div>
          <div className="w-full grid grid-cols-2 gap-4 mt-4  my-bg-trans">
            {Array(9)
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
      </div>
    </>
  )
}

export default SkeletonList