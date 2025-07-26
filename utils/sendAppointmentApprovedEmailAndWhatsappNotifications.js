const nodemailer = require('nodemailer');
const axios = require('axios');
const Department = require('../models/departmentsModel');

async function sendAppointmentApprovedEmailAndWhatsappNotifications({ appointment, newDate }) {
  const formattedDate = new Date(newDate).toLocaleString();

  // ✅ Find the doctor info from Department
  let doctorEmail = '';
  let doctorPhone = '';

  const dept = await Department.findOne({ name: appointment.department });
  if (dept && dept.doctors?.length) {
    const doctorInfo = dept.doctors.find(d => d.name === appointment.doctor);
    if (doctorInfo) {
      doctorEmail = doctorInfo.email;
      doctorPhone = doctorInfo.phone;
    }
  }

  if (!doctorEmail) doctorEmail = process.env.DEFAULT_DOCTOR_EMAIL;
  if (!doctorPhone) doctorPhone = process.env.DEFAULT_DOCTOR_PHONE;

  const patientEmail = appointment.email;
  const patientPhone = appointment.phone;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  /** =============== PATIENT MESSAGE =============== */
  const patientSubject = `✅ Your appointment has been rescheduled - ${formattedDate}`;
  const patientHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #007bff;">Hello ${appointment.name},</h2>
      <p>We wanted to let you know that your appointment has been successfully <strong>rescheduled</strong>.</p>
      <p><strong>New Appointment Details:</strong></p>
      <ul>
        <li>📅 <b>Date:</b> ${formattedDate}</li>
        <li>🏥 <b>Department:</b> ${appointment.department}</li>
        <li>👨‍⚕️ <b>Doctor:</b> ${appointment.doctor}</li>
      </ul>
      <p>If you have any questions, please reply to this email.</p>
      <p style="margin-top:20px;">💙 Thank you for choosing our hospital!</p>
    </div>
  `;

  const patientWhatsApp = `✅ *Your appointment has been rescheduled!*\n\n` +
    `📅 *New Date:* ${formattedDate}\n` +
    `🏥 *Department:* ${appointment.department}\n` +
    `👨‍⚕️ *Doctor:* ${appointment.doctor}\n\n` +
    `We look forward to seeing you!`;

  /** =============== DOCTOR MESSAGE =============== */
  const doctorSubject = `📅 New appointment schedule for ${appointment.name}`;
  const doctorHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>📢 Appointment Rescheduled</h2>
      <p>The appointment for <strong>${appointment.name}</strong> has been rescheduled:</p>
      <ul>
        <li>👤 <b>Patient:</b> ${appointment.name}</li>
        <li>📞 <b>Contact:</b> ${appointment.phone}, ${appointment.email}</li>
        <li>📅 <b>New Date:</b> ${formattedDate}</li>
        <li>📝 <b>Message:</b> ${appointment.message || 'N/A'}</li>
      </ul>
      <p>Please prepare accordingly.</p>
    </div>
  `;

  const doctorWhatsApp = `📢 *Appointment Rescheduled*\n\n` +
    `👤 Patient: ${appointment.name}\n` +
    `📅 New Date: ${formattedDate}\n` +
    `📝 Message: ${appointment.message || 'N/A'}\n\n` +
    `Kindly take note.`;

  /** =============== ADMIN MESSAGE =============== */
  const adminSubject = `ℹ️ Rescheduled Appointment Summary - ${appointment.name}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>🔄 Appointment Rescheduled</h2>
      <p>The appointment has been rescheduled with the following details:</p>
      <ul>
        <li>👤 Patient: ${appointment.name} (${appointment.phone})</li>
        <li>🏥 Department: ${appointment.department}</li>
        <li>👨‍⚕️ Doctor: ${appointment.doctor}</li>
        <li>📅 New Date: ${formattedDate}</li>
        <li>📝 Message: ${appointment.message}</li>
      </ul>
      <p>This notification has been sent to the doctor and patient as well.</p>
    </div>
  `;

  const adminWhatsApp = `ℹ️ *Appointment Rescheduled*\n\n` +
    `👤 Patient: ${appointment.name}\n` +
    `👨‍⚕️ Doctor: ${appointment.doctor}\n` +
    `🏥 Department: ${appointment.department}\n` +
    `📅 New Date: ${formattedDate}\n\n` +
    `This update was sent to both the doctor & patient.`;

  // ✅ Send Email Helper
  async function sendEmail(to, subject, html) {
    await transporter.sendMail({
      from: `"Hospital Appointments" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
  }

  // ✅ Send WhatsApp Helper
  async function sendWhatsApp(phone, message) {
    if (!phone) return console.log('⚠️ No phone number provided');
    try {
      await axios.post(
        process.env.WHATSAPP_API_URL,
        {
          messaging_product: 'whatsapp',
          to: phone.replace(/\D/g, ''), // only digits
          text: { body: message }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ WhatsApp message sent to ${phone}`);
    } catch (err) {
      console.error(`❌ WhatsApp failed for ${phone}`, err.response?.data || err.message);
    }
  }

  // ✅ Send tailored notifications
  await sendEmail(patientEmail, patientSubject, patientHtml);
  await sendEmail(doctorEmail, doctorSubject, doctorHtml);
  await sendEmail(adminEmail, adminSubject, adminHtml);

  // await sendWhatsApp(patientPhone, patientWhatsApp);
  // await sendWhatsApp(doctorPhone, doctorWhatsApp);
  // await sendWhatsApp(adminPhone, adminWhatsApp);
}

module.exports = sendAppointmentApprovedEmailAndWhatsappNotifications;
