import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import SlideText from './SlideText';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07110f] text-white">
      <div data-scroll-y="60" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-5 inline-flex rounded-xl bg-black px-2 py-1">
              <Image src="/bappuji_main_logo_enhanced.png" alt="Logo" width={200} height={64} className="h-12 w-auto" />
            </div>
            <SlideText delay={0.08}>
              <p className="mb-6 max-w-md leading-relaxed text-stone-300">
                Empowering communities through arts, sports, culture, and social service.
                Building a brighter future for Kalkuzhy and beyond.
              </p>
            </SlideText>
            <div className="flex gap-3">
              <a href="https://facebook.com/bappujikalkuzhy" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-3 transition hover:bg-teal-600">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/bappujikalkuzhy?igsh=MXRieWg2NDJodzZkcg==" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-3 transition hover:bg-teal-600">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/qr/N3TH3LTNAH7HN1" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full bg-white/10 p-3 transition hover:bg-teal-600">
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <SlideText>
              <h4 className="mb-5 font-display text-xl">Contact</h4>
            </SlideText>
            <div className="space-y-4 text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-amber-200" />
                <p>
                  Kalkuzhy, Thrissur<br />
                  Kerala, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-amber-200" />
                <a href="tel:+918139076084" className="hover:text-white">+91 81390 76084</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-amber-200" />
                <a href="mailto:bappujikalkuzhy@gmail.com" className="break-all hover:text-white">bappujikalkuzhy@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-4">
            <SlideText>
              <h4 className="mb-5 font-display text-xl">Find us</h4>
            </SlideText>
            <div className="h-52 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-56">
              <iframe
                title="google-maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15696.52135037926!2d76.35140208172456!3d10.41122154002795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7fdbd3d843231%3A0x971a17089998cc35!2sBappuji%20Kala%20Kayika%20Samskarika%20Vedhi!5e0!3m2!1sen!2sin!4v1756402096082!5m2!1sen!2sin"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <SlideText>
          <p className="text-xs leading-relaxed text-stone-400 sm:text-sm">
            © 2025 Bappuji Kala Kayika Samskarika Vedhi. All Rights Reserved
            <br />
            Registered under Act 12 of 1955 | Affiliated with Kerala Youth Welfare Board & MY Bharat | Darpan Registered | Banking Partner: South Indian Bank.
          </p>
          </SlideText>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
