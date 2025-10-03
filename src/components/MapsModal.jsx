import { useState } from 'react';
import { X, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { getMapServiceUrls } from '../utils/mapsUtils';

const MapsModal = ({ isOpen, onClose, temple, action = 'view' }) => {
  const [selectedService, setSelectedService] = useState('google');
  const [travelMode, setTravelMode] = useState('driving');

  if (!isOpen || !temple) return null;

  const mapUrls = getMapServiceUrls(temple.coordinates.lat, temple.coordinates.lng, temple.name);

  const mapServices = [
    {
      id: 'google',
      name: 'Google Maps',
      url: action === 'directions' ? mapUrls.googleDirections : mapUrls.googleMaps,
      icon: '🗺️',
      description: 'Most popular and comprehensive'
    },
    {
      id: 'apple',
      name: 'Apple Maps',
      url: mapUrls.appleMaps,
      icon: '🍎',
      description: 'Best for iOS devices'
    },
    {
      id: 'bing',
      name: 'Bing Maps',
      url: mapUrls.bingMaps,
      icon: '🔍',
      description: 'Microsoft\'s mapping service'
    },
    {
      id: 'openstreet',
      name: 'OpenStreetMap',
      url: mapUrls.openStreetMap,
      icon: '🌍',
      description: 'Open source mapping'
    }
  ];

  const travelModes = [
    { id: 'driving', name: '🚗 Driving', description: 'By car' },
    { id: 'walking', name: '🚶 Walking', description: 'On foot' },
    { id: 'transit', name: '🚌 Transit', description: 'Public transport' },
    { id: 'bicycling', name: '🚲 Bicycling', description: 'By bicycle' }
  ];

  const handleOpenMap = (service) => {
    let url;
    
    if (service.id === 'google') {
      const destination = temple.name ? encodeURIComponent(temple.name) : `${temple.coordinates.lat},${temple.coordinates.lng}`;
      if (action === 'directions') {
        url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${travelMode}`;
      } else {
        url = service.url;
      }
    } else {
      url = service.url;
    }
    
    try {
      window.open(url, '_blank');
      onClose();
    } catch (error) {
      console.error('Error opening map:', error);
      // Fallback
      window.open(`https://www.google.com/maps?q=${temple.coordinates.lat},${temple.coordinates.lng}`, '_blank');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            {action === 'directions' ? <Navigation className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
            <span>{action === 'directions' ? 'Get Directions' : 'Open in Maps'}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-1">{temple.name}</h3>
            <p className="text-sm text-gray-600">{temple.location}</p>
            <p className="text-xs text-gray-500 mt-1">
              Coordinates: {temple.coordinates.lat}, {temple.coordinates.lng}
            </p>
          </div>

          <div className="space-y-4">
            {action === 'directions' && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Travel Mode:</p>
                <div className="grid grid-cols-2 gap-2">
                  {travelModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setTravelMode(mode.id)}
                      className={`p-2 rounded-lg border text-sm transition-all duration-200 ${
                        travelMode === mode.id
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{mode.name}</div>
                      <div className="text-xs text-gray-600">{mode.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Choose your preferred map service:</p>
              
              {mapServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleOpenMap(service)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 mb-2"
                >
                  <span className="text-2xl">{service.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> If one service doesn't work, try another. Different map services may have varying coverage in your area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsModal;
