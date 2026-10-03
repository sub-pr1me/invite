import { WebSocket, WebSocketServer } from "ws"
import type { Server } from 'node:http'

declare module 'ws' {
  interface WebSocket {
    isAlive: boolean
  }
}

function sendJson(socket: WebSocket, payload: unknown) {
  if(socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
};

function broadcast(wss: WebSocketServer, payload: unknown) {
  for (const client of wss.clients) {
    if(client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  };
};

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({server, path: '/ws', maxPayload: 1024 * 1024});

  wss.on('connection', (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => { socket.isAlive = true });
    
    sendJson(socket, { type: 'welcome' });    
    socket.on('error', console.error);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping;
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  function broadcastAuctionsUpdated(auctions: unknown) {
    try {
      broadcast(wss, { type: 'auctions_updated', data: auctions });
    } catch (err) {
      console.log('WS BROADCAST ERROR:', err);
    }
  };

  return { broadcastAuctionsUpdated }
};