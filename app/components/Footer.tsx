import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                <Image src="/bappuji.png" alt="Logo" width={30} height={30} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-[0.3em]">BAPPUJI</h1>
                <p className="text-[8px] font-bold text-gray-400">FROM HOPE TO HEIGHTS TO THRIVE</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Empowering communities through arts, sports, culture, and social service.
              Building a brighter future for Kalkuzhy and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'About', 'Mission & Vision', 'Activities', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' & ', '-').replace(' ', '')}`}
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
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
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row text-center justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Bappuji Kala Kayika Samskarika Vedhi. All Rights Reserved <br />| Registered under Act 12 of 1955 | Affiliated with Kerala Youth Welfare Board & MY Bharat | Darpan Registered | Banking Partner: South Indian Bank.
            </p>
            {/* <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Terms of Service
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;