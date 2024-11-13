import jwt from 'jsonwebtoken';

export function attachUserId(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // request auth header: `Authorization: Bearer + <access_token>`
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.user = {
      id: user.id,
    };
    next();
  });
}
