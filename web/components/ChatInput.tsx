"use client"
import React, { ReactEventHandler, useState } from 'react'

interface Chat{
    chat:string,
    role:"assistant"|"user"
}

const ChatInput = () => {

    const [chat,setChat]=useState("");
    const [chatHistory,setChatHistory]=useState<Chat[]>([]);
    const [llm,setllm]=useState<string>("GPT-4");
    const [loading, setLoading] = useState<boolean>(false);
    

    const chatHandler=(e: React.ChangeEvent<HTMLTextAreaElement >)=>{
        setChat(e.target.value);
    }

    const simulateAssistantReply = async (currentChatHistory: Chat[], res: Chat) => {
        setLoading(true); // Start loading

        try {
            const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat: res.chat,
                llm: llm,
            }),
            });

            const assistantReply: Chat = await response.json();

            setChatHistory((prev) => [...prev, assistantReply]);
        } catch (err) {
            setChatHistory((prev) => [
            ...prev,
            { chat: "❌ Error talking to the model.", role: "assistant" },
            ]);
        } finally {
            setLoading(false); // Stop loading
        }
        };

    const buttonSubmitHandler=()=>{
        const res:Chat={
            chat:chat,
            role:"user"
        }
        const updatedChatHistory = [...chatHistory, res];
        setChatHistory(updatedChatHistory);

        setChat("");
        simulateAssistantReply(updatedChatHistory,res);

    }

    const llmHandler=(e: React.ChangeEvent<HTMLSelectElement>)=>{
        setllm(e.target.value);
    }

  return (
    <div >
        <div className='chat-box'>
            {chatHistory.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                <strong>{message.role === "user" ? "You" : "Assistant"}:</strong> {message.chat}
                </div>
            ))}

            {loading && (
                <div className="message assistant">
                <strong>Assistant:</strong> <em>Typing...</em>
                </div>
            )}
        </div>

        <div>
            <textarea
                placeholder='Chat here'
                    className='b-white'
                    onChange={chatHandler}
                    value={chat}
            />
        
            <select name='llm' onChange={llmHandler}>
                <option value="GPT-4">GPT-4</option>
                <option value="Gemini">Gemini</option>
                <option value="Cluade-Sonnet-3.7">Cluade-Sonnet-3.7</option>
            </select>
            <button className='border-white' onClick={buttonSubmitHandler}>Send</button>
        </div>
      
    </div>
  )
}

export default ChatInput
