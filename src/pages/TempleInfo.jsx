import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Wifi, 
  Car, 
  Utensils,
  ShoppingBag,
  Camera,
  Heart,
  Navigation,
  Info,
  BookOpen,
  Calendar,
  Star
} from 'lucide-react';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';
import { openMap, getGoogleMapsDirectionsByName } from '../utils/mapsUtils';
import MapsModal from '../components/MapsModal';

const TempleInfo = ({ language, selectedTemple }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [mapsAction, setMapsAction] = useState('view');
  
  const t = translations[language];
  const temple = templeData[selectedTemple];

  const tabs = [
    { id: 'overview', label: t.overview || 'Overview', icon: Info },
    { id: 'history', label: t.history || 'History', icon: BookOpen },
    { id: 'timings', label: t.templeTimings, icon: Clock },
    { id: 'facilities', label: t.facilities, icon: Wifi },
    { id: 'routes', label: t.routes, icon: Navigation },
    { id: 'services', label: t.nearbyServices, icon: MapPin }
  ];

  const getFacilityIcon = (facility) => {
    if (facility.toLowerCase().includes('parking')) return Car;
    if (facility.toLowerCase().includes('food') || facility.toLowerCase().includes('prasadam')) return Utensils;
    if (facility.toLowerCase().includes('shop')) return ShoppingBag;
    if (facility.toLowerCase().includes('photo')) return Camera;
    if (facility.toLowerCase().includes('medical')) return Heart;
    return Info;
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'accommodation': return Car;
      case 'religious': return Heart;
      case 'attraction': return Camera;
      case 'historical': return Info;
      default: return MapPin;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{temple.name}</h1>
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{temple.location}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{t.overview || 'Temple Overview'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.basicInfo || 'Basic Information'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t.established || 'Established'}</p>
                      <p className="font-semibold">{temple.established}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t.deity || 'Deity'}</p>
                      <p className="font-semibold">{temple.deity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t.location || 'Location'}</p>
                      <p className="font-semibold">{temple.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Significance */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.significance || 'Significance'}</h3>
                <p className="text-gray-700 leading-relaxed">{temple.significance}</p>
              </div>
            </div>

            {/* Architecture */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.architecture || 'Architecture'}</h3>
              <p className="text-gray-700 leading-relaxed">{temple.architecture}</p>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{t.history || 'Temple History'}</h2>
            
            <div className="card">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {temple.history}
                </p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-primary-900 mb-3">
                {t.religiousSignificance || 'Religious Significance'}
              </h4>
              <p className="text-primary-800 leading-relaxed">
                {temple.significance}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t.architecturalFeatures || 'Architectural Features'}
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {temple.architecture}
              </p>
            </div>
          </div>
        )}

        {/* Temple Timings */}
        {activeTab === 'timings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{t.templeTimings}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Morning Darshan</h3>
                    <p className="text-gray-600">Regular worship hours</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{temple.timings.morning}</div>
                <div className="text-sm text-gray-500">
                  Includes morning aarti and regular darshan
                </div>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Evening Darshan</h3>
                    <p className="text-gray-600">Evening worship hours</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{temple.timings.evening}</div>
                <div className="text-sm text-gray-500">
                  Includes evening aarti and darshan
                </div>
              </div>
            </div>

            {temple.timings.afternoon && (
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Afternoon Darshan</h3>
                    <p className="text-gray-600">Afternoon worship hours</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{temple.timings.afternoon}</div>
                <div className="text-sm text-gray-500">
                  Special afternoon darshan hours
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Temple may close during lunch hours (12:00 PM - 4:00 PM)</li>
                <li>• Special timings during festivals and auspicious days</li>
                <li>• VIP darshan available with prior booking</li>
                <li>• Photography restrictions may apply inside the temple</li>
              </ul>
            </div>
          </div>
        )}

        {/* Facilities */}
        {activeTab === 'facilities' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{t.facilities}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {temple.facilities.map((facility, index) => {
                const Icon = getFacilityIcon(facility);
                return (
                  <div key={index} className="card">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{facility}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-900 mb-2">Accessibility Features</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Wheelchair accessible entrances and pathways</li>
                <li>• Dedicated parking spaces for disabled visitors</li>
                <li>• Audio announcements in multiple languages</li>
                <li>• Volunteer assistance available on request</li>
              </ul>
            </div>
          </div>
        )}

        {/* Routes & Directions */}
        {activeTab === 'routes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{t.routes}</h2>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temple Location</h3>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Lat: {temple.coordinates.lat}, Lng: {temple.coordinates.lng}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setMapsAction('view');
                    setShowMapsModal(true);
                  }}
                  className="btn-primary"
                >
                  {t.openInMaps}
                </button>
                <button 
                  onClick={() => {
                    setMapsAction('directions');
                    setShowMapsModal(true);
                  }}
                  className="btn-secondary"
                >
                  {t.getDirections}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">By Road</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Well connected by state highways</li>
                  <li>• Regular bus services available</li>
                  <li>• Taxi and auto-rickshaw services</li>
                  <li>• Ample parking space available</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">By Train</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Nearest railway station: 15 km</li>
                  <li>• Regular trains from major cities</li>
                  <li>• Shuttle services from station</li>
                  <li>• Pre-paid taxi counters available</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Services */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">{t.nearbyServices}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temple.nearbyServices.map((service, index) => {
                const Icon = getServiceIcon(service.type);
                return (
                  <div key={index} className="card">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{service.type}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{service.distance}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const destination = `${service.name}, ${temple.location}`;
                          window.open(getGoogleMapsDirectionsByName(destination), '_blank');
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        {t.getDirections}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Recommended Services</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Book accommodations in advance during peak seasons</li>
                <li>• Local guides available for temple history and significance</li>
                <li>• Traditional food and prasadam available at temple complex</li>
                <li>• Souvenir shops for religious items and local crafts</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Maps Modal */}
      <MapsModal
        isOpen={showMapsModal}
        onClose={() => setShowMapsModal(false)}
        temple={temple}
        action={mapsAction}
      />
    </div>
  );
};

export default TempleInfo;
