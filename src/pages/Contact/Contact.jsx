import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { FiMail, FiUser, FiMessageSquare, FiMapPin, FiPhone } from "react-icons/fi";

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/api/contact", data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-neutral py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-heading text-white mb-4"
          >
            Contact <span className="text-secondary">Us</span>
          </motion.h1>
          <p className="text-white/60 text-xl">Have a question? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info cards */}
          <div className="space-y-5">
            {[
              { icon: <FiMail size={22} />, title: "Email", value: "hello@clubsphere.app" },
              { icon: <FiPhone size={22} />, title: "Phone", value: "+1 (555) 000-0000" },
              { icon: <FiMapPin size={22} />, title: "Location", value: "San Francisco, CA" },
            ].map((item) => (
              <div key={item.title} className="card bg-base-100 shadow border border-base-300">
                <div className="card-body p-5 flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50">{item.title}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="card bg-primary text-white shadow">
              <div className="card-body p-5">
                <p className="font-bold font-heading mb-2">Response Time</p>
                <p className="text-white/80 text-sm">We typically respond within 24 hours on business days.</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body p-8">
                <h2 className="text-2xl font-bold font-heading mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="form-control">
                      <label className="label pb-1">
                        <span className="label-text font-medium">Your Name *</span>
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
                        <span className="label-text font-medium">Email Address *</span>
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
                  </div>

                  {/* Subject */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-medium">Subject *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      className={`input input-bordered w-full ${errors.subject ? "input-error" : ""}`}
                      {...register("subject", { required: "Subject is required" })}
                    />
                    {errors.subject && <p className="text-error text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  {/* Message */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-medium">Message *</span>
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-4 text-base-content/40" />
                      <textarea
                        rows={5}
                        placeholder="Write your message here..."
                        className={`textarea textarea-bordered w-full pl-10 ${errors.message ? "textarea-error" : ""}`}
                        {...register("message", {
                          required: "Message is required",
                          minLength: { value: 20, message: "Minimum 20 characters" },
                        })}
                      />
                    </div>
                    {errors.message && <p className="text-error text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner" />
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
