const express = require('express');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'miapp-92693.appspot.com',
});

const bucket = admin.storage().bucket();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Upload the file to Firebase Storage
    const blob = bucket.file(`profileImages/${uuidv4()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error during file upload:', err);
      res.status(500).send('Upload error');
    });

    blobStream.on('finish', async () => {
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });

      res.status(200).send({ imageUrl: url }); // Return the image URL
    });

    blobStream.end(file.buffer);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).send('Something went wrong');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
