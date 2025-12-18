import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                sheets
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-teal-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
            <p className="text-teal-800 mb-2">
              <strong>Last updated:</strong> August 22, 2025
            </p>
            <p className="text-teal-700">
              This Privacy Policy describes how sheets ("we", "our", or "us")
              collects, uses, and protects your personal information when you
              use our service.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              1.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Google Account Information:</strong> When you sign in
                with Google, we receive your name, email address, and profile
                picture
              </li>
              <li>
                <strong>Google Sheets Data:</strong> We access only the Google
                Sheets you explicitly grant us permission to view or modify
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our service, including feature usage and preferences
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              1.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Log Data:</strong> IP address, browser type, operating
                system, and access times
              </li>
              <li>
                <strong>Cookies:</strong> Small data files stored on your device
                to improve your experience
              </li>
              <li>
                <strong>Device Information:</strong> Information about the
                device you use to access our service
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Service Provision:</strong> To provide, maintain, and
                improve our Google Sheets integration service
              </li>
              <li>
                <strong>Data Processing:</strong> To analyze, visualize, and
                generate reports from your Google Sheets data
              </li>
              <li>
                <strong>Authentication:</strong> To verify your identity and
                secure your account
              </li>
              <li>
                <strong>Communication:</strong> To send you service-related
                notifications and updates
              </li>
              <li>
                <strong>Support:</strong> To respond to your questions and
                provide customer support
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable
                laws and regulations
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Google API Services
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
              <p className="text-blue-800 mb-3">
                <strong>Google API Services User Data Policy Compliance</strong>
              </p>
              <p className="text-blue-700">
                Our use of information received from Google APIs adheres to the
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="underline hover:text-blue-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.1 Scope of Access
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                We only access Google Sheets that you explicitly authorize
              </li>
              <li>
                We request minimal permissions necessary for our service
                functionality
              </li>
              <li>
                You can revoke access at any time through your Google Account
                settings
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.2 Data Usage Restrictions
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                We do not sell, lease, or share your Google user data with third
                parties
              </li>
              <li>We do not use your data for advertising purposes</li>
              <li>
                We only transfer data to third parties as necessary to provide
                our service or as legally required
              </li>
              <li>
                All data transfers are secured and comply with applicable
                privacy laws
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your
              information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Encryption:</strong> All data in transit is encrypted
                using industry-standard TLS protocols
              </li>
              <li>
                <strong>Access Controls:</strong> Strict access controls limit
                who can view your data
              </li>
              <li>
                <strong>Regular Audits:</strong> We regularly review our
                security practices and procedures
              </li>
              <li>
                <strong>Secure Infrastructure:</strong> Our servers are hosted
                on secure, monitored infrastructure
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our
              service and fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Account Data:</strong> Retained while your account is
                active
              </li>
              <li>
                <strong>Google Sheets Data:</strong> Processed in real-time and
                not permanently stored unless necessary for service
                functionality
              </li>
              <li>
                <strong>Log Data:</strong> Retained for up to 90 days for
                security and service improvement purposes
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <strong>Access:</strong> Request access to your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                portable format
              </li>
              <li>
                <strong>Withdrawal:</strong> Withdraw consent for data
                processing at any time
              </li>
              <li>
                <strong>Google Access:</strong> Revoke our access to your Google
                account through your Google Account settings
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              Our service integrates with Google Services and may use other
              third-party services. These services have their own privacy
              policies:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  className="text-teal-600 hover:text-teal-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://policies.google.com/terms"
                  className="text-teal-600 hover:text-teal-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Terms of Service
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure that such
              transfers comply with applicable data protection laws and
              implement appropriate safeguards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the "Last updated" date. We
              encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@gopafy.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong> support@gopafy.com
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong>{" "}
                <Link
                  to="/"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  https://sheets.gopafy.com
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
