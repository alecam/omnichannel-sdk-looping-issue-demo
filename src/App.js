import { useEffect, useState } from "react";
import "./App.css";
import { OmnichannelChatSDK } from "@microsoft/omnichannel-chat-sdk";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [chatSDK, setChatSDK] = useState(null);

  useEffect(() => {
    const omnichannelSDK = new OmnichannelChatSDK({
      orgId: "7288124b-237b-41f8-bdec-82e4e1f1a1fb",
      orgUrl: "https://orgf0ddc589-crm4.omnichannelengagementhub.com",
      widgetId: "96f7b9a9-92d8-48b8-9a6e-f03d04c3c226",
    });
    setChatSDK(omnichannelSDK);
  }, []);

  useEffect(() => {
    if (chatSDK) {
      initializeSDK();
    }
  }, [chatSDK]);

  const initializeSDK = async () => {
    console.log("[INFO] Initializing SDK");
    await chatSDK.initialize();
    console.log("[INFO] SDK Initialized");
  };

  const startChat = async () => {
    console.log("[INFO] Starting new chat");
    await chatSDK.startChat({
      initContext: {
        locale: "it-it",
        browser: "Chrome",
        device: "Desktop",
        os: "Windows 10",
        customContextData: {
          Variable1: { value: "Variable_1_Value", isDisplayable: true },
          Variable2: { value: "Variable_2_Value", isDisplayable: true },
          Variable3: { value: "Variable_3_Value", isDisplayable: true },
        },
      },
    });
    console.log("[INFO] New chat started");
    chatSDK.onNewMessage(onNewMessage);
    chatSDK.onAgentEndSession(onAgentEnd);
  };

  const onNewMessage = (message) => {
    console.log("[INFO] New message incoming: ", message);
    setMessages((previousMessages) => {
      return [message, ...previousMessages];
    });
  };

  const onAgentEnd = (message) => {
    console.log("[INFO] Agent closed conversation");
    chatSDK.endChat();
    console.log("[INFO] Chat ended");
  };

  const endCurrentChat = () => {
    chatSDK.endChat();
    console.log("[INFO] Chat ended");
  };

  const getMessageClassname = (msg) => {
    if (msg.tags?.includes("system")) {
      return "system";
    } else {
      return msg.id === 1 ? "right" : "left";
    }
  };

  return (
    <>
      <div className="buttonsContainer">
        <div className="button" onClick={startChat}>
          Start new chat
        </div>
        <div className="button" onClick={endCurrentChat}>
          End chat
        </div>
      </div>
      <div className="app">
        <div className="messagesContainer">
          {messages.map((msg) => (
            <div
              className={`messageBox ${getMessageClassname(msg)}`}
              key={msg.clientmessageid}
            >
              {msg.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
