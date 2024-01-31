import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [stompClient, setStompClient] = useState(null);



  useEffect(() => {
    const connectAndSubscribe = () => {
      const socket = new WebSocket('ws://localhost:8080/chat'); // WebSocket 서버 주소
      const stomp = new Client();

      stomp.webSocketFactory = () => socket;
      stomp.activate();

      stomp.onConnect = () => {
        console.log('Connected to WebSocket');
        setStompClient(stomp);
      };
    };

    connectAndSubscribe();

    return () => {
      stompClient && stompClient.deactivate();
    };
  }, []);
  useEffect(() => {
    // 특정 주제("/topic/public/rooms/{roomId}")를 구독
    stompClient && stompClient.subscribe('/topic/public/rooms/1', (message) => {
      const receivedMessage = JSON.parse(message.body);
      console.log('수신시작 >>> message:', receivedMessage);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      console.log('>>> 수신완료');
    });
  }, [stompClient])

  useEffect(() => {
    console.log('현재 messages:', messages);

  }, [messages])


  const sendMessage = () => {
    // 메시지를 WebSocket으로 보내기
    const message = {
      from: 'React User',
      text: messageInput,
    };
    console.log('-----------------------------------------------');
    console.log('전송시작 >>> message:', message);

    stompClient && stompClient.publish({
      destination: '/app/chat/rooms/1/send',
      body: JSON.stringify(message),
    });
    console.log('>>> 전송완료');
    setMessageInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;
