import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Pricing Section Component
 * Beautiful pricing cards with hover effects
 */
const PricingSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Free",
      price: "£0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "3 forms",
        "100 submissions/month",
        "Basic form fields",
        "Google Sheets integration",
        "Email notifications",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-100 to-gray-200",
      textColor: "text-gray-900",
      buttonColor: "bg-gray-900 hover:bg-gray-800 text-white",
    },
    {
      name: "Premium",
      price: "£6.99",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited forms",
        "Unlimited submissions",
        "Advanced form fields",
        "Multi-sheet connections",
        "Webhooks & API access",
        "Custom branding",
        "Priority support",
        "Analytics dashboard",
        "Form templates",
        "Conditional logic",
      ],
      cta: "Get Premium",
      popular: true,
      gradient: "from-purple-600 to-cyan-600",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-100 text-purple-600",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
            Simple Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Choose your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              perfect plan
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Start free, upgrade when you grow. No hidden fees, cancel anytime.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div
                className={`relative rounded-3xl p-8 shadow-xl ${
                  plan.popular
                    ? "ring-4 ring-purple-500"
                    : "ring-1 ring-gray-200"
                } bg-gradient-to-br ${plan.gradient} ${
                  plan.textColor
                } overflow-hidden`}
              >
                {/* Background Pattern */}
                {plan.popular && (
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                )}

                <div className="relative z-10">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p
                    className={`mb-6 ${
                      plan.popular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span
                        className={`text-lg ${
                          plan.popular ? "text-purple-200" : "text-gray-500"
                        }`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to="/login">
                    <motion.button
                      className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all mb-8 ${plan.buttonColor} flex items-center justify-center gap-2 group`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Check
                          className={`w-6 h-6 flex-shrink-0 ${
                            plan.popular ? "text-white" : "text-green-500"
                          }`}
                        />
                        <span
                          className={
                            plan.popular ? "text-purple-100" : "text-gray-700"
                          }
                        >
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Need a custom plan for your team?{" "}
            <a
              href="mailto:hello@gopafy.com"
              className="text-purple-600 font-semibold hover:underline"
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
