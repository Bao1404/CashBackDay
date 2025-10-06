// Admin Messages Manager with API Integration
class AdminMessenger {
    constructor() {
        this.connection = null;
        this.conversations = new Map();
        this.currentConversation = null;
        this.adminId = null;
        this.init();
    }

    async init() {
        await this.getAdminId();
        await this.setupSignalR();
        await this.loadConversations();
        this.setupEventListeners();
    }

    async getAdminId() {
        const adminElement = document.querySelector('[data-admin-id]');
        if (adminElement) {
            this.adminId = parseInt(adminElement.dataset.adminId);
        }
    }

    async setupSignalR() {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/chathub")
                .withAutomaticReconnect()
                .build();

            // User connected
            this.connection.on("UserConnected", (userId, userName, avatarUrl, timestamp) => {
                this.handleUserConnected(userId, userName, avatarUrl, timestamp);
            });

            // User disconnected
            this.connection.on("UserDisconnected", (userId, timestamp) => {
                this.handleUserDisconnected(userId);
            });

            // Receive message from user
            this.connection.on("ReceiveUserMessage", (userId, userName, avatarUrl, message, timestamp, messageId, conversationId) => {
                this.receiveMessage(userId, userName, avatarUrl, message, timestamp, messageId, conversationId);
            });

            // User typing status
            this.connection.on("UserTypingStatus", (userId, userName, isTyping) => {
                this.updateTypingStatus(userId, userName, isTyping);
            });

            // Message sent confirmation
            this.connection.on("MessageSent", (messageId) => {
                console.log("Message sent:", messageId);
            });

            // Handle errors
            this.connection.on("Error", (errorMessage) => {
                this.showToast(errorMessage, "error");
            });

            // Reconnected
            this.connection.onreconnected(async () => {
                console.log("Reconnected to SignalR");
                await this.loadConversations();
            });

            await this.connection.start();
            console.log("Admin SignalR Connected");
        } catch (err) {
            console.error("SignalR Connection Error:", err);
            setTimeout(() => this.setupSignalR(), 5000);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchMessages');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterConversations(e.target.value);
            });
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            let typingTimeout;
            messageInput.addEventListener('input', () => {
                if (this.currentConversation) {
                    clearTimeout(typingTimeout);
                    this.handleAdminTyping(true);
                    
                    typingTimeout = setTimeout(() => {
                        this.handleAdminTyping(false);
                    }, 2000);
                }
            });
        }
    }

    async loadConversations() {
        try {
            // Get all conversations from API
            const response = await fetch('/api/Chat/conversations');
            if (!response.ok) throw new Error('Failed to load conversations');
            
            const conversations = await response.json();
            
            // Clear existing conversations
            this.conversations.clear();
            
            // Load conversations with active status
            for (const conv of conversations.filter(c => c.status === 'Active')) {
                try {
                    // Get messages for this conversation
                    const messagesResponse = await fetch(`/api/Chat/messages/${conv.conversationId}`);
                    const messages = await messagesResponse.json();
                    
                    // Get user info from messages (sender)
                    let userName = 'User';
                    let avatarUrl = '/placeholder.svg?height=48&width=48&text=User';
                    
                    if (messages.length > 0) {
                        // Try to get user info from your user service
                        // For now, use userId from conversation
                        userName = `User #${conv.userId}`;
                    }
                    
                    const lastMessage = messages.length > 0 
                        ? messages[messages.length - 1] 
                        : null;
                    
                    const unreadCount = messages.filter(m => 
                        !m.isRead && m.senderId === conv.userId
                    ).length;
                    
                    this.conversations.set(conv.conversationId.toString(), {
                        conversationId: conv.conversationId,
                        userId: conv.userId,
                        userName: userName,
                        avatar: avatarUrl,
                        lastMessage: lastMessage?.content || 'Chưa có tin nhắn',
                        lastMessageTime: lastMessage?.createdAt || conv.createdAt,
                        unreadCount: unreadCount,
                        isOnline: false, // Will be updated by SignalR
                        status: conv.status,
                        messages: messages
                    });
                } catch (msgError) {
                    console.error(`Error loading messages for conversation ${conv.conversationId}:`, msgError);
                }
            }
            
            this.renderConversationsList();
            this.updateStats();
        } catch (error) {
            console.error('Error loading conversations:', error);
            this.showToast('Không thể tải danh sách hội thoại', 'error');
        }
    }

    updateStats() {
        const totalConversations = this.conversations.size;
        const unreadCount = Array.from(this.conversations.values())
            .reduce((sum, conv) => sum + conv.unreadCount, 0);
        
        // Update UI
        const conversationsCount = document.querySelector('.conversations-count');
        if (conversationsCount) {
            conversationsCount.textContent = `${totalConversations} cuộc trò chuyện`;
        }
        
        // Update filter badges
        const unreadFilter = document.querySelector('.filter-btn[data-filter="unread"] .filter-count');
        if (unreadFilter) {
            unreadFilter.textContent = unreadCount;
        }
    }

    renderConversationsList() {
        const container = document.getElementById('messagesList');
        if (!container) return;

        container.innerHTML = '';

        if (this.conversations.size === 0) {
            container.innerHTML = `
                <div class="text-center p-4">
                    <i class="fas fa-inbox fa-3x mb-3 text-muted"></i>
                    <p class="text-muted">Chưa có cuộc trò chuyện nào</p>
                </div>
            `;
            return;
        }

        // Sort conversations by last message time
        const sortedConversations = Array.from(this.conversations.values())
            .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        sortedConversations.forEach((conv) => {
            const convHtml = this.createConversationItem(conv);
            container.insertAdjacentHTML('beforeend', convHtml);
        });

        // Attach click events
        container.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectConversation(item.dataset.conversationId);
            });
        });
    }

    createConversationItem(conv) {
        const time = this.formatTime(conv.lastMessageTime);
        const unreadBadge = conv.unreadCount > 0 ? 
            `<span class="message-badge unread">${conv.unreadCount}</span>` : '';

        return `
            <div class="message-item ${conv.unreadCount > 0 ? 'unread' : ''}" 
                 data-conversation-id="${conv.conversationId}" 
                 data-user-id="${conv.userId}">
                <div class="message-item-header">
                    <div class="message-user-info">
                        <img src="${conv.avatar}" alt="${conv.userName}" class="message-user-avatar">
                        <div>
                            <h6 class="message-user-name">${conv.userName}</h6>
                            <div class="message-user-status">
                                <span class="status-dot ${conv.isOnline ? 'online' : ''}"></span>
                                <span class="status-text">${conv.isOnline ? 'Đang online' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>
                    <span class="message-time">${time}</span>
                </div>
                <p class="message-preview">${this.escapeHtml(conv.lastMessage)}</p>
                <div class="message-meta">
                    <div class="message-badges">
                        ${unreadBadge}
                    </div>
                </div>
            </div>
        `;
    }

    selectConversation(conversationId) {
        this.currentConversation = this.conversations.get(conversationId);
        
        if (!this.currentConversation) return;

        // Update UI
        document.querySelectorAll('.message-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-conversation-id="${conversationId}"]`)?.classList.add('active');

        // Show chat window
        document.getElementById('chatPlaceholder').style.display = 'none';
        document.getElementById('chatWindow').style.display = 'flex';

        // Update chat header
        document.getElementById('chatUserName').textContent = this.currentConversation.userName;
        document.getElementById('chatUserAvatar').src = this.currentConversation.avatar;
        document.getElementById('chatUserStatus').className = 
            `status-dot ${this.currentConversation.isOnline ? 'online' : ''}`;
        document.getElementById('chatUserStatusText').textContent = 
            this.currentConversation.isOnline ? 'Đang hoạt động' : 'Offline';

        // Load messages
        this.loadChatMessages(conversationId);

        // Mark as read
        this.markConversationAsRead(conversationId);
    }

    loadChatMessages(conversationId) {
        const container = document.getElementById('chatMessagesArea');
        if (!container) return;

        const conv = this.conversations.get(conversationId);
        if (!conv || !conv.messages) return;

        container.innerHTML = conv.messages.map(msg => {
            const sender = msg.senderId === conv.userId ? 'user' : 'admin';
            return this.createMessageBubble({
                sender: sender,
                message: msg.content,
                timestamp: msg.createdAt
            });
        }).join('');

        this.scrollToBottom();
    }

    createMessageBubble(msg) {
        const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <div class="message-bubble ${msg.sender}">
                <div class="message-content">${this.escapeHtml(msg.message)}</div>
                <small class="message-time">${time}</small>
            </div>
        `;
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message || !this.currentConversation || !this.connection || !this.adminId) return;

        // Add to UI immediately
        const msgData = {
            sender: 'admin',
            message: message,
            timestamp: new Date()
        };

        const container = document.getElementById('chatMessagesArea');
        container.insertAdjacentHTML('beforeend', this.createMessageBubble(msgData));
        input.value = '';
        this.scrollToBottom();

        // Send via SignalR (which saves to DB via Hub)
        try {
            await this.connection.invoke("SendMessageFromAdmin", 
                this.currentConversation.conversationId,
                this.adminId,
                this.currentConversation.userId,
                message
            );
            
            // Update conversation
            this.currentConversation.lastMessage = message;
            this.currentConversation.lastMessageTime = new Date();
            
            // Reload conversation to get updated messages from DB
            await this.reloadCurrentConversation();
            
            this.renderConversationsList();
            this.selectConversation(this.currentConversation.conversationId.toString());
        } catch (err) {
            console.error("Error sending message:", err);
            this.showToast("Không thể gửi tin nhắn", "error");
        }
    }

    async reloadCurrentConversation() {
        if (!this.currentConversation) return;
        
        try {
            const response = await fetch(`/api/Chat/messages/${this.currentConversation.conversationId}`);
            const messages = await response.json();
            this.currentConversation.messages = messages;
        } catch (error) {
            console.error('Error reloading conversation:', error);
        }
    }

    receiveMessage(userId, userName, avatarUrl, message, timestamp, messageId, conversationId) {
        // Find or update conversation
        let conv = this.conversations.get(conversationId.toString());
        
        if (!conv) {
            // Create new conversation entry
            conv = {
                conversationId: conversationId,
                userId: userId,
                userName: userName,
                avatar: avatarUrl,
                lastMessage: message,
                lastMessageTime: new Date(timestamp),
                unreadCount: 1,
                isOnline: true,
                status: 'Active',
                messages: []
            };
            this.conversations.set(conversationId.toString(), conv);
        } else {
            // Update existing conversation
            conv.lastMessage = message;
            conv.lastMessageTime = new Date(timestamp);
            conv.userName = userName;
            conv.avatar = avatarUrl;
            
            if (this.currentConversation?.conversationId !== conversationId) {
                conv.unreadCount++;
            } else {
                // Add message to current chat
                const msgData = {
                    sender: 'user',
                    message: message,
                    timestamp: timestamp
                };
                
                const container = document.getElementById('chatMessagesArea');
                if (container) {
                    container.insertAdjacentHTML('beforeend', this.createMessageBubble(msgData));
                    this.scrollToBottom();
                }
            }
        }

        // Reload messages from API to keep in sync
        this.reloadConversationMessages(conversationId);

        this.renderConversationsList();
        this.updateStats();
        
        // Show notification
        if (this.currentConversation?.conversationId !== conversationId) {
            this.showToast(`Tin nhắn mới từ ${userName}`, "info");
            this.playNotificationSound();
        }
    }

    async reloadConversationMessages(conversationId) {
        try {
            const response = await fetch(`/api/Chat/messages/${conversationId}`);
            const messages = await response.json();
            
            const conv = this.conversations.get(conversationId.toString());
            if (conv) {
                conv.messages = messages;
            }
        } catch (error) {
            console.error('Error reloading messages:', error);
        }
    }

    handleUserConnected(userId, userName, avatarUrl, timestamp) {
        this.conversations.forEach(conv => {
            if (conv.userId === userId) {
                conv.isOnline = true;
                conv.userName = userName;
                conv.avatar = avatarUrl;
            }
        });
        this.renderConversationsList();
    }

    handleUserDisconnected(userId) {
        this.conversations.forEach(conv => {
            if (conv.userId === userId) {
                conv.isOnline = false;
            }
        });
        this.renderConversationsList();
    }

    updateTypingStatus(userId, userName, isTyping) {
        if (this.currentConversation?.userId === userId) {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.style.display = isTyping ? 'flex' : 'none';
                
                const typingText = indicator.querySelector('.typing-text');
                if (typingText) {
                    typingText.textContent = `${userName} đang nhập...`;
                }
                
                if (isTyping) {
                    this.scrollToBottom();
                }
            }
        }
    }

    async handleAdminTyping(isTyping) {
        if (!this.currentConversation || !this.connection) return;
        
        try {
            await this.connection.invoke("AdminTyping", this.currentConversation.userId, isTyping);
        } catch (err) {
            console.error("Error sending typing status:", err);
        }
    }

    markConversationAsRead(conversationId) {
        const conv = this.conversations.get(conversationId);
        if (!conv) return;

        conv.unreadCount = 0;
        this.renderConversationsList();
        this.updateStats();
    }

    filterConversations(searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('.message-item').forEach(item => {
            const userName = item.querySelector('.message-user-name').textContent.toLowerCase();
            const lastMessage = item.querySelector('.message-preview').textContent.toLowerCase();
            
            if (userName.includes(term) || lastMessage.includes(term)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleFilterClick(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');

        const filter = button.dataset.filter;
        
        document.querySelectorAll('.message-item').forEach(item => {
            const conv = this.conversations.get(item.dataset.conversationId);
            
            if (filter === 'all') {
                item.style.display = 'block';
            } else if (filter === 'unread') {
                item.style.display = conv && conv.unreadCount > 0 ? 'block' : 'none';
            }
        });
    }

    scrollToBottom() {
        const container = document.getElementById('chatMessagesContainer');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }

    formatTime(date) {
        const now = new Date();
        const messageDate = new Date(date);
        const diff = now - messageDate;
        const hours = Math.floor(diff / 3600000);
        
        if (hours < 24) {
            return messageDate.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return messageDate.toLocaleDateString('vi-VN');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    playNotificationSound() {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(() => {});
        } catch (e) {
            // Ignore if sound file doesn't exist
        }
    }

    showToast(message, type) {
        if (typeof showToast !== 'undefined') {
            showToast(message, type);
        }
    }
}

// Initialize
let adminMessenger;
document.addEventListener('DOMContentLoaded', () => {
    adminMessenger = new AdminMessenger();
});

window.adminMessenger = adminMessenger;

// Functions called from HTML
function sendMessage(event) {
    event?.preventDefault();
    adminMessenger?.sendMessage();
}

function viewUserProfile() {
    if (adminMessenger?.currentConversation) {
        window.location.href = `/Admin/UserProfile/${adminMessenger.currentConversation.userId}`;
    }
}

function addNote() {
    adminMessenger?.showToast('Tính năng thêm ghi chú đang phát triển', 'info');
}

function markAsResolved() {
    if (adminMessenger?.currentConversation) {
        adminMessenger.showToast('Đã đánh dấu cuộc trò chuyện là đã giải quyết', 'success');
    }
}

function blockUser() {
    if (adminMessenger?.currentConversation && confirm('Bạn có chắc muốn chặn người dùng này?')) {
        adminMessenger.showToast('Đã chặn người dùng', 'success');
    }
}

function attachFile() {
    adminMessenger?.showToast('Tính năng đính kèm file đang phát triển', 'info');
}