import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers } from "react-icons/fi";

const EventCard = ({ event }) => {
  const { _id, title, description, eventDate, location, isPaid, eventFee, clubName, maxAttendees } = event;

  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300"
    >
      {/* Date strip */}
      <div className="bg-primary text-white px-5 py-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium">
          <FiCalendar size={14} /> {formattedDate}
        </span>
        {isPaid ? (
          <span className="badge badge-accent badge-sm">${eventFee}</span>
        ) : (
          <span className="badge badge-success badge-sm">Free</span>
        )}
      </div>

      <div className="card-body p-5">
        <h2 className="card-title text-lg font-heading line-clamp-1">{title}</h2>
        {clubName && (
          <p className="text-primary text-xs font-medium -mt-1">{clubName}</p>
        )}
        <p className="text-base-content/60 text-sm line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mt-3 text-sm text-base-content/50">
          <span className="flex items-center gap-1">
            <FiMapPin size={13} /> {location}
          </span>
          {maxAttendees && (
            <span className="flex items-center gap-1">
              <FiUsers size={13} /> Max {maxAttendees}
            </span>
          )}
        </div>

        <div className="card-actions mt-4">
          <Link to={`/events/${_id}`} className="btn btn-primary btn-sm w-full">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
