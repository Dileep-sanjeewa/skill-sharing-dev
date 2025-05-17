import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TEInput, TETextarea } from "tw-elements-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../db/firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";


const storage = getStorage(app);

const formSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const getVideoDurationInSeconds = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      resolve(duration);
    };
    video.onerror = (error) => {
      reject(error);
    };
    video.src = URL.createObjectURL(file);
  });
};

const Post = () => {
  const [imageSelected, setImageSelected] = useState(true);
  const [videoSelected, setVideoSelected] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [user, setUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [post, setPost] = useState(null);
  const [editPost, setEditPost] = useState(false);

  const navigate = useNavigate();

  const { postId } = useParams();

  useEffect(() => {
    const fetchSinglePost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/posts/${postId}`
        );
        setPost(data);

        if (data.video) {
          setVideoSelected(true);
          setImageSelected(false);
        }

        if (data.images.length > 0) {
          setImageSelected(true);
          setVideoSelected(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (postId) {
      fetchSinglePost();
      setEditPost(true);
    } else {
      setEditPost(false);
      setPost(null);
    }
  }, [postId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e) {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("images", {
        type: "manual",
        message: "Please select at least one image",
      });
      setImages([]);
      return;
    }

    if (selectedFiles.length > 3) {
      setError("images", {
        type: "manual",
        message: "Maximum of 3 images allowed",
      });
    } else {
      clearErrors("images");
      setImages([...selectedFiles]);
    }
  }

  function onVideoChange(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      getVideoDurationInSeconds(selectedFile).then((duration) => {
        if (duration > 30) {
          setError("video", {
            type: "manual",
            message: "Video duration should be less than 30 seconds",
          });
        } else {
          clearErrors("video");
          setVideo(selectedFile);
          setVideoURL(URL.createObjectURL(selectedFile));
        }
      });
    }
  }

  const onSubmit = async (data) => {
    if (!editPost) {
      if (!imageSelected && !video) {
        setError("video", {
          type: "manual",
          message: "Video is required",
        });
        return;
      }

      if (!videoSelected && images.length === 0) {
        setError("images", {
          type: "manual",
          message: "Please select at least one image",
        });
        return;
      }
    }

    console.log(user);
    if (user) {
      if (imageSelected) {
        const imageUrls = [];

        for (const image of images) {
          const imageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(imageRef, image);
          const imageUrl = await getDownloadURL(imageRef);
          imageUrls.push(imageUrl);
        }

        const updatePost = {
          id: postId,
          title: data.title,
          description: data.description,
          images: imageUrls.length > 0 ? imageUrls : post.images,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        const postData = {
          title: data.title,
          description: data.description,
          images: imageUrls,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        if (editPost) {
          try {
            const res = await axios.put(
              `http://localhost:8080/posts`,
              updatePost
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post updated successfully");
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(postData);
          try {
            const res = await axios.post(
              "http://localhost:8080/posts",
              postData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post uploaded successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }

      if (videoSelected) {
        let videoUrl = null;

        if (video) {
          const videoRef = ref(storage, `videos/${video.name}`);
          await uploadBytes(videoRef, video);
          videoUrl = await getDownloadURL(videoRef);
        }

        const updateData = {
          id: postId,
          title: data.title,
          description: data.description,
          video: videoUrl ? videoUrl : post.video,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        const videoPostData = {
          title: data.title,
          description: data.description,
          video: videoUrl,
          userId: user.id,
          username: user.name,
          userProfile: user.profileImage,
        };

        if (editPost) {
          try {
            const res = await axios.put(
              `http://localhost:8080/posts`,
              updateData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post updated successfully");
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const res = await axios.post(
              "http://localhost:8080/posts",
              videoPostData
            );
            console.log(res);
            setIsUploadSuccess(true);
            navigate("/");
            toast.success("Post uploaded successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  useEffect(() => {
    setValue("title", "");
    setValue("description", "");
    setVideo(null);
    setVideoURL(null);
    setImageURLs([]);
    setImages([]);
    // eslint-disable-next-line
  }, [imageSelected, videoSelected, isUploadSuccess]);

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("description", post.description);
      setVideoURL(post.video);
      setImageURLs(post.images);
    }
    // eslint-disable-next-line
  }, [post, postId]);

  return (
    <Layout>
     <div style={{ backgroundColor: "#5dade2" }} className="min-h-screen p-4">
  <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
    <h1 className="text-4xl text-[#2c5364] font-bold mb-8 text-center tracking-tighter">
      {editPost ? "Refine Your Post ✍️" : "Share Your Story 📝"}
    </h1>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title Input */}
      <div className="group">
        <TEInput
          type="text"
          label="Post Title"
          {...register("title")}
          className={`text-lg rounded-xl bg-white/50 transition-all ${
            errors.title 
              ? "border-2 border-rose-400" 
              : "border-2 border-[#5dade2]/30 focus:border-[#5dade2]"
          }`}
          labelClassName="text-[#2c5364] group-focus-within:text-[#5dade2] font-medium"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-rose-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description Input */}
      <div className="group">
        <TETextarea
          rows={5}
          label="Your Story"
          {...register("description")}
          className={`rounded-xl text-lg bg-white/50 transition-all `}
          labelClassName="text-[#2c5364] group-focus-within:text-[#5dade2] font-medium"
          placeholder="Share your thoughts, ideas, or experiences..."
        />
        {errors.description && (
          <p className="mt-2 text-sm text-rose-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Media Selector */}
      {!editPost && (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setImageSelected(true);
              setVideoSelected(false);
              clearErrors("media");
            }}
            className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              imageSelected 
                ? "bg-[#5dade2] text-white shadow-lg" 
                : "bg-white/80 text-[#2c5364] hover:bg-[#5dade2]/10 border-2 border-[#5dade2]/20"
            }`}
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image Upload
          </button>
          <button
            type="button"
            onClick={() => {
              setImageSelected(false);
              setVideoSelected(true);
              clearErrors("media");
            }}
            className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              videoSelected 
                ? "bg-[#5dade2] text-white shadow-lg" 
                : "bg-white/80 text-[#2c5364] hover:bg-[#5dade2]/10 border-2 border-[#5dade2]/20"
            }`}
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Video Upload
          </button>
        </div>
      )}

      {/* Media Upload Section */}
      <div className="space-y-6">
        {imageSelected ? (
          <div className={`border-2 border-dashed rounded-xl p-6 transition-all bg-white/50 ${
            errors.media ? "border-rose-400" : "border-[#5dade2]/30 hover:border-[#5dade2]"
          }`}>
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <div className="text-center">
                <svg className="w-12 h-12 text-[#5dade2] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#2c5364] mb-2 font-medium">Drag & drop images or click to upload</p>
                <p className="text-sm text-[#5dade2]">(Up to 3 images, JPEG/PNG)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageChange}
                className="hidden"
              />
            </label>
            
            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {imageURLs.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg transform group-hover:scale-105 transition-all border-2 border-[#5dade2]/20"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`border-2 border-dashed rounded-xl p-6 transition-all bg-white/50 ${
            errors.media ? "border-rose-400" : "border-[#5dade2]/30 hover:border-[#5dade2]"
          }`}>
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <div className="text-center">
                <svg className="w-12 h-12 text-[#5dade2] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-[#2c5364] mb-2 font-medium">Drag & drop video or click to upload</p>
                <p className="text-sm text-[#5dade2]">(Max 30 seconds, MP4 format)</p>
              </div>
              <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                onChange={onVideoChange}
                className="hidden"
              />
            </label>

            {/* Video Preview */}
            {videoURL && (
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-[#5dade2]/20">
                <video
                  controls
                  className="w-full rounded-lg transform hover:scale-[1.02] transition-all"
                >
                  <source src={videoURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}

        {errors.media && (
          <p className="text-sm text-rose-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.media.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 bg-gradient-to-r from-[#5dade2] to-[#2c97d1] hover:from-[#4ca1d9] hover:to-[#2380c4] text-white font-semibold rounded-xl transition-all 
                   transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Publishing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {editPost ? "Update Post" : "Publish Now"}
          </>
        )}
      </button>
    </form>
  </div>
</div>
    </Layout>
  );
};
export default Post;