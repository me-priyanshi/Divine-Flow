import { useState } from 'react';
import { 
  Phone, 
  Shield, 
  Heart, 
  Building, 
  Flame,
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';
import { getGoogleMapsDirectionsByName } from '../utils/mapsUtils';

const EmergencyContacts = ({ language, selectedTemple }) => {
  const [copiedNumber, setCopiedNumber] = useState(null);
  
  const t = translations[language];
  const temple = templeData[selectedTemple];

  const emergencyServices = [
    {
      id: 'police',
      title: t.police,
      icon: Shield,
      number: temple.emergencyContacts.police,
      description: 'Local police station',
      color: 'blue',
      available: '24/7'
    },
    {
      id: 'medical',
      title: t.medical,
      icon: Heart,
      number: temple.emergencyContacts.medical,
      description: 'Medical emergency services',
      color: 'red',
      available: '24/7'
    },
    {
      id: 'temple',
      title: t.templeOffice,
      icon: Building,
      number: temple.emergencyContacts.templeOffice,
      description: 'Temple administration office',
      color: 'orange',
      available: '6:00 AM - 10:00 PM'
    },
    {
      id: 'fire',
      title: 'Fire Department',
      icon: Flame,
      number: temple.emergencyContacts.fire,
      description: 'Fire and rescue services',
      color: 'red',
      available: '24/7'
    },
    {
      id: 'ambulance',
      title: 'Ambulance',
      icon: Truck,
      number: temple.emergencyContacts.ambulance,
      description: 'Emergency medical transport',
      color: 'green',
      available: '24/7'
    }
  ];

  // Add ropeway contact if it exists (for Pavagadh)
  if (temple.emergencyContacts.ropeway) {
    emergencyServices.push({
      id: 'ropeway',
      title: 'Ropeway Control',
      icon: MapPin,
      number: temple.emergencyContacts.ropeway,
      description: 'Ropeway operations and safety',
      color: 'purple',
      available: '6:00 AM - 8:00 PM'
    });
  }

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleCopy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch (err) {
      console.error('Failed to copy number:', err);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const safetyTips = [
    'Keep emergency numbers saved in your phone',
    'Inform someone about your visit plans',
    'Carry identification documents',
    'Stay hydrated, especially during summer',
    'Follow temple safety guidelines',
    'Be aware of your surroundings'
  ];

  const medicalFacilities = [
    {
      name: 'Primary Health Center',
      distance: '2 km',
      services: 'Basic medical care, first aid',
      hours: '24/7'
    },
    {
      name: 'District Hospital',
      distance: '15 km',
      services: 'Emergency care, surgery, ICU',
      hours: '24/7'
    },
    {
      name: 'Private Clinic',
      distance: '1 km',
      services: 'General consultation',
      hours: '9:00 AM - 9:00 PM'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.emergencyContacts}</h1>
        <p className="text-gray-600">Important contact numbers for your safety</p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-900">In Case of Emergency</h4>
            <p className="text-sm text-red-800 mt-1">
              Call the appropriate emergency number immediately. For life-threatening situations, call 108 (Ambulance) or 100 (Police).
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyServices.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getColorClasses(service.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{service.available}</span>
                  </div>
                  
                  <div className="text-xl font-bold text-gray-900 mb-3">
                    {service.number}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCall(service.number)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </button>
                    
                    <button
                      onClick={() => handleCopy(service.number)}
                      className="btn-secondary flex items-center justify-center space-x-2 px-3"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedNumber === service.number ? (
                        <span className="text-green-600">Copied!</span>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medical Facilities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Nearby Medical Facilities</h2>
        
        <div className="space-y-3">
          {medicalFacilities.map((facility, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <div className="font-medium">{facility.distance}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Services:</span>
                      <div className="font-medium">{facility.services}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Hours:</span>
                      <div className="font-medium">{facility.hours}</div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const destination = `${facility.name}, ${temple.location}`;
                    window.open(getGoogleMapsDirectionsByName(destination), '_blank');
                  }}
                  className="btn-secondary ml-4 flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t.getDirections}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Safety Tips</h2>
        
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Incident</h3>
            <p className="text-sm text-gray-600 mb-4">Report any safety concerns or incidents</p>
            <button 
              onClick={() => window.open(`tel:${temple.emergencyContacts.police}`, '_self')}
              className="btn-primary"
            >
              {t.report} {t.now}
            </button>
          </div>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <div className="text-center">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Assistance</h3>
            <p className="text-sm text-gray-600 mb-4">Request immediate medical help</p>
            <button 
              onClick={() => handleCall(temple.emergencyContacts.medical)}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Call Medical
            </button>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900">Important Information</h4>
            <ul className="text-sm text-yellow-800 mt-1 space-y-1">
              <li>• All emergency services are available 24/7 except temple office</li>
              <li>• Keep your phone charged and carry a power bank</li>
              <li>• Inform temple authorities about any medical conditions</li>
              <li>• Emergency assembly point: Main temple courtyard</li>
              <li>• First aid stations are located near main entrances</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
