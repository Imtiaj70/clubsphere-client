import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMapPin, FiUsers, FiTag, FiCalendar, FiDollarSign, FiCheck } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Stripe checkout form ───────────────────────────────────────────────────
const CheckoutForm = ({ club, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Create payment intent on server
      const { data } = await axiosInstance.post("/api/memberships/create-payment-intent", {
        clubId: club._id,
      });

      // 2. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
        setProcessing(false);
        return;
      }

      // 3. Confirm on backend → creates membership
      await axiosInstance.post("/api/memberships/confirm-payment", {
        clubId: club._id,
        paymentIntentId: result.paymentIntent.id,
      });

      toast.success("Membership activated! Welcome to the club 🎉");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Card Details</p>
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#1A1A2E", "::placeholder": { color: "#aab7c4" } },
            },
          }}
        />
      </div>
      <p className="text-xs text-base-content/50">Use test card: 4242 4242 4242 4242, any future date, any CVC</p>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={!stripe || processing} className="btn btn-primary flex-1">
          {processing ? <span className="loading loading-spinner" /> : `Pay $${club.membershipFee}`}
        </button>
      </div>
    </form>
  );
};

// ── Main ClubDetail ────────────────────────────────────────────────────────
const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPayModal, setShowPayModal] = useState(false);

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/clubs/${id}`);
      return res.data;
    },
  });

  const { data: myMemberships = [] } = useQuery({
    queryKey: ["myMemberships"],
    queryFn: async () => {
      if (!user) return [];
      const res = await axiosInstance.get("/api/memberships/my");
      return res.data;
    },
    enabled: !!user,
  });

  const isAlreadyMember = myMemberships.some(
    (m) => m.clubId === id && m.status === "active"
  );

  const joinFreeMutation = useMutation({
    mutationFn: () => axiosInstance.post("/api/memberships/join-free", { clubId: id }),
    onSuccess: () => {
      toast.success("Joined club successfully!");
      queryClient.invalidateQueries(["myMemberships"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to join"),
  });

  const handleJoin = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    if (club.membershipFee > 0) {
      setShowPayModal(true);
    } else {
      joinFreeMutation.mutate();
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!club) return <div className="text-center py-20">Club not found</div>;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Banner */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        {club.bannerImage ? (
          <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-9xl font-bold text-primary/20 font-heading">{club.clubName?.[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge badge-secondary mb-2">{club.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white">{club.clubName}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h2 className="text-xl font-bold font-heading mb-3">About This Club</h2>
                <p className="text-base-content/70 leading-relaxed">{club.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: <FiMapPin />, label: "Location", value: club.location },
                    { icon: <FiUsers />, label: "Members", value: `${club.memberCount || 0} active` },
                    { icon: <FiTag />, label: "Category", value: club.category },
                    {
                      icon: <FiDollarSign />,
                      label: "Membership",
                      value: club.membershipFee > 0 ? `$${club.membershipFee}/year` : "Free",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-base-200">
                      <span className="text-primary mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-xs text-base-content/50">{item.label}</p>
                        <p className="font-semibold text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar join card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card bg-base-100 shadow border border-base-300 sticky top-20">
              <div className="card-body text-center">
                <p className="text-4xl font-bold font-heading text-primary">
                  {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                </p>
                {club.membershipFee > 0 && (
                  <p className="text-base-content/50 text-sm">per year</p>
                )}

                {isAlreadyMember ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2 text-success font-semibold mb-2">
                      <FiCheck /> You're a member
                    </div>
                    <p className="text-xs text-base-content/50">You have active membership</p>
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joinFreeMutation.isPending}
                    className="btn btn-primary w-full mt-4"
                  >
                    {joinFreeMutation.isPending ? (
                      <span className="loading loading-spinner" />
                    ) : club.membershipFee > 0 ? (
                      `Join for $${club.membershipFee}`
                    ) : (
                      "Join Free"
                    )}
                  </button>
                )}

                <ul className="text-left mt-4 space-y-2 text-sm text-base-content/60">
                  <li className="flex items-center gap-2"><FiCheck className="text-success" /> Access all club events</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-success" /> Connect with members</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-success" /> Get club announcements</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold font-heading mb-1">Complete Payment</h3>
            <p className="text-base-content/50 text-sm mb-5">
              Joining <strong>{club.clubName}</strong> for ${club.membershipFee}/year
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                club={club}
                onSuccess={() => {
                  setShowPayModal(false);
                  queryClient.invalidateQueries(["myMemberships"]);
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

export default ClubDetail;
