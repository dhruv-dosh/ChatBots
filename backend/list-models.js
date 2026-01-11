const axios = require('axios');

async function listModels() {
    try {
        const response = await axios.get('https://openrouter.ai/api/v1/models');
        const allModels = response.data.data;
        console.log(JSON.stringify(allModels.map(m => m.id), null, 2));
    } catch (err) {
        console.error(err);
    }
}

listModels();
