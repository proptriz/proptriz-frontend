"use client";

// components/LoginPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import Link from "next/link";
import Image from "next/image";
import { FaApple, FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import {
  EmailInput,
  PasswordInput,
  TextInput,
} from "@/components/shared/Input";
import { IoChevronForward } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import userAPI from "@/services/userApi";
import { toast } from "react-toastify";

const Inputs = [
  {
    id: 1,
    maxLenght: 1,
    name: "first",
  },
  {
    id: 2,
    maxLenght: 1,
    name: "second",
  },
  {
    id: 3,
    maxLenght: 1,
    name: "third",
  },
  {
    id: 4,
    maxLenght: 1,
    name: "fourth",
  },
];

const ConfirmCodePage: React.FC = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const InputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState("");

  const router = useRouter();
  const [value, setValue] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
  });

  const [loading, setLoading] = useState({
    verify: false,
    resend: false,
  });
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [time, setTime] = useState(300);
  useEffect(() => {
    if (time === 0) return;

    const timer = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m:${seconds}s`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string
  ) => {
    // const { value } = e.target;

    setValue({ ...value, [name]: e.target.value.trim() });

    if (e.target.value.length === 1 && index < InputRefs.current.length - 1) {
      InputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      (e.target as HTMLInputElement).value === ""
    ) {
      InputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    let hasError = false;
    InputRefs.current.forEach((input, index) => {
      if (input && input.value.trim() === "") {
        input.style.borderColor = "red";
        hasError = true;
      } else if (input) {
        input.style.borderColor = "#61AF74";
      }
    });

    if (hasError) {
      setError(true);
      return;
    }

    const code = `${value.first}${value.second}${value.third}${value.fourth}`;

    if (
      value.first !== "" &&
      value.second &&
      value.third !== "" &&
      value.fourth !== ""
    ) {
      try {
        setLoading({ ...loading, verify: true });
        setErrMsg("");
        const user = await userAPI.verifyOtp({ code, email });
        if (user?.success == true) {
          setLoading({ ...loading, verify: false });
           toast.success("OTP verified successfully! Redirecting...");
          router.push("/profile/login");
        } else {
          InputRefs.current.forEach((input, index) => {
            if (input) {
              input.style.borderColor = "red";
            }
          });

          setErrMsg(user?.message as string);
        }
      } catch (error) {
        InputRefs.current.forEach((input, index) => {
          if (input) {
            input.style.borderColor = "red";
          }
        });
        console.error("Error verifying OTP:", error);
        setErrMsg("Invalid OTP. Please try again.");
        return;
      } finally {
        setLoading({ ...loading, verify: false });
      }
    }

    // router.push("/profile/signup/select-location")
  };

  const handleResendOtp = async () => {
    try {
      setLoading({ ...loading, resend: true });
      const response = await userAPI.resendOtp({email});
      if (response?.success) {
        setTime(300);
         toast.success("OTP resent successfully!");
        // updateTimer(300);
        setLoading({ ...loading, resend: false });
      }
    } catch (err: any) {
      console.log(err.message);
      setLoading({ ...loading, resend: false });
    }
  };

  // const handleSignup = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Logging in with:", { code });
  // };

  // const handleSocialLogin = (provider: string) => {
  //   console.log(`Log in with ${provider}`);
  // };

  return (
    <div className="flex justify-center min-h-screen overflow-hidden relative">
      <div className="w-full max-w-md rounded-lg p-8">
        {/* <h1 className="text-3xl font-bold mt-10 mb-10">
          Enter Received 4-Digit Code
        </h1> */}
        <h4 className="text-3xl font-bold text-center">Please check your email</h4>
        <p className="text-center text-xl text-[#9ea8b5]">
          We&apos;ve sent a code to your registered mail
        </p>
        <p className="text-center text-[14px] text-[#9ea8b5] mb-5 mt-2">
          The OTP will expire in {formatTime(time)}
        </p>
        {/* <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-green font-medium mb-1">
              Code
            </label>
            <input
              type="number"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-gray-400 bg-transparent"
            />
          </div>
          <div className="flex justify-items-between items-center w-full mt-3">
            <Link href={"#"} className="text-green text-sm">
              Resend Code
            </Link>
            <button
              className="ml-auto p-5 text-xl bg-green rounded-full shadow-md text-white"
              onClick={() => router.push("/profile/signup/select-location")}
            >
              <IoChevronForward className="text-3xl" />
            </button>
          </div>
        </form> */}
        <div className="flex justify-between gap-3 w-max ml-auto mr-auto">
          {Inputs.map((input, index) => (
            <div key={index}>
              <input
                className={`bg-transparent w-full max-w-[60px] p-1 h-16 text-[30px] text-center rounded-lg border-solid border-[green] focus:outline-[green] border-[1px] font-bold mt-1`}
                type="text"
                value={value[input["name"] as keyof typeof value]}
                onChange={(e) => handleChange(e, index, input.name)}
                maxLength={1}
                ref={(el: HTMLInputElement | null) => {
                  InputRefs.current[index] = el;
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>
        <div className="text-center font-bold mt-2 text-red-700">{errMsg}</div>
        <div className="mt-2">
          <div className="text-[13px] text-center flex justify-center items-center text-[--side-text-color]">
            Didn&apos;t get the code?{" "}
            {loading.resend ? (
              <CgSpinner size={20} className="animate-spin ml-2" />
            ) : (
              <span
                className="underline text-green cursor-pointer ml-2"
                onClick={handleResendOtp}
              >
                Click to send
              </span>
            )}
          </div>
        </div>
        <button
          className="ml-auto mr-auto mt-5 p-4 text-xl bg-green rounded-lg shadow-md text-white flex gap-2 items-center"
          onClick={handleVerify}
        >
          {
            loading.verify ? <CgSpinner size={25} className="animate-spin" /> : <><span>verify</span> <IoChevronForward /></> 
          }
          
        </button>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 mx-auto z-10">
            <Image
              src={"/icon/spiral.png"}
              alt={"spiral"}
              width={400}
              height={300}
              className="ml-7"
            />
          </div>
        </div>
        <div className="text-center mt-32">
          <img src="/banner.png" alt="Logo" className="mx-auto h-16 mb-4" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmCodePage;
