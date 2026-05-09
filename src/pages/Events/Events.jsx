import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import EventCard from "../../components/shared/EventCard";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const Events = () => {
  const [sort, setSort] = useState("soonest");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", sort],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/events?sort=${sort}`);
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-neutral py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading text-white mb-3"
          >
            Upcoming Events
          </motion.h1>
          <p className="text-white/60 text-lg">Find events that excite you</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Sort bar */}
        <div className="bg-base-100 rounded-2xl shadow-md p-4 mb-8 border border-base-300 flex justify-end">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered w-48"
          >
            <option value="soonest">Soonest First</option>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-xl font-semibold">No upcoming events</p>
            <p className="text-base-content/50 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
