import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FileText,
  Zap,
  Shield,
  Cloud,
  Bell,
  Webhook,
  Code,
  BarChart3,
} from "lucide-react";

/**
 * Features Section Component
 * Showcase core features with scroll animations
 */
const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: FileText,
      title: "Custom Form Builder",
      description:
        "Create beautiful forms with drag-and-drop simplicity. 8+ field types, conditional logic, and custom validation.",
      color: "from-purple-500 to-purple-600",
      delay: 0.1,
    },
    {
      icon: Cloud,
      title: "Google Sheets Integration",
      description:
        "Automatically sync form submissions to Google Sheets in real-time. No manual data entry required.",
      color: "from-green-500 to-green-600",
      delay: 0.2,
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description:
        "Instant data synchronization ensures your sheets are always up-to-date with the latest submissions.",
      color: "from-yellow-500 to-orange-600",
      delay: 0.3,
    },
    {
      icon: Bell,
      title: "Email Notifications",
      description:
        "Get instant email alerts for new submissions. Configure multiple recipients and custom messages.",
      color: "from-cyan-500 to-cyan-600",
      delay: 0.4,
    },
    {
      icon: Webhook,
      title: "Webhook Support",
      description:
        "Integrate with any service using webhooks. Send data to Slack, Zapier, or your custom endpoints.",
      color: "from-blue-500 to-blue-600",
      delay: 0.5,
    },
    {
      icon: Code,
      title: "External API",
      description:
        "Access your forms via REST API. Perfect for developers building custom integrations.",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.6,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level encryption, CSRF protection, and SOC 2 compliance. Your data is always safe.",
      color: "from-pink-500 to-pink-600",
      delay: 0.7,
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track submissions, conversion rates, and user behavior with beautiful, actionable insights.",
      color: "from-teal-500 to-teal-600",
      delay: 0.8,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
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
            className="text-purple-600 font-semibold mb-3 uppercase tracking-wide"
          >
            Powerful Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Experience that grows{" "}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              with your scale
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Everything you need to build, manage, and scale your data collection
            workflow. From simple forms to complex integrations.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={feature.delay}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Line */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-6`}
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
