import React, { useState } from 'react'

function Queue() {
  const [queueNumber, setQueueNumber] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(null)

  const joinQueue = () => {
    const number = Math.floor(Math.random() * 1000) + 1
    const time = Math.floor(Math.random() * 120) + 30 // 30-150 minutes
    setQueueNumber(number)
    setEstimatedTime(time)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Smart Queue & Ticketing Systems</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Virtual Queue Management</h3>
        <p className="mb-4">Join the virtual queue for darshan. Get real-time updates on your position.</p>
        {!queueNumber ? (
          <button onClick={joinQueue} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Join Queue
          </button>
        ) : (
          <div className="bg-green-100 p-4 rounded">
            <p className="font-semibold">Your Queue Number: {queueNumber}</p>
            <p>Estimated Wait Time: {estimatedTime} minutes</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Digital Darshan Passes</h3>
        <p className="mb-4">Purchase digital passes for priority darshan.</p>
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Buy Digital Pass - ₹500
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-gray-600">People in Queue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">15 min</div>
            <div className="text-sm text-gray-600">Avg Wait Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">8:00 AM - 8:00 PM</div>
            <div className="text-sm text-gray-600">Temple Hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Queue
