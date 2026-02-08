import Link from 'next/link';
import { Store } from 'lucide-react';
import { NewsletterSignup } from './newsletter-signup';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-6 h-6 text-orange-500" />
              <span className="font-bold text-lg">CountyConnect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your local community hub for Navarro County, Texas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-white transition">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/directory/jobs" className="text-gray-400 hover:text-white transition">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/directory/community-resources" className="text-gray-400 hover:text-white transition">
                  Community Resources
                </Link>
              </li>
              <li>
                <Link href="/directory/events" className="text-gray-400 hover:text-white transition">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition">
                  Press & Partnerships
                </Link>
              </li>
              <li>
                <Link href="/account/support" className="text-gray-400 hover:text-white transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 pb-8">
          <NewsletterSignup variant="footer" className="max-w-md" />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Leo Ashcraft. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm italic">
            Not affiliated with Navarro County government.
          </p>
        </div>
      </div>
    </footer>
  );
}
