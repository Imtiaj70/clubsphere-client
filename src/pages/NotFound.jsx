import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <p className="text-9xl font-bold font-heading text-primary/20">404</p>
      <h1 className="text-3xl font-bold font-heading text-neutral">Page Not Found</h1>
      <p className="text-base-content/50 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
