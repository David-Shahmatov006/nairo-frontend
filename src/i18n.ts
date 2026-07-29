import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

const savedLang = localStorage.getItem("language") || "en";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: "en",
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
