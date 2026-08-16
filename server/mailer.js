const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmation(order) {
  try {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:6px 0;">${item.name} x ${item.quantity}</td>
            <td style="padding:6px 0; text-align:right;">Rs. ${item.price}</td>
          </tr>`
      )
      .join('');

    await transporter.sendMail({
      from: `"MESsupply" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmed — #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #0B2A4A;">Thank you for your order!</h2>
          <p style="color: #5C7186;">Hi ${order.customerName}, your order #${order.id} has been placed successfully.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            ${itemsHtml}
            <tr style="border-top: 1px solid #E5E9ED;">
              <td style="padding-top:8px; font-weight:bold;">Subtotal</td>
              <td style="padding-top:8px; text-align:right;">Rs. ${order.subtotal}</td>
            </tr>
            <tr>
              <td style="font-weight:bold;">Shipping</td>
              <td style="text-align:right;">${order.shippingFee === 0 ? 'Free' : `Rs. ${order.shippingFee}`}</td>
            </tr>
            <tr>
              <td style="font-weight:bold; color:#FF5A00;">Total</td>
              <td style="text-align:right; font-weight:bold; color:#FF5A00;">Rs. ${order.total}</td>
            </tr>
          </table>
          <p style="color: #5C7186; font-size: 14px;">
            Delivery to: ${order.shippingAddress}${order.landmark ? ` (near ${order.landmark})` : ''}<br/>
            Phone: ${order.phone}<br/>
            Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'eSewa'}
          </p>
          <p style="color: #5C7186; font-size: 13px; margin-top: 24px;">— MESsupply</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
    // We don't throw — a failed email shouldn't break order placement
  }
}

module.exports = { sendOrderConfirmation };