// Simplified PDF text extraction that works reliably with Next.js
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Import pdfjs-dist dynamically
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Disable worker to avoid Next.js issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = undefined;
    
    // Create a typed array view of the buffer
    const uint8Array = new Uint8Array(buffer);
    
    // Load the PDF document with minimal options
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      // Disable features that might cause issues
      disableFontFace: true,
      disableRange: true,
      disableStream: true,
      disableAutoFetch: true,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items
        const pageText = textContent.items
          .map((item: any) => {
            if (typeof item.str === 'string') {
              return item.str;
            }
            return '';
          })
          .filter(text => text.length > 0)
          .join(' ');
        
        if (pageText) {
          fullText += pageText + '\n';
        }
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        // Continue with other pages even if one fails
      }
    }
    
    // Clean up the document
    if (pdf && typeof pdf.destroy === 'function') {
      pdf.destroy();
    }
    
    // Clean up the extracted text
    fullText = fullText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n')  // Remove empty lines
      .trim();
    
    if (!fullText) {
      throw new Error('No text content could be extracted from the PDF');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('The file appears to be corrupted or is not a valid PDF');
      }
      if (error.message.includes('password')) {
        throw new Error('This PDF is password protected');
      }
    }
    
    throw new Error('Unable to extract text from this PDF. Please try converting it to a text file or copying and pasting the content into the AI Skill Analyzer.');
  }
}
