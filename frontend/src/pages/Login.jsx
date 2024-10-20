import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/UserService";

const carouselItems = [
  "Transforming the way you prepare for Technical Interviews",
  "Elevate your interview skills with PeerPrep",
  "Practice makes perfect. Start your journey with us!",
];

const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Send a login request to the server
      const response = await loginUser(data);
      toast.success("Successfully Logged In");
      navigate("/dashboard");
      reset();
    } catch (error) {
      toast.error("Invalid login credentials");
      console.error(error.message);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full p-6">
      <ToastContainer />
      <div className="flex flex-row space-x-6">
        {/* Text Carousel */}
        <div className="relative h-[calc(100vh-3rem)] w-[75rem] overflow-hidden rounded-3xl bg-blue-50">
          <div className="absolute flex w-full justify-between text-white">
            <Link to="/">
              <div className="relative left-10 top-6 text-4xl font-semibold">
                PeerPrep
              </div>
            </Link>
            <Link to="/">
              <div className="relative right-8 top-6 flex items-center space-x-1 rounded-full bg-white/40 px-4 py-2 text-sm font-medium text-black hover:bg-white">
                <h1>Go to Homepage</h1>
                <ArrowUpRight size={20} />
              </div>
            </Link>
          </div>
          <img
            src="/images/abik-peravan-unsplash.jpg"
            alt="Stylized chair on a grassy hill"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            {carouselItems.map((item, index) => (
              <h2
                key={index}
                className={`absolute bottom-28 left-0 right-0 px-6 text-4xl font-semibold tracking-normal text-white transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {item}
              </h2>
            ))}
            <div className="mt-16 flex justify-center space-x-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-8 rounded-3xl transition-colors duration-300 ${
                    index === currentIndex ? "bg-white" : "bg-gray-300/70"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex h-[calc(100vh-3rem)] w-2/3 rounded-3xl border border-gray-300/30 bg-transparent">
          <div className="flex w-full flex-col items-center justify-center">
            <span className="flex space-x-3 text-2xl font-medium md:text-4xl lg:text-5xl">
              <h1 className="text-[#C6FF46]">Welcome</h1>
              <h1>back!</h1>
            </span>
            <p className="mb-4 mt-2 text-sm font-extralight tracking-wide text-gray-300">
              Enter your login details
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 w-full space-y-2 px-2 md:px-4 lg:px-[7rem]"
            >
              {/* Email */}
              <div className="w-full">
                <input
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-xl border border-gray-100/30 bg-gray-300/10 px-4 py-4 focus:outline-none focus:ring-0"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Email is not valid.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mx-2 mt-1 text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="mt-1 w-full rounded-xl border border-gray-100/30 bg-gray-300/10 px-4 py-4 focus:outline-none focus:ring-0"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password should be at least 8 characters.",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-300" />
                  ) : (
                    <Eye className="text-gray-300" />
                  )}
                </button>
                {errors.password && (
                  <p className="mx-2 mt-1 text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#C6FF46] p-2 text-xl font-medium text-black"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Link to Signup */}
            <div className="mt-4 flex space-x-1 text-sm font-extralight text-gray-300">
              <h1>Don&apos;t have an account yet? </h1>
              <Link to="/register">
                <h1 className="text-[#C6FF46] underline underline-offset-2">
                  Sign Up here
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
