import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";

/**
 * Statistics Section Component
 * Social proof with animated counters
 */
const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: Users,
      value: "3,000+",
      label: "Active Users",
      description: "Businesses trusting SheetTree",
      color: "from-purple-500 to-purple-600",
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      value: "180K+",
      label: "Forms Created",
      description: "And counting every day",
      color: "from-cyan-500 to-cyan-600",
      delay: 0.2,
    },
    {
      icon: DollarSign,
      value: "24%",
      label: "Time Saved",
      description: "Average efficiency gain",
      color: "from-green-500 to-green-600",
      delay: 0.3,
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Uptime",
      description: "Reliable and always available",
      color: "from-yellow-500 to-orange-600",
      delay: 0.4,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-purple-400 font-semibold mb-3 uppercase tracking-wide"
          >
            Trusted Worldwide
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Why they prefer SheetTree
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Join thousands of businesses already running on SheetTree
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: stat.delay, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className="text-5xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: stat.delay + 0.3, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.div>

                  {/* Label */}
                  <div className="text-xl font-semibold mb-2 text-gray-200">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Quote Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
                💬
              </div>

              <div>
                {/* Quote */}
                <p className="text-xl text-gray-200 mb-6 leading-relaxed italic">
                  "SheetTree transformed how we collect customer data. What used
                  to take hours now happens automatically. It's like having a
                  full-time data entry team for free!"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Sarah Chen</div>
                    <div className="text-gray-400">CEO, TechStart Inc.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
