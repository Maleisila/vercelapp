// API Base URL - Vercel automatically handles /api routes
const API_BASE = '/api';

// DOM Elements
const helloResponseEl = document.getElementById('hello-response');
const postResponseEl = document.getElementById('post-response');
const statusDotEl = document.getElementById('status-dot');
const statusTextEl = document.getElementById('status-text');
const deploymentInfoEl = document.getElementById('deployment-info');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year')?.textContent = new Date().getFullYear();
    
    // Check API status on load
    checkAPIStatus();
    
    // Initialize deployment info
    showDeployInfo();
});

// Call /api/hello endpoint
async function callHelloAPI() {
    try {
        helloResponseEl.textContent = 'Calling API...';
        helloResponseEl.style.color = 'var(--warning)';
        
        const response = await fetch(`${API_BASE}/hello`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display response
        helloResponseEl.textContent = JSON.stringify(data, null, 2);
        helloResponseEl.style.color = 'var(--success)';
        
        // Visual feedback
        showNotification(`API responded in ${response.headers.get('x-response-time') || '??'}ms`, 'success');
        
    } catch (error) {
        helloResponseEl.textContent = `Error: ${error.message}`;
        helloResponseEl.style.color = 'var(--danger)';
        showNotification('Failed to call API', 'error');
        console.error('API Error:', error);
    }
}

// POST data to /api/hello
async function postToAPI() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (!name) {
        postResponseEl.textContent = 'Please enter a name first';
        postResponseEl.style.color = 'var(--warning)';
        nameInput.focus();
        return;
    }
    
    try {
        postResponseEl.textContent = 'Sending data...';
        postResponseEl.style.color = 'var(--warning)';
        
        const response = await fetch(`${API_BASE}/hello`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, timestamp: new Date().toISOString() })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display response
        postResponseEl.textContent = JSON.stringify(data, null, 2);
        postResponseEl.style.color = 'var(--success)';
        
        // Clear input
        nameInput.value = '';
        
        showNotification(`Data sent successfully!`, 'success');
        
    } catch (error) {
        postResponseEl.textContent = `Error: ${error.message}`;
        postResponseEl.style.color = 'var(--danger)';
        showNotification('Failed to send data', 'error');
        console.error('POST Error:', error);
    }
}

// Check API status
async function checkAPIStatus() {
    try {
        statusTextEl.textContent = 'Checking...';
        statusDotEl.className = 'status-dot';
        
        const startTime = Date.now();
        const response = await fetch(`${API_BASE}/hello`);
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        if (response.ok) {
            statusDotEl.classList.add('online');
            statusTextEl.textContent = `API is online • ${latency}ms`;
            statusTextEl.style.color = 'var(--success)';
        } else {
            throw new Error(`Status: ${response.status}`);
        }
        
    } catch (error) {
        statusDotEl.className = 'status-dot';
        statusTextEl.textContent = `API offline: ${error.message}`;
        statusTextEl.style.color = 'var(--danger)';
    }
}

// Show deployment information
function showDeployInfo() {
    const info = {
        'Project Structure': [
            '📁 /public - Frontend files (auto-served)',
            '📁 /api - Serverless functions',
            '📄 /api/hello.js → /api/hello endpoint'
        ],
        'Deployment': [
            `Deployed: ${new Date().toLocaleString()}`,
            `Environment: ${window.location.hostname.includes('vercel.app') ? 'Production' : 'Development'}`,
            'Git Integration: Push to GitHub → Auto-deploy'
        ],
        'API Endpoints': [
            'GET /api/hello - Returns greeting message',
            'POST /api/hello - Accepts JSON data'
        ]
    };
    
    let infoText = '';
    for (const [section, items] of Object.entries(info)) {
        infoText += `\n${section}:\n`;
        items.forEach(item => {
            infoText += `  ${item}\n`;
        });
    }
    
    deploymentInfoEl.textContent = infoText.trim();
    
    // Toggle display
    if (deploymentInfoEl.style.display === 'block') {
        deploymentInfoEl.style.display = 'none';
    } else {
        deploymentInfoEl.style.display = 'block';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: var(--radius);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification-success {
                background: var(--success);
                color: white;
            }
            .notification-error {
                background: var(--danger);
                color: white;
            }
            .notification-info {
                background: var(--primary);
                color: white;
            }
            .notification button {
                background: transparent;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Export functions for HTML onclick
window.callHelloAPI = callHelloAPI;
window.postToAPI = postToAPI;
window.checkAPIStatus = checkAPIStatus;
window.showDeployInfo = showDeployInfo;