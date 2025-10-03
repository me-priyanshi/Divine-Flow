import React, { useState } from 'react'

function Traffic() {
  const [selectedParking, setSelectedParking] = useState(null)
  const [shuttleRoute, setShuttleRoute] = useState(null)

  const parkingSpots = [
    { id: 1, name: "Main Parking", available: 45, total: 100, distance: "200m" },
    { id: 2, name: "North Parking", available: 23, total: 50, distance: "500m" },
    { id: 3, name: "South Parking", available: 67, total: 80, distance: "300m" }
  ]

  const shuttleRoutes = [
    { id: 1, name: "Temple to Parking", frequency: "Every 10 min", next: "5 min" },
    { id: 2, name: "Parking to Bus Stand", frequency: "Every 15 min", next: "8 min" },
    { id: 3, name: "Temple to Railway Station", frequency: "Every 20 min", next: "12 min" }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Traffic & Mobility Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Intelligent Parking Guidance</h3>
          <div className="space-y-3">
            {parkingSpots.map((spot) => (
              <div key={spot.id} className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{spot.name}</h4>
                  <span className="text-sm text-gray-600">{spot.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available: {spot.available}/{spot.total}</span>
                  <button 
                    onClick={() => setSelectedParking(spot)}
                    className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  >
                    Navigate
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{width: `${(spot.available / spot.total) * 100}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Shuttle/Bus Coordination</h3>
          <div className="space-y-3">
            {shuttleRoutes.map((route) => (
              <div key={route.id} className="border rounded p-3">
                <h4 className="font-semibold mb-1">{route.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{route.frequency}</p>
                <div className="flex justify-between items-center">
                  <span>Next shuttle in: {route.next}</span>
                  <button 
                    onClick={() => setShuttleRoute(route)}
                    className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Traffic Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">Low</div>
            <div className="text-sm text-gray-600">Traffic Congestion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">15 min</div>
            <div className="text-sm text-gray-600">Avg Travel Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Open</div>
            <div className="text-sm text-gray-600">Road Status</div>
          </div>
        </div>
      </div>

      {selectedParking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Navigation to {selectedParking.name}</h3>
            <p>Distance: {selectedParking.distance}</p>
            <p>Available spots: {selectedParking.available}</p>
            <button 
              onClick={() => setSelectedParking(null)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {shuttleRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Tracking {shuttleRoute.name}</h3>
            <p>Next shuttle: {shuttleRoute.next}</p>
            <p>Frequency: {shuttleRoute.frequency}</p>
            <button 
              onClick={() => setShuttleRoute(null)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Traffic
