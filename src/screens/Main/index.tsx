import { useEffect, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { Settings } from "./tabs/Settings";
import { Home } from "./tabs/Home";
import { useAppStore } from "../../stores/app";
import { useTranslation } from "react-i18next";
import { LANGS } from "../../constants/langs";
import { Search } from "./tabs/Search";
import { Saved } from "./tabs/Saved";
import { Profile } from "./tabs/Profile";

export const Main = () => {
  const savedTab = localStorage.getItem("activeTab");
  const initialTab = savedTab ? parseInt(savedTab, 10) : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const { setSelectedLanguage } = useAppStore();
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
        return <Search setActiveTab={setActiveTab} />;
      case 2:
        return <Saved />;
      case 3:
        return <Profile />;
      case 4:
        return <Settings />;
      default:
        return null;
    }
  };
  return (
    <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTabContent()}
    </MainLayout>
  );
};
