const { generateEmbedding } = require('./services/llm');

async function test() {
    try {
        const text = "Hello world";
        console.log('Testing embedding generation...');
        const embedding = await generateEmbedding(text);
        console.log('Embedding generated successfully!');
        console.log('Dimension:', embedding.length);
    } catch (err) {
        console.error('Test failed');
    }
}

test();
