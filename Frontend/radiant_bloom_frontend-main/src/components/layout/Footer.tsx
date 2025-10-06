import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, RotateCcw, Banknote, Headphones, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<null | string>(null);

  const handleSubscribe = () => {
    if (!email) {
      setMessage("❌ Please enter a valid email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("❌ Invalid email format");
      return;
    }

    // ✅ Call API here if you have backend
    console.log("Subscribed with email:", email);

    setEmail("");
    setMessage("✅ Successfully subscribed!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Trust Badges Section */}
      <div className="bg-background border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">Shipped In 1-3 Days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Free Returns</h3>
                <p className="text-sm text-muted-foreground">Free 7 Days Return</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Banknote className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Payment On Delivery</h3>
                <p className="text-sm text-muted-foreground">Cash On Delivery (Rs:)</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Customer Support</h3>
                <p className="text-sm text-muted-foreground">
                  📞 (021) 111-624-333<br />
                  📧 support@radiantbloom.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="text-sm">
                    <a
                      href="https://maps.google.com/?q=156-157, Block 3, BYJCHS, Bahadurabad Karachi"
                      target="_blank"
                      className="hover:underline"
                    >
                      156-157, Block 3, BYJCHS, Bahadurabad, Karachi
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                  <div className="text-sm">
                    <a
                      href="https://maps.google.com/?q=Safa Mall, Ziarat Line, Malir Cantonment Karachi"
                      target="_blank"
                      className="hover:underline"
                    >
                      Safa Mall, Ziarat Line, Malir Cantonment, Karachi
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary" />
                  <a href="tel:021111624333" className="text-sm hover:underline">
                    (021) 111-624-333
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-secondary" />
                  <a href="mailto:support@radiantbloom.com" className="text-sm hover:underline">
                    support@radiantbloom.com
                  </a>
                </div>
              </div>
            </div>

            {/* Customer Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Customer Services</h3>
              <ul className="space-y-3">
                <li><a href="/contact" className="text-sm hover:text-secondary">Contact Us</a></li>
                <li><a href="/delivery" className="text-sm hover:text-secondary">Delivery Info</a></li>
                <li><a href="/faq" className="text-sm hover:text-secondary">FAQs</a></li>
                <li><a href="/loyalty" className="text-sm hover:text-secondary">Naheed-Loyalty</a></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Information</h3>
              <ul className="space-y-3">
                <li><a href="/about" className="text-sm hover:text-secondary">About Us</a></li>
                <li><a href="/return-policy" className="text-sm hover:text-secondary">Return & Refund</a></li>
                <li><a href="/privacy" className="text-sm hover:text-secondary">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm hover:text-secondary">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Subscribe our Newsletter</h3>
              <div className="space-y-4">
                <p className="text-sm">Get the latest offers and promotions!</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background text-foreground border-border"
                  />
                  <Button
                    onClick={handleSubscribe}
                    className="bg-secondary hover:bg-secondary/90 text-white px-6"
                  >
                    Subscribe
                  </Button>
                </div>
                {message && (
                  <p className="text-sm mt-2">{message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-primary-light/20 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-primary-foreground/80">
            <p>Copyright © 2025 Radiant Bloom. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
