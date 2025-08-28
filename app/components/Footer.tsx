import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image src="/bappuji_main_logo_enhanced.png" alt="Logo" width={200} height={100} />
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Empowering communities through arts, sports, culture, and social service.
              Building a brighter future for Kalkuzhy and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/bappujikalkuzhy" target="_blank" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/bappujikalkuzhy?igsh=MXRieWg2NDJodzZkcg==" target="_blank" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/qr/N3TH3LTNAH7HN1" target="_blank" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>



          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-teal-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">
                  Kalkuzhy, Thrissur<br />
                  Kerala, India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-teal-400 flex-shrink-0" />
                <p className="text-gray-300">+91 81390 76084</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-teal-400 flex-shrink-0" />
                <p className="text-gray-300">bappujikalkuzhy@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='border-2 border-white rounded-lg'>
            <iframe
              title="google-maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15696.52135037926!2d76.35140208172456!3d10.41122154002795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7fdbd3d843231%3A0x971a17089998cc35!2sBappuji%20Kala%20Kayika%20Samskarika%20Vedhi!5e0!3m2!1sen!2sin!4v1756402096082!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: 3, borderColor: 'white' }}
              // allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-full"
            ></iframe>



            {/* <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Mission & Vision', 'Activities', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' & ', '-').replace(' ', '')}`}
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row text-center justify-center items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Bappuji Kala Kayika Samskarika Vedhi. All Rights Reserved <br />| Registered under Act 12 of 1955 | Affiliated with Kerala Youth Welfare Board & MY Bharat | Darpan Registered | Banking Partner: South Indian Bank.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;