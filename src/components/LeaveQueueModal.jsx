import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { translations } from '../data/translations';

const LeaveQueueModal = ({ isOpen, onClose, onConfirmLeave, language, userQueue, selectedTemple }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showReschedule, setShowReschedule] = useState(false);
  const [newSlot, setNewSlot] = useState(null);
  
  const t = translations[language];
  
  if (!isOpen) return null;

  const leaveReasons = [
    { id: 'change_plans', label: t.leaveReasons?.changePlans || 'Change in plans' },
    { id: 'emergency', label: t.leaveReasons?.emergency || 'Emergency situation' },
    { id: 'long_wait', label: t.leaveReasons?.longWait || 'Wait time too long' },
    { id: 'technical_issue', label: t.leaveReasons?.technicalIssue || 'Technical issue with app' },
    { id: 'found_alternative', label: t.leaveReasons?.foundAlternative || 'Found alternative time' },
    { id: 'change_slot', label: 'Change time slot (no extra charge)' },
    { id: 'dissatisfied_service', label: t.leaveReasons?.dissatisfiedService || 'Dissatisfied with service' },
    { id: 'other', label: t.leaveReasons?.other || 'Other reason' }
  ];

  const handleConfirm = () => {
    const reason = selectedReason === 'other' ? customReason : 
                   leaveReasons.find(r => r.id === selectedReason)?.label || '';
    
    if (!reason.trim()) {
      alert('Please select or enter a reason for leaving the queue.');
      return;
    }
    
    // If rescheduling
    if (selectedReason === 'change_slot' && newSlot) {
      onConfirmLeave({ reason, newSlot, refundEligible: false, refundAmount: 0 });
      setSelectedReason('');
      setCustomReason('');
      setNewSlot(null);
      setShowReschedule(false);
      return;
    }

    // Default leave with refund if paid
    const refundEligible = (userQueue?.amount || 0) > 0;
    const refundAmount = refundEligible ? userQueue.amount : 0;
    onConfirmLeave({ reason, refundEligible, refundAmount });
    setSelectedReason('');
    setCustomReason('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t.leaveQueue || 'Leave Queue'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t.confirmLeaveQueue || 'Are you sure you want to leave the queue?'}
              </h3>
              <p className="text-gray-600 text-sm">
                {t.leaveQueueWarning || 'You will lose your current position and will need to rejoin to get darshan. Please let us know why you\'re leaving to help us improve our service.'}
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              {t.reasonForLeaving || 'Reason for leaving:'} *
            </label>
            
            {leaveReasons.map((reason) => (
              <label key={reason.id} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="leaveReason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{reason.label}</span>
              </label>
            ))}
            
            {selectedReason === 'other' && (
              <div className="ml-7 mt-2">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={t.enterCustomReason || 'Please specify your reason...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  rows="3"
                />
              </div>
            )}

            {selectedReason === 'change_slot' && (
              <div className="ml-7 mt-2 space-y-2">
                <p className="text-sm text-gray-700">Select a different time slot:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    try {
                      const { templeData } = require('../data/templeData');
                      const slots = templeData[selectedTemple]?.darshanSlots || [];
                      return slots.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setNewSlot(s)}
                          className={`px-2 py-1 rounded border text-xs ${newSlot?.time === s.time ? 'border-primary-500 text-primary-600' : 'border-gray-300 text-gray-700'}`}
                        >{s.time}</button>
                      ));
                    } catch {
                      return null;
                    }
                  })()}
                </div>
                {newSlot && (
                  <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">Selected: {newSlot.time}. You won't be charged again.</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {t.confirmLeave || 'Confirm Leave'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveQueueModal;
