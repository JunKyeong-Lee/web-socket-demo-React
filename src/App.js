import SubscribeComponent from './SubscribeComponent';

import React, { useState, useEffect } from 'react';
// npm install @stomp/stompjs
import { Client } from '@stomp/stompjs';

const App = () => {
    // stompClient를 state로 관리하여 제공하기 위함.
    const [stompClient, setStompClient] = useState(null);

    // App.js의 최상단에서 이를 정의한다. 마찬가지 전역적으로 알림기능을 사용해야 하기 때문이다.
    // 그리고 여기서 발생한 stompClient를 useContext를 이용해서 전역적으로 활용한다.
    useEffect(() => {
        const connectAndSubscribe = () => {
            // WebSocket 서버 주소. 엔드포인트 주소를 말한다. http가 아니라 ws로 써야 된다. 나중에는 보안을 위해 https처럼 wss로 써야되긴 하다.
            const socket = new WebSocket('ws://localhost:1208/websocket');
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

    return (
        <>
            {/*
                이런식으로 최상단 App.js 에서 handshake를 진행한 다음에
                이 클라이언트를 자식 컴포넌트에 전달한다.

                아니면 useContext를 사용하면 된다.

                실질적으로 구독이라는 개념은 저 컴포넌트 내부에서 사용한다.
             */}
            <SubscribeComponent stompClient={stompClient} />
        </>
    );
};

export default App;
