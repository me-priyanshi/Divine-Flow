import { useState, useEffect, useRef } from 'react';
import { Clock, Users, Calendar, CheckCircle, XCircle, AlertCircle, Ticket, QrCode, RefreshCw, Star, Crown, Zap, Heart, X } from 'lucide-react';
import { translations } from '../data/translations';
import { queueData, templeData } from '../data/templeData';
import PaymentModal from '../components/PaymentModal';
import LeaveQueueModal from '../components/LeaveQueueModal';
import DigitalPass from '../components/DigitalPass';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const QueueManagement = ({ language, selectedTemple }) => {
  const [userQueue, setUserQueue] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [queuePosition, setQueuePosition] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTierSelection, setShowTierSelection] = useState(false);
  const [showLeaveQueueModal, setShowLeaveQueueModal] = useState(false);
  const [showDigitalPass, setShowDigitalPass] = useState(false);
  const [autoDownloadPass, setAutoDownloadPass] = useState(false);
  const [showDownloadChoice, setShowDownloadChoice] = useState(false);
  const [quickQrDataUrl, setQuickQrDataUrl] = useState('');
  const [toast, setToast] = useState(null);
  const passRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrExpired, setQrExpired] = useState(false);
  
  const t = translations[language];
  const queue = queueData[selectedTemple];
  const temple = templeData[selectedTemple];

  // Effect to check QR expiration whenever userQueue changes
  useEffect(() => {
    if (userQueue?.bookingId) {
      const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
      setQrExpired(expiredPasses.includes(userQueue.bookingId));
    }
  }, [userQueue]);

  useEffect(() => {
    // Check if user is already in queue (from localStorage)
    const savedQueue = localStorage.getItem(`queue-${selectedTemple}`);
    if (savedQueue) {
      const parsedQueue = JSON.parse(savedQueue);
      
      // Check if QR is expired
      const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
      const isExpired = expiredPasses.includes(parsedQueue.bookingId);
      setQrExpired(isExpired);
      
      if (isExpired) {
        handleQrExpiration();
        return;
      }

      // Set queue data and position if QR is not expired
      setUserQueue(parsedQueue);
      setQueuePosition(parsedQueue.position);
      
      // Generate QR code for preview
      if (parsedQueue.bookingId) {
        try {
          const temple = templeData[parsedQueue.templeId];
          const qrData = {
            bookingId: parsedQueue.bookingId,
            templeId: parsedQueue.templeId,
            templeName: temple.name,
            templeLocation: temple.location,
            visitorName: parsedQueue.userData.name,
            phoneNumber: parsedQueue.userData.phoneNumber,
            email: parsedQueue.userData.email || '',
            slotTime: parsedQueue.slotTime,
            tier: parsedQueue.tier.name,
            tierPrice: parsedQueue.tier.price,
            numberOfPeople: parsedQueue.userData.numberOfPeople,
            amount: parsedQueue.amount,
            paymentId: parsedQueue.paymentId,
            bookingDate: new Date(parsedQueue.timestamp).toLocaleDateString('en-IN'),
            bookingTime: new Date(parsedQueue.timestamp).toLocaleTimeString('en-IN'),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            queuePosition: parsedQueue.position || 'TBD',
            estimatedTime: parsedQueue.estimatedTime || 'TBD',
            verificationUrl: `https://temple-app.com/verify/${parsedQueue.bookingId}`,
            checksum: `${parsedQueue.bookingId}-${parsedQueue.templeId}-${Date.now()}`.slice(-8),
            status: 'active'
          };
          const qrString = JSON.stringify(qrData);
          QRCode.toDataURL(qrString, { 
            width: 512,
            margin: 2,
            color: { 
              dark: '#1f2937',
              light: '#ffffff' 
            },
            errorCorrectionLevel: 'H'
          })
            .then(setQuickQrDataUrl)
            .catch(console.error);
        } catch (error) {
          console.error('Error generating QR preview:', error);
        }
      }
    }
  }, [selectedTemple]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setShowTierSelection(true);
  };

  const handleTierSelection = (tier) => {
    setSelectedTier(tier);
    setShowTierSelection(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    const queueInfo = {
      templeId: selectedTemple,
      slotTime: paymentData.slot.time,
      tier: paymentData.tier,
      position: Math.floor(Math.random() * 50) + 1,
      estimatedTime: Math.floor(Math.random() * 30) + 15,
      bookingId: paymentData.bookingId,
      paymentId: paymentData.paymentId,
      amount: paymentData.amount,
      timestamp: new Date().toISOString(),
      userData: {
        name: paymentData.name,
        phoneNumber: paymentData.phoneNumber,
        email: paymentData.email,
        numberOfPeople: paymentData.numberOfPeople
      }
    };
    
    setUserQueue(queueInfo);
    setQueuePosition(queueInfo.position);
    localStorage.setItem(`queue-${selectedTemple}`, JSON.stringify(queueInfo));
    setShowPaymentModal(false);
    setSelectedSlot(null);
    setSelectedTier(null);

    // Pre-generate quick preview QR with all details (same as DigitalPass)
    try {
      const temple = templeData[queueInfo.templeId];
      const qrData = {
        bookingId: queueInfo.bookingId,
        templeId: queueInfo.templeId,
        templeName: temple.name,
        templeLocation: temple.location,
        visitorName: queueInfo.userData.name,
        phoneNumber: queueInfo.userData.phoneNumber,
        email: queueInfo.userData.email || '',
        slotTime: queueInfo.slotTime,
        tier: queueInfo.tier.name,
        tierPrice: queueInfo.tier.price,
        numberOfPeople: queueInfo.userData.numberOfPeople,
        amount: queueInfo.amount,
        paymentId: queueInfo.paymentId,
        bookingDate: new Date(queueInfo.timestamp).toLocaleDateString('en-IN'),
        bookingTime: new Date(queueInfo.timestamp).toLocaleTimeString('en-IN'),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        queuePosition: queueInfo.position || 'TBD',
        estimatedTime: queueInfo.estimatedTime || 'TBD',
        verificationUrl: `https://temple-app.com/verify/${queueInfo.bookingId}`,
        checksum: `${queueInfo.bookingId}-${queueInfo.templeId}-${Date.now()}`.slice(-8),
        status: 'active'
      };
      const qrString = JSON.stringify(qrData);
      QRCode.toDataURL(qrString, { 
        width: 512, // Increased size for better quality
        margin: 2,
        color: { 
          dark: '#1f2937', 
          light: '#ffffff' 
        }, 
        errorCorrectionLevel: 'H' // Higher error correction for better scanning
      })
        .then(dataUrl => {
          setQuickQrDataUrl(dataUrl);
        })
        .catch(error => {
          console.error('QR Generation error:', error);
          setToast({
            type: 'error',
            message: 'Failed to generate QR code'
          });
        });
    } catch (error) {
      console.error('QR Data preparation error:', error);
      setToast({
        type: 'error',
        message: 'Failed to prepare QR code data'
      });
    }
  };

  const handleLeaveQueue = () => {
    setShowLeaveQueueModal(true);
  };

  const handleConfirmLeaveQueue = (leaveData) => {
    // Log the reason for analytics
    console.log('Queue left for reason:', leaveData);
    
    if (leaveData.reason === 'slot_change' && leaveData.newSlot) {
      // Mark old booking as expired
      const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
      expiredPasses.push(userQueue.bookingId);
      localStorage.setItem('expired-passes', JSON.stringify(expiredPasses));

      // Generate new booking ID for the updated slot
      const newBookingId = `TQ${Date.now()}`;
      
      // Update queue with new slot information while preserving user data
      const updatedQueue = {
        ...userQueue,
        slotTime: leaveData.newSlot.time,
        position: Math.floor(Math.random() * 20) + 1,
        estimatedTime: Math.floor(Math.random() * 15) + 10,
        timestamp: new Date().toISOString(),
        bookingId: newBookingId,
        userData: {
          ...userQueue.userData
        }
      };
      
      // Update state and storage
      setUserQueue(updatedQueue);
      setQueuePosition(updatedQueue.position);
      localStorage.setItem(`queue-${selectedTemple}`, JSON.stringify(updatedQueue));
      setShowLeaveQueueModal(false);

      // Create new QR code for the updated slot
      try {
        const qrData = {
          bookingId: updatedQueue.bookingId,
          templeId: updatedQueue.templeId,
          templeName: temple.name,
          templeLocation: temple.location,
          visitorName: updatedQueue.userData.name,
          phoneNumber: updatedQueue.userData.phoneNumber,
          email: updatedQueue.userData.email || '',
          slotTime: updatedQueue.slotTime,
          tier: updatedQueue.tier.name,
          tierPrice: updatedQueue.tier.price,
          numberOfPeople: updatedQueue.userData.numberOfPeople,
          amount: updatedQueue.amount,
          paymentId: updatedQueue.paymentId,
          bookingDate: new Date(updatedQueue.timestamp).toLocaleDateString('en-IN'),
          bookingTime: new Date(updatedQueue.timestamp).toLocaleTimeString('en-IN'),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          queuePosition: updatedQueue.position,
          estimatedTime: updatedQueue.estimatedTime,
          verificationUrl: `https://temple-app.com/verify/${updatedQueue.bookingId}`,
          checksum: `${updatedQueue.bookingId}-${updatedQueue.templeId}-${Date.now()}`.slice(-8),
          status: 'active'
        };
        
        QRCode.toDataURL(JSON.stringify(qrData), { 
          width: 512,
          margin: 2,
          color: { 
            dark: '#1f2937',
            light: '#ffffff' 
          },
          errorCorrectionLevel: 'H'
        })
          .then((dataUrl) => {
            setQuickQrDataUrl(dataUrl);
            // Show success toast
            setToast({
              type: 'success',
              message: `Successfully rescheduled to ${leaveData.newSlot.time}. Opening your new digital pass...`
            });
            setTimeout(() => {
              setToast(null);
              // Show updated digital pass after a brief delay
              setShowDigitalPass(true);
            }, 2000);
          })
          .catch(error => {
            console.error('Error generating QR code:', error);
            setToast({
              type: 'error',
              message: 'Failed to generate new QR code. Please try again.'
            });
          });
      } catch (error) {
        console.error('Error updating slot:', error);
        setToast({
          type: 'error',
          message: 'Failed to update your slot. Please try again.'
        });
      }
      return; // Skip all refund-related code
    }
    
    // Save leave reason for analytics
    const analyticsData = {
      bookingId: userQueue.bookingId,
      templeId: selectedTemple,
      reason: leaveData.reason,
      timestamp: new Date().toISOString(),
      position: queuePosition
    };
    
    // Store leave reason locally (in a real app, this would be sent to analytics)
    const leaveHistory = JSON.parse(localStorage.getItem('queue-leave-history') || '[]');
    leaveHistory.push(analyticsData);
    localStorage.setItem('queue-leave-history', JSON.stringify(leaveHistory));
    
    // Mark QR as expired
    const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
    expiredPasses.push(userQueue.bookingId);
    localStorage.setItem('expired-passes', JSON.stringify(expiredPasses));
    setQrExpired(true);
    
    // Clear queue data
    setUserQueue(null);
    setQueuePosition(null);
    setQuickQrDataUrl(null); // Clear QR code
    localStorage.removeItem(`queue-${selectedTemple}`);
    setShowLeaveQueueModal(false);
    
    // Calculate refund amount based on time until slot
    const slotTime = new Date(userQueue.slotTime);
    const now = new Date();
    const hoursUntilSlot = (slotTime - now) / (1000 * 60 * 60);
    
    // If more than 2 hours until slot, offer full refund
    // If between 1-2 hours, offer 50% refund
    // If less than 1 hour, no refund
    let refundAmount = 0;
    let refundMessage = '';
    
    if (hoursUntilSlot >= 2) {
      refundAmount = userQueue.amount;
      refundMessage = `Full refund of ₹${refundAmount} will be processed for your booking.`;
    } else if (hoursUntilSlot >= 1) {
      refundAmount = Math.floor(userQueue.amount * 0.5);
      refundMessage = `Partial refund of ₹${refundAmount} (50%) will be processed for your booking.`;
    } else {
      refundMessage = 'No refund is available as the cancellation is too close to the slot time.';
    }

    // Store refund information if applicable
    if (refundAmount > 0) {
      const refunds = JSON.parse(localStorage.getItem('pending-refunds') || '[]');
      refunds.push({
        bookingId: userQueue.bookingId,
        amount: refundAmount,
        reason: leaveData.reason,
        timestamp: new Date().toISOString(),
        status: 'processing'
      });
      localStorage.setItem('pending-refunds', JSON.stringify(refunds));
    }
    
    // Show refund message
    if(refundAmount > 0 && leaveData.reason !== 'slot_change' ){
      setToast({
        type: refundAmount > 0 ? 'success' : 'info',
        message: `${refundMessage} Your refund will be processed in 3-5 business days.` 
      });
      setTimeout(() => setToast(null), 6000);
    }
    else {
      setToast({
        type: refundAmount > 0 ? 'success' : 'info',
        message: `${refundMessage}` 
      });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleQrExpiration = () => {
    // Just clear the queue data without showing leave modal or refund message
    setUserQueue(null);
    setQueuePosition(null);
    localStorage.removeItem(`queue-${selectedTemple}`);
    setQrExpired(true);
    setToast({
      type: 'warning',
      message: 'Your queue session has expired.'
    });
  };

  const refreshQueueStatus = async () => {
    setRefreshing(true);
    
    // Check if QR is expired first
    const expiredPasses = JSON.parse(localStorage.getItem('expired-passes') || '[]');
    const isExpired = userQueue && expiredPasses.includes(userQueue.bookingId);
    setQrExpired(isExpired);
    
    if (isExpired) {
      handleQrExpiration();
      setRefreshing(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userQueue) {
      const updatedPosition = Math.max(1, userQueue.position - Math.floor(Math.random() * 3));
      const updatedQueue = {
        ...userQueue,
        position: updatedPosition,
        estimatedTime: updatedPosition * 2
      };
      setUserQueue(updatedQueue);
      setQueuePosition(updatedPosition);
      localStorage.setItem(`queue-${selectedTemple}`, JSON.stringify(updatedQueue));

      // Regenerate QR code with updated position
      if (updatedQueue.bookingId) {
        try {
          const temple = templeData[updatedQueue.templeId];
          const qrData = {
            bookingId: updatedQueue.bookingId,
            templeId: updatedQueue.templeId,
            templeName: temple.name,
            templeLocation: temple.location,
            visitorName: updatedQueue.userData.name,
            phoneNumber: updatedQueue.userData.phoneNumber,
            email: updatedQueue.userData.email || '',
            slotTime: updatedQueue.slotTime,
            tier: updatedQueue.tier.name,
            tierPrice: updatedQueue.tier.price,
            numberOfPeople: updatedQueue.userData.numberOfPeople,
            amount: updatedQueue.amount,
            paymentId: updatedQueue.paymentId,
            bookingDate: new Date(updatedQueue.timestamp).toLocaleDateString('en-IN'),
            bookingTime: new Date(updatedQueue.timestamp).toLocaleTimeString('en-IN'),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            queuePosition: updatedPosition,
            estimatedTime: updatedPosition * 2,
            verificationUrl: `https://temple-app.com/verify/${updatedQueue.bookingId}`,
            checksum: `${updatedQueue.bookingId}-${updatedQueue.templeId}-${Date.now()}`.slice(-8),
            status: 'active'
          };
          const qrString = JSON.stringify(qrData);
          QRCode.toDataURL(qrString, { 
            width: 512,
            margin: 2,
            color: { 
              dark: '#1f2937',
              light: '#ffffff' 
            },
            errorCorrectionLevel: 'H'
          })
            .then(setQuickQrDataUrl)
            .catch(console.error);
        } catch (error) {
          console.error('Error generating QR preview:', error);
        }
      }
    }
    
    setRefreshing(false);
  };

  const getSlotStatus = (slot) => {
    const bookedPercentage = (slot.booked / slot.available) * 100;
    if (bookedPercentage >= 100) return 'full';
    if (bookedPercentage >= 80) return 'filling';
    return 'available';
  };

  const getSlotStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'filling': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'full': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTierIcon = (tierId) => {
    switch (tierId) {
      case 'free': return Users;
      case 'regular': return CheckCircle;
      case 'premium': return Star;
      case 'vip': return Crown;
      case 'special': return Heart;
      default: return Users;
    }
  };

  const getTierColor = (tierId) => {
    switch (tierId) {
      case 'free': return 'border-gray-300 text-gray-700';
      case 'regular': return 'border-blue-300 text-blue-700';
      case 'premium': return 'border-purple-300 text-purple-700';
      case 'vip': return 'border-yellow-300 text-yellow-700';
      case 'special': return 'border-red-300 text-red-700';
      default: return 'border-gray-300 text-gray-700';
    }
  };
  const downloadAsPDF = async () => {
    if (!passRef.current || isDownloading || !userQueue || !temple) {
      setToast({
        type: 'error',
        message: 'Cannot generate PDF: Missing required data'
      });
      return;
    }

    setIsDownloading(true);
    try {
      setShowDownloadChoice(false); // Hide the modal while generating
      
      // Wait for elements to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(passRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: true,
        width: passRef.current.offsetWidth,
        height: passRef.current.offsetHeight,
        onclone: (doc) => {
          const root = doc.getElementById('digital-pass-root');
          if (root) {
            root.style.backgroundColor = '#ffffff';
            root.style.transform = 'none';
            root.style.position = 'static';
          }
          const header = doc.querySelector('.pass-header');
          if (header) {
            header.style.backgroundColor = '#f2750a';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40; // 20mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Center on page
      const x = 20;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
      pdf.setProperties({
        title: `Temple Pass - ${userQueue.bookingId}`,
        subject: `Digital Pass for ${temple.name}`,
        author: 'Divine Flow',
        creator: 'Divine Flow'
      });

      pdf.save(`temple-pass-${userQueue.bookingId}.pdf`);
      
      setToast({
        type: 'success',
        message: 'PDF downloaded successfully!'
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      setToast({
        type: 'error',
        message: 'Failed to generate PDF. Please try again.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

const downloadAsPNG = async () => {
    if (!passRef.current || isDownloading || !userQueue || !temple) {
      setToast({
        type: 'error',
        message: 'Cannot generate PNG: Missing required data'
      });
      return;
    }

    setIsDownloading(true);
    try {
      setShowDownloadChoice(false); // Hide the modal while generating
      
      // Wait for elements to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(passRef.current, {
        scale: 3, // Higher scale for better quality PNG
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: true,
        width: passRef.current.offsetWidth,
        height: passRef.current.offsetHeight,
        onclone: (doc) => {
          const root = doc.getElementById('digital-pass-root');
          if (root) {
            root.style.backgroundColor = '#ffffff';
            root.style.transform = 'none';
            root.style.position = 'static';
          }
          const header = doc.querySelector('.pass-header');
          if (header) {
            header.style.backgroundColor = '#f2750a';
          }
        }
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `temple-pass-${userQueue.bookingId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({
        type: 'success',
        message: 'PNG downloaded successfully!'
      });
    } catch (error) {
      console.error('PNG generation error:', error);
      setToast({
        type: 'error',
        message: 'Failed to generate PNG. Please try again.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (userQueue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Queue Status Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.queueStatus}</h1>
          <p className="text-gray-600 dark:text-gray-300">Your virtual queue position</p>
        </div>

        {/* Current Queue Position */}
        <div className="card text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">#{queuePosition}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t.currentPosition}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{userQueue.estimatedTime}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t.minutes} remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{userQueue.slotTime}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Darshan time</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <button
              onClick={refreshQueueStatus}
              disabled={refreshing}
              className="btn-secondary flex items-center justify-center space-x-2 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{t.refresh}</span>
            </button>
            {/* <button
              onClick={() => setShowDownloadChoice(true)}
              className="btn-primary flex items-center justify-center space-x-2 text-sm"
            >
              <QrCode className="h-4 w-4" />
              <span>{t.viewPass || 'View Pass'}</span>
            </button> */}
            <button
              onClick={handleLeaveQueue}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              {t.leaveQueue}
            </button>
          </div>
        </div>

        {/* Quick QR Code Preview */}
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick QR Preview</h3>
          <div className="w-40 h-40 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-2 border border-gray-200 dark:border-gray-600 p-2">
            {qrExpired ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <QrCode className="h-16 w-16 text-red-400" />
                <span className="text-sm text-red-500 mt-2 font-medium">QR Expired</span>
              </div>
            ) : quickQrDataUrl ? (
              <img 
                src={quickQrDataUrl} 
                alt="Quick QR" 
                className="w-full h-full" 
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="animate-pulse flex flex-col items-center justify-center w-full h-full">
                <QrCode className="h-16 w-16 text-gray-400" />
                <span className="text-sm text-gray-400 mt-2">Generating QR...</span>
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Booking ID: {userQueue.bookingId}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Show this QR code at the entrance for quick verification
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                setAutoDownloadPass(false);
                setShowDigitalPass(true);
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
            >
              View Full Pass <span className="ml-1">→</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Instructions</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                <li>• Arrive 10 minutes before your estimated time</li>
                <li>• Carry a valid ID proof</li>
                <li>• Show the QR code at the entrance</li>
                <li>• Follow temple guidelines and dress code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
            onClick={() => setToast(null)}
          >
            {toast.message}
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedSlot(null);
            setSelectedTier(null);
          }}
          slot={selectedSlot}
          selectedTier={selectedTier}
          temple={temple}
          language={language}
          onPaymentSuccess={handlePaymentSuccess}
        />

        {/* Leave Queue Modal */}
        <LeaveQueueModal
          isOpen={showLeaveQueueModal}
          onClose={() => setShowLeaveQueueModal(false)}
          onConfirmLeave={handleConfirmLeaveQueue}
          language={language}
          userQueue={userQueue}
          selectedTemple={selectedTemple}
        />

        {/* Digital Pass Modal */}
        {showDigitalPass && userQueue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.darshanPass}</h2>
                <button 
                  onClick={() => setShowDigitalPass(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <DigitalPass 
                  ref={passRef} 
                  queueData={userQueue} 
                  language={language} 
                  autoDownload={false}
                  onQrExpire={handleQrExpiration}
                />
              </div>
            </div>
          </div>
        )}

        {/* Download Format Choice Dialog */}
        {/* {showDownloadChoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download pass as</h3>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={downloadAsPDF}
                  disabled={isDownloading}
                  className={`btn-primary w-full flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
                </button>
                <button
                  onClick={downloadAsPNG}
                  disabled={isDownloading}
                  className={`btn-secondary w-full flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isDownloading ? 'Generating PNG...' : 'Download as PNG'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden DigitalPass for download only 
        {autoDownloadPass && userQueue && (
          <div style={{ display: 'none' }}>
            <DigitalPass 
              ref={passRef} 
              queueData={userQueue} 
              language={language} 
              autoDownload={false}
              onQrExpire={handleQrExpiration}
            />
          </div>
        )} */}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.queueManagement}</h1>
        <p className="text-gray-600 dark:text-gray-300">Book your darshan slot and skip the physical queue</p>
      </div>

      {/* Current Queue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <Users className="h-8 w-8 text-primary-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{queue.currentQueue}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">People in queue</div>
        </div>
        <div className="card text-center">
          <Clock className="h-8 w-8 text-primary-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{queue.averageWaitTime}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t.minutes} avg wait</div>
        </div>
        <div className="card text-center">
          <Calendar className="h-8 w-8 text-primary-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {queue.darshanSlots.filter(slot => slot.booked < slot.available).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Slots available</div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Available Darshan Slots</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {queue.darshanSlots.map((slot, index) => {
            const status = getSlotStatus(slot);
            const isDisabled = status === 'full' || isBooking;
            
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{slot.time}</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSlotStatusColor(status)}`}>
                    {status === 'available' && 'Available'}
                    {status === 'filling' && 'Filling Fast'}
                    {status === 'full' && 'Full'}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Total Available:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{slot.available - slot.booked}/{slot.available}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'available' ? 'bg-green-500' :
                        status === 'filling' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(slot.booked / slot.available) * 100}%` }}
                    />
                  </div>
                </div>

                {!isDisabled ? (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Available Tiers:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {temple.pricingTiers.map((tier) => {
                        const availableCount = slot.pricing?.[tier.id] || 0;
                        const tierDisabled = availableCount === 0;
                        const TierIcon = getTierIcon(tier.id);
                        
                        return (
                          <button
                            key={tier.id}
                            onClick={() => !tierDisabled && (setSelectedSlot(slot), handleTierSelection(tier))}
                            disabled={tierDisabled}
                            className={`p-2 rounded-lg border text-xs transition-all duration-200 ${
                              tierDisabled 
                                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                                : `bg-white dark:bg-gray-800 hover:shadow-sm ${getTierColor(tier.id)}`
                            }`}
                          >
                            <div className="flex items-center space-x-1 mb-1">
                              <TierIcon className="h-3 w-3" />
                              <span className="font-medium">{tier.name}</span>
                            </div>
                            <div className="text-xs">₹{tier.price}</div>
                            <div className="text-xs">{availableCount} left</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 text-sm text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4 mr-1" />
                    Fully Booked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedSlot(null);
          setSelectedTier(null);
        }}
        slot={selectedSlot}
        selectedTier={selectedTier}
        temple={temple}
        language={language}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Leave Queue Modal */}
      <LeaveQueueModal
        isOpen={showLeaveQueueModal}
        onClose={() => setShowLeaveQueueModal(false)}
        onConfirmLeave={handleConfirmLeaveQueue}
        language={language}
        userQueue={userQueue}
        selectedTemple={selectedTemple}
      />

      {/* Digital Pass Modal */}
      {showDigitalPass && userQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.darshanPass}</h2>
              <button 
                onClick={() => setShowDigitalPass(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <DigitalPass queueData={userQueue} language={language} autoDownload={false} />
            </div>
          </div>
        </div>
      )}

      {/* Download Format Choice Dialog */}
      {/* Hidden pass for download */}
      {userQueue && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <DigitalPass 
            ref={passRef} 
            queueData={userQueue} 
            language={language} 
            autoDownload={false}
            onQrExpire={(bookingId) => {
              handleLeaveQueue();
              setToast({
                type: 'warning',
                message: 'Your QR code has expired. You have been removed from the queue.'
              });
            }}
          />
        </div>
      )}

      {showDownloadChoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Download pass as</h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={downloadAsPDF}
                disabled={isDownloading}
                className={`btn-primary w-full flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
              </button>
              <button
                onClick={downloadAsPNG}
                disabled={isDownloading}
                className={`btn-secondary w-full flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDownloading ? 'Generating PNG...' : 'Download as PNG'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden DigitalPass for download only */}
      {autoDownloadPass && userQueue && (
        <div style={{ display: 'none' }}>
          <DigitalPass queueData={userQueue} language={language} autoDownload={autoDownloadPass} />
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}

      {/* Information */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Virtual Queue Benefits</h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-1 space-y-1">
              <li>• Skip the physical queue and save time</li>
              <li>• Get real-time updates on your position</li>
              <li>• Receive notifications when it's your turn</li>
              <li>• Plan your visit better with estimated wait times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;