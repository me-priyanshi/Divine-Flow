import { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Bell, 
  Moon, 
  Sun,
  Smartphone,
  Download,
  Info,
  Shield,
  HelpCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';
import { useTheme } from '../contexts/ThemeContext';

const Settings = ({ language, onLanguageChange, selectedTemple, onTempleChange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    queueUpdates: true,
    darshanReminders: true,
    trafficAlerts: true,
    emergencyAlerts: true
  });
  const [offlineMode, setOfflineMode] = useState(false);
  
  const t = translations[language];

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
  ];

  const temples = Object.keys(templeData);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInstallPWA = () => {
    // Check if PWA is installable
    if ('serviceWorker' in navigator) {
      // Show installation instructions
      alert(`${t.installing}\n\nTo install this app:\n\n1. Open browser menu (⋮)\n2. Select "Add to Home Screen" or "Install App"\n3. Follow the prompts\n\nOr use Ctrl+Shift+A (Chrome) / Cmd+Shift+A (Safari)`);
    } else {
      alert('PWA installation not supported on this browser');
    }
  };

  const handleExportData = () => {
    const data = {
      language,
      selectedTemple,
      notifications,
      darkMode,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temple-app-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrivacyPolicy = () => {
    alert('Privacy Policy\n\nWe respect your privacy and are committed to protecting your personal data. This app stores minimal data locally on your device and does not share personal information with third parties without your consent.\n\nFor the full privacy policy, visit our website or contact support.');
  };

  const handleTermsOfService = () => {
    alert('Terms of Service\n\nBy using this app, you agree to our terms and conditions. This app is provided for temple crowd management and booking purposes. Users are responsible for providing accurate information and following temple guidelines.\n\nFor complete terms, visit our website or contact support.');
  };

  const handleFAQ = () => {
    alert('Frequently Asked Questions\n\n1. How do I book a darshan slot?\n   - Go to Queue Management and select your preferred time slot.\n\n2. Can I cancel my booking?\n   - Yes, you can leave the queue from the queue status page.\n\n3. Is the app free to use?\n   - Yes, the app is free. Some premium darshan slots may have charges.\n\n4. How do I change my temple selection?\n   - Use the temple selector in the header or go to Settings.\n\nFor more questions, contact our support team.');
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@temple-app.com';
    const subject = encodeURIComponent('Temple App Support Request');
    const body = encodeURIComponent(`Hello Support Team,\n\nI need help with:\n\nApp Version: 1.0.0\nSelected Temple: ${templeData[selectedTemple].name}\nLanguage: ${language}\n\nPlease describe your issue below:\n\n`);
    
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_self');
  };

  const handleSendFeedback = () => {
    const feedbackEmail = 'feedback@temple-app.com';
    const subject = encodeURIComponent('Temple App Feedback');
    const body = encodeURIComponent(`Hello Team,\n\nI'd like to share my feedback about the Temple Crowd Management App:\n\nApp Version: 1.0.0\nSelected Temple: ${templeData[selectedTemple].name}\nLanguage: ${language}\n\nMy feedback:\n\n`);
    
    window.open(`mailto:${feedbackEmail}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.settings}</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your temple experience</p>
      </div>

      {/* Language Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Language Preferences</h2>
        </div>
        
        <div className="space-y-3">
          {languages.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            >
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={language === lang.code}
                onChange={() => onLanguageChange(lang.code)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{lang.nativeName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{lang.name}</div>
              </div>
              {language === lang.code && (
                <Check className="h-5 w-5 text-primary-600" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Temple Selection */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Default Temple</h2>
        </div>
        
        <div className="space-y-3">
          {temples.map((temple) => (
            <label
              key={temple}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            >
              <input
                type="radio"
                name="temple"
                value={temple}
                checked={selectedTemple === temple}
                onChange={() => onTempleChange(temple)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{t.temples[temple]}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{templeData[temple].location}</div>
              </div>
              {selectedTemple === temple && (
                <Check className="h-5 w-5 text-primary-600" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Queue Updates</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Get notified about your queue position</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.queueUpdates}
                onChange={() => handleNotificationChange('queueUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Darshan Reminders</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reminders for your booked darshan slots</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.darshanReminders}
                onChange={() => handleNotificationChange('darshanReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Traffic Alerts</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Updates about traffic and parking</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.trafficAlerts}
                onChange={() => handleNotificationChange('trafficAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Emergency Alerts</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Important safety and emergency notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emergencyAlerts}
                onChange={() => handleNotificationChange('emergencyAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Switch to dark theme</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Offline Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Download content for offline use</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={() => setOfflineMode(!offlineMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* PWA Installation */}
      <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="h-6 w-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Install App</h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Install this app on your device for a better experience and offline access.
        </p>
        
        <button
          onClick={handleInstallPWA}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Install App</span>
        </button>
      </div>

      {/* Data & Privacy */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data & Privacy</h2>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Download your app data and settings</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
          
          <button 
            onClick={handlePrivacyPolicy}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Privacy Policy</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Learn how we protect your data</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
          
          <button 
            onClick={handleTermsOfService}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Terms of Service</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Read our terms and conditions</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
        </div>
      </div>

      {/* Help & Support */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <HelpCircle className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Help & Support</h2>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleFAQ}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">FAQ</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Frequently asked questions</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
          
          <button 
            onClick={handleContactSupport}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Get help from our support team</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
          
          <button 
            onClick={handleSendFeedback}
            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Send Feedback</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Help us improve the app</div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="h-6 w-6 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">App Information</h2>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">October 2, 2025</span>
          </div>
          <div className="flex justify-between">
            <span>Developer:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">DevAIne Guardians</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
