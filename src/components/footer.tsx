import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                ICH
              </div>
              <div>
                <div className="font-semibold text-sm">Islamic Center</div>
                <div className="text-xs text-muted-foreground">of Hattiesburg</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Serving the Muslim community of Hattiesburg, Mississippi with
              prayer, education, and community programs.
            </p>
            <div className="text-lg font-arabic text-primary">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { href: "/prayer-times", label: "Prayer Times" },
                { href: "/events", label: "Events Calendar" },
                { href: "/donate", label: "Donate" },
                { href: "/about", label: "About ICH" },
                { href: "/about#oak-grove", label: "Oak Grove Project" },
                { href: "/resources", label: "Islamic Resources" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>
                  21 Windmill Drive<br />
                  Hattiesburg, MS 39402
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+16019280088" className="hover:text-primary transition-colors">
                  (601) 928-0088
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:ichattiesburg@protonmail.com" className="hover:text-primary transition-colors">
                  ichattiesburg@protonmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Prayer */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Follow Us</h3>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.facebook.com/ichattiesburg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://www.instagram.com/ichattiesburg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-bold"
                aria-label="Instagram"
              >
                ig
              </a>
            </div>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Islamic Center of Hattiesburg. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
