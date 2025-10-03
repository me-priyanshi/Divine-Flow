import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  Info, 
  Car, 
  Phone, 
  Settings,
  QrCode
} from 'lucide-react';
import { translations } from '../data/translations';

const Navigation = ({ language }) => {
  const t = translations[language];

  const navItems = [
    { path: '/', icon: Home, label: t.home },
    { path: '/queue', icon: Clock, label: t.queue },
    { path: '/temple-info', icon: Info, label: t.templeInfo },
    { path: '/traffic', icon: Car, label: t.traffic },
    // { path: '/verify', icon: QrCode, label: 'Verify' },
    { path: '/settings', icon: Settings, label: t.settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
