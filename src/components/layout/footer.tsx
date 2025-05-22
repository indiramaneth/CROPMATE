import Link from "next/link";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Cropmate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting farmers with vendors through a seamless platform for
              fresh produce exchange.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Social Media Icons */}
              {["twitter", "facebook", "instagram", "linkedin"].map(
                (social) => (
                  <Link
                    key={social}
                    href={`https://${social}.com/cropmate`}
                    className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors"
                    aria-label={`Cropmate on ${social}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      {social === "twitter" && (
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      )}
                      {social === "facebook" && (
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      )}
                      {social === "instagram" && (
                        <>
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </>
                      )}
                      {social === "linkedin" && (
                        <>
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </>
                      )}
                    </svg>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Browse Crops", href: "/crops" },
                { name: "About Us", href: "/about" },
                { name: "Sign Up", href: "/register" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Farming Tips", href: "/resources/farming-tips" },
                { name: "Market Trends", href: "/resources/market-trends" },
                { name: "FAQ", href: "/faq" },
                { name: "Support", href: "/support" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Farm Tech Way</li>
              <li>Silicon Valley, CA</li>
              <li>contact@cropmate.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cropmate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
