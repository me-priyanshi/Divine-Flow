import { useState } from 'react';
import { ChevronDown, Globe, MapPin } from 'lucide-react';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';

const Header = ({ language, onLanguageChange, selectedTemple, onTempleChange }) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTempleMenu, setShowTempleMenu] = useState(false);
  
  const t = translations[language];
  const currentTemple = templeData[selectedTemple];

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
  ];

  const temples = Object.keys(templeData);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Title */}
          <div className="flex items-center">
            <img 
                src="/DivineFlowLogo.png" 
                alt="DivineFlow Logo"
                className='h-11 w-auto'
              />
            <div className="flex-shrink-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 temple-gradient bg-clip-text text-transparent">
                &nbsp;&nbsp;{t.appTitle}
              </h1>
            </div>
          </div>

          {/* Temple Selector */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowTempleMenu(!showTempleMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <MapPin className="h-4 w-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  {t.temples[selectedTemple]}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showTempleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {temples.map((temple) => (
                    <button
                      key={temple}
                      onClick={() => {
                        onTempleChange(temple);
                        setShowTempleMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        selectedTemple === temple ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t.temples[temple]}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{templeData[temple].location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <Globe className="h-4 w-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  {languages.find(lang => lang.code === language)?.nativeName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showLanguageMenu || showTempleMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowLanguageMenu(false);
            setShowTempleMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
