interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Base email sending function
export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: to,
          subject: subject,
          html: html,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

// Account verification email
export const sendVerificationEmail = async (
  email: string,
  verificationLink: string
) => {
  const subject = "Verify your Luraaya account";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Welcome to Luraaya!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <div style="margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>If you didn't create an account with Luraaya, you can safely ignore this email.</p>
      <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
        This link will expire in 24 hours.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

// Password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  const subject = "Reset your Luraaya password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Password Reset Request</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
        This link will expire in 1 hour.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};