import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Islamic Center of Hattiesburg. Find our address, phone number, and send us a message.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground">
          We&apos;d love to hear from you. Reach out with any questions or comments.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div>
          <div className="space-y-5 mb-8">
            {[
              {
                icon: <MapPin className="h-5 w-5" />,
                label: "Address",
                content: (
                  <p className="text-muted-foreground text-sm">
                    21 Windmill Drive<br />Hattiesburg, MS 39402
                  </p>
                ),
              },
              {
                icon: <Phone className="h-5 w-5" />,
                label: "Phone",
                content: (
                  <a href="tel:+16019280088" className="text-primary hover:underline text-sm">
                    (601) 928-0088
                  </a>
                ),
              },
              {
                icon: <Mail className="h-5 w-5" />,
                label: "Email",
                content: (
                  <a href="mailto:info@ichattiesburg.org" className="text-primary hover:underline text-sm">
                    info@ichattiesburg.org
                  </a>
                ),
              },
              {
                icon: <Clock className="h-5 w-5" />,
                label: "Prayer Times",
                content: (
                  <p className="text-muted-foreground text-sm">
                    Open for all five daily prayers.<br />
                    See <a href="/prayer-times" className="text-primary hover:underline">prayer times page</a> for current schedule.
                  </p>
                ),
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium text-sm mb-1">{item.label}</div>
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="font-medium text-sm mb-3">Social Media</div>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/ichattiesburg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:opacity-90"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/ichattiesburg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium hover:opacity-90"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
