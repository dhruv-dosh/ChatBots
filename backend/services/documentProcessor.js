const fs = require('fs');

const chunkText = (text, size = 1000, overlap = 200) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = start + size;
        chunks.push(text.slice(start, end));
        start = end - overlap;
    }
    return chunks;
};

module.exports = { chunkText };
