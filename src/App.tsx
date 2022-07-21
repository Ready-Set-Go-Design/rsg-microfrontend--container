import { MicroFrontend } from "./Microfrontend.tsx";
import styled from "styled-components";
import { Observable } from "windowed-observable";
import { useEffect, useState } from "react";

interface ObservableMessage {
  target: string;
  action: string;
  value?: any;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
`;

const ContainerTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  background-color: #f7f7f7;
  grid-column: 1 / -1;
  padding: 10px;
`;

const Messages = styled.div`
  grid-column: 1 / -1;
  padding: 10px;
`;

const Message = styled.div`
  font-size: 1em;
  margin-bottom: 5px;
`;

const BroadcastButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
  grid-column: 1 / -1;

  div {
    grid-column: 1 / -1;
  }
`;

const MessageItem = ({ message }: { message: ObservableMessage }) => {
  return (
    <Message>
      <strong>{message.target}</strong>: {message.action}
      {message.value && `: ${message.value}`}
    </Message>
  );
};

const observable = new Observable("mfe-observable");

function App() {
  const { REACT_APP_APP_1, REACT_APP_APP_2 } = process.env;
  const [messages, setMessages] = useState<Array<ObservableMessage>>([]);

  const handleObservableMessage = (
    message: ObservableMessage,
    messages: Array<ObservableMessage>
  ) => {
    if (message.target === "app1" || message.target === "app2") {
      setMessages([...messages, message]);
    }
  };

  useEffect(() => {
    observable.subscribe((e) => handleObservableMessage(e, messages));

    return () => {
      observable.unsubscribe((e) => handleObservableMessage(e, messages));
    };
  }, [messages]);

  const sendObservableMessage = (target: string) => {
    observable.publish({
      target,
      action: "container_message",
      value: `The time is ${new Date()}`,
    });
  };

  return (
    <Wrapper>
      <ContainerTitle>Container!</ContainerTitle>
      <BroadcastButtons>
        <div>Broadcast from container to microfrontend apps:</div>
        <button onClick={() => sendObservableMessage("app1")}>
          Send click to 'app 1'
        </button>
        <button onClick={() => sendObservableMessage("app2")}>
          Send click to 'app 2'
        </button>
      </BroadcastButtons>
      <MicroFrontend
        history={window.history}
        host={REACT_APP_APP_1}
        document={document}
        name="App1"
        window={window}
      />
      <MicroFrontend
        history={window.history}
        host={REACT_APP_APP_2}
        document={document}
        name="App2"
        window={window}
      />

      <Messages>
        {messages.map((message: any, index: number) => {
          return <MessageItem key={`message-${index}`} message={message} />;
        })}
      </Messages>
    </Wrapper>
  );
}

export default App;
