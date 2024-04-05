import React from "react";
import ChatTopbar from "./chat-topbar";
import { Message, UserData } from "../data";
import { ChatList } from "./chat.list";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
}

export function Chat({ messages, selectedUser }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
      />
    </div>
  );
}
