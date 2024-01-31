import React, { useState, useEffect } from 'react';

const SubscribeComponent = ({ stompClient }) => {
    // 메시지들을 담는 역할. 출력할 때 쓰인다.
    const [messages, setMessages] = useState([]);
    // input 태그의 변화하는 데이터를 담당
    const [messageInput, setMessageInput] = useState('');
    // 각각 위치를 구독하기 위한 state
    // 이 부분은 필요한 컴포넌트 자체에서 구성해야 합니다.
    const [subscriptions, setSubscriptions] = useState([]);

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
        ];

        // 새롭게 발생하는 구독을 합쳐서 설정합니다.
        setSubscriptions((prevSubscriptions) => [...prevSubscriptions, ...newSubscriptions]);

        // 해당 클린업 함수는 이 컴포넌트가 언마운트 될 경우 사용됩니다.
        // 메신저에 접속한 순간부터는 계속해서 구독된 상태가 유지됩니다.
        return () => {
            newSubscriptions.forEach((subscription) => subscription?.unsubscribe());
        };
    }, []);

    useEffect(() => {
        console.log('현재 messages:', messages);
    }, [messages]);

    // Send 버튼을 누를경우 발생합니다.
    const sendMessage = () => {
        // 예시 메시지. backend 측면에서는 정의한 DTO가 전달 받습니다.
        const message = {
            from: 'React User',
            text: messageInput,
        };

        console.log('-----------------------------------------------');
        console.log('전송시작 >>> message:', message);

        // stompClient가 연결되어 있을 경우.
        // 즉 stompClient가 실제로 존재할때 다음 메서드를 실행한다.
        // 다음 메서드는 데이터를 전송하는 내용이다.
        stompClient?.publish({
            // 목적지. 즉, 어느 장소로 보내는지. MessageMapping 부분이 받을 것이다.
            destination: '/app/messenger/rooms/1/send',
            // body. 실제 데이터를 나타낸다.
            body: JSON.stringify(message),
        });
        console.log('>>> 전송완료');
        // 입력값을 초기화 한다.
        setMessageInput('');
    };

    return (
        <>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.from}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input type='text' value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </>
    );
};

export default SubscribeComponent;
