import { useEffect } from "react";
import { Settings } from "./tabs/Settings";
import { useAppStore } from "../../stores/app";
import { useTranslation } from "react-i18next";
import { LANGS } from "../../constants/langs";
import { Search } from "./tabs/Search";
import { Saved } from "./tabs/Saved";
import { Profile } from "./tabs/Profile";
import { Home } from "./tabs/Home";
import { Chats } from "./tabs/Chats";

export const Main = () => {
  const { activeTab, setSelectedLanguage } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
    const found = LANGS.find((l) => l.code === savedLanguage);
    if (found) setSelectedLanguage(found);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Home />;
      case 1:
        return <Search />;
      case 2:
        return <Chats />;
      case 3:
        return <Saved />;
      case 4:
        return <Profile />;
      case 5:
        return <Settings />;
      default:
        return null;
    }
  };
  return <>{renderTabContent()}</>;
};
