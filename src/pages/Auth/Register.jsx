import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const Register = () => {
  const { register: registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ name, email, password, photoURL }) => {
    try {
      await registerUser(name, email, password, photoURL);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Welcome to ClubSphere!");
      navigate("/");
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">
            <div className="text-center mb-6">
              <Link to="/" className="text-3xl font-bold font-heading text-neutral">
                Club<span className="text-primary">Sphere</span>
              </Link>
              <h2 className="text-xl font-semibold mt-3">Create your account</h2>
              <p className="text-base-content/50 text-sm mt-1">Join the community today</p>
            </div>

            <button
              onClick={handleGoogle}
              className="btn btn-outline w-full gap-2 mb-4 hover:bg-base-200"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>

            <div className="divider text-base-content/40 text-xs">OR</div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                    })}
                  />
                </div>
                {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Photo URL */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Photo URL <span className="text-base-content/40">(optional)</span></span>
                </label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered w-full pl-10"
                    {...register("photoURL")}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                      validate: {
                        hasUpper: (v) => /[A-Z]/.test(v) || "Must contain uppercase letter",
                        hasLower: (v) => /[a-z]/.test(v) || "Must contain lowercase letter",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs mt-1">{errors.password.message}</p>
                )}
                <ul className="text-xs text-base-content/40 mt-1 space-y-0.5 pl-1">
                  <li>• At least 6 characters</li>
                  <li>• One uppercase & one lowercase letter</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full mt-2"
              >
                {isSubmitting ? <span className="loading loading-spinner" /> : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
