const fetch = require('node-fetch');

async function testConversationContext() {
    const baseUrl = 'http://localhost:8000/api/chat';
    
    // First message
    console.log('Testing first message...');
    const response1 = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userMessage: 'Tell me about Your Work project',
            conversationHistory: []
        })
    });
    
    let firstResponse = '';
    const reader1 = response1.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { value, done } = await reader1.read();
        if (done) break;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
            for (const line of lines) {
                const content = line.replace('data: ', '');
                if (content === '[DONE]') break;
                firstResponse += content;
            }
        }
    }
    
    console.log('First response:', firstResponse.substring(0, 100) + '...');
    
    // Second message with context
    console.log('\nTesting follow-up message with context...');
    const response2 = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userMessage: 'What technologies did you use?',
            conversationHistory: [
                {
                    text: 'Tell me about Your Work project',
                    isUser: true,
                    timestamp: '2024-01-01T00:00:00.000Z'
                },
                {
                    text: firstResponse,
                    isUser: false,
                    timestamp: '2024-01-01T00:00:01.000Z'
                }
            ]
        })
    });
    
    let secondResponse = '';
    const reader2 = response2.body.getReader();
    
    while (true) {
        const { value, done } = await reader2.read();
        if (done) break;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
            for (const line of lines) {
                const content = line.replace('data: ', '');
                if (content === '[DONE]') break;
                secondResponse += content;
            }
        }
    }
    
    console.log('Second response:', secondResponse.substring(0, 100) + '...');
    
    // Check if the second response mentions the project context
    if (secondResponse.toLowerCase().includes('your work') || 
        secondResponse.toLowerCase().includes('project') ||
        secondResponse.toLowerCase().includes('platform')) {
        console.log('\n✅ SUCCESS: Context is being maintained!');
    } else {
        console.log('\n❌ FAILURE: Context is not being maintained.');
    }
}

testConversationContext().catch(console.error); 