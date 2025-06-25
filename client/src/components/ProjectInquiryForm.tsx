import React, { useState, useRef } from 'react';
import { Upload, Send, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePdfFile, validateEmail, checkFileForMaliciousContent, createPdfPreviewUrl } from '../utils/fileValidation';
import Popup from '../components/common/Popup';
import LegalModal from './legal/LegalModal';

const ProjectInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organizationType: '',
    project: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [securityCheckStatus, setSecurityCheckStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Legal modal state
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy'>('terms');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate email when it changes
    if (name === 'email') {
      if (!value) {
        setEmailError('Email is required');
      } else if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  };

  const handleFileChange = async (file: File | null) => {
    // Reset states
    setFileError('');
    setPdfPreviewUrl(null);
    setSecurityCheckStatus('idle');
    
    if (!file) {
      setFormData(prev => ({ ...prev, project: null }));
      return;
    }
    
    // Validate file type and size
    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      setFileError(validation.errorMessage);
      return;
    }
    
    // Set security check status to checking
    setSecurityCheckStatus('checking');
    
    // Check for malicious content
    try {
      const securityCheck = await checkFileForMaliciousContent(file);
      
      if (!securityCheck.isSafe) {
        setFileError(securityCheck.message);
        setSecurityCheckStatus('failed');
        return;
      }
      
      // File passed all checks
      setSecurityCheckStatus('passed');
      setFormData(prev => ({ ...prev, project: file }));
      
      // Generate PDF preview URL
      try {
        const previewUrl = await createPdfPreviewUrl(file);
        setPdfPreviewUrl(previewUrl);
      } catch (error) {
        console.error('Error creating PDF preview:', error);
      }
    } catch (error) {
      console.error('Error during security check:', error);
      setFileError('Error validating file security');
      setSecurityCheckStatus('failed');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      handleFileChange(files[0]);
    }
  };

  const sendProjectInquiry = async () => {
    // Create FormData for multipart/form-data submission (for file upload)
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('organizationType', formData.organizationType || '');
    formDataToSend.append('projectDetails', formData.project ? `Project file: ${formData.project.name}` : 'No file attached');
    
    // Append the actual file instead of base64 data URL
    if (formData.project) {
      formDataToSend.append('pdfFile', formData.project);
    }

    try {
      const response = await fetch('http://localhost:5000/api/project-inquiry-with-pdf', {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send project inquiry');
      }
      
      return data;
    } catch (error) {
      console.error('Project inquiry submission failed:', error);
      throw error; // Rethrow to handle in the calling function
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs before submission
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (!formData.project) {
      setFileError('Please upload your project file');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send project inquiry via backend API
      // This will handle both admin notification and thank you emails
      await sendProjectInquiry();
      
      // Reset form and states
      setFormData({ name: '', email: '', organizationType: '', project: null });
      setFileError('');
      setEmailError('');
      setPdfPreviewUrl(null);
      setSecurityCheckStatus('idle');
      
      // Show success popup
      setSuccessMessage('Thank you for your inquiry! We\'ve sent you a confirmation email and will get back to you soon with exciting possibilities for your project.');
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle closing the success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  // Function to render security check status icon and message
  const renderSecurityStatus = () => {
    if (securityCheckStatus === 'idle' || !formData.project) return null;
    
    if (securityCheckStatus === 'checking') {
      return (
        <div className="flex items-center mt-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-xs">Checking file security...</span>
        </div>
      );
    }
    
    if (securityCheckStatus === 'passed') {
      return (
        <div className="flex items-center mt-2 text-green-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">File security check passed</span>
        </div>
      );
    }
    
    if (securityCheckStatus === 'failed') {
      return (
        <div className="flex items-center mt-2 text-red-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">Security check failed</span>
        </div>
      );
    }
    
    return null;
  };
  
  // Function to render PDF preview
  const renderPdfPreview = () => {
    if (!pdfPreviewUrl || !formData.project) return null;
    
    return (
      <div className="mt-4 border rounded-lg p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-secondary mr-2" />
            <span className="font-medium text-sm truncate max-w-[200px]">{formData.project.name}</span>
          </div>
          <a 
            href={pdfPreviewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-secondary hover:underline"
          >
            View PDF
          </a>
        </div>
        <div className="text-xs text-gray-500">
          {(formData.project.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full animate-slide-up">
      <div className="mb-6">
        <h3 className="font-changa text-2xl font-bold text-black mb-2">
          Do you have a <span className="text-secondary">project</span>
        </h3>
        <h3 className="font-changa text-2xl font-bold text-black mb-4">
          in <span className="text-secondary">Mind?</span>
        </h3>
        <p className="font-poppins text-gray-600 font-medium">
          We'd love to hear from you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. liight design"
            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="e.g. liightdesigninc@gmail.com"
            className={`w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:outline-none transition-all duration-200 ${emailError ? 'ring-2 ring-red-500' : 'focus:ring-secondary'}`}
            required
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-500">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Business/Organization Type
          </label>
          <input
            type="text"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleInputChange}
            placeholder="e.g. Non-profit, Corporate, Educational, etc."
            className="w-full px-4 py-3 bg-lightGrey rounded-lg border-0 font-poppins text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-secondary focus:outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
            Project *
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
              dragActive
                ? 'border-secondary bg-secondary/5'
                : fileError 
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-secondary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <Upload className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="font-poppins text-sm text-gray-600">
              {formData.project ? formData.project.name : 'Upload it here'}
            </p>
          </div>
          
          {fileError ? (
            <p className="mt-1 text-xs text-red-500">{fileError}</p>
          ) : (
            <p className="font-poppins text-xs text-gray-500 mt-1 italic">
              PDF Only - Max 30MB - Required
            </p>
          )}
          
          {renderSecurityStatus()}
          {renderPdfPreview()}
        </div>

        <div className="pt-2">
          <p className="font-poppins text-sm text-black mb-4">
            Let's start building something amazing together.
          </p>
          <p className="font-poppins text-sm text-gray-400 mb-4">
            By submitting this form, you agree to our <a href="terms of service" onClick={(e) => {
              e.preventDefault();
              setLegalModalType('terms');
              setLegalModalOpen(true);
            }} className="text-secondary hover:underline">Terms of Service</a> and <a href="privacy policy" onClick={(e) => {
              e.preventDefault();
              setLegalModalType('privacy');
              setLegalModalOpen(true);
            }} className="text-secondary hover:underline">Privacy Policy</a>.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Project</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Success Popup */}
      <Popup
        isOpen={showSuccessPopup}
        onClose={handleCloseSuccessPopup}
        title="Project Inquiry Received!"
        message={successMessage}
        type="success"
      />
      
      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        type={legalModalType}
      />
    </div>
  );
};

export default ProjectInquiryForm;