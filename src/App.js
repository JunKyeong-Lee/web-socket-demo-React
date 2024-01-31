import React, { useState, useEffect } from 'react';
// npm install @stomp/stompjs
import { Client } from '@stomp/stompjs';

const App = () => {
    // 메시지들을 담는 역할. 출력할 때 쓰인다.
    const [messages, setMessages] = useState([]);
    // input 태그의 변화하는 데이터를 담당
    const [messageInput, setMessageInput] = useState('');
    // stompClient를 state로 관리하여 제공하기 위함.
    const [stompClient, setStompClient] = useState(null);
    // 각각 위치를 구독하기 위한 state
    // 이 부분은 필요한 컴포넌트 자체에서 구성해야 합니다.
    const [subscriptions, setSubscriptions] = useState([]);

    // App.js의 최상단에서 이를 정의한다. 마찬가지 전역적으로 알림기능을 사용해야 하기 때문이다.
    // 그리고 여기서 발생한 stompClient를 useContext를 이용해서 전역적으로 활용한다.
    useEffect(() => {
        const connectAndSubscribe = () => {
            // WebSocket 서버 주소. 엔드포인트 주소를 말한다. http가 아니라 ws로 써야 된다. 나중에는 보안을 위해 https처럼 wss로 써야되긴 하다.
            const socket = new WebSocket('ws://localhost:8080/websocket');
            // Stomp 프로토콜을 사용하는 클라이언트를 생성한다.
            const stomp = new Client();

            // WebSocket 인스턴스를 제공함. (인스턴스는 new 선언으로 객체를 생성한 그 변수를 말했었다.)
            stomp.webSocketFactory = () => socket;
            // Stomp 클라이언트를 활성화 한다. WebSocket을 통해 서버와 연결을 시도한다.
            // 이때 성공하면 onConnect 핸들러가 호출된다.
            stomp.activate();

            // onConnect를 정의한다. 사실 정의되어 있을테지만, state를 활용하기 위해 새롭게 정의한다.
            stomp.onConnect = () => {
                console.log('Connected to WebSocket');
                setStompClient(stomp);
            };
        };
        // 위에서 정의한 메서드를 실행한다.
        connectAndSubscribe();

        // 클린업 함수를 정의한다. 위에서 한 과정이 바로 상호동의하는 handshake 과정인데 이 과정이 언마운트 될떄 끊어져야 된다.
        return () => {
            stompClient?.deactivate();
        };
    }, []); // 마운트 될 때만 실행된다. 언마운트 될 때만 클린업 함수가 실행된다.


    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */
    /* 여기서부터 작성! */

    useEffect(() => {
        const newSubscriptions = [
            stompClient?.subscribe('/topic/messenger/rooms/1', (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log('수신시작 >>> message:', receivedMessage);
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                console.log('>>> 수신완료');
            }),
            // 만약에 두개 이상을 한번에 구독해야 된다면 아래를 배열의 원소로 계속 추가해주면 됩니다.
            // stompClient?.subscribe('/topic/messenger/rooms/2', (message) => {
            //     // message는 backend에서 반환되는 메시지로 일반적으로 객체형태라 json으로 받는다.
            //     const receivedMessage = JSON.parse(message.body);
            //     console.log('수신시작 >>> message:', receivedMessage);
            //     // 출력하기 위한 부분이라서 이는 수정하면 된다.
            //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            //     console.log('>>> 수신완료');
            // }),
        ]

        // 새롭게 발생하는 구독을 합쳐서 설정합니다.
        setSubscriptions((prevSubscriptions) => [...prevSubscriptions, ...newSubscriptions]);

        // 
        return () => {
            newSubscriptions.forEach((subscription) => subscription?.unsubscribe());
        }
    }, [stompClient, subscriptions]);

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
            destination: '/app/messenger/rooms/1/send',
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
