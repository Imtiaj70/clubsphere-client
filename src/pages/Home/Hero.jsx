import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const slides = [
  {
    title: "Discover Your",
    highlight: "Perfect Club",
    subtitle:
      "Browse hundreds of local clubs, join communities you love, and never miss exciting events.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
  {
    title: "Start & Grow",
    highlight: "Your Community",
    subtitle:
      "Create events, connect with members, and build a thriving local community.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Hero = () => {
  return (
    <section className="relative w-full py-24 bg-gray-100 overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0b99ce]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
              <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

                {/* Left Content */}
                <div className="lg:flex-1 text-center lg:text-left">
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.span
                      variants={fadeUp}
                      className="inline-block px-5 py-2 rounded-full bg-[#0b99ce]/10 text-[#0b99ce] font-semibold text-sm"
                    >
                      🎉 Find your community today
                    </motion.span>

                    <motion.h1
                      variants={fadeUp}
                      className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
                    >
                      {slide.title}
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-[#0b99ce]">
                        {slide.highlight}
                      </span>
                    </motion.h1>

                    <motion.p
                      variants={fadeUp}
                      className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.div
                      variants={fadeUp}
                      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                      <Link to="/clubs">
                        <button className="bg-[#0b99ce] hover:bg-[#0880b0] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition">
                          <FiSearch />
                          Browse Clubs
                        </button>
                      </Link>

                      <Link to="/register">
                        <button className="border border-gray-300 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-200 transition">
                          Get Started Free
                        </button>
                      </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                      variants={fadeUp}
                      className="flex flex-wrap gap-8 pt-4 justify-center lg:justify-start"
                    >
                      {[
                        { label: "Active Clubs", value: "200+" },
                        { label: "Members", value: "5K+" },
                        { label: "Events Monthly", value: "50+" },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Image */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="lg:flex-1 flex justify-center"
                >
                  <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={slide.image}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;