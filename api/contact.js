// Netlify Serverless Function for Backend API
// This acts as a mini-server/backend for your application.
// You can deploy this on Netlify to have a live API endpoint.

exports.handler = async (event, context) => {
    // Only allow POST requests (e.g. from the contact form)
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ message: "Method Not Allowed. Please use POST." }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { name, email, message } = body;

        // In a real application, you would connect to a database here
        // or send an email using a service like Resend, SendGrid, or Nodemailer
        console.log(`Received contact message from ${name} (${email}): ${message}`);
        
        // Example: access the env variables
        const adminEmail = process.env.CONTACT_EMAIL || "admin@example.com";

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                success: true, 
                message: "Thanks for reaching out! Your message was received successfully." 
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request payload" })
        };
    }
};
