import { useState, useEffect, useCallback, useRef } from 'react';

const useFetchSSE = (url, headers, onMessage) => {

  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef();

  const connect = useCallback(async () => {
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/event-stream',
          ...headers,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      setIsConnected(true);
      setError(null);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete events (separated by double newlines)
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep incomplete event in buffer

        for (const event of events) {
          if (!event.trim()) continue;

          // Parse SSE format
          const lines = event.split('\n');
          let eventData = '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              eventData += line.slice(6);
            }
          }

          if (eventData) {
            try {
              const parsed = JSON.parse(eventData);
              setData(parsed);
              onMessage?.(parsed);
            } catch (err) {
              console.error('Parse error:', err);
            }
          }
        }
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        setIsConnected(false);
      }
    }
  }, [url, headers, onMessage]);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    reconnect: connect,
    disconnect,
  };
}

export default useFetchSSE;