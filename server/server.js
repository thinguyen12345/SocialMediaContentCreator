const express = require('express');
     const cors = require('cors');
     const admin = require('firebase-admin');
     const twilio = require('twilio');
     const { GoogleGenerativeAI } = require('@google/generative-ai');
     require('dotenv').config();

     const app = express();
     app.use(cors());
     app.use(express.json());

     // Initialize Firebase
     admin.initializeApp({
       credential: admin.credential.cert({
         projectId: process.env.FIREBASE_PROJECT_ID,
         privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
       }),
     });
     const db = admin.firestore();

     // Initialize Twilio
     const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

     // Initialize Gemini AI
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

     // Generate random 6-digit access code
     function generateAccessCode() {
       return Math.floor(100000 + Math.random() * 900000).toString();
     }

     // POST: Create new access code
     app.post('/api/create-access-code', async (req, res) => {
       const { phoneNumber } = req.body;
       if (!phoneNumber) return res.status(400).json({ error: 'Phone number required' });

       const accessCode = generateAccessCode();
       try {
         await db.collection('users').doc(phoneNumber).set({ accessCode }, { merge: true });
         
         await twilioClient.messages.create({
           body: `Your access code is: ${accessCode}`,
           from: process.env.TWILIO_PHONE_NUMBER,
           to: phoneNumber,
         });
         
         res.json({ accessCode });
       } catch (err) {
         console.error('Error creating access code:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Validate access code
     app.post('/api/validate-access-code', async (req, res) => {
       const { phoneNumber, accessCode } = req.body;
       if (!phoneNumber || !accessCode) return res.status(400).json({ error: 'Missing parameters' });

       try {
         const userDoc = await db.collection('users').doc(phoneNumber).get();
         if (!userDoc.exists || userDoc.data().accessCode !== accessCode) {
           return res.status(401).json({ error: 'Invalid access code' });
         }
         await db.collection('users').doc(phoneNumber).update({ accessCode: '' });
         res.json({ success: true });
       } catch (err) {
         console.error('Error validating access code:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Generate post captions
     app.post('/api/generate-post-captions', async (req, res) => {
       const { socialNetwork, subject, tone } = req.body;
       if (!socialNetwork || !subject || !tone) return res.status(400).json({ error: 'Missing parameters' });

       try {
         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
         const prompt = `Generate 5 social media captions for ${socialNetwork} about ${subject} with a ${tone} tone.`;
         const result = await model.generateContent(prompt);
         const captions = result.response.text().split('\n').filter((line) => line.trim());
         res.json({ captions });
       } catch (err) {
         console.error('Error generating captions:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Get post ideas
     app.post('/api/get-post-ideas', async (req, res) => {
       const { topic } = req.body;
       if (!topic) return res.status(400).json({ error: 'Topic required' });

       try {
         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
         const prompt = `Generate 10 post ideas for social media about ${topic}.`;
         const result = await model.generateContent(prompt);
         const ideas = result.response.text().split('\n').filter((line) => line.trim());
         res.json({ ideas });
       } catch (err) {
         console.error('Error generating post ideas:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Create captions from ideas
     app.post('/api/create-captions-from-ideas', async (req, res) => {
       const { idea } = req.body;
       if (!idea) return res.status(400).json({ error: 'Idea required' });

       try {
         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
         const prompt = `Generate 5 social media captions based on this post idea: ${idea}.`;
         const result = await model.generateContent(prompt);
         const captions = result.response.text().split('\n').filter((line) => line.trim());
         res.json({ captions });
       } catch (err) {
         console.error('Error creating captions from ideas:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Save generated content
     app.post('/api/save-generated-content', async (req, res) => {
       const { topic, data, phoneNumber } = req.body;
       if (!topic || !data || !phoneNumber) return res.status(400).json({ error: 'Missing parameters' });

       try {
         await db.collection('contents').add({
           topic,
           data,
           phoneNumber,
           createdAt: admin.firestore.FieldValue.serverTimestamp(),
         });
         res.json({ success: true });
       } catch (err) {
         console.error('Error saving content:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // GET: Get user-generated contents
     app.get('/api/get-user-generated-contents', async (req, res) => {
       const { phone_number } = req.query;
       if (!phone_number) return res.status(400).json({ error: 'Phone number required' });
       const normalizedPhone = phone_number.replace(/\s+/g, '').startsWith('+') ? phone_number.replace(/\s+/g, '') : `+${phone_number.replace(/\s+/g, '')}`;
       
       try {
        const snapshot = await db.collection('contents').where('phoneNumber', '==', normalizedPhone).get();
        console.log(`Query found ${snapshot.size} documents for ${normalizedPhone}`);
        snapshot.forEach(doc => {
          console.log('Document:', doc.id, doc.data());
        });
        const contents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json({ contents });
       } catch (err) {
         console.error('Error fetching contents:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     // POST: Unsave content
     app.post('/api/unsave-content', async (req, res) => {
       const { captionId } = req.body;
       if (!captionId) return res.status(400).json({ error: 'Caption ID required' });

       try {
         await db.collection('contents').doc(captionId).delete();
         res.json({ success: true });
       } catch (err) {
         console.error('Error unsaving content:', err);
         res.status(500).json({ error: 'Server error' });
       }
     });

     app.listen(3001, () => console.log('Server running on port 3001'));