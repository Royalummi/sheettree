-- Seed form_templates table with 10 pre-built templates
-- These templates can be used as starting points for creating forms

DELETE FROM form_templates;

-- 1. Simple Contact Form
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Simple Contact Form',
    'Basic contact form with name, email, and message fields',
    'contact',
    'MessageSquare',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Full Name', 'required', true, 'placeholder', 'Enter your full name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', false, 'placeholder', '(555) 123-4567'),
        JSON_OBJECT('id', 4, 'type', 'textarea', 'label', 'Message', 'required', true, 'placeholder', 'How can we help you?')
    ),
    JSON_OBJECT('submitButtonText', 'Send Message', 'successMessage', 'Thank you! We will get back to you soon.'),
    true
);

-- 2. Event Registration Form
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Event Registration',
    'Perfect for collecting registrations for events, webinars, or workshops',
    'event',
    'Calendar',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Full Name', 'required', true, 'placeholder', 'Enter your name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', true, 'placeholder', 'Contact number'),
        JSON_OBJECT('id', 4, 'type', 'text', 'label', 'Company/Organization', 'required', false, 'placeholder', 'Optional'),
        JSON_OBJECT('id', 5, 'type', 'select', 'label', 'Number of Attendees', 'required', true, 'options', JSON_ARRAY('1', '2', '3', '4', '5+')),
        JSON_OBJECT('id', 6, 'type', 'textarea', 'label', 'Special Requirements', 'required', false, 'placeholder', 'Dietary restrictions, accessibility needs, etc.')
    ),
    JSON_OBJECT('submitButtonText', 'Register Now', 'successMessage', 'Registration successful! Check your email for confirmation.'),
    true
);

-- 3. Customer Feedback Survey
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Customer Feedback Survey',
    'Collect valuable feedback from your customers',
    'survey',
    'BarChart3',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Name (Optional)', 'required', false, 'placeholder', 'Your name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email (Optional)', 'required', false, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'select', 'label', 'How satisfied are you with our service?', 'required', true, 'options', JSON_ARRAY('Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied')),
        JSON_OBJECT('id', 4, 'type', 'select', 'label', 'How likely are you to recommend us?', 'required', true, 'options', JSON_ARRAY('10 - Extremely Likely', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0 - Not Likely')),
        JSON_OBJECT('id', 5, 'type', 'textarea', 'label', 'What did you like most?', 'required', false, 'placeholder', 'Tell us what you loved'),
        JSON_OBJECT('id', 6, 'type', 'textarea', 'label', 'How can we improve?', 'required', false, 'placeholder', 'Your suggestions are valuable')
    ),
    JSON_OBJECT('submitButtonText', 'Submit Feedback', 'successMessage', 'Thank you for your feedback!'),
    true
);

-- 4. Job Application Form
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Job Application',
    'Comprehensive form for collecting job applications',
    'application',
    'GraduationCap',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Full Name', 'required', true, 'placeholder', 'First and Last Name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', true, 'placeholder', 'Contact number'),
        JSON_OBJECT('id', 4, 'type', 'text', 'label', 'LinkedIn Profile', 'required', false, 'placeholder', 'https://linkedin.com/in/yourprofile'),
        JSON_OBJECT('id', 5, 'type', 'select', 'label', 'Position Applied For', 'required', true, 'options', JSON_ARRAY('Software Developer', 'Product Manager', 'Designer', 'Marketing', 'Sales', 'Other')),
        JSON_OBJECT('id', 6, 'type', 'select', 'label', 'Years of Experience', 'required', true, 'options', JSON_ARRAY('0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years')),
        JSON_OBJECT('id', 7, 'type', 'textarea', 'label', 'Why do you want to work with us?', 'required', true, 'placeholder', 'Tell us about your interest'),
        JSON_OBJECT('id', 8, 'type', 'text', 'label', 'Resume/CV URL', 'required', false, 'placeholder', 'Link to Google Drive, Dropbox, etc.')
    ),
    JSON_OBJECT('submitButtonText', 'Submit Application', 'successMessage', 'Application submitted successfully!'),
    true
);

-- 5. Product Order Form
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Product Order Form',
    'Simple order form for products or services',
    'order',
    'ShoppingCart',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Full Name', 'required', true, 'placeholder', 'Enter your name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', true, 'placeholder', 'Contact number'),
        JSON_OBJECT('id', 4, 'type', 'text', 'label', 'Product Name', 'required', true, 'placeholder', 'Which product?'),
        JSON_OBJECT('id', 5, 'type', 'number', 'label', 'Quantity', 'required', true, 'placeholder', '1'),
        JSON_OBJECT('id', 6, 'type', 'textarea', 'label', 'Shipping Address', 'required', true, 'placeholder', 'Street, City, State, ZIP'),
        JSON_OBJECT('id', 7, 'type', 'textarea', 'label', 'Special Instructions', 'required', false, 'placeholder', 'Gift wrapping, delivery notes, etc.')
    ),
    JSON_OBJECT('submitButtonText', 'Place Order', 'successMessage', 'Order received! We will contact you shortly.'),
    true
);

