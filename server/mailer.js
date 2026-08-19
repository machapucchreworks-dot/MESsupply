require('dotenv').config();

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER = { name: 'MESsupply', email: 'sambhav057acharya@gmail.com' };
const ADMIN_EMAIL = 'machapucchreworks@gmail.com';

async function sendBrevoEmail({ to, toName, subject, html }) {
  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Brevo email failed:', res.status, errText);
    }
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

function orderItemsHtml(items) {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 0;">${item.name} x ${item.quantity}</td>
          <td style="padding:6px 0; text-align:right;">Rs. ${item.price}</td>
        </tr>`
    )
    .join('');
}

function orderSummaryHtml(order) {
  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      ${orderItemsHtml(order.items)}
      <tr style="border-top: 1px solid #E5E9ED;">
        <td style="padding-top:8px; font-weight:bold;">Subtotal</td>
        <td style="padding-top:8px; text-align:right;">Rs. ${order.subtotal}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">Shipping</td>
        <td style="text-align:right;">${Number(order.shippingFee) === 0 ? 'Free' : `Rs. ${order.shippingFee}`}</td>
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
  `;
}

// Sent to the customer right after they place an order
async function sendOrderConfirmation(order) {
  await sendBrevoEmail({
    to: order.customerEmail,
    toName: order.customerName,
    subject: `Order Confirmed — #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0B2A4A;">Thank you for your order!</h2>
        <p style="color: #5C7186;">Hi ${order.customerName}, your order #${order.id} has been placed successfully.</p>
        ${orderSummaryHtml(order)}
        <p style="color: #5C7186; font-size: 13px; margin-top: 24px;">— MESsupply</p>
      </div>
    `,
  });
}

// Sent to the store owner whenever a new order comes in
async function sendNewOrderAlert(order) {
  await sendBrevoEmail({
    to: ADMIN_EMAIL,
    toName: 'MESsupply Admin',
    subject: `New Order #${order.id} — Rs. ${order.total}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0B2A4A;">New order received!</h2>
        <p style="color: #5C7186;">From: ${order.customerName} (${order.customerEmail})</p>
        ${orderSummaryHtml(order)}
        <p style="color: #5C7186; font-size: 13px; margin-top: 24px;">— MESsupply Admin Notification</p>
      </div>
    `,
  });
}

// Sent to the customer when the order's status changes (processing/shipped/delivered/cancelled)
async function sendStatusUpdate(order, newStatus) {
  const statusLabels = {
    processing: 'is being processed',
    shipped: 'has been shipped',
    delivered: 'has been delivered',
    cancelled: 'has been cancelled',
  };
  const label = statusLabels[newStatus] || `is now "${newStatus}"`;

  await sendBrevoEmail({
    to: order.customerEmail,
    toName: order.customerName,
    subject: `Order #${order.id} Update — ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0B2A4A;">Order Update</h2>
        <p style="color: #5C7186;">Hi ${order.customerName}, your order #${order.id} ${label}.</p>
        <p style="color: #5C7186; font-size: 13px; margin-top: 24px;">— MESsupply</p>
      </div>
    `,
  });
}

module.exports = { sendOrderConfirmation, sendNewOrderAlert, sendStatusUpdate };