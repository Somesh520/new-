require('dotenv').config();
const emailjs = require('emailjs-com');

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// Base email sending function
async function sendEmail({ subject, to_email, message, user }) {
    // Debug configuration
    console.log('📧 EmailJS Configuration Check:');
    console.log(`  SERVICE_ID: ${SERVICE_ID ? '✅ ' + SERVICE_ID : '❌ missing'}`);
    console.log(`  TEMPLATE_ID: ${TEMPLATE_ID ? '✅ ' + TEMPLATE_ID : '❌ missing'}`);
    console.log(`  PUBLIC_KEY: ${PUBLIC_KEY ? '✅ ' + PUBLIC_KEY : '❌ missing'}`);
    console.log(`  PRIVATE_KEY: ${PRIVATE_KEY ? '✅ present' : '❌ missing'}`);

    // Check if all required EmailJS config is present and not empty
    if (!SERVICE_ID || SERVICE_ID.trim() === '' || 
        !TEMPLATE_ID || TEMPLATE_ID.trim() === '' || 
        !PUBLIC_KEY || PUBLIC_KEY.trim() === '') {
        console.log('📧 EmailJS configuration incomplete, skipping email notification');
        return null;
    }

    const params = {
        subject: subject || 'Notification',
        to_email: to_email || 'admin@company.com',
        message: message || 'New notification',
        user_id: user || 'system',
        from_name: 'Management System',
        reply_to: 'noreply@company.com'
    };

    try {
        console.log('📧 Attempting to send email notification...');
        console.log('📧 Email params:', params);
        
        // Use the correct EmailJS send method
        const response = await emailjs.send(
            SERVICE_ID, 
            TEMPLATE_ID, 
            params,
            {
                publicKey: PUBLIC_KEY,
                privateKey: PRIVATE_KEY
            }
        );
        
        console.log('✅ Email sent successfully:', response);
        return response;
    } catch (err) {
        console.error('❌ EmailJS send failed:', err);
        console.log('📧 Email notification skipped due to error');
        return null;
    }
}

// Send task notification (legacy function)
async function sendTaskNotification({ subject, to_email, message, user }) {
    return await sendEmail({ subject, to_email, message, user });
}

// Send service log notification
async function sendServiceLogNotification(log, action) {
    const subject = `Service Log ${action}: ${log.title}`;
    const message = `Service log "${log.title}" has been ${action}.\n\nService ID: ${log.serviceId}\nAssigned Engineer: ${log.assignedEngineer}\nNotes: ${log.notes || 'No notes provided'}`;
    
    return await sendEmail({
        subject,
        to_email: 'admin@company.com', // You can customize this
        message,
        user: log.createdBy
    });
}

module.exports = sendTaskNotification;
module.exports.sendServiceLogNotification = sendServiceLogNotification;
module.exports.sendEmail = sendEmail;
