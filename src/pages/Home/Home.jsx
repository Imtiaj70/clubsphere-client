import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import ClubCard from "../../components/shared/ClubCard";
import EventCard from "../../components/shared/EventCard";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { FiSearch, FiUsers, FiCalendar, FiAward, FiArrowRight } from "react-icons/fi";
import Hero from "./Hero";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};



// ---------- Featured Clubs ----------
const FeaturedClubs = () => {
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["featuredClubs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/featured");
      return res.data;
    },
  });

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* soft background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0b99ce]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Clubs
          </h2>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Join the most active and popular communities on ClubSphere
          </p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : clubs?.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {clubs.map((club, i) => (
              <motion.div
                key={club._id}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="transition"
              >
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No featured clubs found</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-14"
        >
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 bg-[#0b99ce] hover:bg-[#0880b0] text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            View All Clubs
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ---------- Upcoming Events ----------
const UpcomingEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/events/upcoming");
      return res.data;
    },
  });

  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Don't miss out on these exciting upcoming events</p>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, i) => (
              <motion.div key={event._id} custom={i} variants={fadeUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/events" className="btn btn-primary btn-lg gap-2">
            View All Events <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ---------- How It Works ----------
const HowItWorks = () => {
  const steps = [
    {
      icon: <FiSearch size={26} />,
      title: "Discover Clubs",
      desc: "Browse clubs by category, location, or keyword and find what truly excites you.",
    },
    {
      icon: <FiUsers size={26} />,
      title: "Join & Connect",
      desc: "Join instantly or subscribe to premium communities with secure payments.",
    },
    {
      icon: <FiCalendar size={26} />,
      title: "Attend Events",
      desc: "Register for events, meet people, and build real connections easily.",
    },
    {
      icon: <FiAward size={26} />,
      title: "Grow Together",
      desc: "Host events, build your club, and grow a strong community over time.",
    },
  ];

  return (
    <section className="relative py-28 bg-gray-50 overflow-hidden">
      {/* background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0b99ce]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Get started in just a few simple steps and become part of a growing community
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group text-center"
            >
              {/* step card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                
                {/* icon */}
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-[#0b99ce]/10 text-[#0b99ce] group-hover:bg-[#0b99ce] group-hover:text-white transition">
                  {step.icon}
                </div>

                {/* step number */}
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>

                {/* content */}
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* connector line */}
              {i !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-[-20px] w-10 h-[2px] bg-gradient-to-r from-[#0b99ce]/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Categories ----------
const Categories = () => {
  const categories = [
    { name: "Photography", emoji: "📸" },
    { name: "Sports", emoji: "⚽" },
    { name: "Tech", emoji: "💻" },
    { name: "Music", emoji: "🎵" },
    { name: "Books", emoji: "📚" },
    { name: "Hiking", emoji: "🏔️" },
    { name: "Cooking", emoji: "🍳" },
    { name: "Art", emoji: "🎨" },
  ];

  return (
    <section className="relative py-28 bg-neutral overflow-hidden">
      {/* background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Popular Categories
          </h2>
          <p className="mt-3 text-white/60 text-lg">
            Explore communities based on what you love
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={`/clubs?category=${cat.name}`}
                className="relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl 
                bg-white/5 backdrop-blur-md border border-white/10 
                hover:bg-white/10 hover:border-primary/40 
                transition-all duration-300 hover:-translate-y-2"
              >
                {/* glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-transparent transition" />

                {/* emoji bubble */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-primary/20 text-3xl transition">
                  {cat.emoji}
                </div>

                {/* text */}
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
// ---------- CTA Banner ----------
const CTABanner = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-gray-500 via-gray-300 to-black">

      {/* soft glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0b99ce]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-xl"
        >

          <span className="inline-block mb-6 px-4 py-2 rounded-full bg-[#0b99ce]/10 text-[#0b99ce] text-sm font-medium">
            🚀 Start your journey today
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0b99ce] to-pink-400">
              Perfect Club?
            </span>
          </h2>

          <p className="mt-5 text-white/70 text-lg max-w-2xl mx-auto">
            Join thousands of members already building connections, hosting events,
            and discovering new communities every day.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

            <Link to="/register">
              <button className="bg-[#0b99ce] hover:bg-[#0880b0] text-white px-7 py-3 rounded-xl font-semibold transition">
                Create Account Free
              </button>
            </Link>

            <Link to="/clubs">
              <button className="border border-white/15 text-white px-7 py-3 rounded-xl hover:bg-white/10 transition">
                Browse Clubs
              </button>
            </Link>

          </div>

        </motion.div>
      </div>
    </section>
  );
};

// ---------- Main Home ----------

// ---------- Statistics ----------
const Statistics = () => {
  const stats = [
    { value: "200+", label: "Active Clubs", emoji: "🏛️" },
    { value: "5,000+", label: "Happy Members", emoji: "😊" },
    { value: "500+", label: "Events Hosted", emoji: "🎉" },
    { value: "20+", label: "Categories", emoji: "🎯" },
  ];
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">
            ClubSphere by the Numbers
          </h2>
          <p className="text-white/70">Growing every day with passionate community members</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-white/10 backdrop-blur rounded-2xl p-6"
            >
              <p className="text-4xl mb-2">{stat.emoji}</p>
              <p className="text-3xl font-bold font-heading text-white">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Testimonials ----------
const Testimonials = () => {
  const reviews = [
    { name: "Sarah K.", role: "Photography Club Member", text: "ClubSphere helped me find an amazing photography club in my city. The events are fantastic and I've made lifelong friends!", avatar: "SK" },
    { name: "James R.", role: "Hiking Group Organizer", text: "As a club manager, managing members and events has never been easier. The dashboard is incredibly intuitive.", avatar: "JR" },
    { name: "Maria L.", role: "Book Club Member", text: "I love how easy it is to discover new clubs and register for events. The payment process is super smooth too!", avatar: "ML" },
  ];
  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">What Members Say</h2>
          <p className="section-subtitle">Real stories from our community</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-100 shadow border border-base-300 p-6"
            >
              <p className="text-4xl text-primary mb-4">"</p>
              <p className="text-base-content/70 text-sm leading-relaxed mb-5">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-base-content/40">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- FAQ ----------
const FAQ = () => {
  const faqs = [
    { q: "Is ClubSphere free to use?", a: "Joining ClubSphere is completely free. Some clubs may charge a membership fee, but browsing and registering for free events costs nothing." },
    { q: "How do I create a club?", a: "Register an account, then contact our admin to get the Club Manager role. Once approved, you can create and manage your own clubs." },
    { q: "How does payment work?", a: "We use Stripe for secure payments. Your card details are never stored on our servers — everything is handled by Stripe's secure infrastructure." },
    { q: "Can I manage multiple clubs?", a: "Yes! As a Club Manager, you can create and manage multiple clubs, each with their own events and members." },
  ];
  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about ClubSphere</p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl shadow-sm"
            >
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold">{faq.q}</div>
              <div className="collapse-content text-base-content/70 text-sm">{faq.a}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- Main Home ----------
const Home = () => (
  <div>
    <Hero />
    <FeaturedClubs />
    <Statistics />
    <HowItWorks />
    <UpcomingEvents />
    <Testimonials />
    <Categories />
    <FAQ />
    <CTABanner />
  </div>
);

export default Home;
