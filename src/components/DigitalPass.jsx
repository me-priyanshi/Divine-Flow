import { useState, useRef, useEffect, forwardRef } from 'react';
import { Download, Share, QrCode, Calendar, MapPin, User, Clock, CreditCard, Phone, Users, Crown } from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { translations } from '../data/translations';
import { templeData } from '../data/templeData';

// autoDownload can be: false | 'pdf' | 'png'
const DigitalPass = forwardRef(({ queueData, language, autoDownload = false, onQrExpire }, ref) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrExpired, setQrExpired] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const innerRef = useRef(null);
  const passRef = ref || innerRef;
  
  // Handle null/undefined cases
  if (!queueData) {
    return <div>No queue data available</div>;
  }

  const t = translations[language] || {};
  const temple = queueData.templeId ? templeData[queueData.templeId] : null;

  if (!temple) {
    return <div>Invalid temple data</div>;
  }

  useEffect(() => {
    generateQRCode();
    
    // Check if QR is expired
    const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
    const isExpired = expiredPasses.includes(queueData.bookingId);
    setQrExpired(isExpired);
    
    // Call onQrExpire callback if QR is expired
    if (isExpired && onQrExpire) {
      onQrExpire(queueData.bookingId);
    }
    
    // Auto-download if requested
    if (!isExpired) {
      if (autoDownload === 'pdf') {
        setTimeout(() => downloadAsPDF(), 800);
      } else if (autoDownload === 'png') {
        setTimeout(() => downloadAsPNG(), 800);
      }
    }
  }, [queueData, autoDownload, qrExpired, onQrExpire]);

  const generateQRCode = async () => {
    if (!queueData || !temple) {
      return;
    }

    // Check if QR is expired
    const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
    if (expiredPasses.includes(queueData.bookingId)) {
      setQrExpired(true);
      return;
    }

    const qrData = {
      bookingId: queueData.bookingId,
      templeId: queueData.templeId,
      templeName: temple.name,
      templeLocation: temple.location,
      visitorName: queueData.userData.name,
      phoneNumber: queueData.userData.phoneNumber,
      email: queueData.userData.email || '',
      slotTime: queueData.slotTime,
      tier: queueData.tier.name,
      tierPrice: queueData.tier.price,
      numberOfPeople: queueData.userData.numberOfPeople,
      amount: queueData.amount,
      paymentId: queueData.paymentId,
      bookingDate: new Date(queueData.timestamp).toLocaleDateString('en-IN'),
      bookingTime: new Date(queueData.timestamp).toLocaleTimeString('en-IN'),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      queuePosition: queueData.position || 'TBD',
      estimatedTime: queueData.estimatedTime || 'TBD',
      verificationUrl: `https://temple-app.com/verify/${queueData.bookingId}`,
      checksum: `${queueData.bookingId}-${queueData.templeId}-${Date.now()}`.slice(-8), // Simple checksum for verification
      status: 'active' // Add status to track QR validity
    };

    try {
      const qrString = JSON.stringify(qrData);
      const dataUrl = await QRCode.toDataURL(qrString, {
        width: 256,
        margin: 3,
        color: {
          dark: qrExpired ? '#ef4444' : '#1f2937', // Red if expired, Gray-800 if active
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Function to simulate QR scanning and expiration
  const handleQRScan = () => {
    if (qrExpired) {
      alert('This QR code has already been used and is no longer valid.');
      return;
    }

    // Simulate scanning by marking as expired
    const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
    if (!expiredPasses.includes(queueData.bookingId)) {
      expiredPasses.push(queueData.bookingId);
      localStorage.setItem('expired-passes', JSON.stringify(expiredPasses));
      setQrExpired(true);
      alert('QR code scanned successfully! This pass is now expired and cannot be used again.');
    }
  };

  const downloadAsPDF = async () => {
    if (!passRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Wait for QR code to be fully loaded
      if (!qrCodeDataUrl) {
        alert('Please wait for the QR code to load before downloading.');
        setIsDownloading(false);
        return;
      }

      // Small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(passRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const root = doc.getElementById('digital-pass-root');
          if (root) {
            root.style.background = '#ffffff';
            root.classList.remove('bg-gradient-to-br', 'from-primary-50', 'to-temple-50');
          }
          const header = doc.querySelector('.pass-header');
          if (header) {
            header.style.background = '#f2750a';
            header.classList.remove('bg-gradient-to-r', 'from-primary-500', 'to-temple-500');
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit the pass on A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      
      let width = pdfWidth - 20; // 10mm margin on each side
      let height = width * canvasAspectRatio;
      
      // If height exceeds page, scale down
      if (height > pdfHeight - 20) {
        height = pdfHeight - 20;
        width = height / canvasAspectRatio;
      }
      
      const x = (pdfWidth - width) / 2;
      const y = 10; // Top margin
      
      pdf.addImage(imgData, 'PNG', x, y, width, height);
      
      // Add metadata
      pdf.setProperties({
        title: `Temple Darshan Pass - ${queueData.bookingId}`,
        subject: `Digital Pass for ${temple.name}`,
        author: 'Divine Flow',
        creator: 'Divine Flow'
      });

      pdf.save(`${temple.name.replace(/\s+/g, '-')}-pass-${queueData.bookingId}.pdf`);
      
      // Show success message
      alert('Digital pass downloaded successfully as PDF!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsPNG = async () => {
    if (!passRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Wait for QR code to be fully loaded
      if (!qrCodeDataUrl) {
        alert('Please wait for the QR code to load before downloading.');
        setIsDownloading(false);
        return;
      }

      // Small delay to ensure all elements are rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(passRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const root = doc.getElementById('digital-pass-root');
          if (root) {
            root.style.background = '#ffffff';
            root.classList.remove('bg-gradient-to-br', 'from-primary-50', 'to-temple-50');
          }
          const header = doc.querySelector('.pass-header');
          if (header) {
            header.style.background = '#f2750a';
            header.classList.remove('bg-gradient-to-r', 'from-primary-500', 'to-temple-500');
          }
        }
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${temple.name.replace(/\s+/g, '-')}-pass-${queueData.bookingId}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      alert('Digital pass downloaded successfully as PNG!');
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to generate PNG. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const sharePass = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Temple Darshan Pass - ${temple.name}`,
          text: `My darshan booking for ${temple.name} on ${new Date(queueData.timestamp).toLocaleDateString()} at ${queueData.slotTime}`,
          url: `https://temple-app.com/pass/${queueData.bookingId}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Temple Darshan Pass\n${temple.name}\nBooking ID: ${queueData.bookingId}\nSlot: ${queueData.slotTime}\nDate: ${new Date(queueData.timestamp).toLocaleDateString()}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Pass details copied to clipboard!');
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Digital Pass */}
      <div 
        ref={passRef}
        id="digital-pass-root"
        className="bg-gradient-to-br from-primary-50 to-temple-50 rounded-2xl shadow-lg overflow-hidden border border-primary-200"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-temple-500 text-white p-6 pass-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t.darshanPass}</h2>
              <p className="text-primary-100">{temple.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-100">Booking ID</p>
              <p className="text-lg font-mono font-bold">{queueData.bookingId}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visitor Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {t.visitorDetails || 'Visitor Details'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.name}</p>
                    <p className="font-semibold">{queueData.userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.phoneNumber}</p>
                    <p className="font-semibold">{queueData.userData.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.numberOfPeople}</p>
                    <p className="font-semibold">{queueData.userData.numberOfPeople}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {t.bookingDetails || 'Booking Details'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.temple || 'Temple'}</p>
                    <p className="font-semibold">{temple.name}</p>
                    <p className="text-sm text-gray-500">{temple.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.bookingDate || 'Booking Date'}</p>
                    <p className="font-semibold">{new Date(queueData.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.darshanTime || 'Darshan Time'}</p>
                    <p className="font-semibold">{queueData.slotTime}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">{t.tier || 'Tier'}</p>
                    <p className="font-semibold">{queueData.tier.name}</p>
                  </div>
                </div>

                {queueData.amount > 0 && (
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t.totalAmount}</p>
                      <p className="font-semibold">₹{queueData.amount}</p>
                      <p className="text-xs text-gray-500">Payment ID: {queueData.paymentId}</p>
                    </div>
                  </div>
                )}

                {queueData.position && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">{t.queuePosition || 'Queue Position'}</p>
                      <p className="font-semibold">#{queueData.position}</p>
                      {queueData.estimatedTime && (
                        <p className="text-xs text-gray-500">Est. wait: {queueData.estimatedTime} mins</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.scanForEntry || 'Scan for Entry'}</h3>
            {qrCodeDataUrl ? (
              <div className="inline-block">
                <div className={`relative p-6 bg-white rounded-xl shadow-lg border-2 mb-4 ${qrExpired ? 'border-red-200 opacity-75' : 'border-primary-200'}`}>
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code for temple entry" 
                    className="w-56 h-56 mx-auto"
                  />
                  {qrExpired && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-xl">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transform rotate-12">
                        EXPIRED
                      </div>
                    </div>
                  )}
                </div>
                <div className={`rounded-lg p-4 max-w-md mx-auto ${qrExpired ? 'bg-red-50' : 'bg-primary-50'}`}>
                  <p className={`text-sm font-medium mb-2 ${qrExpired ? 'text-red-900' : 'text-primary-900'}`}>
                    {qrExpired 
                      ? 'This QR code has been used and is no longer valid' 
                      : (t.showQrAtEntry || 'Show this QR code at the temple entrance')
                    }
                  </p>
                  <p className={`text-xs ${qrExpired ? 'text-red-700' : 'text-primary-700'}`}>
                    {qrExpired 
                      ? 'Please contact temple authorities if you need assistance'
                      : 'QR Code contains all your details'
                    }
                  </p>
                </div>
                {!qrExpired && (
                  <button
                    onClick={handleQRScan}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Simulate QR Scan (Test Only)
                  </button>
                )}
              </div>
            ) : (
              <div className="inline-block p-6 bg-gray-100 rounded-xl border-2 border-gray-200">
                <div className="w-56 h-56 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                  <span className="ml-2 text-gray-500">Generating QR Code...</span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-900 mb-2">
              {t.importantInstructions || 'Important Instructions'}
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• {t.arriveEarly || 'Arrive 10 minutes before your slot time'}</li>
              <li>• {t.carryId || 'Carry a valid photo ID proof'}</li>
              <li>• {t.showQr || 'Show this QR code at the entrance'}</li>
              <li>• {t.followDressCode || 'Follow temple dress code and guidelines'}</li>
              <li>• {t.validFor24Hours || 'This pass is valid for 24 hours from booking'}</li>
            </ul>
          </div>

          {/* Validity */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            <p>{t.validUntil || 'Valid until'}: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p className="mt-1">{t.generatedBy || 'Generated by'}: Divine Flow </p>
            <p className="mt-1 text-xs">Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="mt-1 text-xs">Verification ID: {queueData.bookingId?.slice(-8)?.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m-7">
        <button
          onClick={downloadAsPDF}
          disabled={isDownloading || !qrCodeDataUrl}
          className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>{isDownloading ? 'Generating...' : (t.downloadPdf || 'Download PDF')}</span>
        </button>
        
        <button
          onClick={downloadAsPNG}
          disabled={isDownloading || !qrCodeDataUrl}
          className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>{isDownloading ? 'Generating...' : (t.downloadImage || 'Download PNG')}</span>
        </button>
        
        {/* <button
          onClick={sharePass}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <Share className="h-4 w-4" />
          <span>{t.share}</span>
        </button> */}
      </div>
    </div>
  );
});

export default DigitalPass;
