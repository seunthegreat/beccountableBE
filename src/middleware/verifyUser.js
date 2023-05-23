const authenticateUser = (req, res, next) => {
  const accessToken = req.headers.authorization;
  
  // Verify and decode the access token
  jwt.verify(accessToken, 'your_secret_key', (err, decoded) => {
     if (err) {
     // Handle token verification error
      return res.status(401).json({ error: 'Invalid access token' });
    }
  
    // Store the decoded token in the request object for further use
    req.user = decoded;
  
    // Proceed to the next middleware or route handler
    next();
  });
};