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
    <div className="bg-indigo-50 min-h-screen flex items-center justify-center">
      <section className="h-screen flex w-full">
        {/* Left: Transparent Background Image */}
        <div className="w-1/2 hidden lg:flex items-center justify-center">
          <img
            src={SignInBG}
            alt="Skill Sharing Illustration"
            className="object-contain max-w-full h-auto"
          />
        </div>

        {/* Right: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
          <div
            className="w-full max-w-md mb-2 mt-4 rounded-lg p-6"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "2px solid #E09145",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <TEInput
                type="email"
                label="Email address"
                size="lg"
                className="mb-1 border border-purple-500 rounded-lg text-white"
                style={{
                  "--tw-ring-color": "#9F5F91",
                  "--tw-ring-offset-width": "2px",
                }}
                {...register("email")}
                isInvalid={errors.email}
              ></TEInput>
              <p className="mb-6 text-sm text-red-500">
                {errors.email?.message}
              </p>

              <TEInput
                type="password"
                label="Password"
                className="mb-1 border border-purple-500 rounded-lg text-black"
                style={{
                  "--tw-ring-color": "#9F5F91",
                  "--tw-ring-offset-width": "2px",
                }}
                size="lg"
                {...register("password")}
                isInvalid={errors.password}
              ></TEInput>
              <p className="mb-6 text-sm text-red-500">
                {errors.password?.message}
              </p>

              <TERipple rippleColor="light" className="w-full">
                <button
                  type="submit"
                  className="mb-3 inline-block w-full rounded bg-yellow-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 active:bg-yellow-800 active:shadow-lg"
                >
                  {isSubmitting ? "Loading..." : "Sign In"}
                </button>
              </TERipple>

              <TERipple rippleColor="light" className="w-full">
                <button
                  onClick={() => navigate("/register")}
                  type="button"
                  className="mb-3 inline-block w-full rounded bg-yellow-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 active:bg-yellow-800 active:shadow-lg"
                >
                  Sign Up
                </button>
              </TERipple>

              <div className="my-4 flex items-center before:flex-1 before:border-t before:border-neutral-300 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold text-white">
                  OR
                </p>
              </div>

              <TERipple rippleColor="light" className="w-full">
                <div
                  onClick={handleGoogleLogin}
                  className="mb-3 flex w-full cursor-pointer items-center justify-center rounded bg-[#13A455] px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-[#0e8a3f]"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                    />
                  </svg>
                  Continue with Google
                </div>
              </TERipple>
            </form>
          </div>
          
        </div>
        
      </section>
      
      
    </div>
  );
}
