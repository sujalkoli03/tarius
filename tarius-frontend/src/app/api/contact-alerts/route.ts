// Filename: src/app/api/contact-alerts/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env['RESEND_API_KEY'] as string);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, tier, preferredContact } = body;

    // --- 1. ADMIN ALERT EMAIL ---
    const adminHtml = "<div style=\"font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a1a; color: #ffffff; text-align: center;\">" +
      "<p style=\"font-size: 10px; letter-spacing: 0.3em; color: #c8b99a; text-transform: uppercase; margin-bottom: 20px;\">System Alert</p>" +
      "<h1 style=\"font-size: 24px; font-weight: normal; margin-bottom: 30px; letter-spacing: 0.1em;\">NEW CLIENT DOSSIER</h1>" +
      "<p style=\"color: #a8a29e; font-size: 14px; line-height: 1.6; margin-bottom: 20px;\">A new inquiry has been submitted to the Tarius sanctuary.</p>" +
      "<div style=\"background-color: #292524; padding: 24px; text-align: left; margin-bottom: 40px; border-left: 2px solid #c8b99a;\">" +
      "<p style=\"margin: 0 0 12px 0;\"><strong style=\"color:#c8b99a; font-size:10px; text-transform:uppercase; letter-spacing:0.1em;\">Client Name:</strong> <br/>" + name + "</p>" +
      "<p style=\"margin: 0 0 12px 0;\"><strong style=\"color:#c8b99a; font-size:10px; text-transform:uppercase; letter-spacing:0.1em;\">Email Address:</strong> <br/>" + email + "</p>" +
      "<p style=\"margin: 0 0 12px 0;\"><strong style=\"color:#c8b99a; font-size:10px; text-transform:uppercase; letter-spacing:0.1em;\">Nature of Inquiry:</strong> <br/>" + tier + "</p>" +
      "<p style=\"margin: 0;\"><strong style=\"color:#c8b99a; font-size:10px; text-transform:uppercase; letter-spacing:0.1em;\">Preferred Contact:</strong> <br/>" + preferredContact + "</p>" +
      "</div></div>";

    // Send to your designated Admin Email
    await resend.emails.send({
      from: 'Tarius System <onboarding@resend.dev>',
      to: 'roshanwadhai175@gmail.com', 
      subject: "NEW DOSSIER: " + name + " (" + tier + ")",
      html: adminHtml,
    });

    // --- 2. USER AUTO-REPLY EMAIL ---
    const userHtml = "<div style=\"font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #1a1a1a; color: #ffffff; text-align: center;\">" +
      "<p style=\"font-size: 10px; letter-spacing: 0.3em; color: #c8b99a; text-transform: uppercase; margin-bottom: 20px;\">Private Concierge</p>" +
      "<h1 style=\"font-size: 24px; font-weight: normal; margin-bottom: 30px; letter-spacing: 0.1em;\">TARIUS</h1>" +
      "<p style=\"color: #a8a29e; font-size: 14px; line-height: 1.6; margin-bottom: 20px;\">Dear " + name + ",</p>" +
      "<p style=\"color: #a8a29e; font-size: 14px; line-height: 1.6; margin-bottom: 40px;\">We have securely received your request. A dedicated member of our concierge team will review your dossier and contact you shortly.</p>" +
      "<p style=\"color: #57534e; font-size: 10px; margin-top: 40px;\">Do not reply directly to this email. For immediate assistance, please visit the sanctuary portal.</p>" +
      "</div>";

    // Send to User
    await resend.emails.send({
      from: 'Tarius Concierge <onboarding@resend.dev>',
      to: email, 
      subject: 'TARIUS: Allocation Request Received',
      html: userHtml,
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Email alert failure:', error);
    return NextResponse.json({ error: 'Failed to dispatch alerts' }, { status: 500 });
  }
}