import { useState, useEffect } from 'react';
import { 
  Car, 
  Bus, 
  MapPin, 
  Navigation, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Route,
  Zap
} from 'lucide-react';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';
import { openMap } from '../utils/mapsUtils';

const TrafficManagement = ({ language, selectedTemple }) => {
  const [selectedParking, setSelectedParking] = useState(null);
  const [shuttleStatus, setShuttleStatus] = useState('active');
  const [roadConditions, setRoadConditions] = useState('good');
  
  const t = translations[language];
  const temple = templeData[selectedTemple];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update parking availability
      temple.parkingZones.forEach(zone => {
        const change = Math.floor(Math.random() * 10) - 5;
        zone.available = Math.max(0, Math.min(zone.capacity, zone.available + change));
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [temple.parkingZones]);

  const getParkingStatus = (zone) => {
    const occupancyRate = ((zone.capacity - zone.available) / zone.capacity) * 100;
    if (occupancyRate >= 90) return 'full';
    if (occupancyRate >= 70) return 'filling';
    return 'available';
  };

  const getParkingStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'filling': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'full': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'filling': return AlertTriangle;
      case 'full': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const shuttleRoutes = [
    { id: 1, name: 'Main Route', from: 'Railway Station', to: 'Temple', duration: '15 min', frequency: '10 min' },
    { id: 2, name: 'City Route', from: 'Bus Stand', to: 'Temple', duration: '20 min', frequency: '15 min' },
    { id: 3, name: 'Hotel Route', from: 'Hotel Zone', to: 'Temple', duration: '12 min', frequency: '20 min' }
  ];

  const alternateRoutes = [
    { id: 1, name: 'Coastal Highway', distance: '25 km', time: '35 min', condition: 'Good', traffic: 'Light' },
    { id: 2, name: 'Inner Ring Road', distance: '18 km', time: '45 min', condition: 'Fair', traffic: 'Heavy' },
    { id: 3, name: 'Bypass Road', distance: '30 km', time: '40 min', condition: 'Excellent', traffic: 'Moderate' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.traffic}</h1>
        <p className="text-gray-600">Real-time traffic and parking information</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <Car className="h-6 w-6 text-primary-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">
            {temple.parkingZones.reduce((sum, zone) => sum + zone.available, 0)}
          </div>
          <div className="text-xs text-gray-500">Parking Available</div>
        </div>
        
        <div className="card text-center">
          <Bus className="h-6 w-6 text-primary-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">3</div>
          <div className="text-xs text-gray-500">Shuttle Routes</div>
        </div>
        
        <div className="card text-center">
          <Route className="h-6 w-6 text-primary-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">3</div>
          <div className="text-xs text-gray-500">Alternate Routes</div>
        </div>
        
        <div className="card text-center">
          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">Good</div>
          <div className="text-xs text-gray-500">Road Condition</div>
        </div>
      </div>

      {/* Parking Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{t.parkingStatus}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {temple.parkingZones.map((zone) => {
            const status = getParkingStatus(zone);
            const StatusIcon = getStatusIcon(status);
            
            return (
              <div
                key={zone.id}
                className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedParking === zone.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedParking(zone.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getParkingStatusColor(status)}`}>
                    <StatusIcon className="h-3 w-3 inline mr-1" />
                    {status === 'available' && 'Available'}
                    {status === 'filling' && 'Filling'}
                    {status === 'full' && 'Full'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{zone.available}/{zone.capacity}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'available' ? 'bg-green-500' :
                        status === 'filling' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${((zone.capacity - zone.available) / zone.capacity) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {zone.distance}
                    </div>
                    <button 
                      onClick={() => openMap(temple.coordinates.lat, temple.coordinates.lng, temple.name, 'directions')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t.navigate}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shuttle Service */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{t.shuttleService}</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shuttleRoutes.map((route) => (
            <div key={route.id} className="card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  <p className="text-sm text-gray-600">{route.from} → {route.to}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{route.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">Every {route.frequency}</span>
                </div>
              </div>
              
              <button 
                onClick={() => alert(`${t.track} ${route.name}: Next shuttle in ${Math.floor(Math.random() * 10) + 1} minutes`)}
                className="w-full mt-3 btn-secondary text-sm"
              >
                {t.track} Shuttle
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Road Conditions & Alternate Routes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{t.alternateRoutes}</h2>
        
        <div className="space-y-3">
          {alternateRoutes.map((route) => (
            <div key={route.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Navigation className="h-5 w-5 text-primary-500" />
                    <h3 className="font-semibold text-gray-900">{route.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <div className="font-medium">{route.distance}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <div className="font-medium">{route.time}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <div className={`font-medium ${
                        route.condition === 'Excellent' ? 'text-green-600' :
                        route.condition === 'Good' ? 'text-blue-600' :
                        route.condition === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {route.condition}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Traffic:</span>
                      <div className={`font-medium ${
                        route.traffic === 'Light' ? 'text-green-600' :
                        route.traffic === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {route.traffic}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => openMap(temple.coordinates.lat, temple.coordinates.lng, temple.name, 'directions', 'driving')}
                  className="btn-primary ml-4"
                >
                  {t.getDirections}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Updates */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Live Traffic Updates</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Main highway: Normal traffic flow</li>
              <li>• Temple approach road: Moderate congestion expected</li>
              <li>• Parking zones: P1 filling up fast, consider P2 or P3</li>
              <li>• Shuttle services: Running on schedule</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900">Smart Recommendations</h4>
            <ul className="text-sm text-green-800 mt-1 space-y-1">
              <li>• Best time to visit: Early morning (6:00-8:00 AM) for less traffic</li>
              <li>• Recommended parking: {temple.parkingZones.find(z => getParkingStatus(z) === 'available')?.name || 'Check availability'}</li>
              <li>• Use shuttle service from railway station to avoid parking hassles</li>
              <li>• Consider carpooling during peak festival seasons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficManagement;
