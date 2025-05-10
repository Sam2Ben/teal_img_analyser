import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// CORS configuration
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Verify environment variables
const requiredEnvVars = [
    'AZURE_OPENAI_KEY',
    'AZURE_OPENAI_API_VERSION',
    'AZURE_OPENAI_ENDPOINT',
    'DEPLOYMENT_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Initialize Azure OpenAI client
const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.DEPLOYMENT_NAME}`,
    defaultHeaders: {
        'api-key': process.env.AZURE_OPENAI_KEY
    },
    defaultQuery: {
        'api-version': process.env.AZURE_OPENAI_API_VERSION
    }
});

// Endpoint for image analysis
app.post('/analyze-image', async (req, res) => {
    try {
        console.log('Received analyze-image request');
        const { base64Image } = req.body;
        const { prompt } = req.body || 'What do you see in this image? Please describe it in detail.';

        if (!base64Image) {
            console.error('No image provided in request');
            return res.status(400).json({ error: 'No image provided' });
        }

        console.log('Creating messages array');
        const messages = [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ]
            }
        ];

        console.log('Sending request to Azure OpenAI...');
        console.log('Deployment Name:', process.env.DEPLOYMENT_NAME);
        console.log('Messages:', JSON.stringify(messages, null, 2));

        try {
            const response = await openai.chat.completions.create({
                model: process.env.DEPLOYMENT_NAME,
                messages: messages,
                max_tokens: 300
            });

            console.log('Response received:', JSON.stringify(response, null, 2));

            if (!response.choices || !response.choices[0] || !response.choices[0].message) {
                throw new Error('Invalid response format from Azure OpenAI');
            }

            res.json({ 
                response: response.choices[0].message.content,
                usage: response.usage
            });
        } catch (azureError) {
            console.error('Azure OpenAI API Error:', azureError);
            console.error('Error details:', azureError.details);
            console.error('Error code:', azureError.code);
            console.error('Error status:', azureError.status);
            throw azureError;
        }

    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to analyze image',
            details: error.message,
            stack: error.stack,
            code: error.code,
            status: error.status
        });
    }
});

// Serve HTML files
app.get('/upload', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.get('/camera', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'camera.html'));
});

app.get('/docs', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment variables:');
    console.log('AZURE_OPENAI_ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT);
    console.log('DEPLOYMENT_NAME:', process.env.DEPLOYMENT_NAME);
    console.log('AZURE_OPENAI_API_VERSION:', process.env.AZURE_OPENAI_API_VERSION);
}); 