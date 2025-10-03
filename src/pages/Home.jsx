import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Calendar, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { translations } from '../data/translations';
import { templeData, queueData } from '../data/templeData';
import DivineFlowLogo from '../../public/DivineFlowLogo.png';

const Home = ({ language, selectedTemple }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [crowdLevel, setCrowdLevel] = useState('medium');
  
  const t = translations[language];
  const temple = templeData[selectedTemple];
  const queue = queueData[selectedTemple];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate crowd level based on queue length
    if (queue.currentQueue < 100) setCrowdLevel('low');
    else if (queue.currentQueue < 200) setCrowdLevel('medium');
    else if (queue.currentQueue < 300) setCrowdLevel('high');
    else setCrowdLevel('veryHigh');
  }, [queue.currentQueue]);

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'veryHigh': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getNextDarshanTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (const slot of queue.darshanSlots) {
      const [hour, minute] = slot.time.split(':').map(Number);
      if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
        return slot.time;
      }
    }
    return queue.darshanSlots[0].time; // Next day's first slot
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center justify-center py-8">
        <div className='flex justify-center'>
        <img 
          src={DivineFlowLogo} 
          alt="DivineFlow Logo"
          height={100}
          width={180}
        /> 
        </div>
        <br/>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          🙏🏻 {t.welcome} 🙏🏻
        </h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4" />
          <h4><span>{temple.name}</span></h4>
        </div>
        <div className="mt-2 text-lg font-mono text-primary-600 dark:text-primary-400">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Crowd Level */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.crowdLevel}</h3>
            <Users className="h-6 w-6 text-primary-500" />
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCrowdColor(crowdLevel)}`}>
            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
            {t.crowdLevels[crowdLevel]}
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {queue.currentQueue}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">People in queue</div>
        </div>

        {/* Wait Time */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.waitTime}</h3>
            <Clock className="h-6 w-6 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {queue.averageWaitTime}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t.minutes}</div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            Improving
          </div>
        </div>

        {/* Next Darshan */}
        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.nextDarshan}</h3>
            <Calendar className="h-6 w-6 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {getNextDarshanTime()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Available slots</div>
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Booking open
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Book Darshan Pass */}
          <Link
            to="/queue"
            className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t.bookDarshan}</h3>
                <p className="text-primary-100 text-sm">{t.pricingTiers.regular}</p>
              </div>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>

          {/* View Queue Status */}
          <Link
            to="/queue"
            className="group bg-white border-2 border-gray-200 text-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t.viewQueue}</h3>
                <p className="text-gray-600 text-sm">Real-time updates</p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400 group-hover:translate-x-1 group-hover:text-primary-500 transition-all duration-200" />
            </div>
          </Link>
        </div>
      </div>

      {/* Temple Timings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.templeTimings}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Morning</span>
            <span className="font-semibold text-gray-900">{temple.timings.morning}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Evening</span>
            <span className="font-semibold text-gray-900">{temple.timings.evening}</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Important Notice</h4>
            <p className="text-sm text-blue-800 mt-1">
              Please carry a valid ID proof for darshan. Security check is mandatory for all visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
