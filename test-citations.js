// Test file to verify citation parsing improvements
// This simulates the parseSourcesSection function logic

function parseSourcesSection(rawText) {
  const sources = [];
  let mainText = rawText;
  
  // First try the [[cite:slug#section]] format
  const citationRegex = /\[\[cite:([^#\]]+)#([^\]]+)\]\]/g;
  let citationIndex = 1;
  let match;
  const citations = [];

  // First pass: collect all citations with their positions
  while ((match = citationRegex.exec(rawText)) !== null) {
    const [fullMatch, slug, section] = match;
    
    citations.push({
      match: fullMatch,
      index: citationIndex,
      position: match.index,
      slug: slug.trim(),
      section: section.trim()
    });
    
    const url = `/${slug.trim()}/#${section.trim().replace(/\s+/g, '')}`;
    
    sources.push({
      index: citationIndex,
      title: section.trim().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      url,
      slug: slug.trim(),
      section: section.trim()
    });
    
    citationIndex++;
  }

  // If we found citations, replace them with numbered citations
  if (citations.length > 0) {
    // Replace citations in reverse order to maintain positions
    let cleanText = rawText;
    citations.slice().reverse().forEach(citation => {
      cleanText = cleanText.replace(citation.match, ` [${citation.index}]`);
    });
    
    // Clean up any double spaces and fix spacing around punctuation
    cleanText = cleanText.replace(/\s+/g, ' ')
      .replace(/\s+([.!?])/g, '$1')
      .replace(/([.!?])\s+\[/g, '$1 [')
      .replace(/,\s*\./g, '.')
      .replace(/,\s*,/g, ',');
    
    mainText = cleanText.trim();
  }

  // If no [[cite:]] format found, look for inline citations throughout the text
  if (sources.length === 0) {
    // Look for various citation patterns that might appear throughout the text
    const inlineCitationPatterns = [
      // Pattern 1: [1], [2], [3] etc. scattered throughout
      /\[(\d+)\]/g,
      // Pattern 2: (1), (2), (3) etc. scattered throughout  
      /\((\d+)\)/g
    ];

    let foundCitations = false;
    
    for (const pattern of inlineCitationPatterns) {
      const matches = Array.from(mainText.matchAll(pattern));
      
      if (matches.length > 0) {
        foundCitations = true;
        
        // Handle inline citations that are already in the text
        const citationNumbers = new Set();
        
        matches.forEach(match => {
          const num = parseInt(match[1], 10);
          citationNumbers.add(num);
        });
        
        // Create sources for each unique citation number
        Array.from(citationNumbers).sort((a, b) => a - b).forEach(num => {
          sources.push({
            index: num,
            title: `Reference ${num}`,
            url: '#',
            slug: `reference-${num}`,
            section: `citation-${num}`
          });
        });
        
        // Convert (1) format to [1] format for consistency
        if (pattern.source === '\\((\\d+)\\)') {
          mainText = mainText.replace(/\((\d+)\)/g, '[$1]');
        }
        
        break; // Use the first pattern that finds matches
      }
    }
    
    // If no inline citations found, check for trailing numbers
    if (!foundCitations) {
      const endingNumbers = mainText.match(/(\d+)\s*$/);
      if (endingNumbers) {
        const numbers = endingNumbers[1].split('');
        let newText = mainText.slice(0, mainText.lastIndexOf(endingNumbers[1])).trim();
        
        // Normalize the text
        newText = newText.replace(/\s+/g, ' ');
        
        // Split into sentences and distribute citations
        const sentences = newText.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        
        let citationCount = 0;
        const processedSentences = sentences.map((sentence, idx) => {
          const isLastSentence = idx === sentences.length - 1;
          const citationsForThisSentence = isLastSentence 
            ? numbers.length - citationCount
            : Math.min(1, numbers.length - citationCount);
          
          let processedSentence = sentence.trim();
          
          // Ensure sentence ends with proper punctuation
          if (!processedSentence.match(/[.!?]$/)) {
            processedSentence += '.';
          }
          
          // Add citations for this sentence
          for (let i = 0; i < citationsForThisSentence && citationCount < numbers.length; i++) {
            citationCount++;
            sources.push({
              index: citationCount,
              title: `Reference ${citationCount}`,
              url: '#',
              slug: `reference-${citationCount}`,
              section: `citation-${citationCount}`
            });
            processedSentence += ` [${citationCount}]`;
          }
          
          return processedSentence;
        });
        
        mainText = processedSentences.join(' ').trim();
      }
    }
    
    // If still no citations found, check for structured content with trailing numbers
    if (sources.length === 0) {
      const endingNumbers = mainText.match(/(\d+)\s*$/);
      if (endingNumbers) {
        const numbers = endingNumbers[1].split('');
        let newText = mainText.slice(0, mainText.lastIndexOf(endingNumbers[1])).trim();
        
        // Normalize the text
        newText = newText.replace(/\s+/g, ' ');
        
        // Split text into sections (e.g., "Impact:", "Constraints:")
        const sections = newText.split(/(?=\w+:)/).filter(s => s.trim());
        
        let citationCount = 0;
        const processedSections = sections.map((section) => {
          // Split section into header and content
          const colonIndex = section.indexOf(':');
          if (colonIndex === -1) return section;
          
          const header = section.slice(0, colonIndex + 1);
          let content = section.slice(colonIndex + 1).trim();
          
          // Split content into bullet points
          let bulletPoints;
          if (content.includes('-')) {
            bulletPoints = content.split(/(?=^-)/).filter(s => s.trim());
          } else {
            // If no bullets, split by sentences or key phrases
            bulletPoints = content.split(/(?=\w+\s*:)/).filter(s => s.trim());
          }
          
          // If we still don't have good splits, split by sentences
          if (bulletPoints.length <= 1) {
            bulletPoints = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());
          }
          
          const processedBulletPoints = bulletPoints.map((point, idx) => {
            // For the last bullet point, use all remaining citations
            const isLastPoint = idx === bulletPoints.length - 1;
            const citationsForThisPoint = isLastPoint 
              ? numbers.length - citationCount
              : Math.min(1, numbers.length - citationCount); // One citation per point
            
            let processedPoint = point.trim();
            
            // Remove leading "-" if present and add it back properly
            if (processedPoint.startsWith('-')) {
              processedPoint = processedPoint.slice(1).trim();
            }
            
            // Ensure point ends with proper punctuation
            if (!processedPoint.match(/[.!?]$/)) {
              processedPoint += '.';
            }
            
            // Add citations for this point
            for (let i = 0; i < citationsForThisPoint && citationCount < numbers.length; i++) {
              citationCount++;
              sources.push({
                index: citationCount,
                title: `Reference ${citationCount}`,
                url: '#',
                slug: `reference-${citationCount}`,
                section: `citation-${citationCount}`
              });
              processedPoint += ` [${citationCount}]`;
            }
            
            return `- ${processedPoint}`;
          });
          
          return `${header}\n${processedBulletPoints.join('\n')}`;
        });
        
        mainText = processedSections.join('\n\n').trim();
      }
    }
  }

  return { mainText, sources };
}

// Test cases
console.log('=== Testing Citation Parsing Improvements ===\n');

// Test 1: Inline citations already in text
console.log('Test 1: Inline citations [1], [2], [3]');
const test1 = "This is a sentence with citation [1]. Another sentence with citation [2]. Final sentence with citation [3].";
const result1 = parseSourcesSection(test1);
console.log('Input:', test1);
console.log('Output:', result1.mainText);
console.log('Sources:', result1.sources.map(s => `${s.index}: ${s.title}`));
console.log('');

// Test 2: Parentheses citations (1), (2), (3)
console.log('Test 2: Parentheses citations (1), (2), (3)');
const test2 = "This is a sentence with citation (1). Another sentence with citation (2). Final sentence with citation (3).";
const result2 = parseSourcesSection(test2);
console.log('Input:', test2);
console.log('Output:', result2.mainText);
console.log('Sources:', result2.sources.map(s => `${s.index}: ${s.title}`));
console.log('');

// Test 3: Trailing numbers that should be distributed
console.log('Test 3: Trailing numbers 123 that should be distributed');
const test3 = "This is the first sentence. This is the second sentence. This is the third sentence. 123";
const result3 = parseSourcesSection(test3);
console.log('Input:', test3);
console.log('Output:', result3.mainText);
console.log('Sources:', result3.sources.map(s => `${s.index}: ${s.title}`));
console.log('');

// Test 4: Mixed inline and trailing citations
console.log('Test 4: Mixed inline [1] and trailing 23');
const test4 = "This sentence has citation [1]. This sentence has no citation. This is the final sentence. 23";
const result4 = parseSourcesSection(test4);
console.log('Input:', test4);
console.log('Output:', result4.mainText);
console.log('Sources:', result4.sources.map(s => `${s.index}: ${s.title}`));
console.log('');

// Test 5: Structured content with trailing numbers
console.log('Test 5: Structured content with trailing numbers');
const test5 = `Impact:
- Improved user experience by 40%
- Reduced loading time by 60%
- Increased conversion rate by 25%

Constraints:
- Limited budget of $50k
- Timeline of 3 months
- Team size of 4 people

123`;
const result5 = parseSourcesSection(test5);
console.log('Input:', test5);
console.log('Output:', result5.mainText);
console.log('Sources:', result5.sources.map(s => `${s.index}: ${s.title}`));
console.log('');

console.log('=== Test Complete ==='); 