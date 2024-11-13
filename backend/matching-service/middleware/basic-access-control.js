import jwt from 'jsonwebtoken';
import "dotenv/config";

// Middleware to verify JWT token
export const verifyAccessToken = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    // Verify the JWT token
    if (!token) {
      const error = new Error('Authentication error: Token not provided');
      error.data = { content: 'Please provide a valid token' };
      return next(error);
    }

    // Replace 'your_jwt_secret' with your secret key used to sign the token
    jwt.verify(token, process.env.JWT_SECRET || 'you-can-replace-this-with-your-own-secret', (err, decoded) => {
      if (err) {
        const error = new Error('Authentication error: Invalid token');
        error.data = { content: 'Invalid token' };
        return next(error);
      }

      // Add decoded user data to the socket object (optional, for further use)
      socket.user = decoded; // 'decoded' contains the user information embedded in the JWT

      next();
    });
  } catch (err) {
    console.log('Token verification failed:', err.message);
    const error = new Error('Authentication error');
    error.data = { content: 'Failed to authenticate' };
    next(error);
  }
};
