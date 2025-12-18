import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { UserPlus, FileEdit, Link2, Rocket } from "lucide-react";

/**
 * How It Works Section
 * Step-by-step process visualization
 */
const HowItWorksSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: UserPlus,
      number: "1",
      title: "Sign up with Google",
      description:
        "Get started in seconds with your Google account. No credit card required.",
      color: "from-purple-500 to-purple-600",
      emoji: "🚀",
    },
    {
      icon: FileEdit,
      number: "2",
      title: "Create your form",
      description:
        "Use our drag-and-drop builder to create beautiful forms. Choose from templates or start fresh.",
      color: "from-cyan-500 to-cyan-600",
      emoji: "✏️",
    },
    {
      icon: Link2,
      number: "3",
      title: "Connect Google Sheets",
      description:
        "Link your form to any Google Sheet with one click. Data syncs automatically in real-time.",
      color: "from-green-500 to-green-600",
      emoji: "🔗",
    },
    {
      icon: Rocket,
      number: "4",
      title: "Start collecting data",
      description:
        "Share your form and watch submissions flow directly into your spreadsheet.",
      color: "from-orange-500 to-pink-600",
      emoji: "📊",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-purple-600 font-semibold mb-3 uppercase tracking-wide"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            How SheetTree{" "}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              simplifies
            </span>{" "}
            your workflow
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            From signup to your first submission in less than 5 minutes
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Lines (desktop only) */}
            <div className="hidden lg:block absolute top-24 left-0 w-full h-1">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-300 via-cyan-300 to-green-300 rounded-full"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="text-center">
                    {/* Step Number Circle */}
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg relative z-10`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon Badge */}
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                    >
                      {step.emoji}
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Video Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-100 to-cyan-100 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-full aspect-video bg-gradient-to-br from-purple-200 to-cyan-200 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden group cursor-pointer">
                {/* Video Placeholder */}
                <motion.div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                <motion.div
                  className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.2 }}
                >
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-purple-600 border-b-8 border-b-transparent ml-1" />
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-9xl opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    📹
                  </motion.div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Watch SheetTree in Action
              </h3>
              <p className="text-gray-600">
                See how easy it is to create forms and collect data in under 2
                minutes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
