"use client";
import React, { useState } from "react";
import { Mail, Phone, Award } from "lucide-react";
import { leaders } from "../data/leaders";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import SlideText from "./SlideText";

// Card component for reuse
const LeaderCard: React.FC<{
  leader: (typeof leaders)[number];
  showAchievements?: boolean;
}> = ({ leader, showAchievements = false }) => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="aspect-square overflow-hidden">
      <img
        src={leader.image}
        alt={leader.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{leader.name}</h3>
      <p className="text-blue-600 font-semibold mb-4">{leader.position}</p>
      <p className="text-gray-600 mb-4 text-sm">{leader.experience}</p>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-blue-500" />
          <a
            href={`mailto:${leader.email}`}
            className="hover:text-blue-600 transition-colors"
          >
            {leader.email}
          </a>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-blue-500" />
          <a
            href={`tel:${leader.phone}`}
            className="hover:text-blue-600 transition-colors"
          >
            {leader.phone}
          </a>
        </div>
      </div>

      {/* Achievements */}
      {showAchievements && leader.achievements?.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center mb-2">
            <Award className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">
              Achievements
            </span>
          </div>
          <ul className="space-y-1">
            {leader.achievements.map((achievement, idx) => (
              <li
                key={idx}
                className="text-xs text-gray-600 flex items-start"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const About: React.FC = () => {
  const [showFullText, setShowFullText] = useState(false);
  const [showBoardMembers, setShowBoardMembers] = useState(false);

  const fullText = `Bappuji Kala Kayika Samskarika Vedhi (Bappuji Arts, Sports & Cultural Forum) is a vibrant community forum rooted in the heart of Kalkuzhy, Thrissur.
              <br /><br />
              Established in the late 1970s and proudly re-established in 2014, we continue to stand as a beacon of secular and democratic values, committed to the holistic growth of our village and its people,especially youth.
              <br /><br />
              Our initiatives span across arts, sports, culture, and social service, creating opportunities to nurture talent, inspire creativity, and strengthen community bonds. From lively festivals and competitions to meaningful service projects, we bring people together in the spirit of unity and progress.
              <br /><br />
              At Bappuji Kala Kayika Samskarika Vedhi, we believe every voice matters and every effort counts. Together, we are building a more connected, engaged, and forward-thinking Kalkuzhy. `;

  const words = fullText.split(/\s+/);
  const shortText = words.slice(0, 60).join(" ");
  const remainingText = words.slice(60).join(" ");

  const otherMembers = leaders.filter(
    (leader) =>
      leader.position !== "Executive Committee Member" &&
      leader.position !== "Action Council Member"
  );
  const executiveMembers = leaders.filter(
    (leader) => leader.position === "Executive Committee Member"
  );
  const actionCouncilMembers = leaders.filter(
    (leader) => leader.position === "Action Council Member"
  );

  // Helper to render leader grids
  const renderGrid = (
    members: typeof leaders,
    showAchievements = false
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((leader, index) => (
        <LeaderCard
          key={index}
          leader={leader}
          showAchievements={showAchievements}
        />
      ))}
    </div>
  );

  return (
    <section id="about" className="bg-[#f6f3ee] py-16 sm:py-24">
      <div data-scroll-y="80" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-md">
              <img
                src="/images/about-forum.png"
                alt="Members of the Bappuji community forum in Kalkuzhy"
                data-speed="0.86"
                className="h-72 w-full scale-110 object-cover sm:h-96"
              />
            </div>
          </Reveal>
          <div>
          <Reveal>
            <SectionHeading
              eyebrow="Our story"
              title="About us"
              subtitle="A community forum for arts, sports, culture, and service in the heart of Kalkuzhy."
              align="left"
            />
          </Reveal>
          <Reveal delay={0.08}>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/80 sm:p-10">
            <SlideText delay={0.12}>
            <p className="text-base leading-relaxed text-stone-700 sm:text-lg">
              <span dangerouslySetInnerHTML={{ __html: shortText }} />
              {!showFullText && words.length > 60 && <span>... </span>}
              {showFullText && (
                <span dangerouslySetInnerHTML={{ __html: remainingText }} />
              )}
              {!showFullText && words.length > 60 && (
                <button
                  type="button"
                  onClick={() => setShowFullText(true)}
                  className="ml-1 font-semibold text-teal-700 hover:text-teal-900"
                >
                  Read more
                </button>
              )}
              {showFullText && (
                <button
                  type="button"
                  onClick={() => setShowFullText(false)}
                  className="ml-1 font-semibold text-teal-700 hover:text-teal-900"
                >
                  Read less
                </button>
              )}
            </p>
            </SlideText>
          </div>
          </Reveal>
          </div>

          {showBoardMembers && (
            <div className="mt-12 lg:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Board Members
              </h3>
              {otherMembers.length > 0 && renderGrid(otherMembers, true)}

              {/* Executive Committee Members */}
              {executiveMembers.length > 0 && (
                <>
                  <hr className="my-12 border-gray-300" />
                  <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                    Executive Committee Members
                  </h4>
                  {renderGrid(executiveMembers)}
                </>
              )}
              {/* Action Council Members */}
              {actionCouncilMembers.length > 0 && (
                <>
                  <hr className="my-12 border-gray-300" />
                  <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                    Action Council Members
                  </h4>
                  {renderGrid(actionCouncilMembers)}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;