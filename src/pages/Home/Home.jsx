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
const Home = () => (
  <div>
    <Hero></Hero>
    <FeaturedClubs />
    <HowItWorks />
    <UpcomingEvents />
    <Categories />
    <CTABanner />
  </div>
);

export default Home;
