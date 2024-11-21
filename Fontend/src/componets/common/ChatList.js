import React, { useState, useEffect } from "react";
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
    width: "30%",
    backgroundColor: "#3a3b3c",
    padding: "10px",
    overflowY: "auto",
  },
  chatWindow: {
    width: "70%",
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
  message: {
    backgroundColor: "#3a3b3c",
    padding: "8px 12px",
    borderRadius: "18px",
    margin: "5px 0",
    maxWidth: "70%",
    alignSelf: "flex-start",
  },
  myMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: "14px",
  },
  searchInput: {
    width: "100%",
    marginBottom: "10px",
  },
  messageContainer: {
    display: "flex",
    margin: "5px 0",
  },
  messageFromMe: {
    justifyContent: "flex-end", // Căn sang bên phải
  },
  messageFromOther: {
    justifyContent: "flex-start", // Căn sang bên trái
  },
  message: {
    padding: "10px",
    borderRadius: "18px",
    maxWidth: "60%",
    color: "white",
    fontSize: "14px",
  },
  myMessage: {
    backgroundColor: "#007bff", // Màu xanh cho tin nhắn của mình
    color: "white",
  },
  otherMessage: {
    backgroundColor: "#3a3b3c", // Màu xám cho tin nhắn của người khác
    color: "white",
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
        const processedChats = response.data.map((chat) => ({
          ...chat,
          lastMessage: chat.lastMessage || "Không có tin nhắn",
          isOnline: chat.isOnline || false,
        }));
        setChats(processedChats);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chat:", error);
        alert("Không thể tải danh sách trò chuyện!");
      }
    };

    fetchChats();
  }, []);

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

      console.log("Messages API Response:", response.data);

      // Xử lý phản hồi từ API
      const userId = parseInt(localStorage.getItem("userId")); // ID người dùng hiện tại
      const processedMessages = response.data.map((msg) => ({
        id: msg.chatId,
        text: msg.message || "Không có nội dung", // Sử dụng trường 'message'
        isMine: msg.sendFromId === userId, // Kiểm tra tin nhắn có phải của mình không
        time: new Date(msg.sendTime).toLocaleTimeString("vi-VN"), // Định dạng thời gian
      }));

      setMessages(processedMessages);
      setSelectedChat(chatId);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      alert("Không thể tải tin nhắn!");
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.fullName &&
      chat.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [newMessage, setNewMessage] = useState(""); // State cho tin nhắn mới

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    const userId = parseInt(localStorage.getItem("userId"));

    if (!newMessage.trim()) {
      alert("Tin nhắn không được để trống!");
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7077/api/Chat/SendMessage`,
        {
          chatId: selectedChat,
          sendFromId: userId,
          sendToId: chats.find((chat) => chat.userId === selectedChat)?.userId,
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật tin nhắn trong giao diện
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: response.data.chatId,
          text: newMessage,
          isMine: true,
          time: new Date().toLocaleTimeString("vi-VN"),
        },
      ]);
      setNewMessage(""); // Reset ô nhập tin nhắn
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      alert("Không thể gửi tin nhắn!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar for Chat List */}
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
          dataSource={filteredChats}
          renderItem={(chat) => (
            <List.Item
              style={{
                backgroundColor:
                  selectedChat === chat.userId ? "#4e4f50" : "transparent",
                cursor: "pointer",
              }}
              onClick={() => fetchMessages(chat.userId)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: chat.isOnline ? "#87d068" : "#bbb",
                    }}
                  >
                    {chat.fullName[0]} {/* Lấy ký tự đầu tiên của tên */}
                  </Avatar>
                }
                title={
                  <Text style={{ color: "#e4e6eb" }}>{chat.fullName}</Text>
                }
                description={
                  <Text style={{ color: "#b0b3b8" }}>{chat.lastMessage}</Text>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        <div style={styles.header}>
          {selectedChat
            ? `Chat với ${
                chats.find((chat) => chat.userId === selectedChat)?.fullName ||
                ""
              }`
            : "Chọn một cuộc trò chuyện"}
        </div>
        <div style={styles.chatContent}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
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
            ))
          ) : (
            <p style={{ color: "#b0b3b8", textAlign: "center" }}>
              Không có tin nhắn nào.
            </p>
          )}
        </div>

        {/* Ô nhập tin nhắn */}
        <div style={styles.inputContainer}>
          <Input
            placeholder="Nhập tin nhắn..."
            style={styles.inputBox}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={sendMessage} // Gửi tin nhắn khi nhấn Enter
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
