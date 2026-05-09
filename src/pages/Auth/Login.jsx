import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "Login failed. Please try again."
      );
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Welcome!");
      navigate(from, { replace: true });
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
            {/* Header */}
            <div className="text-center mb-6">
              <Link to="/" className="text-3xl font-bold font-heading text-neutral">
                Club<span className="text-primary">Sphere</span>
              </Link>
              <h2 className="text-xl font-semibold mt-3 text-neutral">Welcome back</h2>
              <p className="text-base-content/50 text-sm mt-1">Sign in to your account</p>
            </div>

            {/* Google login */}
            <button
              onClick={handleGoogle}
              className="btn btn-outline w-full gap-2 mb-4 hover:bg-base-200"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>

            <div className="divider text-base-content/40 text-xs">OR</div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {errors.email && (
                  <p className="text-error text-xs mt-1">{errors.email.message}</p>
                )}
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
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full mt-2"
              >
                {isSubmitting ? <span className="loading loading-spinner" /> : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
