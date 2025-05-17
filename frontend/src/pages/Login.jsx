import React from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import SignInBG from "../images/SignInBG.png";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data) => {
    const user = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post(`http://localhost:8080/users/login`, user);
      if (res.status === 200) {
        toast.success("Login successfully");
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    // CHANGED: Updated the main container to use flex-row-reverse to swap positions
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5dade2] to-[#80c4ef] p-4">
  <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
    {/* Left Column - Visual Section */}
    <div className="hidden lg:block w-6/12 bg-gradient-to-b from-[#5dade2] to-[#6fb5e8] p-6">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <img 
          src={SignInBG} 
          alt="Learning illustration" 
          className="w-full max-w-[280px] object-cover rounded-xl shadow-lg mb-5 transform hover:scale-105 transition-transform duration-300"
        />
        <h3 className="text-xl font-bold text-white mb-3">Join Our Community</h3>
        <p className="text-white/90 text-sm px-4">
          Connect with experts and enhance your skills through collaborative learning
        </p>
      </div>
    </div>

    {/* Right Column - Form Section */}
    <div className="w-full lg:w-6/12 p-8">
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#5dade2]/10 rounded-xl mb-3 animate-pulse">
            <svg className="w-7 h-7 text-[#5dade2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to continue learning</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#5dade2] transition-colors pb-1 group">
              <svg className="w-5 h-5 text-gray-400 mr-3 group-focus-within:text-[#5dade2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <input
                type="email"
                {...register("email")}
                placeholder="Email address"
                className="w-full py-2 focus:outline-none placeholder-gray-400 text-sm bg-transparent"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#5dade2] transition-colors pb-1 group">
              <svg className="w-5 h-5 text-gray-400 mr-3 group-focus-within:text-[#5dade2] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full py-2 focus:outline-none placeholder-gray-400 text-sm bg-transparent"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-[#5dade2] rounded focus:ring-[#5dade2] transition-colors"
              />
              <span className="text-gray-600 hover:text-gray-800 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-[#5dade2] hover:text-[#3a89ba] transition-colors">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out 
              bg-gradient-to-r from-[#5dade2] to-[#4a9dce] hover:from-[#4a9dce] hover:to-[#3a89ba] 
              shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-95"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-transparent" />
                <span>Signing In...</span>
              </div>
            ) : "Sign In"}

            
          </button>
          <TERipple rippleColor="light" className="w-full">
                <button
                  onClick={() => navigate("/register")}
                  type="button"
                  className="mb-3  text-[#5dade2] hover:text-[#3a89ba] transition-colors"
                >
                  Create Account
                </button>
              </TERipple>
          {/* Social Login */}
          <div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-400 text-xs">Or continue with</span>
              </div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-2.5 rounded-lg text-sm
                bg-white hover:bg-gray-50 transition-colors duration-300
                border-2 border-gray-200 hover:border-[#5dade2]/30
                shadow-sm hover:shadow-md transform hover:scale-[1.005] active:scale-95"
            >
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.7663 12.2764C23.7663 11.4607 23.6999 10.6406 23.5588 9.83807H12.2402V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                  fill="#34A853"
                />
                <path
                  d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                  fill="#FBBC04"
                />
                <path
                  d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  );
}
