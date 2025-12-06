// Vercel Serverless Function
// This will be available at: /api/hello

export default function handler(req, res) {
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Response-Time', new Date().toISOString());
    res.setHeader('X-Powered-By', 'Vercel Serverless Functions');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    
    // Handle different HTTP methods
    switch (req.method) {
        case 'GET':
            handleGET(req, res);
            break;
            
        case 'POST':
            handlePOST(req, res);
            break;
            
        case 'OPTIONS':
            // CORS preflight
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.status(200).end();
            break;
            
        default:
            res.status(405).json({
                error: 'Method not allowed',
                allowed: ['GET', 'POST', 'OPTIONS']
            });
    }
}

// GET handler
function handleGET(req, res) {
    const response = {
        message: 'Hello from Vercel Serverless Function!',
        timestamp: new Date().toISOString(),
        method: 'GET',
        path: req.url,
        query: req.query,
        environment: process.env.NODE_ENV || 'development',
        region: process.env.VERCEL_REGION || 'local',
        deployment: {
            id: process.env.VERCEL_DEPLOYMENT_ID || 'local',
            url: process.env.VERCEL_URL || 'http://localhost:3000'
        },
        tips: [
            'Try POST request with JSON body',
            'Check console for server logs',
            'Deploy from GitHub for auto-updates'
        ]
    };
    
    res.status(200).json(response);
}

// POST handler
async function handlePOST(req, res) {
    try {
        let body;
        
        // Parse JSON body
        if (req.headers['content-type'] === 'application/json') {
            body = req.body;
            
            // If body is a stream, we need to parse it
            if (typeof req.body === 'object' && req.body !== null) {
                body = req.body;
            } else {
                body = JSON.parse(req.body || '{}');
            }
        } else {
            body = {};
        }
        
        const response = {
            message: `Hello ${body.name || 'Anonymous'}!`,
            received: body,
            timestamp: new Date().toISOString(),
            method: 'POST',
            serverInfo: {
                region: process.env.VERCEL_REGION,
                runtime: 'Node.js',
                memory: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || 'unknown',
                environment: process.env.NODE_ENV
            },
            note: 'This response came from a serverless function running globally on Vercel'
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('POST error:', error);
        res.status(400).json({
            error: 'Invalid request',
            message: error.message,
            tip: 'Send JSON with Content-Type: application/json'
        });
    }
}

// Optional: Add helper function for CORS
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}