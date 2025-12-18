import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChartBarIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  BuildingOfficeIcon,
  LockClosedIcon,
  ChartPieIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0.9, 1]);

  // Professional animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Professional features data
  const features = [
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: "Advanced Analytics",
      description:
        "Enterprise-grade data analysis with real-time insights and automated reporting capabilities.",
      metrics: "5x faster analysis",
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and compliance with SOC 2, GDPR, and enterprise security standards.",
      metrics: "99.99% uptime",
    },
    {
      icon: <UsersIcon className="h-6 w-6" />,
      title: "Team Collaboration",
      description:
        "Streamlined workflows with role-based access, version control, and real-time collaboration.",
      metrics: "40% productivity boost",
    },
    {
      icon: <CloudArrowUpIcon className="h-6 w-6" />,
      title: "Cloud Integration",
      description:
        "Seamless Google Workspace integration with automated sync and backup capabilities.",
      metrics: "Zero downtime",
    },
  ];

  const stats = [
    {
      value: "50,000+",
      label: "Enterprise Users",
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
    },
    {
      value: "99.99%",
      label: "Uptime SLA",
      icon: <LockClosedIcon className="h-5 w-5" />,
    },
    {
      value: "2M+",
      label: "Data Points Processed",
      icon: <ChartPieIcon className="h-5 w-5" />,
    },
    {
      value: "150+",
      label: "Countries Served",
      icon: <GlobeAltIcon className="h-5 w-5" />,
    },
  ];

  const testimonials = [
    {
      content:
        "sheets has transformed our data operations. The enterprise features and security compliance made it an easy choice for our Fortune 500 company.",
      author: "Sarah Chen",
      role: "Chief Data Officer",
      company: "TechCorp Industries",
      logo: "TC",
    },
    {
      content:
        "The ROI was immediate. We've reduced our data processing time by 75% and improved accuracy across all departments.",
      author: "Michael Rodriguez",
      role: "Operations Director",
      company: "Global Manufacturing Inc.",
      logo: "GM",
    },
    {
      content:
        "Outstanding support and reliability. Our team can now focus on insights instead of data management.",
      author: "Emily Johnson",
      role: "Head of Analytics",
      company: "Financial Services Group",
      logo: "FS",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Secure Integration",
      description:
        "Connect your Google Workspace with enterprise-grade security protocols and OAuth 2.0 authentication.",
    },
    {
      step: "02",
      title: "Data Processing",
      description:
        "Our AI-powered engine analyzes your data structure and optimizes it for maximum performance.",
    },
    {
      step: "03",
      title: "Insights & Automation",
      description:
        "Generate actionable insights with automated reporting and real-time collaboration features.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                sheets
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="#features"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                to="#enterprise"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Enterprise
              </Link>
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Security
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Support
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Start Now
                </Link>
              </motion.div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="#features"
                className="block py-2 text-gray-600 font-medium"
              >
                Features
              </Link>
              <Link
                to="#enterprise"
                className="block py-2 text-gray-600 font-medium"
              >
                Enterprise
              </Link>
              <Link
                to="/privacy"
                className="block py-2 text-gray-600 font-medium"
              >
                Security
              </Link>
              <Link
                to="/terms"
                className="block py-2 text-gray-600 font-medium"
              >
                Support
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-teal-700 transition-colors"
                >
                  Start Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section - Professional Layout */}
      <section className="pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium">
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Trusted by Enterprise Teams
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Transform Your
                <span className="block text-teal-600">Google Sheets</span>
                <span className="block text-teal-500">Into Insights</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
              >
                Enterprise-grade analytics platform that connects seamlessly
                with Google Workspace. Trusted by Fortune 500 companies for
                mission-critical data operations.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white text-lg font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Start Now
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal-200 text-teal-700 text-lg font-semibold rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
                >
                  <PlayCircleIcon className="mr-2 h-5 w-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center space-x-6 text-sm text-gray-500"
              >
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                  Enterprise support
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Professional Visual */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Dashboard Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      sheets Dashboard
                    </span>
                  </div>

                  {/* Chart Area */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Revenue Analytics
                      </h3>
                      <span className="text-sm text-teal-600 font-medium">
                        ↗ +24.5%
                      </span>
                    </div>

                    {/* Simulated Chart */}
                    <div className="h-32 bg-gradient-to-t from-teal-50 to-teal-100 rounded-lg flex items-end justify-between p-4">
                      {[40, 65, 80, 45, 90, 70, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          className="bg-teal-600 rounded-sm"
                          style={{ width: "8px" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Total Users", value: "2,847", change: "+12%" },
                      { label: "Revenue", value: "$45.2K", change: "+8%" },
                      { label: "Conversion", value: "3.2%", change: "+15%" },
                      { label: "Growth", value: "24.5%", change: "+5%" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-3 bg-teal-50 rounded-lg"
                      >
                        <div className="text-sm text-gray-500">
                          {stat.label}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="text-xs text-teal-600">
                          {stat.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators & Statistics */}
      <section className="py-16 bg-teal-50 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-4 group-hover:bg-teal-200 transition-colors"
                >
                  <div className="text-teal-600">{stat.icon}</div>
                </motion.div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Enterprise Grid Layout */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6"
            >
              Enterprise Features
            </motion.span>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            >
              Built for Enterprise Success
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive tools designed for enterprise teams who demand
              reliability, security, and performance at scale.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <div className="text-teal-600">{feature.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-teal-700">
                      <CheckIcon className="h-4 w-4 mr-2 text-teal-600" />
                      {feature.metrics}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section - Professional Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            >
              Simple Implementation Process
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get your team up and running in minutes with our streamlined
              onboarding process designed for enterprise environments.
            </motion.p>
          </motion.div>

          <div className="relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative text-center lg:text-left"
                >
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-xl font-bold text-lg mb-6 relative z-10">
                    {step.step}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Professional Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            >
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600">
              See what enterprise teams are saying about their experience with
              sheets
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-semibold mr-4">
                    {testimonial.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action - Professional Design */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-white mb-6"
            >
              Ready to Transform Your Data Operations?
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of enterprise teams who have streamlined their
              workflow with sheets. Start your free trial and experience the
              difference today.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal-200 text-white text-lg font-semibold rounded-lg hover:border-white hover:bg-white hover:text-teal-600 transition-colors"
              >
                <PlayCircleIcon className="mr-2 h-5 w-5" />
                Schedule Demo
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center items-center gap-8 text-teal-100 text-sm"
            >
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2" />
                Enterprise support
              </div>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2" />
                SOC 2 compliant
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Professional Layout */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-4 gap-8"
          >
            {/* Company Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  sheets
                </span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                Enterprise-grade Google Sheets analytics platform trusted by
                Fortune 500 companies for mission-critical data operations and
                insights.
              </p>
              <div className="flex space-x-4">
                {["LinkedIn", "Twitter", "GitHub"].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-teal-600 hover:text-white transition-colors"
                  >
                    <span className="text-sm font-semibold">{social[0]}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div variants={fadeInUp}>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Enterprise", href: "#enterprise" },
                  { name: "Security", href: "/privacy" },
                  { name: "API Documentation", href: "/login" },
                  { name: "Integrations", href: "/login" },
                ].map((item, index) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={fadeInUp}>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" },
                  { name: "Support Center", href: "mailto:support@gopafy.com" },
                  { name: "Contact Sales", href: "mailto:sales@gopafy.com" },
                  { name: "System Status", href: "#" },
                ].map((item, index) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="border-t border-gray-200 mt-12 pt-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2025 sheets by Gopafy. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 lg:mt-0">
                <span className="text-gray-500 text-sm">
                  SOC 2 Type II Certified
                </span>
                <span className="text-gray-500 text-sm">GDPR Compliant</span>
                <span className="text-gray-500 text-sm">ISO 27001</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
