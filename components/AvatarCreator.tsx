"use client";
import { useState, useEffect } from 'react';

const AvatarCreator = () => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin === 'https://readyplayer.me') {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'avatar') {
            setAvatarUrl(data.url);
          }
        } catch (error) {
          console.error('Failed to parse event data:', error);
        }
      }
    };

    window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, []);

  return (
    <div>
      <iframe
        src="https://readyplayer.me/avatar"
        style={{ width: '100%', height: '600px', border: 'none' }}
        allow="camera *"
      ></iframe>
      {avatarUrl && (
        <div>
          <h3>Avatar Ready:</h3>
          <p>{avatarUrl}</p>
        </div>
      )}
    </div>
  );
};

export default AvatarCreator;
