
/**
 * Functions for extracting text from different file types
 */

// Function to extract text content from a file
export const extractTextFromFile = async (file: File): Promise<string> => {
  // For text files, we can directly read the content
  if (file.type === 'text/plain') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  
  // For other file types (PDF, DOCX), we'd need server-side processing
  // Since we don't have that available, we'll extract some sample text from the beginning
  // This is a limitation of the current implementation
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // This is a simplified approach for demo purposes
      // In a real application, you'd want to use libraries to properly extract text
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      
      // Try to extract some readable text from the beginning of the file
      // This is very rudimentary and won't work well for binary files
      let text = '';
      for (let i = 0; i < Math.min(5000, bytes.length); i++) {
        if (bytes[i] >= 32 && bytes[i] <= 126) { // ASCII printable chars
          text += String.fromCharCode(bytes[i]);
        }
      }
      
      // Clean up the text a bit
      text = text.replace(/[^\x20-\x7E]/g, ' ').trim();
      
      // If we couldn't extract meaningful text, provide a fallback message
      if (text.length < 100) {
        reject(new Error("Could not extract text from this file type. Try uploading a plain text (.txt) file."));
        return;
      }
      
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
