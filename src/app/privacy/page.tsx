import React from "react";
import { Metadata } from "next";
import { ICH } from "@/components/ui-primitives";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the Islamic Center of Hattiesburg.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-enter" style={{ minHeight: "80vh", background: "#fdfdfd" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          background: `linear-gradient(135deg,${ICH.primaryDark},${ICH.primary})`,
          padding: "80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="geo-bg" style={{ position: "absolute", inset: 0, opacity: 0.35 }} />
        <div style={{ position: "relative" }}>
          <h1
            style={{
              fontFamily: "Cormorant Garamond,serif",
              fontSize: "clamp(36px,5vw,48px)",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,.85)",
              maxWidth: 600,
              margin: "0 auto",
              fontFamily: "Inter,sans-serif",
            }}
          >
            Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "64px 24px" }}>
        <div
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: 15,
            lineHeight: 1.8,
            color: ICH.text,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <p>
            Welcome to the Islamic Center of Hattiesburg (ICH). We respect your privacy and are committed to protecting any personal information that you may provide to us through our website. This Privacy Policy explains what information we may collect, how we use it, and your rights concerning that information.
          </p>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: 12 }}>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: ICH.textMuted }}>
              <li><strong>Contact Us:</strong> If you fill out our contact form, we collect your name, email address, phone number, and message.</li>
              <li><strong>Make a Donation:</strong> When you donate online, we collect information necessary to process your transaction (e.g., name, billing details). We use secure third-party payment processors (such as Stripe) and do not store your full credit card information on our servers.</li>
              <li><strong>Sign Up for Updates:</strong> If you subscribe to our newsletter or announcements, we collect your email address.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: 12 }}>
              The information we collect is used in the following ways:
            </p>
            <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: ICH.textMuted }}>
              <li>To respond to your inquiries or support requests.</li>
              <li>To process your donations securely and send you receipts for tax purposes.</li>
              <li>To send you updates about upcoming events, programs, and important announcements at the masjid (only if you have opted in).</li>
              <li>To improve our website's functionality and user experience.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              3. Information Sharing and Disclosure
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties. We may share your information only with trusted third-party service providers (like our payment processor) strictly for the purpose of facilitating our services. We may also disclose information if required by law or to protect the safety and rights of our community.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              4. Data Security
            </h2>
            <p>
              We implement reasonable security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              5. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites (such as our social media pages or third-party fundraising campaigns). We are not responsible for the privacy practices or the content of these external websites.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              6. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 28, fontWeight: 600, color: ICH.primaryDark, marginBottom: 16 }}>
              7. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div style={{ marginTop: 12, padding: 20, background: ICH.bgCard, border: `1px solid ${ICH.border}`, borderRadius: 8 }}>
              <strong>Islamic Center of Hattiesburg</strong><br/>
              211 N 25th Ave<br/>
              Hattiesburg, MS 39401<br/>
              <br/>
              <a href="/contact" style={{ color: ICH.primary, textDecoration: "none", fontWeight: 500 }}>Go to Contact Page →</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
