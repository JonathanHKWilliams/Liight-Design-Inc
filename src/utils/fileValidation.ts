/**
 * File validation and security utilities for Liight Design
 */

// Maximum file size in bytes (30MB)
export const MAX_FILE_SIZE = 30 * 1024 * 1024;

/**
 * Validates if a file is a PDF and within size limits
 * @param file The file to validate
 * @returns An object with validation result and error message if any
 */
export const validatePdfFile = (file: File | null): { isValid: boolean; errorMessage: string } => {
  if (!file) {
    return { isValid: false, errorMessage: 'No file selected' };
  }

  // Check file type
  if (file.type !== 'application/pdf') {
    return { isValid: false, errorMessage: 'Only PDF files are allowed' };
  }

  // Check file size (30MB limit)
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      errorMessage: `File size exceeds the 30MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` 
    };
  }

  return { isValid: true, errorMessage: '' };
};

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Whether the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Basic security check for potentially malicious content
 * This is a simple implementation - in production, you'd want more sophisticated scanning
 * @param file The file to check
 * @returns Promise resolving to an object with check result and message
 */
export const checkFileForMaliciousContent = async (file: File): Promise<{ isSafe: boolean; message: string }> => {
  try {
    // Check file name for suspicious patterns
    const fileName = file.name.toLowerCase();
    const suspiciousExtensions = ['.exe', '.js', '.html', '.php'];
    
    if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
      return { isSafe: false, message: 'File contains potentially unsafe content' };
    }

    // For a real implementation, you would integrate with a security scanning service
    // This is a placeholder for demonstration purposes
    
    // Simulate scanning the first few bytes of the file
    const fileSlice = file.slice(0, 4096);
    const buffer = await fileSlice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check for executable file signatures or script tags
    // This is very basic and not comprehensive
    const suspiciousPatterns = [
      [0x4D, 0x5A], // MZ header (executable)
      [0x7F, 0x45, 0x4C, 0x46], // ELF header
      [0x3C, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74] // <script
    ];
    
    for (const pattern of suspiciousPatterns) {
      let matches = true;
      for (let i = 0; i < pattern.length; i++) {
        if (bytes[i] !== pattern[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return { isSafe: false, message: 'File contains potentially unsafe content' };
      }
    }
    
    return { isSafe: true, message: 'File passed security check' };
  } catch (error) {
    console.error('Error checking file security:', error);
    return { isSafe: false, message: 'Error checking file security' };
  }
};

/**
 * Creates a data URL for a PDF file to enable viewing
 * @param file The PDF file
 * @returns Promise resolving to the data URL
 */
export const createPdfPreviewUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
