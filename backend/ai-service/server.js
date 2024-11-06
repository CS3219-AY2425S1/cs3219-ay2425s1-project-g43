require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3007;  // Use environment variable

app.use(cors());
app.use(express.json());
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});