import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiUsers, FiDollarSign, FiTag } from "react-icons/fi";

const ClubCard = ({ club }) => {
  const { _id, clubName, description, category, location, bannerImage, membershipFee, memberCount } = club;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300 overflow-hidden"
    >
      {/* Banner */}
      <figure className="h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={clubName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30 font-heading">
              {clubName?.[0]}
            </span>
          </div>
        )}
      </figure>

      <div className="card-body p-5">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-primary badge-sm gap-1">
            <FiTag size={10} /> {category}
          </span>
          {membershipFee > 0 ? (
            <span className="badge badge-accent badge-sm">Paid</span>
          ) : (
            <span className="badge badge-success badge-sm">Free</span>
          )}
        </div>

        <h2 className="card-title text-lg font-heading line-clamp-1">{clubName}</h2>
        <p className="text-base-content/60 text-sm line-clamp-2 flex-1">{description}</p>

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 text-sm text-base-content/50">
          <span className="flex items-center gap-1">
            <FiMapPin size={13} /> {location}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers size={13} /> {memberCount || 0} members
          </span>
        </div>

        {/* Fee + CTA */}
        <div className="card-actions items-center justify-between mt-4">
          <span className="font-bold text-primary text-lg">
            {membershipFee > 0 ? `$${membershipFee}/yr` : "Free"}
          </span>
          <Link to={`/clubs/${_id}`} className="btn btn-primary btn-sm">
            View Club
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ClubCard;
