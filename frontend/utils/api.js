/**
 * Server-side Backend API Helper
 */

/**
 * Fetch data from backend microservice
 * @param {Express.Request} req - Express Request object
 * @param {string} endpoint - API path (e.g. '/patient/dashboard')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch Response object
 */
const fetchFromBackend = async (req, endpoint, options = {}) => {
    const token = req.cookies?.accessToken;
    console.log("token: ", token);
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:3004/api/v1';
    
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log("headers: ", headers);
    try {
        const response = await fetch(`${backendUrl}${endpoint}`, {
            ...options,
            headers
        });
        
        console.log("back res : ", response);
        return response;
    } catch (error) {
        console.error(`Server-side fetch error to backend ${endpoint}:`, error);
        throw error;
    }
};

module.exports = { fetchFromBackend };
