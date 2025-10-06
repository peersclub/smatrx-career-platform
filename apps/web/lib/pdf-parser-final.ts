const pdf = require('pdf-parse-new');

export async function extractTextFromPDF(dataBuffer: ArrayBuffer | Buffer): Promise<string> {
  try {
    // Convert ArrayBuffer to Buffer if needed
    const buffer = Buffer.isBuffer(dataBuffer) ? dataBuffer : Buffer.from(dataBuffer);
    
    // Parse the PDF
    const data = await pdf(buffer, {
      // Options to improve parsing
      max: 0, // Parse all pages (0 = no limit)
      version: 'v2.0.550' // Use latest PDF.js version
    });
    
    // Extract the text
    let text = data.text || '';
    
    // Clean up the text
    text = text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
      .trim();
    
    if (!text || text.length < 10) {
      throw new Error('No readable text found in the PDF');
    }
    
    console.log(`Successfully extracted ${text.length} characters from PDF`);
    return text;
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('encrypted')) {
        throw new Error('This PDF is encrypted or password protected');
      }
      if (error.message.includes('Invalid')) {
        throw new Error('This file appears to be corrupted or is not a valid PDF');
      }
    }
    
    throw new Error('Unable to read this PDF. Please try a different file or use the AI Skill Analyzer to paste your resume text.');
  }
}
