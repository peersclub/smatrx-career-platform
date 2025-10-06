export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamically import pdfjs-dist to avoid build issues
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
    
    // Disable worker for server-side usage
    GlobalWorkerOptions.workerSrc = false as any;
    
    // Load the PDF document
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
      standardFontDataUrl: undefined,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => {
          // Add space after each item to prevent words from running together
          return item.str + ' ';
        })
        .join('')
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      fullText += pageText + '\n\n';
    }
    
    // Clean up and destroy the document
    await pdf.destroy();
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF. The file may be corrupted or password protected.');
  }
}
