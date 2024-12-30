import Image from "next/image";

export default function TransactionDetailPage() {
  return (
    <div className="bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10 text-center">Transaction Detail</h1>
        <div className="">

          {/* card */}
          <div className="flex space-x-4 bg-gray-100 rounded-lg shadow-md p-2 mb-6">
            <Image
              src="/cover-1.png" // Placeholder image
              alt="Apartment"
              width={200}
              height={100}
              className="rounded"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-md font-bold ">Sky Dandelions Apartment</h2>
              <p className="text-gray-600 text-md">Jakarta, Indonesia</p>
              <button className="px-4 py-2 bg-white rounded-full font-bold ml-auto mt-4">Rent</button>
            </div>
          </div>

          <h3 className="font-bold mb-3">Transaction Detail</h3>
          <div className="flex rounded-lg border border-gray-200 p-4 text-sm mb-6">
            <div className="flex-auto w-64 space-y-2">
              <p>Check-in: </p>
              <p>Check-out: </p>
              <p>Owner: </p>
              <p>Transaction Type:</p>
            </div>
            <div className="flex-auto w-32 space-y-2 justify-items-end">
              <p>11/28/2021 </p>
              <p>01/28/2022</p>
              <p>Anderson</p>
              <p>Rent</p>
            </div>
          </div>

          <h3 className="font-bold mb-3">Payment Detail</h3>
          <div className="rounded-lg border border-gray-200 text-sm mb-6">
            <div className="flex  p-4">
              <div className="flex-auto w-64 space-y-2">
                <p>Period Time:</p>
                <p>Monthly Payment:</p>
                <p>Discount:</p>
              </div>
              <div className="flex-auto w-32 space-y-2 justify-items-end">
                <p>2 months</p>
                <p>$220</p>
                <p>-$88</p>
              </div>
              
            </div>
            <div className="flex bg-gray-200 p-4 font-bold text-lg">
              <div className="flex-auto w-64 space-y-2">
                <p>Total:</p>
              </div>
              <div className="flex-auto w-32 space-y-2 justify-items-end">
                <p>N31250</p>
              </div>
            </div>            
          </div>

          <h3 className="font-bold mb-3">Payment Method</h3>
          <div className="space-y-2 rounded-lg border border-gray-200 p-4 text-sm mb-6">
            <p>.......@gmail.com</p>
          </div>

          <div className="mt-6 px-5">
            <button className="bg-[#8BC83F] text-white w-full py-4 rounded-lg">
              Click here to add a review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
