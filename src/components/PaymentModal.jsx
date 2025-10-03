import { useState } from 'react';
import { 
  CreditCard, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader
} from 'lucide-react';
import { translations } from '../data/translations';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  slot, 
  selectedTier, 
  temple, 
  language, 
  onPaymentSuccess 
}) => {
  const [paymentStep, setPaymentStep] = useState('details'); // details, processing, success, failed
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    numberOfPeople: 1
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phoneNumber: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const t = translations[language];
  
  if (!isOpen || !slot || !selectedTier) return null;

  const basePrice = selectedTier.price;
  const bookingFee = basePrice > 0 ? 10 : 0;
  const serviceTax = basePrice > 0 ? Math.round(basePrice * 0.18) : 0;
  const totalAmount = (basePrice + bookingFee + serviceTax) * formData.numberOfPeople;

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s.]+$/.test(value)) {
          error = 'Name can only contain letters, spaces, and dots';
        }
        break;
        
      case 'phoneNumber':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          error = 'Enter a valid 10-digit Indian mobile number';
        }
        break;
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Enter a valid email address';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const errors = {
      name: validateField('name', formData.name),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      email: validateField('email', formData.email)
    };
    
    setFormErrors(errors);
    const isValid = !errors.name && !errors.phoneNumber && !errors.email;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and limit to 10 characters
    if (name === 'phoneNumber') {
      const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: sanitizedValue
        };
        // Immediate validation for phone number after sanitization
        const error = validateField(name, sanitizedValue);
        setFormErrors(prev => ({
          ...prev,
          [name]: error
        }));
        // Update form validity
        const errors = {
          ...formErrors,
          [name]: error
        };
        setIsFormValid(!errors.name && !errors.phoneNumber && !errors.email);
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        // Validation for other fields
        const error = validateField(name, value);
        setFormErrors(prev => ({
          ...prev,
          [name]: error
        }));
        // Update form validity
        const errors = {
          ...formErrors,
          [name]: error
        };
        setIsFormValid(!errors.name && !errors.phoneNumber && !errors.email);
        return newData;
      });
    }
  };

  const handlePayment = async () => {
    // Validate form before processing
    if (!validateForm()) {
      return;
    }
    
    setPaymentStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate payment success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      setPaymentStep('success');
      setTimeout(() => {
        onPaymentSuccess({
          ...formData,
          slot,
          tier: selectedTier,
          amount: totalAmount,
          paymentId: `PAY${Date.now()}`,
          bookingId: `TQ${Date.now()}`
        });
        onClose();
      }, 2000);
    } else {
      setPaymentStep('failed');
    }
  };

  const handleRetry = () => {
    setPaymentStep('details');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {paymentStep === 'details' && t.payment}
            {paymentStep === 'processing' && t.processing}
            {paymentStep === 'success' && t.paymentSuccessful}
            {paymentStep === 'failed' && t.paymentFailed}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Payment Details Step */}
        {paymentStep === 'details' && (
          <div className="p-6 space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{t.bookDarshan}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.temples[temple.id]}:</span>
                  <span className="font-medium">{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.pricingTiers[selectedTier.id]}:</span>
                  <span className="font-medium">{selectedTier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.numberOfPeople}:</span>
                  <span className="font-medium">{formData.numberOfPeople}</span>
                </div>
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Personal Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.name} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => validateField('name', formData.name)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.phoneNumber} *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onBlur={() => validateField('phoneNumber', formData.phoneNumber)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  required
                />
                {formErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email} (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => validateField('email', formData.email)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.numberOfPeople} *
                </label>
                <select
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method */}
            {totalAmount > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span>UPI</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span>Digital Wallet</span>
                  </label>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">{t.totalAmount}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedTier.name} x {formData.numberOfPeople}:</span>
                  <span>₹{basePrice * formData.numberOfPeople}</span>
                </div>
                {bookingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.bookingFee}:</span>
                    <span>₹{bookingFee * formData.numberOfPeople}</span>
                  </div>
                )}
                {serviceTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.serviceTax} (18%):</span>
                    <span>₹{serviceTax * formData.numberOfPeople}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                  <span>{t.totalAmount}:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button onClick={onClose} className="flex-1 btn-secondary">
                {t.cancel}
              </button>
              <button 
                onClick={handlePayment}
                disabled={!isFormValid}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {totalAmount > 0 ? `${t.payNow} ₹${totalAmount}` : t.confirm}
              </button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {paymentStep === 'processing' && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.processing}</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {/* Success Step */}
        {paymentStep === 'success' && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.paymentSuccessful}</h3>
            <p className="text-gray-600">Your darshan has been booked successfully!</p>
          </div>
        )}

        {/* Failed Step */}
        {paymentStep === 'failed' && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.paymentFailed}</h3>
            <p className="text-gray-600 mb-4">There was an issue processing your payment. Please try again.</p>
            <div className="flex space-x-3">
              <button onClick={onClose} className="flex-1 btn-secondary">
                {t.cancel}
              </button>
              <button onClick={handleRetry} className="flex-1 btn-primary">
                {t.retry}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
