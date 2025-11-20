import clsx from "clsx";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const interests = [
  "Drawing",
  "Photography",
  "Design",
  "Music",
  "Dancing",
  "Reading books",
  "Programming",
  "Languages",
  "History",
  "Psychology",
  "Fitness",
  "Yoga",
  "Running",
  "Swimming",
  "Extreme sports",
  "Video games",
  "Board games",
  "Movies",
  "Anime",
  "Role-playing games",
  "Traveling",
  "Hiking",
  "Fishing",
  "Gardening",
  "Cooking",
  "Coffee/Tea",
  "Sports",
  "Robotics",
  "DIY",
  "Cars/Motorcycles",
  "Volunteering",
  "Communities",
];

interface IProps {
  handleBack: () => void;
}

export const HobbiesSelector = ({ handleBack }: IProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="bg-gradient-to-t from-[#8b53ff] to-transparent rounded-[16px] shadow-[0px_32px_64px_-12px_#10182824] p-[1.5px] z-[2] relative p-6 font-manrope max-w-3xl mx-auto">
      <div className="bg-white p-[32px] sm:p-[48px] rounded-[16px]">
        <h2 className="text-2xl font-bold mb-4">Select Your Interests</h2>
        <p className="text-gray-600 mb-6">
          Choose hobbies and topics that you like. This helps us recommend
          relevant content and friends.
        </p>

        <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-wrap gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={clsx(
                "px-4 py-2 rounded-full border border-gray-300 transition-colors duration-200 text-sm font-medium duration-300 cursor-pointer",
                selected.includes(interest)
                  ? "bg-main text-white border-main"
                  : "bg-white text-gray-700 hover:bg-main/70"
              )}
            >
              {interest}
            </button>
          ))}
        </div>

        <button className="mt-7 group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] bg-gray-900 text-white w-full font-[500] cursor-pointer hover:opacity-70 duration-300">
          Create account
          <FiArrowRight className="group-hover:translate-x-[15%] duration-300" />
        </button>
        <button
          onClick={handleBack}
          className="mt-2 group flex items-center justify-center gap-3 min-h-[48px] rounded-[12px] border border-gray-500 text-gray-700 w-full font-[500] cursor-pointer hover:opacity-70 duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};
