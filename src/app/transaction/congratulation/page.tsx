export default function CongratulationPage() {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-7">Congratulations</h1>
        <div className="bg-green-100 p-6 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            className="w-16 h-16 text-green-600"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.293-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-gray-600 mt-2 font-bold">Successfully purchased a house</p>
        <button className="mt-6 bg-gray-100 text-white px-6 py-2 rounded">
          Go to Home
        </button>
      </div>
    );
  }
  