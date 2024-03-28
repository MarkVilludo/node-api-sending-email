const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON-encoded bodies and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if any)
app.use(express.static('public'));

// Validation middleware for the send-email route
const validateSendEmail = [
    body('senderName').notEmpty().withMessage('Sender name is required'),
    body('senderEmail').isEmail().withMessage('Invalid sender email'),
    body('message').notEmpty().withMessage('Message is required')
];

// POST route to handle sending emails
app.post('/api/send-email', validateSendEmail, (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { senderName, senderEmail, subject, message, recipientEmail } = req.body;

    // Construct 'from' address dynamically
    const from = `${senderName} <${senderEmail}>`;

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        auth: {
            user: '59560c94b2397a',
            pass: 'b15ed991eab552'
        }
    });

    // Define email options
    let mailOptions = {
        from: from,
        to: "markanthony.villudo@gmail.com",
        subject: subject,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ error: 'Error occurred while sending email.' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully.' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});