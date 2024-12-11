import express, { Request, Response } from 'express';

const router = express.Router();
const VERIFY_TOKEN = 'SPORT_E';

// Endpoint to verify the webhook
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.json({ 'hub.challenge': challenge });
  } else {
    res.sendStatus(403);
  }
});

// Endpoint to handle incoming events
router.post('/webhook', (req: Request, res: Response) => {
  const event = req.body;
  console.log('Received event:', event);

  // Process the event here

  res.sendStatus(200);
});

export default router;