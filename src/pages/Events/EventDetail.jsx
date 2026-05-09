import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers, FiCheck, FiDollarSign } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EventCheckoutForm = ({ event, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      const { data } = await axiosInstance.post("/api/registrations/create-payment-intent", {
        eventId: event._id,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
        setProcessing(false);
        return;
      }

      await axiosInstance.post("/api/registrations/confirm-payment", {
        eventId: event._id,
        paymentIntentId: result.paymentIntent.id,
      });

      toast.success("Registered for event! 🎉");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="bg-base-200 rounded-xl p-4">
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#1A1A2E" } } }} />
      </div>
      <p className="text-xs text-base-content/50">Test card: 4242 4242 4242 4242</p>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">Cancel</button>
        <button type="submit" disabled={!stripe || processing} className="btn btn-primary flex-1">
          {processing ? <span className="loading loading-spinner" /> : `Pay $${event.eventFee}`}
        </button>
      </div>
    </form>
  );
};

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPayModal, setShowPayModal] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/events/${id}`);
      return res.data;
    },
  });

  const { data: myRegs = [] } = useQuery({
    queryKey: ["myRegistrations"],
    queryFn: async () => {
      if (!user) return [];
      const res = await axiosInstance.get("/api/registrations/my");
      return res.data;
    },
    enabled: !!user,
  });

  const isRegistered = myRegs.some(
    (r) => r.eventId === id && r.status === "registered"
  );

  const registerFreeMutation = useMutation({
    mutationFn: () => axiosInstance.post("/api/registrations/register-free", { eventId: id }),
    onSuccess: () => {
      toast.success("Registered successfully!");
      queryClient.invalidateQueries(["myRegistrations"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to register"),
  });

  const handleRegister = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    if (event.isPaid) {
      setShowPayModal(true);
    } else {
      registerFreeMutation.mutate();
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!event) return <div className="text-center py-20">Event not found</div>;

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-gradient-to-r from-primary to-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {event.clubName && (
              <p className="text-white/70 text-sm mb-2 font-medium">{event.clubName}</p>
            )}
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1"><FiCalendar /> {formattedDate}</span>
              <span className="flex items-center gap-1"><FiMapPin /> {event.location}</span>
              <span className="flex items-center gap-1"><FiUsers /> {event.registrationCount || 0} registered</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h2 className="text-xl font-bold font-heading mb-3">About This Event</h2>
                <p className="text-base-content/70 leading-relaxed">{event.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 rounded-xl bg-base-200">
                    <p className="text-xs text-base-content/50 mb-1">Date</p>
                    <p className="font-semibold text-sm">{formattedDate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-base-200">
                    <p className="text-xs text-base-content/50 mb-1">Location</p>
                    <p className="font-semibold text-sm">{event.location}</p>
                  </div>
                  {event.maxAttendees && (
                    <div className="p-3 rounded-xl bg-base-200">
                      <p className="text-xs text-base-content/50 mb-1">Max Attendees</p>
                      <p className="font-semibold text-sm">{event.maxAttendees}</p>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-base-200">
                    <p className="text-xs text-base-content/50 mb-1">Fee</p>
                    <p className="font-semibold text-sm">{event.isPaid ? `$${event.eventFee}` : "Free"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card bg-base-100 shadow border border-base-300 sticky top-20">
              <div className="card-body text-center">
                <p className="text-4xl font-bold font-heading text-primary">
                  {event.isPaid ? `$${event.eventFee}` : "Free"}
                </p>
                <p className="text-base-content/50 text-sm">per person</p>

                {isRegistered ? (
                  <div className="mt-4 flex items-center justify-center gap-2 text-success font-semibold">
                    <FiCheck /> Registered
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registerFreeMutation.isPending}
                    className="btn btn-primary w-full mt-4"
                  >
                    {registerFreeMutation.isPending ? (
                      <span className="loading loading-spinner" />
                    ) : event.isPaid ? `Register - $${event.eventFee}` : "Register Free"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold font-heading mb-1">Complete Payment</h3>
            <p className="text-base-content/50 text-sm mb-5">
              Registering for <strong>{event.title}</strong>
            </p>
            <Elements stripe={stripePromise}>
              <EventCheckoutForm
                event={event}
                onSuccess={() => {
                  setShowPayModal(false);
                  queryClient.invalidateQueries(["myRegistrations"]);
                }}
                onCancel={() => setShowPayModal(false)}
              />
            </Elements>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
