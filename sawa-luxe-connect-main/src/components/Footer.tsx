import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

const STORE_PHONE = import.meta.env.VITE_STORE_PHONE ?? '+254 700 000 000';
const STORE_PHONE_PLAIN = import.meta.env.VITE_STORE_PHONE_PLAIN ?? '254700000000';
const STORE_LOCATION = import.meta.env.VITE_STORE_LOCATION ?? 'Sawa Mall, Section 1\nEastleigh, Nairobi';

const Footer = () => {
  return (
    <footer className="bg-chocolate text-ivory">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-2">Hafsa's</h3>
            <p className="text-ivory/60 text-sm mb-4">
              Eastleigh's premier destination for luxury jewelry, designer bags, and premium makeup.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${STORE_PHONE_PLAIN}`}
                className="w-10 h-10 rounded-full bg-whatsapp flex items-center justify-center hover:bg-whatsapp/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-accent font-semibold mb-4 text-primary">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#jewelry" className="text-ivory/60 hover:text-primary transition-colors">
                  Jewelry Collection
                </a>
              </li>
              <li>
                <a href="#bags" className="text-ivory/60 hover:text-primary transition-colors">
                  Designer Bags
                </a>
              </li>
              <li>
                <a href="#makeup" className="text-ivory/60 hover:text-primary transition-colors">
                  Makeup Essentials
                </a>
              </li>
              <li>
                <a href="#" className="text-ivory/60 hover:text-primary transition-colors">
                  New Arrivals
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-accent font-semibold mb-4 text-primary">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-ivory/60 whitespace-pre-line">{STORE_LOCATION}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${STORE_PHONE}`} className="text-ivory/60 hover:text-primary transition-colors">
                  {STORE_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-whatsapp" />
                <a href={`https://wa.me/${STORE_PHONE_PLAIN}`} className="text-ivory/60 hover:text-whatsapp transition-colors">
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-accent font-semibold mb-4 text-primary">Store Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-ivory/60">
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-ivory/5 rounded-lg">
              <p className="text-xs text-ivory/60">
                🚚 <span className="text-primary">Same-day delivery</span> within Eastleigh for orders before 4 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ivory/40">
          <p>© 2025 Hafsa's Boutique. All rights reserved.</p>
          <p>Crafted with ❤️ in Eastleigh, Nairobi</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
