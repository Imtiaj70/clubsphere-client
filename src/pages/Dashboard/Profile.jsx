import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiImage, FiShield } from "react-icons/fi";

const Profile = () => {
  const { user, dbUser, refetchDbUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  const onSubmit = async ({ name, photoURL }) => {
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      await axiosInstance.patch("/api/auth/profile", { name, photoURL });
      await refetchDbUser();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const roleBadge = {
    admin: "badge-error",
    clubManager: "badge-warning",
    member: "badge-success",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">My Profile</h1>
        <p className="text-base-content/50 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Profile card */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body p-6">
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-base-300">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6C63FF&color=fff&size=80`}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
            />
            <div>
              <h2 className="text-xl font-bold font-heading">{user?.displayName}</h2>
              <p className="text-base-content/50 text-sm">{user?.email}</p>
              <span className={`badge badge-sm mt-2 ${roleBadge[dbUser?.role] || "badge-success"}`}>
                {dbUser?.role}
              </span>
            </div>
          </div>

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
                  className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email - readonly */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input input-bordered w-full pl-10 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-base-content/40 mt-1">Email cannot be changed</p>
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Photo URL</span>
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

            {/* Role - readonly */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Role</span>
              </label>
              <div className="relative">
                <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={dbUser?.role}
                  disabled
                  className="input input-bordered w-full pl-10 opacity-60 cursor-not-allowed capitalize"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-2"
            >
              {isSubmitting ? <span className="loading loading-spinner" /> : "Update Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* Account info */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body p-6">
          <h3 className="font-bold font-heading mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/50">Member since</span>
              <span className="font-medium">
                {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-base-300">
              <span className="text-base-content/50">Account type</span>
              <span className="font-medium capitalize">{dbUser?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-base-content/50">Login method</span>
              <span className="font-medium">
                {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email/Password"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
