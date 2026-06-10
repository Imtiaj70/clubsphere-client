import { motion } from "framer-motion";
import { FiTarget, FiUsers, FiHeart, FiAward } from "react-icons/fi";

const About = () => {
  const team = [
    { name: "Alex Johnson", role: "Founder & CEO", avatar: "AJ" },
    { name: "Sarah Chen", role: "Head of Product", avatar: "SC" },
    { name: "Mike Patel", role: "Lead Developer", avatar: "MP" },
    { name: "Lisa Wang", role: "Community Manager", avatar: "LW" },
  ];

  const values = [
    { icon: <FiTarget size={28} />, title: "Our Mission", desc: "To connect people with local communities and help them discover clubs that match their passions and interests." },
    { icon: <FiUsers size={28} />, title: "Community First", desc: "Everything we build is centered around creating meaningful connections between club members and organizers." },
    { icon: <FiHeart size={28} />, title: "Passion Driven", desc: "We believe everyone deserves to find their community. ClubSphere makes that discovery effortless." },
    { icon: <FiAward size={28} />, title: "Quality Events", desc: "We empower club managers to create and manage professional events that members love to attend." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-neutral py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-heading text-white mb-4"
          >
            About <span className="text-secondary">ClubSphere</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-xl max-w-2xl mx-auto"
          >
            We're on a mission to help people discover, join, and manage local clubs — making community building simple and enjoyable.
          </motion.p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "200+", label: "Active Clubs" },
            { value: "5,000+", label: "Members" },
            { value: "50+", label: "Events Monthly" },
            { value: "20+", label: "Categories" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold font-heading text-white">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">Our core values guide everything we do at ClubSphere</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card bg-base-100 shadow border border-base-300 text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold font-heading mb-2">{v.title}</h3>
                <p className="text-base-content/60 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="py-20 bg-base-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title text-left">Our Story</h2>
              <p className="text-base-content/70 leading-relaxed mb-4">
                ClubSphere was born from a simple observation: finding and joining local clubs was unnecessarily difficult. People with shared interests couldn't easily connect, and club organizers struggled to manage their communities.
              </p>
              <p className="text-base-content/70 leading-relaxed">
                We built ClubSphere to solve this — a platform where discovery, membership, and event management all happen in one place. Whether you're into photography, hiking, tech, or cooking, your community is here.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center"
            >
              <p className="text-6xl mb-4">🌐</p>
              <p className="text-2xl font-bold font-heading">Building Communities</p>
              <p className="text-base-content/60 mt-2">One club at a time</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 bg-base-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">The passionate people behind ClubSphere</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card bg-base-100 shadow border border-base-300 p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                  {member.avatar}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-base-content/50 text-xs mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
