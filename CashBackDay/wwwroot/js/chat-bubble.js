// User Chat Bubble with SignalR and API Integration
class UserChatBubble {
    constructor() {
        this.connection = null;
        this.userId = null;
        this.conversationId = null;
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.init();
    }

    async init() {
        await this.getUserId();
        if (!this.userId) {
            console.log("User not logged in");
            return;
        }
        
        this.createChatBubble();
        await this.loadConversation();
        await this.setupSignalR();
        this.attachEventListeners();
    }

    async getUserId() {
        const userIdElement = document.querySelector('[data-user-id]');
        if (userIdElement) {
            this.userId = parseInt(userIdElement.dataset.userId);
        }
    }

    async loadConversation() {
        try {
            // Get all conversations
            const response = await fetch('/api/Chat/conversations');
            if (!response.ok) throw new Error('Failed to load conversations');
            
            const conversations = await response.json();
            
            // Find active conversation for this user
            const userConversation = conversations.find(c => 
                c.userId === this.userId && c.status === 'Active'
            );
            
            if (userConversation) {
                this.conversationId = userConversation.conversationId;
                await this.loadMessages();
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    }

    async loadMessages() {
        if (!this.conversationId) return;
        
        try {
            const response = await fetch(`/api/Chat/messages/${this.conversationId}`);
            if (!response.ok) throw new Error('Failed to load messages');
            
            const messages = await response.json();
            this.messages = messages;
            this.renderMessages();
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages() {
        const container = document.getElementById('userChatMessages');
        if (!container) return;
        
        // Clear welcome message if there are real messages
        if (this.messages.length > 0) {
            container.innerHTML = '';
        }
        
        this.messages.forEach(msg => {
            const sender = msg.senderId === this.userId ? 'user' : 'admin';
            const messageHtml = this.createMessageBubble(msg.content, sender, msg.createdAt);
            container.insertAdjacentHTML('beforeend', messageHtml);
        });
        
        this.scrollToBottom();
    }

    createChatBubble() {
        const html = `
            <div class="user-chat-bubble" data-user-id="${this.userId || ''}">
                <button class="chat-bubble-toggle" onclick="userChat.toggle()">
                    <i class="fas fa-comments"></i>
                    <span class="chat-notification-badge" style="display: none;">0</span>
                </button>
                
                <div class="chat-bubble-window">
                    <div class="chat-bubble-header">
                        <div>
                            <h6>Hỗ trợ trực tuyến</h6>
                            <small>Chúng tôi luôn sẵn sàng</small>
                        </div>
                        <button class="chat-bubble-close" onclick="userChat.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-bubble-messages" id="userChatMessages">
                        <div class="message-bubble admin">
                            <div class="message-content">
                                Xin chào! Chúng tôi có thể giúp gì cho bạn?
                            </div>
                            <small class="message-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                    </div>
                    
                    <div class="chat-typing" id="userChatTyping" style="display: none;">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span class="typing-text">Đang nhập...</span>
                    </div>
                    
                    <div class="chat-bubble-input-area">
                        <form class="chat-input-form" onsubmit="userChat.sendMessage(event)">
                            <div class="chat-bubble-input-wrapper">
                                <textarea 
                                    class="chat-bubble-input" 
                                    id="userChatInput" 
                                    placeholder="Nhập tin nhắn..." 
                                    rows="1"
                                    oninput="userChat.handleInput(event)"
                                    onkeydown="userChat.handleKeyDown(event)"></textarea>
                                <button type="submit" class="chat-bubble-send">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    async setupSignalR() {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/chathub")
                .withAutomaticReconnect()
                .build();

            // Receive message from admin
            this.connection.on("ReceiveAdminMessage", (message, timestamp, messageId) => {
                this.addMessage(message, 'admin', timestamp);
                this.playNotificationSound();
                
                if (!this.isOpen) {
                    this.incrementNotificationBadge();
                }
            });

            // Admin typing status
            this.connection.on("AdminTypingStatus", (isTyping) => {
                this.showTypingIndicator(isTyping);
            });

            // Handle errors
            this.connection.on("Error", (errorMessage) => {
                this.showError(errorMessage);
            });

            // Reconnected - reload messages
            this.connection.onreconnected(async () => {
                console.log("Reconnected to SignalR");
                await this.loadMessages();
            });

            await this.connection.start();
            console.log("SignalR Connected");
        } catch (err) {
            console.error("SignalR Connection Error:", err);
            setTimeout(() => this.setupSignalR(), 5000);
        }
    }

    attachEventListeners() {
        const input = document.getElementById('userChatInput');
        if (input) {
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }
    }

    toggle() {
        const window = document.querySelector('.chat-bubble-window');
        const toggle = document.querySelector('.chat-bubble-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('show');
            toggle.classList.add('active');
            this.resetNotificationBadge();
            this.scrollToBottom();
            document.getElementById('userChatInput')?.focus();
        } else {
            window.classList.remove('show');
            toggle.classList.remove('active');
        }
    }

    async sendMessage(event) {
        event.preventDefault();
        
        if (!this.userId) {
            this.showError("Vui lòng đăng nhập để gửi tin nhắn");
            return;
        }

        const input = document.getElementById('userChatInput');
        const message = input.value.trim();
        
        if (!message || !this.connection) return;

        // Add message to UI immediately
        this.addMessage(message, 'user', new Date());
        
        try {
            // Send via SignalR (which will save to DB via Hub)
            await this.connection.invoke("SendMessageToAdmin", this.userId, message);
            
            input.value = '';
            input.style.height = 'auto';
            this.stopTypingNotification();
            
            // Reload conversation if it was just created
            if (!this.conversationId) {
                setTimeout(async () => {
                    await this.loadConversation();
                }, 1000);
            }
        } catch (err) {
            console.error("Error sending message:", err);
            this.showError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    }

    addMessage(message, sender, timestamp) {
        const messagesContainer = document.getElementById('userChatMessages');
        const messageHtml = this.createMessageBubble(message, sender, timestamp);
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
    }

    createMessageBubble(message, sender, timestamp) {
        const time = new Date(timestamp).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <div class="chat-bubble-message ${sender}">
                <div class="message-bubble ${sender}">
                    <div class="message-content">${this.escapeHtml(message)}</div>
                <small class="message-time">${time}</small>
            </div>
            </div>
        `;
    }

    handleInput(event) {
        const value = event.target.value;
        
        if (value.trim() && !this.isTyping) {
            this.startTypingNotification();
        } else if (!value.trim() && this.isTyping) {
            this.stopTypingNotification();
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage(event);
        }
    }

    async startTypingNotification() {
        this.isTyping = true;
        
        clearTimeout(this.typingTimeout);
        
        if (this.connection && this.userId) {
            try {
                await this.connection.invoke("UserTyping", this.userId, true);
            } catch (err) {
                console.error("Error sending typing status:", err);
            }
        }

        this.typingTimeout = setTimeout(() => {
            this.stopTypingNotification();
        }, 3000);
    }

    async stopTypingNotification() {
        this.isTyping = false;
        clearTimeout(this.typingTimeout);
        
        if (this.connection && this.userId) {
            try {
                await this.connection.invoke("UserTyping", this.userId, false);
            } catch (err) {
                console.error("Error sending typing status:", err);
            }
        }
    }

    showTypingIndicator(show) {
        const indicator = document.getElementById('userChatTyping');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
            if (show) {
                this.scrollToBottom();
            }
        }
    }

    incrementNotificationBadge() {
        const badge = document.querySelector('.chat-notification-badge');
        if (badge) {
            badge.style.display = 'flex';
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
        }
    }

    resetNotificationBadge() {
        const badge = document.querySelector('.chat-notification-badge');
        if (badge) {
            badge.style.display = 'none';
            badge.textContent = '0';
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('userChatMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    playNotificationSound() {
        // Optional: Add notification sound
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(() => {});
        } catch (e) {
            // Ignore if sound file doesn't exist
        }
    }

    showError(message) {
        if (typeof showToast !== 'undefined') {
            showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat bubble
let userChat;
document.addEventListener('DOMContentLoaded', () => {
    userChat = new UserChatBubble();
});
