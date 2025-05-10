# Azure Image Analyzer

A powerful image analysis api powered by Azure OpenAI's GPT-4 Vision model. This api allows users to analyze images through upload or camera capture, providing detailed descriptions and insights.

## Features

- 📸 Image upload and camera capture
- 🤖 GPT-4 Vision powered analysis
- 📝 Custom prompts for specific analysis
- 📱 Responsive design
- 🔒 Secure API key handling
- 📊 Token usage tracking

## Tech Stack

- Node.js
- Express.js
- Azure OpenAI API
- TailwindCSS
- HTML5/CSS3/JavaScript

## Prerequisites

- Node.js (v14 or higher)
- Azure OpenAI API access
- Azure OpenAI API key
- Azure OpenAI endpoint
- Azure OpenAI deployment name

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_ENDPOINT=your_endpoint_here
DEPLOYMENT_NAME=your_deployment_name
PORT=3001
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/azure-image-analyzer.git
cd azure-image-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Documentation

The API provides the following endpoints:

### POST /analyze-image

Analyzes an image using Azure OpenAI's GPT-4 Vision model.

**Request Body:**
```json
{
    "base64Image": "string", // Base64 encoded image
    "prompt": "string"       // Optional custom prompt
}
```

**Response:**
```json
{
    "response": "string",    // Analysis result
    "usage": {              // Token usage information
        "total_tokens": number
    }
}
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Security Considerations

- Never commit your `.env` file
- Keep your API keys secure
- Use environment variables for sensitive data
- Implement rate limiting in production


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Azure OpenAI for providing the GPT-4 Vision API
- TailwindCSS for the styling framework
- Express.js for the backend framework

