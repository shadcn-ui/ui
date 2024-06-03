import {
    FileImage,
    Mic,
    Paperclip,
    PlusCircle,
    SendHorizontal,
    Smile,
    ThumbsUp,
  } from "lucide-react";
  import Link from "next/link";
  import React, { useRef, useState } from "react";
  import { cn } from "@/lib/utils";
  import { Message, loggedInUserData } from "../data";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover";
import { buttonVariants } from "@/registry/new-york/ui/button";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { Input } from "@/registry/new-york/ui/input";
  
  interface ChatBottombarProps {
    sendMessage: (newMessage: Message) => void;
  }
  
  export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];
  
  export default function ChatBottombar({
    sendMessage
  }: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
    };
  
    const handleThumbsUp = () => {
      const newMessage: Message = {
        id: message.length + 1,
        name: loggedInUserData.name,
        avatar: loggedInUserData.avatar,
        message: "👍",
      };
      sendMessage(newMessage);
      setMessage("");
    };
  
    const handleSend = () => {
      if (message.trim()) {
        const newMessage: Message = {
          id: message.length + 1,
          name: loggedInUserData.name,
          avatar: loggedInUserData.avatar,
          message: message.trim(),
        };
        sendMessage(newMessage);
        setMessage("");
  
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
  
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
  
      if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        setMessage((prev) => prev + "\n");
      }
    };
  
    return (
      <div className="p-2 flex justify-between w-full items-center gap-2">
        <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
              <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
            )}
          >
            <PlusCircle size={20} className="text-muted-foreground" />
          </Link>
              </PopoverTrigger>
              <PopoverContent 
              side="top"
              className="w-full p-2">
               {message.trim() ? (
                 <div className="flex gap-2">
                  <Link 
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                )}
                >
                  <Mic size={20} className="text-muted-foreground" />
                </Link>
                 {BottombarIcons.map((icon, index) => (
                   <Link
                     key={index}
                     href="#"
                     className={cn(
                       buttonVariants({ variant: "ghost", size: "icon" }),
                       "h-9 w-9",
                     )}
                   >
                     <icon.icon size={20} className="text-muted-foreground" />
                   </Link>
                 ))}
               </div>
               ) : (
                <Link 
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                )}
                >
                  <Mic size={20} className="text-muted-foreground" />
                </Link>
               )}
              </PopoverContent>
            </Popover>
          {!message.trim() && (
            <div className="flex gap-2">
              {BottombarIcons.map((icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                  )}
                >
                  <icon.icon size={20} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
  
          <div
            key="input"
            className="w-full relative"
          >
            <Input
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Aa"
              className=" w-full border rounded-full flex items-center resize-none overflow-hidden bg-background"
            />
          </div>
  
          {message.trim() ? (
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
              onClick={handleSend}
            >
              <SendHorizontal size={20} className="text-muted-foreground" />
            </Link>
          ) : (
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "shrink-0"
              )}
              onClick={handleThumbsUp}
            >
              <ThumbsUp size={20} className="text-muted-foreground" />
            </Link>
          )}
      </div>
    );
  }
  