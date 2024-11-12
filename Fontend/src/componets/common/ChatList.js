import React, { useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#2e2e2e',
    color: 'white',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#3a3b3c',
    padding: '10px',
    overflowY: 'auto',
  },
  chatWindow: {
    width: '70%',
    backgroundColor: '#18191a',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    overflowY: 'auto',
  },
  header: {
    fontSize: '20px',
    padding: '10px 0',
    textAlign: 'center',
    borderBottom: '1px solid #4e4f50',
  },
  chatList: {
    listStyle: 'none',
    padding: '0',
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  chatItemHover: {
    backgroundColor: '#4e4f50',
  },
  profilePic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    backgroundColor: '#bbb',
  },
  chatInfo: {
    flex: '1',
  },
  name: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#e4e6eb',
  },
  lastMessage: {
    fontSize: '14px',
    color: '#b0b3b8',
  },
  chatContent: {
    flexGrow: 1,
    color: '#e4e6eb',
    padding: '10px',
  },
  message: {
    backgroundColor: '#3a3b3c',
    padding: '8px 12px',
    borderRadius: '18px',
    margin: '5px 0',
    maxWidth: '70%',
    alignSelf: 'flex-start',
  },
  myMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: '14px',
  },
  searchInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #4e4f50',
    marginBottom: '10px',
    backgroundColor: '#3a3b3c',
    color: 'white',
  },
};

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats] = useState([
    { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Xin chào!', isOnline: true },
    { id: 2, name: 'Trần Thị B', lastMessage: 'Hẹn gặp lại!', isOnline: false },
    { id: 3, name: 'Phạm Văn C', lastMessage: 'Bạn có khỏe không?', isOnline: true },
  ]);

  const [messages] = useState([
    { id: 1, text: 'Tối ae họp nhé', sender: 'Nguyễn Văn A', time: '18:33' },
    { id: 2, text: 'Tối ae 8h30 vào nhé', sender: 'Nguyễn Văn A', time: '20:43' },
    { id: 3, text: '@mọi người Discord', sender: 'Tôi', time: '20:44', isMine: true },
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Sidebar for Chat List */}
      <div style={styles.sidebar}>
        <h2 style={styles.header}>Danh Sách Trò Chuyện</h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul style={styles.chatList}>
          {filteredChats.map(chat => (
            <li
              key={chat.id}
              style={styles.chatItem}
              onMouseOver={(e ) => e.currentTarget.style.backgroundColor = styles.chatItemHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.chatItem.backgroundColor}
            >
              <div style={styles.profilePic}></div>
              <div style={styles.chatInfo}>
                <div style={styles.name}>{chat.name}</div>
                <div style={styles.lastMessage}>{chat.lastMessage}</div>
              </div>
              {chat.isOnline && <span style={styles.onlineDot}></span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        <div style={styles.header}>Chat with Nguyễn Văn A</div>
        <div style={styles.chatContent}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                ...(msg.isMine ? styles.myMessage : {}),
              }}
            >
              <span style={styles.messageText}>{msg.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;