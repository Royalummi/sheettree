import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const TermsOfService = () => {
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
            Terms of Service
          </h1>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
            <p className="text-teal-800 mb-2">
              <strong>Last updated:</strong> August 22, 2025
            </p>
            <p className="text-teal-700">
              These Terms of Service ("Terms") govern your use of the sheets
              service operated by Gopafy ("we", "our", or "us").
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using our service, you agree to be bound by these
              Terms. If you disagree with any part of these terms, then you may
              not access the service. These Terms apply to all visitors, users,
              and others who access or use the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              sheets is a web-based application that provides tools for
              analyzing, visualizing, and managing Google Sheets data. Our
              service includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Google Sheets integration and data analysis</li>
              <li>Data visualization and reporting tools</li>
              <li>Collaborative features for team workflows</li>
              <li>Export and sharing capabilities</li>
              <li>Real-time data synchronization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Accounts
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.1 Account Creation
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You must have a Google account to use our service</li>
              <li>
                You must provide accurate and complete information during
                registration
              </li>
              <li>
                You are responsible for safeguarding your account credentials
              </li>
              <li>You must be at least 13 years old to create an account</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              3.2 Account Responsibilities
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                You are responsible for all activity that occurs under your
                account
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account
              </li>
              <li>You must not share your account with others</li>
              <li>
                You may not create multiple accounts for the same individual or
                entity
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Acceptable Use
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.1 Permitted Uses
            </h3>
            <p className="text-gray-700 mb-4">
              You may use our service for lawful business and personal purposes,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Analyzing and visualizing your Google Sheets data</li>
              <li>Creating reports and dashboards for business purposes</li>
              <li>Collaborating with team members on data projects</li>
              <li>Integrating with other business tools and workflows</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              4.2 Prohibited Uses
            </h3>
            <p className="text-gray-700 mb-4">
              You may not use our service to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>
                Attempt to gain unauthorized access to our systems or other
                users' accounts
              </li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>
                Use automated systems to access the service without permission
              </li>
              <li>Interfere with or disrupt the service or its servers</li>
              <li>
                Use the service for any commercial purposes beyond your
                subscription plan
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Google Services Integration
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              5.1 Google Account Authorization
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                You must authorize our application to access your Google Sheets
              </li>
              <li>
                You can revoke this authorization at any time through your
                Google Account settings
              </li>
              <li>
                We will only access the Google Sheets you explicitly grant us
                permission to view
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              5.2 Google Terms Compliance
            </h3>
            <p className="text-gray-700 mb-4">
              Your use of Google services through our platform is also subject
              to Google's Terms of Service and Privacy Policy. You agree to
              comply with all applicable Google policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              6.1 Our Rights
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                The service and its original content, features, and
                functionality are owned by us
              </li>
              <li>
                The service is protected by copyright, trademark, and other laws
              </li>
              <li>
                Our trademarks may not be used without our prior written consent
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              6.2 Your Rights
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                You retain ownership of all data you input into the service
              </li>
              <li>
                You grant us a limited license to process your data to provide
                the service
              </li>
              <li>You may export your data at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our{" "}
              <Link
                to="/privacy"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                We implement appropriate security measures to protect your data
              </li>
              <li>
                We do not sell or share your personal data with third parties
                for marketing purposes
              </li>
              <li>
                You have rights regarding your personal data as outlined in our
                Privacy Policy
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Service Availability
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              8.1 Service Provision
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                We strive to provide reliable service with minimal downtime
              </li>
              <li>
                We may temporarily suspend service for maintenance or updates
              </li>
              <li>
                We will provide reasonable notice for planned maintenance when
                possible
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              8.2 No Warranties
            </h3>
            <p className="text-gray-700 mb-4">
              The service is provided "as is" without warranties of any kind. We
              do not guarantee that the service will be uninterrupted, secure,
              or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Limitation of Liability
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> Please read this section carefully
                as it limits our liability.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by applicable law, we shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                Our total liability shall not exceed the amount you paid for the
                service in the past 12 months
              </li>
              <li>We are not responsible for any data loss that may occur</li>
              <li>
                You are responsible for maintaining backups of your important
                data
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold us harmless from any claims,
              damages, losses, liabilities, costs, and expenses arising from
              your use of the service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Termination
            </h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              11.1 Termination by You
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                You may terminate your account at any time by contacting us
              </li>
              <li>You may stop using the service at any time</li>
              <li>
                Termination does not relieve you of any obligations incurred
                prior to termination
              </li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">
              11.2 Termination by Us
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>
                We may terminate or suspend your account for violation of these
                Terms
              </li>
              <li>We may terminate the service with reasonable notice</li>
              <li>
                We will provide you with an opportunity to export your data
                before termination when possible
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will
              notify users of material changes by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Posting the updated Terms on our website</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notifications for significant changes</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Your continued use of the service after changes constitute
              acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions. Any disputes arising from these Terms or the
              service shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Severability
            </h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision will be limited or eliminated to the
              minimum extent necessary so that these Terms will otherwise remain
              in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@gopafy.com
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

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mt-8">
            <p className="text-teal-800 text-sm">
              <strong>Note:</strong> These Terms of Service are effective as of
              the last updated date above. We encourage you to review these
              Terms periodically to stay informed about our policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
