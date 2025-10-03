import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const QRVerification = () => {
  const [scannedData, setScannedData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate QR scanning (in real app, this would use camera)
  const simulateQRScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      // Get a random queue from localStorage to simulate scanning
      const queueKeys = Object.keys(localStorage).filter(key => key.startsWith('queue-'));
      if (queueKeys.length === 0) {
        setVerificationResult({
          status: 'error',
          message: 'No valid QR codes found. Please book a darshan pass first.'
        });
        setIsScanning(false);
        return;
      }

      const randomQueueKey = queueKeys[Math.floor(Math.random() * queueKeys.length)];
      const queueData = JSON.parse(localStorage.getItem(randomQueueKey));
      
      // Check if already expired
      const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
      const isExpired = expiredPasses.includes(queueData.bookingId);
      
      if (isExpired) {
        setVerificationResult({
          status: 'expired',
          message: 'This QR code has already been used and is expired.',
          data: queueData
        });
      } else {
        // Mark as expired
        expiredPasses.push(queueData.bookingId);
        localStorage.setItem('expired-passes', JSON.stringify(expiredPasses));
        
        setVerificationResult({
          status: 'success',
          message: 'QR code verified successfully! Pass is now marked as used.',
          data: queueData
        });
      }
      
      setScannedData(queueData);
      setIsScanning(false);
    }, 2000);
  };

  const resetScanner = () => {
    setScannedData(null);
    setVerificationResult(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code Verification</h2>
        <p className="text-gray-600 text-sm">Scan darshan passes to verify and mark as used</p>
      </div>

      {!verificationResult ? (
        <div className="text-center">
          <button
            onClick={simulateQRScan}
            disabled={isScanning}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
              isScanning 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
          </button>
          {isScanning && (
            <div className="mt-4">
              <div className="animate-pulse flex justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Looking for QR code...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Verification Result */}
          <div className={`p-4 rounded-lg border-2 ${
            verificationResult.status === 'success' 
              ? 'border-green-200 bg-green-50'
              : verificationResult.status === 'expired'
              ? 'border-red-200 bg-red-50'
              : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-start space-x-3">
              {verificationResult.status === 'success' && (
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              )}
              {verificationResult.status === 'expired' && (
                <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
              )}
              {verificationResult.status === 'error' && (
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  verificationResult.status === 'success' 
                    ? 'text-green-900'
                    : verificationResult.status === 'expired'
                    ? 'text-red-900'
                    : 'text-yellow-900'
                }`}>
                  {verificationResult.status === 'success' && 'Verification Successful'}
                  {verificationResult.status === 'expired' && 'QR Code Expired'}
                  {verificationResult.status === 'error' && 'Verification Failed'}
                </h3>
                <p className={`text-sm ${
                  verificationResult.status === 'success' 
                    ? 'text-green-800'
                    : verificationResult.status === 'expired'
                    ? 'text-red-800'
                    : 'text-yellow-800'
                }`}>
                  {verificationResult.message}
                </p>
              </div>
            </div>
          </div>

          {/* Scanned Data */}
          {scannedData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Pass Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{scannedData.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visitor:</span>
                  <span className="font-medium">{scannedData.userData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slot Time:</span>
                  <span className="font-medium">{scannedData.slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tier:</span>
                  <span className="font-medium">{scannedData.tier?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">People:</span>
                  <span className="font-medium">{scannedData.userData?.numberOfPeople}</span>
                </div>
                {scannedData.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₹{scannedData.amount}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={resetScanner}
              className="flex-1 btn-secondary"
            >
              Scan Another
            </button>
            {verificationResult.status === 'success' && (
              <button
                onClick={() => alert('Entry granted! Visitor can proceed to temple.')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Grant Entry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> In a real implementation, this would use the device camera to scan actual QR codes. 
          This demo simulates the scanning process using stored booking data.
        </p>
      </div>
    </div>
  );
};

export default QRVerification;
