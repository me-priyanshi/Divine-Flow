import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Temple & Pilgrimage Crowd Management",
      selectTemple: "Select a Temple",
      queueTicketing: "Queue & Ticketing",
      pilgrimInfo: "Pilgrim Info",
      trafficMobility: "Traffic & Mobility",
      joinQueue: "Join Queue",
      yourQueueNumber: "Your Queue Number",
      estimatedWaitTime: "Estimated Wait Time",
      buyDigitalPass: "Buy Digital Pass - ₹500",
      peopleInQueue: "People in Queue",
      avgWaitTime: "Avg Wait Time",
      templeHours: "Temple Hours"
    }
  },
  hi: {
    translation: {
      welcome: "मंदिर और तीर्थयात्रा भीड़ प्रबंधन में आपका स्वागत है",
      selectTemple: "मंदिर चुनें",
      queueTicketing: "कतार और टिकटिंग",
      pilgrimInfo: "तीर्थयात्री जानकारी",
      trafficMobility: "यातायात और गतिशीलता",
      joinQueue: "कतार में शामिल हों",
      yourQueueNumber: "आपका कतार संख्या",
      estimatedWaitTime: "अनुमानित प्रतीक्षा समय",
      buyDigitalPass: "डिजिटल पास खरीदें - ₹500",
      peopleInQueue: "कतार में लोग",
      avgWaitTime: "औसत प्रतीक्षा समय",
      templeHours: "मंदिर के घंटे"
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
