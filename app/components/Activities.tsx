"use client";
import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { activities, Activity } from "../data/activities";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

// Activity card
const ActivityCard: React.FC<{
  activity: Activity;
  onReadMore: () => void;
}> = ({ activity, onReadMore }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`group h-full rounded-3xl bg-gradient-to-br ${activity.color} p-4 shadow-md ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5`}
    >
      <div className="mb-5 overflow-hidden rounded-2xl">
        <img
          src={activity.image}
          alt={activity.title}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
        {activity.title}
      </h3>
      <p className="text-gray-700 mb-6 text-sm leading-relaxed">
        {activity.description.split(" ").length > 5 ? (
          <>
            {expanded ? activity.description : activity.description.split(" ").slice(0, 5).join(" ") + "..."}
            {!expanded && (
              <button
                className="text-teal-600 underline ml-1"
                onClick={() => setExpanded(true)}
                type="button"
              >
                more
              </button>
            )}
            {expanded && (
              <button
                className="text-teal-600 underline ml-1"
                onClick={() => setExpanded(false)}
                type="button"
              >
                less
              </button>
            )}

          </>
        ) : (
          activity.description
        )}
      </p>
      <button
        onClick={onReadMore}
        className="w-full rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-teal-800"
        aria-label={`Read more about ${activity.title}`}
      >
        Read more
      </button>
    </div>
  );
};

// Modal popup
const ActivityModal: React.FC<{
  activity: Activity;
  onClose: () => void;
}> = ({ activity, onClose }) => {
  // Handle ESC to close modal
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler as any);
    return () => window.removeEventListener("keydown", handler as any);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative max-h-[88vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
      onClick={(e) => e.stopPropagation()}>
        <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:text-teal-600 text-gray-700 text-2xl font-bold z-50"
            aria-label="Close"
          >
            <IoCloseCircleOutline className="w-6 h-6 text-gray-700" />
          </button>
        <div
          className="bg-white p-6 overflow-y-auto max-h-[80vh] scrollbar-hide">
          <h3 className="text-xl font-bold text-teal-600 mb-4">
            {activity.title}
          </h3>
          <div
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: activity.fullDescription }}
          />
        </div>
      </div>
    </div>
  );
};

const Activities: React.FC = () => {
  const [selected, setSelected] = useState<Activity | null>(null);

  return (
    <section
      id="activities"
      className="bg-white py-16 sm:py-24"
    >
      <div data-scroll-y="80" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Activities"
            subtitle="Sports, arts, youth programmes, and service that keep Kalkuzhy moving."
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.title}
              activity={activity}
              onReadMore={() => setSelected(activity)}
            />
          ))}
        </div>
      </div>
      {selected && (
        <ActivityModal activity={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default Activities;