import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart } from 'lucide-react';
import Popup from '../common/Popup';
import LegalModal from '../legal/LegalModal';

// Import payment method logos
import stripeLogo from '../layout/assets/stripe-logo.png';
import paypalLogo from '../layout/assets/paypal-logo.png';
import orangeLogo from '../layout/assets/orange-money-logo.png';
import lonestarLogo from '../layout/assets/lonestar-logo.png';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal component for processing donations
 * Handles multi-step donation process, payment information, and email confirmations
 */
const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Legal modal state
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy'>('terms');
  const [successTitle, setSuccessTitle] = useState('');
  const [donationFrequency, setDonationFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe'); // 'stripe', 'paypal', 'orange', 'lonestar'
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [mobileMoneyInfo, setMobileMoneyInfo] = useState({
    phoneNumber: '',
    accountName: ''
  });

  // Test mode flag - set to true to accept any payment details
  const [testMode] = useState(true);

  const sendDonationEmails = async () => {
    try {
      // Create the request payload with all necessary donation information
      const payload = {
        amount: selectedAmount || 0,
        frequency: donationFrequency,
        paymentMethod: selectedPaymentMethod,
        donorInfo: {
          name: donorInfo.name || '',
          email: donorInfo.email || '',
          message: donorInfo.message || ''
        },
        billingInfo: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          address: billingInfo.address,
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country
        },
        paymentInfo: selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'paypal' ? {
          cardNumber: cardInfo.cardNumber,
          expiryDate: cardInfo.expiryDate,
          cvv: cardInfo.cvv,
          cardholderName: cardInfo.cardholderName
        } : {
          phoneNumber: mobileMoneyInfo.phoneNumber,
          accountName: mobileMoneyInfo.accountName
        }
      };

      // Send the donation data to the backend API
      const response = await fetch('https://liight-design-backend.onrender.com/api/send-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process donation');
      }
      
      return true;
    } catch (error) {
      console.error('Donation processing failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Show test mode message in console
      if (testMode) {
        console.log('TEST MODE ACTIVE: Processing donation without real payment');
        console.log('Donation details:', {
          amount: selectedAmount,
          frequency: donationFrequency,
          paymentMethod: selectedPaymentMethod,
          donor: donorInfo,
          billing: billingInfo,
          paymentInfo: selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'paypal' ? {
            ...cardInfo,
            cardNumber: '****-****-****-' + (cardInfo.cardNumber.length >= 4 ? cardInfo.cardNumber.slice(-4) : 'XXXX'),
            cvv: '***'
          } : {
            phoneNumber: mobileMoneyInfo.phoneNumber.replace(/\d(?=\d{4})/g, '*'),
            accountName: mobileMoneyInfo.accountName
          }
        });
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send email notifications
      const emailSuccess = await sendDonationEmails();
      
      if (!emailSuccess) {
        throw new Error('Failed to send confirmation emails');
      }
      
      // Prepare success message
      const isHighDonation = selectedAmount && selectedAmount >= 100;
      const title = testMode 
        ? "Test Donation Successful!" 
        : "Thank You for Your Donation!";
        
      let message;
      
      if (testMode) {
        message = `This is a TEST donation of $${selectedAmount?.toFixed(2)}. No actual payment was processed.\n\n`;
        message += donorInfo.email 
          ? `A confirmation email has been sent to ${donorInfo.email}.` 
          : 'No email was provided, so no confirmation email was sent.';
        
        if (isHighDonation) {
          message += '\n\nAs this was a donation of $100 or more, a sample discount code was included in the email.';
        }
      } else {
        message = isHighDonation 
          ? `Thank you for your generous $${selectedAmount?.toFixed(2)} donation!\n\nAs a token of our appreciation, you've earned a 15% discount on your next design project with LIIGHT DESIGN INC.${donorInfo.email ? '\n\nWe\'ve sent you an email with your receipt and discount code.' : ''}`
          : `Thank you for your generous $${selectedAmount?.toFixed(2)} donation! Your support means everything to us and helps bring our vision to life.${donorInfo.email ? '\n\nWe\'ve sent you an email with your donation receipt.' : ''}`;
      }
      
      // Reset form
      setSelectedAmount(null);
      setCurrentStep(1);
      setDonorInfo({ name: '', email: '', message: '' });
      setBillingInfo({ firstName: '', lastName: '', address: '', city: '', state: '', zipCode: '', country: '' });
      setCardInfo({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
      setMobileMoneyInfo({ phoneNumber: '', accountName: '' });
      
      // Show success popup
      setSuccessTitle(title);
      setSuccessMessage(message);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Donation processing error:', error);
      
      // Show error popup
      setSuccessTitle('Donation Error');
      setSuccessMessage('There was an error processing your donation. Please try again later.');
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = selectedAmount && selectedAmount > 0;
  const isStep2Valid = billingInfo.firstName && billingInfo.lastName && billingInfo.address && billingInfo.city && billingInfo.state && billingInfo.zipCode && billingInfo.country;
  
  // In test mode, we're more lenient with card validation
  const isStep3Valid = testMode
    ? (selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'paypal')
      ? cardInfo.cardNumber.length > 0 && cardInfo.expiryDate.length > 0 && cardInfo.cvv.length > 0 && cardInfo.cardholderName
      : mobileMoneyInfo.phoneNumber.length > 0 && mobileMoneyInfo.accountName.length > 0
    : (selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'paypal')
      ? cardInfo.cardNumber.length >= 19 && cardInfo.expiryDate.length === 5 && cardInfo.cvv.length === 3 && cardInfo.cardholderName
      : mobileMoneyInfo.phoneNumber.length >= 10 && mobileMoneyInfo.accountName.length > 0;

  // Create a portal container if it doesn't exist
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      // Reset form state when modal opens
      setSelectedAmount(null);
      setCurrentStep(1);
      setDonorInfo({ name: '', email: '', message: '' });
      setBillingInfo({ firstName: '', lastName: '', address: '', city: '', state: '', zipCode: '', country: '' });
      setCardInfo({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
      setMobileMoneyInfo({ phoneNumber: '', accountName: '' });
      setShowSuccessPopup(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check if the portal container already exists
    let container = document.getElementById('donation-modal-portal');
    
    // If not, create it and append to body
    if (!container) {
      container = document.createElement('div');
      container.id = 'donation-modal-portal';
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Cleanup function to remove the container when component unmounts
    return () => {
      if (container && !isOpen) {
        document.body.removeChild(container);
      }
    };
  }, [isOpen]);

  if (!isOpen || !portalContainer) return null;
  
  // Handle closing the success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return (
    <>
      {createPortal(
        <div 
          className="fixed inset-0 overflow-y-auto"
          style={{ 
            zIndex: 9999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-75" 
              onClick={onClose}
              style={{ 
                zIndex: 9999999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            
            <div 
              className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
              style={{ 
                zIndex: 10000000,
                position: 'relative'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Heart className="w-6 h-6 text-secondary fill-current" />
                  </div>
                  <div>
                    <h3 className="font-changa text-2xl font-bold text-black">
                      Support Our Vision
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full ${
                            step <= currentStep ? 'bg-secondary' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Amount Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <p className="font-poppins text-gray-600 mb-4">
                      Your support helps us bring innovative design solutions to life
                    </p>
                    
                    {/* Donation Frequency Selection */}
                    <div className="mb-6">
                      <h4 className="font-poppins font-medium text-gray-800 mb-3">Donation Frequency</h4>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setDonationFrequency('one-time')}
                          className={`flex-1 py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${donationFrequency === 'one-time' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          One-time
                        </button>
                        <button
                          type="button"
                          onClick={() => setDonationFrequency('monthly')}
                          className={`flex-1 py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${donationFrequency === 'monthly' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          Monthly
                        </button>
                      </div>
                      {donationFrequency === 'monthly' && (
                        <p className="text-xs text-green-600 mt-2">
                          Monthly donors receive exclusive project updates and early access to new designs!
                        </p>
                      )}
                    </div>
                    
                    {/* Suggested Amounts */}
                    <div>
                      <h4 className="font-poppins font-medium text-gray-800 mb-3">Select Amount</h4>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[25, 50, 100, 250, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => setSelectedAmount(amount)}
                            className={`py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${selectedAmount === amount ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Custom Amount */}
                    <div>
                      <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                        Custom Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={selectedAmount || ''}
                          onChange={(e) => setSelectedAmount(Number(e.target.value))}
                          placeholder="Enter amount"
                          className="w-full pl-8 pr-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    {/* Impact Information */}
                    {selectedAmount && selectedAmount > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg border border-gray-100">
                        <h5 className="font-poppins font-medium text-black mb-2">Your Impact</h5>
                        <p className="text-sm text-black">
                          {selectedAmount >= 1000 ? (
                            <>Your generous donation of ${selectedAmount.toFixed(2)} could fund a project for a community in need!</>
                          ) : selectedAmount >= 500 ? (
                            <>Your donation of ${selectedAmount.toFixed(2)} helps provide professional design services to underserved communities.</>
                          ) : selectedAmount >= 100 ? (
                            <>With ${selectedAmount.toFixed(2)}, we can create sustainable design solutions for local initiatives.</>
                          ) : (
                            <>Every dollar counts! Your ${selectedAmount.toFixed(2)} donation supports our mission to bring design to everyone.</>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {/* Tax Deduction Notice */}
                    <div className="text-xs text-gray-500">
                      All donations are tax-deductible to the extent allowed by law.
                    </div>
                    
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStep1Valid}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Billing
                    </button>
                  </div>
                )}

                {/* Step 2: Billing Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="font-poppins text-gray-600 mb-4">
                      Please provide your billing information
                    </p>
                    
                    {/* Donor Information */}
                    <div className="space-y-4">
                      <h4 className="font-poppins font-medium text-gray-800">Donor Information (Optional)</h4>
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                          placeholder="Your name"
                          className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                          placeholder="Your email address"
                          className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={donorInfo.message}
                          onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                          placeholder="Add a message with your donation"
                          rows={3}
                          className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="font-poppins font-medium text-gray-800">Billing Address</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.firstName}
                            onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                            placeholder="First name"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.lastName}
                            onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                            placeholder="Last name"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                          placeholder="Street address"
                          required
                          className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                            placeholder="City"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            State/Province *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.state}
                            onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})}
                            placeholder="State/Province"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.zipCode}
                            onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                            placeholder="ZIP/Postal code"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            value={billingInfo.country}
                            onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
                            placeholder="Country"
                            required
                            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStep2Valid}
                        className="w-1/2 bg-primary hover:bg-primary/90 text-white font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="font-poppins text-gray-600 mb-4">
                      Please enter your payment details
                    </p>
                    
                    {/* Test Mode Notice */}
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg mb-6">
                      <h5 className="font-poppins font-medium text-gray-800 mb-2">Test Mode Active</h5>
                      <p className="text-sm text-gray-700">
                        This is a test environment. Please do not enter real payment information.
                        You can use any test data for the card fields below.
                      </p>
                    </div>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <h4 className="font-poppins font-medium text-gray-800 mb-3">Select Payment Method</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('stripe')}
                          className={`py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${selectedPaymentMethod === 'stripe' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700'} flex flex-col items-center justify-center`}
                        >
                          <img 
                            src={stripeLogo} 
                            alt="Stripe" 
                            className="h-6 mb-1 object-contain" 
                            style={{ filter: selectedPaymentMethod === 'stripe' ? 'brightness(0) invert(1)' : 'none' }} 
                          />
                          <span className="text-xs">Stripe</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={`py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${selectedPaymentMethod === 'paypal' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-700'} flex flex-col items-center justify-center`}
                        >
                          <img 
                            src={paypalLogo} 
                            alt="PayPal" 
                            className="h-6 mb-1 object-contain" 
                            style={{ filter: selectedPaymentMethod === 'paypal' ? 'brightness(0) invert(1)' : 'none' }} 
                          />
                          <span className="text-xs">PayPal</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('orange')}
                          className={`py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${selectedPaymentMethod === 'orange' ? 'bg-[#FF6600] text-white' : 'bg-gray-100 text-gray-700'} flex flex-col items-center justify-center`}
                        >
                          <img 
                            src={orangeLogo} 
                            alt="Orange Money" 
                            className="h-6 mb-1 object-contain" 
                            style={{ filter: selectedPaymentMethod === 'orange' ? 'brightness(0) invert(1)' : 'none' }} 
                          />
                          <span className="text-xs">Orange Money</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('lonestar')}
                          className={`py-3 px-4 rounded-lg font-poppins font-medium transition-all duration-200 ${selectedPaymentMethod === 'lonestar' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'} flex flex-col items-center justify-center`}
                        >
                          <img 
                            src={lonestarLogo} 
                            alt="Lonestar Momo" 
                            className="h-6 mb-1 object-contain" 
                            style={{ filter: selectedPaymentMethod === 'lonestar' ? 'brightness(0) invert(1)' : 'none' }} 
                          />
                          <span className="text-xs">Lonestar Momo</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Card Payment Fields (Stripe/PayPal) */}
                      {(selectedPaymentMethod === 'stripe' || selectedPaymentMethod === 'paypal') && (
                        <>
                          <div>
                            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                              Card Number * <span className="text-xs text-gray-600">(Use any number for test mode)</span>
                            </label>
                            <input
                              type="text"
                              value={cardInfo.cardNumber}
                              onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                              placeholder="e.g. 4242 4242 4242 4242"
                              maxLength={19}
                              required
                              className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                                Expiry Date * <span className="text-xs text-gray-600">(Any future date)</span>
                              </label>
                              <input
                                type="text"
                                value={cardInfo.expiryDate}
                                onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                                className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                              />
                            </div>
                            
                            <div>
                              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                                CVV * <span className="text-xs text-gray-600">(Any 3 digits)</span>
                              </label>
                              <input
                                type="text"
                                value={cardInfo.cvv}
                                onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                                placeholder="123"
                                maxLength={4}
                                required
                                className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                              Cardholder Name * <span className="text-xs text-gray-600">(Any name)</span>
                            </label>
                            <input
                              type="text"
                              value={cardInfo.cardholderName}
                              onChange={(e) => setCardInfo({...cardInfo, cardholderName: e.target.value})}
                              placeholder="Name as it appears on card"
                              required
                              className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                            />
                          </div>
                        </>
                      )}

                      {/* Mobile Money Fields (Orange/Lonestar) */}
                      {(selectedPaymentMethod === 'orange' || selectedPaymentMethod === 'lonestar') && (
                        <>
                          <div>
                            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                              Phone Number * <span className="text-xs text-gray-600">(Use any number for test mode)</span>
                            </label>
                            <input
                              type="text"
                              value={mobileMoneyInfo.phoneNumber}
                              onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, phoneNumber: e.target.value})}
                              placeholder={selectedPaymentMethod === 'orange' ? "e.g. +231 77 123 4567" : "e.g. +231 88 123 4567"}
                              required
                              className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                              Account Name * <span className="text-xs text-gray-600">(Any name)</span>
                            </label>
                            <input
                              type="text"
                              value={mobileMoneyInfo.accountName}
                              onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, accountName: e.target.value})}
                              placeholder="Name registered with mobile money account"
                              required
                              className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
                            />
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-700">
                              {selectedPaymentMethod === 'orange' ? 
                                "For Orange Money test payments, use any phone number and name." : 
                                "For Lonestar Momo test payments, use any phone number and name."}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-poppins text-sm text-gray-600">Donation Amount:</span>
                        <span className="font-poppins font-bold text-black">${selectedAmount}</span>
                      </div>
                      
                      {selectedAmount && selectedAmount >= 100 && (
                        <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-100">
                          Donations of $100 or more qualify for a 15% discount on your next design project!
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <p className="font-poppins text-sm text-gray-400 mb-4">
                        By clicking "Complete Donation", you agree to our <a href="terms of service" onClick={(e) => {
                          e.preventDefault();
                          setLegalModalType('terms');
                          setLegalModalOpen(true);
                        }} className="text-secondary hover:underline">Terms of Service</a> and <a href="privacy policy" onClick={(e) => {
                          e.preventDefault();
                          setLegalModalType('privacy');
                          setLegalModalOpen(true);
                        }} className="text-secondary hover:underline">Privacy Policy</a>.
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!isStep3Valid || isSubmitting}
                        className="w-1/2 bg-primary hover:bg-primary/90 text-white font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        ) : null}
                        {isSubmitting ? 'Processing...' : 'Complete Donation'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>,
        portalContainer
      )}

      {/* Success/Error Popup */}
      <Popup
        isOpen={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        title={successTitle}
        message={successMessage}
        type={successTitle.includes('Error') ? 'error' : 'success'}
        zIndex={10000}
      />
      
      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        type={legalModalType}
      />
    </>
  );
};

export default DonationModal;
