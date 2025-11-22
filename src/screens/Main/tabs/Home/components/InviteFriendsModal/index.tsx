import { useState } from "react";
import { IoIosClose, IoIosCopy } from "react-icons/io";
import { FaWhatsapp, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  invitedFriends: number;
  earnedRewards: number;
}

export const InviteFriendsModal = ({
  isOpen,
  onClose,
  referralCode,
  invitedFriends,
  earnedRewards,
}: InviteFriendsModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const referralLink = `https://myapp.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialShare = {
    whatsapp: `https://wa.me/?text=Join me: ${referralLink}`,
    telegram: `https://t.me/share/url?url=${referralLink}&text=Join me!`,
    email: `mailto:?subject=Join me&body=Sign up using my referral link: ${referralLink}`,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <IoIosClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2">Invite your friends</h2>
        <p className="text-gray-500 mb-6">
          Get rewards when your friends join using your referral link
        </p>

        {/* Referral code */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl mb-6">
          <span className="font-mono font-semibold text-gray-900">{referralCode}</span>
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
          >
            <IoIosCopy />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Social share */}
        <div className="flex gap-4 mb-6">
          <a
            href={socialShare.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href={socialShare.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-400 text-white py-2 rounded-xl hover:bg-blue-500 transition"
          >
            <FaTelegramPlane /> Telegram
          </a>
          <a
            href={socialShare.email}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-900 transition"
          >
            <FaEnvelope /> Email
          </a>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-4 border-t pt-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{invitedFriends}</span>
            <span className="text-gray-500 text-sm">Friends joined</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{earnedRewards} NC</span>
            <span className="text-gray-500 text-sm">Rewards earned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
