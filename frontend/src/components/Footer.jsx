import { assets } from "@/assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const footerLinks = ["Collection", "About", "Contact", "Privacy"];

const Footer = () => {
  return (
    <footer className="border-t border-[#E5E5E5] bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <img src={assets.logo} alt="Noir Eternal" className="h-8 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#000000]/70">
            Considered clothing for daily rotation, edited in clean forms and quiet details.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#000000]">
            Explore
          </h3>
          <ul className="mt-4 space-y-3">
            {footerLinks.map((link) => (
              <li key={link}>
                <Link to="/" className="text-sm text-[#000000]/70 hover:text-[#000000]">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#000000]">
            Contact
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[#000000]/70">
            <p>support@noireternal.com</p>
            <p>Everyday support, 10 AM - 6 PM</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-[#E5E5E5] pt-6 text-sm text-[#000000]/60">
        Copyright 2026 Noir Eternal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
