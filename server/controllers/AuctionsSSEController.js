import { FetchAuctions } from '../db/queries.js'

const handleAuctionsSSE = async (req, res) => {
  try {

  const email = req.email;
  const result = await FetchAuctions(email);
  const sample = JSON.stringify({
    body: "JEWS"
  }) 
    
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Content-Encoding', 'none');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.write(`data: ${sample}\n\n`);

  req.on('close', () => {
    res.end();
    console.log('Client disconnected');
  });
    
  } catch (err) {
    console.log(err);
    res.status(500).send('AUCTIONS SSE CONTROLLER ERROR');
  }
};

export default handleAuctionsSSE