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
import SignUpBG from "../images/SignUpBG.png";



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
  } =  useForm({
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
    <div className="bg-indigo-50" style={{
      backgroundImage: `url(${SignUpBG})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
    }}>
      <section className="h-screen">
        <div className="container h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
             
            </div>

            <div className="w-8/12 md:w-full lg:ml-6 lg:w-5/12 mb-2 mt-4 rounded-lg" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", border: "2px solid #E09145" }}>
              <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
                 Create an Account
              </h2>
              <form className = " ml-6 mr-6 mt-6 mb-6" onSubmit={handleSubmit(onSubmit)}>

                {/* First Name */}
                <TEInput
                  type="text"
                  label="First Name"
                  size="lg"
                  className="mb-1"
                  {...register("firstName")}
                  isInvalid={errors.firstName}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                    {errors.firstName?.message}
                </p>

              {/* Last Name */}
                <TEInput
                  type="text"
                  label="Last Name"
                  size="lg"
                  className="mb-1"
                  {...register("lastName")}
                  isInvalid={errors.lastName}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.lastName?.message}
                </p>
             
                <TEInput
                  type="text"
                  label="User's Name"
                  size="lg"
                  className="mb-1 border border-purple-500 rounded-lg text-white"
                  style={{ "--tw-ring-color": "#9F5F91", "--tw-ring-offset-width": "2px" }}
                  {...register("username")}
                  isInvalid={errors.username}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.username?.message}
                </p>

                <TEInput
                  type="email"
                  label="Email address"
                  size="lg"
                  className="mb-1 border border-purple-500 rounded-lg text-white"
                  style={{ "--tw-ring-color": "#9F5F91", "--tw-ring-offset-width": "2px" }}
                  {...register("email")}
                  isInvalid={errors.email}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.email?.message}
                </p>

              
                <TEInput
                  type="password"
                  label="Password"
                  className="mb-1 border border-yellow-500 rounded-lg text-white"
                  style={{ "--tw-ring-color": "#9F5F91", "--tw-ring-offset-width": "2px" }}
                  {...register("password")}
                  isInvalid={errors.password}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.password?.message}
                </p>

                <TEInput
                  type="number"
                  label="Phone Number"
                  size="lg"
                  className="mb-1 border border-purple-500 rounded-lg text-white"
                  style={{ "--tw-ring-color": "#9F5F91", "--tw-ring-offset-width": "2px" }}
                  {...register("phone")}
                  isInvalid={errors.phone}
                ></TEInput>
                <p className="mb-6 text-sm text-red-500">
                  {errors.phone?.message}
                </p>

                <div className="mb-3 w-96">
                  <label
                    htmlFor="formFile"
                    className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
                  >
                    Select the Profile Picture
                  </label>
                  <input
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-200 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-yellow-500 file:px-3 file:py-[0.32rem] file:text-white file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-yellow-700 focus:border-primary focus:text-neutral-900 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    id="formFile"
                    onChange={onImageChange}
                  />
                  <p className="mb-6 text-sm text-red-500">
                    {errors.image?.message}
                  </p>
                </div>

                <TERipple rippleColor="light" className="w-full">
                  <button
                    type="submit"
                    className="mb-3 inline-block w-full rounded bg-yellow-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-yellow-500 hover:shadow-lg focus:bg-yellow-700 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 active:bg-yellow-700 active:shadow-lg dark:shadow-md dark:hover:shadow-lg dark:focus:shadow-lg dark:active:shadow-lg"
                  >
                    {isSubmitting ? "Loading..." : "Register"}
                  </button>
                </TERipple>

                <TERipple rippleColor="light" className="w-full">
                  <button
                    onClick={() => navigate("/login")}
                    className="mb-3 inline-block w-full rounded bg-yellow-500 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-yellow-500 hover:shadow-lg focus:bg-yellow-500 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 active:bg-yellow-700 active:shadow-lg dark:shadow-md dark:hover:shadow-lg dark:focus:shadow-lg dark:active:shadow-lg"
                  >
                    Sign in
                  </button>
                </TERipple>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;