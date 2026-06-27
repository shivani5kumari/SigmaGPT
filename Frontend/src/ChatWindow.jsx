import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
            }),
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    // Append new chat
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "assistant",
                    content: reply,
                },
            ]);
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const startListening = () => {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        toast.error("Voice input is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
    };

    recognition.onerror = () => {
        toast.error("Couldn't recognize your voice.");
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
};

    // Settings
    const handleSettings = () => {
        setIsOpen(false);

        toast.info("⚙️ Settings feature coming soon!", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    // Logout
    const handleLogout = () => {
        setIsOpen(false);

        toast.success("Logged out successfully! 👋");

        setTimeout(() => {
            localStorage.removeItem("token");
            window.location.reload();
        }, 1500);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>
                    SigmaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
    <div className="dropDown">

        <div
            style={{
                padding: "12px 16px",
                borderBottom: "1px solid #4b4b4b",
                color: "white",
                fontWeight: "600",
                fontSize: "15px",
            }}
        >
            <i className="fa-solid fa-user"></i> {user?.name || "User"}
        </div>

        <div
            className="dropDownItem"
            onClick={handleSettings}
            style={{ cursor: "pointer" }}
        >
            <i className="fa-solid fa-gear"></i> Settings
        </div>

        <div
            className="dropDownItem"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
        >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
        </div>

    </div>
)}

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? getReply() : null
                        }
                    />

                    <div
    id="mic"
    onClick={startListening}
     title={isListening ? "Listening..." : "Voice Input"}
    style={{ cursor: "pointer", marginRight: "10px",color: isListening ? "#ff4d4f" : "#ffffff",
        transition: "0.3s ease", }}
>
    <i
        className="fa-solid fa-microphone">
    </i>
</div>

<div id="submit" onClick={getReply}>
    <i className="fa-solid fa-paper-plane"></i>
</div>
                </div>

                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie
                    Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;