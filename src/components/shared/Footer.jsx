import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">

      {/* background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0b99ce]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20">

        {/* top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold">
              Club<span className="text-[#0b99ce]">Sphere</span>
            </h2>

            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-sm">
              Discover, join, and manage local clubs. Connect with people who share
              your passions and build meaningful communities.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white/90 font-semibold mb-5">Quick Links</h3>

            <ul className="space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/clubs", label: "Browse Clubs" },
                { to: "/events", label: "Events" },
                { to: "/register", label: "Join Now" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-[#0b99ce] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white/90 font-semibold mb-5">Connect</h3>

            <p className="text-white/60 text-sm mb-6">
              hello@clubsphere.app
            </p>

            <div className="flex gap-4">
              {[
                { icon: <FiGithub size={18} />, link: "https://github.com" },
                { icon: <FiLinkedin size={18} />, link: "https://linkedin.com" },
                { icon: <FiTwitter size={18} />, link: "https://x.com" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-[#0b99ce]/20 hover:border-[#0b99ce]/40 transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">

          <p>© {new Date().getFullYear()} ClubSphere. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0b99ce] transition">
              Privacy
            </a>
            <a href="#" className="hover:text-[#0b99ce] transition">
              Terms
            </a>
            <a href="#" className="hover:text-[#0b99ce] transition">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;