"use client";
import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { activities, Activity } from "../data/activities";

// Activity card
const ActivityCard: React.FC<{
  activity: Activity;
  onReadMore: () => void;
}> = ({ activity, onReadMore }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-gradient-to-br ${activity.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}
    >
      <div className="aspect-w-16 aspect-h-10 mb-6">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
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
        className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg w-full"
        aria-label={`Read more about ${activity.title}`}
      >
        Read More
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
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center pt-14 justify-center z-50"
      onClick={onClose}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg relative overflow-y-auto max-h-[80vh] scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:text-teal-600 text-gray-700 text-2xl font-bold z-50"
          aria-label="Close"
        >
          <IoCloseCircleOutline />
        </button>
        <h3 className="text-xl font-bold text-teal-600 mb-4">
          {activity.title}
        </h3>
        <div
          className="text-gray-700 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: activity.fullDescription }}
        />
      </div>
    </div>
  );
};

const Activities: React.FC = () => {
  const [selected, setSelected] = useState<Activity | null>(null);

  return (
    <section
      id="activities"
      className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          ACTIVITIES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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