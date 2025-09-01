
"use client";
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { announcements } from '../data/announcements';

const NotificationBell = () => {
  const [isHovering, setIsHovering] = useState(false);

  const truncate = (str: string, numWords: number) => {
    return str.split(" ").splice(0, numWords).join(" ");
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href="/announcements" passHref>
        <button className="relative hover:text-gray-800 bg-white shadow-md hover:shadow-lg rounded-lg px-4 py-1 text-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-teal-500">
          <Bell className="h-6 w-6" />
        </button>
      </Link>
      {isHovering && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <p className="font-semibold text-gray-800">{truncate(ann.title, 5)}...</p>
                <p className="text-sm text-gray-600 my-1">{truncate(ann.content, 5)}...</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{ann.date}</span>
                  <span>{ann.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 text-center">
            <Link href="/announcements" passHref>
              <span className="text-sm text-teal-600 hover:text-teal-800 font-semibold">View all</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
