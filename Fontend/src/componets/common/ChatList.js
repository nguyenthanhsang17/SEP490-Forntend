import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input, List, Avatar, Typography } from "antd";

const { Text } = Typography;

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#2e2e2e",
    color: "white",
  },
  sidebar: {
    width: "20%",
    backgroundColor: "#3a3b3c",
    padding: "10px",
    overflowY: "auto",
  },
  chatWindow: {
    width: "80%",
    backgroundColor: "#18191a",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    overflowY: "auto",
  },
  header: {
    fontSize: "20px",
    padding: "10px 0",
    textAlign: "center",
    borderBottom: "1px solid #4e4f50",
    color: "#e4e6eb",
  },
  chatContent: {
    flexGrow: 1,
    color: "#e4e6eb",
    padding: "10px",
  },
  messageContainer: {
    display: "flex",
    margin: "5px 0",
    alignItems: "center", // Đảm bảo căn giữa tin nhắn và không bị lệch
  },
  messageFromMe: {
    justifyContent: "flex-end",
  },
  messageFromOther: {
    justifyContent: "flex-start",
  },
  message: {
    padding: "10px",
    borderRadius: "18px",
    maxWidth: "60%",
    color: "white",
    fontSize: "14px",
    wordWrap: "break-word", // Đảm bảo tin nhắn không bị tràn ra ngoài
    margin: 0, // Loại bỏ thừa khoảng cách
  },
  myMessage: {
    backgroundColor: "#007bff",
  },
  otherMessage: {
    backgroundColor: "#3a3b3c",
  },
  timestamp: {
    fontSize: "12px",
    color: "#b0b3b8",
    marginTop: "5px",
    textAlign: "right",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #4e4f50",
    padding: "10px",
    backgroundColor: "#3a3b3c",
  },
  inputBox: {
    flexGrow: 1,
    padding: "10px",
    borderRadius: "18px",
    border: "1px solid #4e4f50",
    marginRight: "10px",
    backgroundColor: "#242526",
    color: "white",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "18px",
    color: "white",
    cursor: "pointer",
  },
};

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const chatContentRef = useRef(null);
  const selectedChatRef = useRef(null); // Tham chiếu đến cuộc trò chuyện hiện tại

  useEffect(() => {
    selectedChatRef.current = selectedChat; // Cập nhật tham chiếu khi `selectedChat` thay đổi
  }, [selectedChat]);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]); // Cuộn xuống khi danh sách tin nhắn thay đổi

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập trước!");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7077/api/Chat/GetChatUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chat:", error);
        alert("Không thể tải danh sách trò chuyện!");
      }
    };

    fetchChats();

    // Kết nối WebSocket
    const socket = new WebSocket("wss://localhost:7077/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      // Cập nhật tin nhắn cho cuộc trò chuyện hiện tại nếu đang mở
      if (
        selectedChatRef.current === data.chatId ||
        selectedChatRef.current === data.sendFromId ||
        selectedChatRef.current === data.sendToId
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.chatId,
            text: data.message,
            isMine:
              data.sendFromId === parseInt(localStorage.getItem("userId")),
            time: new Date(data.sendTime).toLocaleTimeString("vi-VN"),
          },
        ]);
      }

      // Cập nhật danh sách chat bên sidebar với tin nhắn mới nhất
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (
            chat.userId === data.sendFromId ||
            chat.userId === data.sendToId
          ) {
            return {
              ...chat,
              lastMessage: data.message,
              unreadCount:
                selectedChatRef.current === chat.userId
                  ? 0
                  : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        })
      );

      // Tự động load tin nhắn mới nếu là cuộc trò chuyện hiện tại
      const currentUserId = parseInt(localStorage.getItem("userId"));
      if (
        (data.sendFromId === currentUserId ||
          data.sendToId === currentUserId) &&
        (data.sendFromId === selectedChatRef.current ||
          data.sendToId === selectedChatRef.current)
      ) {
        fetchMessages(selectedChatRef.current);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Thêm state để theo dõi tin nhắn chưa đọc
  const [unreadMessages, setUnreadMessages] = useState({});

  // Sửa hàm fetchMessages để reset số tin nhắn chưa đọc khi mở chat
  const fetchMessages = async (chatId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7077/api/Chat/GetAllChat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const processedMessages = response.data.map((msg) => ({
        id: msg.chatId,
        text: msg.message,
        isMine: msg.sendFromId === parseInt(localStorage.getItem("userId")),
        time: new Date(msg.sendTime).toLocaleTimeString("vi-VN"),
      }));

      setMessages(processedMessages);
      setSelectedChat(chatId);
      selectedChatRef.current = chatId;

      // Reset unread count khi mở chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.userId === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      alert("Không thể tải tin nhắn!");
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) {
      alert("Tin nhắn không được để trống!");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId"));
    const chat = chats.find((chat) => chat.userId === selectedChat);

    if (!chat) {
      alert("Không thể tìm thấy người nhận!");
      return;
    }

    const messageData = {
      sendFromId: userId,
      sendToId: chat.userId,
      message: newMessage.trim(),
      sendTime: new Date().toISOString(),
      chatId: selectedChat,
    };

    // Gửi tin nhắn qua WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageData));
    } else {
      alert("Không thể gửi tin nhắn. WebSocket chưa kết nối!");
      return;
    }

    // Cập nhật UI ngay lập tức
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: messageData.chatId,
        text: messageData.message,
        isMine: true,
        time: new Date(messageData.sendTime).toLocaleTimeString("vi-VN"),
      },
    ]);

    setNewMessage(""); // Xóa nội dung input
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  useEffect(() => {
    console.log("Chats updated:", chats);
  }, [chats]);

  console.log("Current selectedChat:", selectedChat);
  useEffect(() => {
    console.log("Messages rendered:", messages);
  }, [messages]);
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.header}>Danh Sách Trò Chuyện</h2>
        <Input
          placeholder="Tìm kiếm..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List
          itemLayout="horizontal"
          dataSource={chats.filter((chat) =>
            chat.fullName.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          renderItem={(chat) => (
            <List.Item
              style={{
                backgroundColor:
                  selectedChat === chat.userId ? "#4e4f50" : "transparent",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px",
              }}
              onClick={() => fetchMessages(chat.userId)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: "#bbb" }}>
                    {chat.fullName[0]}
                  </Avatar>
                }
                title={
                  <div style={styles.chatHeader}>
                    <Text style={{ color: "#e4e6eb" }}>{chat.fullName}</Text>
                    {chat.unreadCount > 0 && (
                      <span style={styles.unreadBadge}>{chat.unreadCount}</span>
                    )}
                  </div>
                }
                description={
                  <Text style={{ color: "#b0b3b8" }}>
                    {chat.lastMessage || "Không có tin nhắn"}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div style={styles.chatWindow}>
        <div style={styles.header}>
          {selectedChat
            ? `Chat với ${
                chats.find((chat) => chat.userId === selectedChat)?.fullName
              }`
            : "Chọn một cuộc trò chuyện"}
        </div>
        <div style={styles.chatContent} ref={chatContentRef}>
          {messages.map((msg, index) => (
            <div key={index}>
              <div
                style={{
                  ...styles.messageContainer,
                  ...(msg.isMine
                    ? styles.messageFromMe
                    : styles.messageFromOther),
                }}
              >
                <div
                  style={{
                    ...styles.message,
                    ...(msg.isMine ? styles.myMessage : styles.otherMessage),
                  }}
                >
                  <span>{msg.text}</span>
                  <div style={styles.timestamp}>{msg.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <Input
            placeholder="Nhập tin nhắn..."
            style={styles.inputBox}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={sendMessage}
          />
          <button style={styles.sendButton} onClick={sendMessage}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