-- 6. Newsletter Signup
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Newsletter Signup',
    'Simple and effective newsletter subscription form',
    'general',
    'Sparkles',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'First Name', 'required', true, 'placeholder', 'John'),
        JSON_OBJECT('id', 2, 'type', 'text', 'label', 'Last Name', 'required', false, 'placeholder', 'Doe'),
        JSON_OBJECT('id', 3, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 4, 'type', 'select', 'label', 'Email Frequency', 'required', true, 'options', JSON_ARRAY('Daily', 'Weekly', 'Monthly'))
    ),
    JSON_OBJECT('submitButtonText', 'Subscribe', 'successMessage', 'Thanks for subscribing!'),
    true
);

-- 7. Support Ticket Form
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Support Ticket',
    'Help your customers report issues and get support',
    'business',
    'Briefcase',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Your Name', 'required', true, 'placeholder', 'Enter your name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'select', 'label', 'Priority Level', 'required', true, 'options', JSON_ARRAY('Low', 'Medium', 'High', 'Critical')),
        JSON_OBJECT('id', 4, 'type', 'select', 'label', 'Issue Category', 'required', true, 'options', JSON_ARRAY('Technical Problem', 'Billing Question', 'Feature Request', 'General Inquiry', 'Other')),
        JSON_OBJECT('id', 5, 'type', 'text', 'label', 'Subject', 'required', true, 'placeholder', 'Brief summary of the issue'),
        JSON_OBJECT('id', 6, 'type', 'textarea', 'label', 'Description', 'required', true, 'placeholder', 'Please provide detailed information about your issue')
    ),
    JSON_OBJECT('submitButtonText', 'Submit Ticket', 'successMessage', 'Ticket created! We will respond shortly.'),
    true
);

-- 8. Course Registration
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Course Registration',
    'Enroll students in courses or training programs',
    'registration',
    'FileText',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Student Name', 'required', true, 'placeholder', 'Full name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'student@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', true, 'placeholder', 'Contact number'),
        JSON_OBJECT('id', 4, 'type', 'select', 'label', 'Course Selection', 'required', true, 'options', JSON_ARRAY('Web Development', 'Data Science', 'Digital Marketing', 'Graphic Design', 'Business Management')),
        JSON_OBJECT('id', 5, 'type', 'select', 'label', 'Preferred Schedule', 'required', true, 'options', JSON_ARRAY('Morning (9 AM - 12 PM)', 'Afternoon (1 PM - 4 PM)', 'Evening (6 PM - 9 PM)', 'Weekend')),
        JSON_OBJECT('id', 6, 'type', 'select', 'label', 'Education Level', 'required', false, 'options', JSON_ARRAY('High School', 'Bachelor''s Degree', 'Master''s Degree', 'PhD', 'Other')),
        JSON_OBJECT('id', 7, 'type', 'textarea', 'label', 'Why do you want to take this course?', 'required', false, 'placeholder', 'Your learning goals')
    ),
    JSON_OBJECT('submitButtonText', 'Register for Course', 'successMessage', 'Registration successful! Welcome aboard.'),
    true
);

-- 9. Appointment Booking
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Appointment Booking',
    'Schedule appointments with clients or patients',
    'business',
    'Briefcase',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Full Name', 'required', true, 'placeholder', 'Your name'),
        JSON_OBJECT('id', 2, 'type', 'email', 'label', 'Email Address', 'required', true, 'placeholder', 'your@email.com'),
        JSON_OBJECT('id', 3, 'type', 'tel', 'label', 'Phone Number', 'required', true, 'placeholder', 'Contact number'),
        JSON_OBJECT('id', 4, 'type', 'date', 'label', 'Preferred Date', 'required', true, 'placeholder', 'Select date'),
        JSON_OBJECT('id', 5, 'type', 'select', 'label', 'Preferred Time', 'required', true, 'options', JSON_ARRAY('9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM')),
        JSON_OBJECT('id', 6, 'type', 'select', 'label', 'Service Type', 'required', true, 'options', JSON_ARRAY('Consultation', 'Follow-up', 'New Patient', 'Emergency')),
        JSON_OBJECT('id', 7, 'type', 'textarea', 'label', 'Additional Notes', 'required', false, 'placeholder', 'Any specific concerns or questions?')
    ),
    JSON_OBJECT('submitButtonText', 'Book Appointment', 'successMessage', 'Appointment requested! We will confirm shortly.'),
    true
);

-- 10. Blank Template
INSERT INTO form_templates (name, description, category, icon, fields, settings, is_active) VALUES (
    'Blank Template',
    'Start from scratch and build your custom form',
    'general',
    'Sparkles',
    JSON_ARRAY(
        JSON_OBJECT('id', 1, 'type', 'text', 'label', 'Field 1', 'required', false, 'placeholder', 'Enter value')
    ),
    JSON_OBJECT('submitButtonText', 'Submit', 'successMessage', 'Form submitted successfully!'),
    true
);
