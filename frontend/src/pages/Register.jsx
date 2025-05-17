import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TEInput, TERipple } from "tw-elements-react";
import * as yup from "yup";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebase";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";


const formSchema = yup.object().shape({
  firstName: yup.string().required("First name is required").min(2),
  lastName: yup.string().required("Last name is required").min(2),
  username: yup.string().required().min(3),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  phone: yup.string().required().min(10),
});

const storage = getStorage(app);

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  function onImageChange(e) {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("image", {
        type: "manual",
        message: "Please select at least one image",
      });
    }

    const currentFile = selectedFiles[0];
    setImage(currentFile);
  }

  const onSubmit = async (data) => {
    if (!image) {
      setError("image", {
        type: "manual",
        message: "Please select at least one image",
      });
      return;
    }

    const imageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      name: data.username,
      email: data.email,
      password: data.password,
      mobileNumber: data.phone,
      profileImage: imageUrl,
    };

    console.log(newUser);
    try {
      const response = await axios.post(
        `http://localhost:8080/users/register`,
        newUser
      );
      if (response.data) {
        toast.success("User created successfully");
        navigate("/login");
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundColor: "#5dade2",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-md w-full space-y-8">
        <div 
          className="bg-blue-50 rounded-xl shadow-xl overflow-hidden p-6 border-t-4 border-blue-500"
        >
          <h2 className="text-2xl font-extrabold text-center text-blue-600 mb-6">
            Join our Learning Community
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <TEInput
                  type="text"
                  label="First Name"
                  size="lg"
                  className="mb-1"
                  {...register("firstName")}
                  isInvalid={errors.firstName}
                ></TEInput>
                <p className="text-xs text-red-500">
                  {errors.firstName?.message}
                </p>
              </div>

              {/* Last Name */}
              <div>
                <TEInput
                  type="text"
                  label="Last Name"
                  size="lg"
                  className="mb-1"
                  {...register("lastName")}
                  isInvalid={errors.lastName}
                ></TEInput>
                <p className="text-xs text-red-500">
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
            
            <div>
              <TEInput
                type="text"
                label="Username"
                size="lg"
                className="mb-1"
                {...register("username")}
                isInvalid={errors.username}
              ></TEInput>
              <p className="text-xs text-red-500">
                {errors.username?.message}
              </p>
            </div>

            <div>
              <TEInput
                type="email"
                label="Email address"
                size="lg"
                className="mb-1"
                {...register("email")}
                isInvalid={errors.email}
              ></TEInput>
              <p className="text-xs text-red-500">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <TEInput
                type="password"
                label="Password"
                className="mb-1"
                {...register("password")}
                isInvalid={errors.password}
              ></TEInput>
              <p className="text-xs text-red-500">
                {errors.password?.message}
              </p>
            </div>

            <div>
              <TEInput
                type="number"
                label="Phone Number"
                size="lg"
                className="mb-1"
                {...register("phone")}
                isInvalid={errors.phone}
              ></TEInput>
              <p className="text-xs text-red-500">
                {errors.phone?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="formFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </label>
              <input
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                id="formFile"
                onChange={onImageChange}
              />
              <p className="text-xs text-red-500 mt-1">
                {errors.image?.message}
              </p>
            </div>

            <div className="pt-4">
              <TERipple rippleColor="light" className="w-full">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </TERipple>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;