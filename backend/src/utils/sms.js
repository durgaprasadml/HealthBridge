// Simplified SMS utility to log directly to the backend terminal
export const sendSMS = async (to, body) => {
    console.log(`\n========================================`);
    console.log(`📱 SMS / OTP RECEIVED`);
    console.log(`To: ${to}`);
    console.log(`Message: ${body}`);
    console.log(`========================================\n`);
    return true;
};
