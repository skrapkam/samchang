const fetch = require('node-fetch');

async function testApiConnection() {
    const baseUrl = process.env.NODE_ENV === "development" 
        ? "http://localhost:3000/api/chat"
        : "https://sam-chat-api.vercel.app/api/chat";
    
    console.log('Testing API connection to:', baseUrl);
    
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-bypass-token': 'samchangsucks' // Include bypass token
            },
            body: JSON.stringify({
                userMessage: 'Hello',
                conversationHistory: []
            })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            console.log('✅ API is accessible and responding');
            
            // Try to read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const content = line.replace('data: ', '');
                            if (content === '[DONE]') {
                                console.log('✅ Stream completed successfully');
                                return;
                            }
                            if (content) {
                                console.log('Received chunk:', content.substring(0, 50) + '...');
                            }
                        }
                    }
                }
            }
        } else {
            console.log('❌ API returned error status:', response.status);
            const errorText = await response.text();
            console.log('Error details:', errorText);
        }
    } catch (error) {
        console.log('❌ Network error:', error.message);
        
        if (process.env.NODE_ENV === "development") {
            console.log('\nTroubleshooting tips:');
            console.log('1. Make sure your backend server is running on port 3000');
            console.log('2. Check if the API endpoint is accessible at http://localhost:3000/api/chat');
            console.log('3. Verify CORS settings on your backend');
        }
    }
}

testApiConnection(); 