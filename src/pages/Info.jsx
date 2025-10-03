import React from 'react'
import { useTranslation } from 'react-i18next'

function Info() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const templeInfo = {
    timings: "8:00 AM - 8:00 PM",
    facilities: ["Parking", "Restrooms", "Drinking Water", "Medical Aid"],
    emergencyContacts: ["Police: 100", "Fire: 101", "Medical: 108"],
    routes: ["From Ahmedabad: NH 47, 2 hours", "From Vadodara: NH 8, 1.5 hours"]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Pilgrim Engagement Platforms</h2>
        <div className="space-x-2">
          <button onClick={() => changeLanguage('en')} className="bg-blue-500 text-white py-1 px-3 rounded">English</button>
          <button onClick={() => changeLanguage('hi')} className="bg-green-500 text-white py-1 px-3 rounded">हिंदी</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Temple Timings</h3>
          <p className="text-lg">{templeInfo.timings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Wait Times</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Morning (8-12):</span>
              <span className="font-semibold text-green-600">15-30 min</span>
            </div>
            <div className="flex justify-between">
              <span>Afternoon (12-4):</span>
              <span className="font-semibold text-yellow-600">30-60 min</span>
            </div>
            <div className="flex justify-between">
              <span>Evening (4-8):</span>
              <span className="font-semibold text-red-600">60-120 min</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Facilities</h3>
          <ul className="list-disc list-inside space-y-1">
            {templeInfo.facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Emergency Contacts</h3>
          <ul className="space-y-1">
            {templeInfo.emergencyContacts.map((contact, index) => (
              <li key={index}>{contact}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Routes & Directions</h3>
          <ul className="space-y-2">
            {templeInfo.routes.map((route, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {route}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Info
