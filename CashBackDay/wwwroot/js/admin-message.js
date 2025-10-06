// Admin Messages JavaScript - Messenger-style interface
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

connection.start().then(() => {
    console.log("Admin connected to SignalR!");
});

// Khi nhận tin nhắn mới từ user
connection.on("ReceiveMessage", (fromUserId, message, time) => {
    addMessageToChat(fromUserId, message, time, "user");
});

function sendAdminMessage(userId, message) {
    connection.invoke("SendMessageToUser", userId, message)
        .catch(err => console.error(err));
}
class AdminMessenger {
    constructor() {
        this.currentChatId = null
        this.conversations = new Map()
        this.ws = null
        this.typingTimeout = null
        this.bootstrap = window.bootstrap
        this.init()
    }

    init() {
        this.loadConversations()
        this.setupEventListeners()
        this.connectWebSocket()
        this.startPeriodicUpdates()
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById("searchMessages").addEventListener("input", (e) => {
            this.filterConversations(e.target.value)
        })

        // Filter tabs
        document.querySelectorAll(".filter-tab").forEach((tab) => {
            tab.addEventListener("click", (e) => {
                this.setActiveFilter(e.target.dataset.filter)
            })
        })

        // Message input
        const messageInput = document.getElementById("messageInput")
        messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                this.sendMessage()
            }
        })

        messageInput.addEventListener("input", () => {
            this.handleTyping()
            this.autoResizeTextarea()
        })

        // Quick responses
        document.querySelectorAll(".quick-response-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.insertQuickResponse(e.target.dataset.response)
            })
        })

        // File input
        document.getElementById("fileInput").addEventListener("change", (e) => {
            this.previewFiles(e.target.files)
        })
    }

    loadConversations() {
        // Mock conversation data
        const mockConversations = [
            {
                id: "user_1",
                userId: 1,
                userName: "Nguyễn Văn A",
                userEmail: "nguyenvana@email.com",
                userAvatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: "Tôi cần hỗ trợ về hoàn tiền từ VPS Securities",
                lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
                unreadCount: 2,
                isOnline: true,
                status: "active",
                messages: [
                    {
                        id: 1,
                        senderId: 1,
                        senderType: "user",
                        message: "Xin chào, tôi cần hỗ trợ về hoàn tiền",
                        timestamp: new Date(Date.now() - 10 * 60 * 1000),
                        status: "delivered",
                    },
                    {
                        id: 2,
                        senderId: "admin",
                        senderType: "admin",
                        message: "Xin chào! Tôi có thể giúp gì cho bạn về vấn đề hoàn tiền?",
                        timestamp: new Date(Date.now() - 8 * 60 * 1000),
                        status: "read",
                    },
                    {
                        id: 3,
                        senderId: 1,
                        senderType: "user",
                        message:
                            "Tôi đã thực hiện giao dịch mua 100 cổ phiếu VIC từ VPS Securities hôm qua nhưng chưa thấy tiền hoàn",
                        timestamp: new Date(Date.now() - 5 * 60 * 1000),
                        status: "delivered",
                    },
                ],
            },
            {
                id: "user_2",
                userId: 2,
                userName: "Trần Thị B",
                userEmail: "tranthib@email.com",
                userAvatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: "Cảm ơn admin đã hỗ trợ!",
                lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
                unreadCount: 0,
                isOnline: false,
                status: "resolved",
                messages: [
                    {
                        id: 4,
                        senderId: 2,
                        senderType: "user",
                        message: "Tỷ lệ hoàn tiền của sàn SSI là bao nhiêu?",
                        timestamp: new Date(Date.now() - 45 * 60 * 1000),
                        status: "read",
                    },
                    {
                        id: 5,
                        senderId: "admin",
                        senderType: "admin",
                        message:
                            "Tỷ lệ hoàn tiền của SSI Securities hiện tại là 75%. Bạn có thể xem chi tiết tại trang Sàn giao dịch.",
                        timestamp: new Date(Date.now() - 35 * 60 * 1000),
                        status: "read",
                    },
                    {
                        id: 6,
                        senderId: 2,
                        senderType: "user",
                        message: "Cảm ơn admin đã hỗ trợ!",
                        timestamp: new Date(Date.now() - 30 * 60 * 1000),
                        status: "read",
                    },
                ],
            },
            {
                id: "user_3",
                userId: 3,
                userName: "Lê Văn C",
                userEmail: "levanc@email.com",
                userAvatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: "Tôi không thể kết nối tài khoản Binance",
                lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                unreadCount: 1,
                isOnline: true,
                status: "pending",
                messages: [
                    {
                        id: 7,
                        senderId: 3,
                        senderType: "user",
                        message: "Tôi không thể kết nối tài khoản Binance. Hệ thống báo lỗi API key không hợp lệ",
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                        status: "delivered",
                    },
                ],
            },
            {
                id: "user_4",
                userId: 4,
                userName: "Phạm Thị D",
                userEmail: "phamthid@email.com",
                userAvatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: "Làm sao để rút tiền về tài khoản ngân hàng?",
                lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
                unreadCount: 1,
                isOnline: false,
                status: "pending",
                messages: [
                    {
                        id: 8,
                        senderId: 4,
                        senderType: "user",
                        message: "Làm sao để rút tiền về tài khoản ngân hàng?",
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                        status: "delivered",
                    },
                ],
            },
            {
                id: "user_5",
                userId: 5,
                userName: "Hoàng Văn E",
                userEmail: "hoangvane@email.com",
                userAvatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: "Website bị lỗi không tải được trang",
                lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
                unreadCount: 1,
                isOnline: false,
                status: "pending",
                messages: [
                    {
                        id: 9,
                        senderId: 5,
                        senderType: "user",
                        message: "Website bị lỗi không tải được trang lịch sử giao dịch",
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                        status: "delivered",
                    },
                ],
            },
        ]

        mockConversations.forEach((conv) => {
            this.conversations.set(conv.id, conv)
        })

        this.renderConversationsList()
        this.updateCounts()
    }

    renderConversationsList() {
        const messagesList = document.getElementById("messagesList")
        messagesList.innerHTML = ""

        const sortedConversations = Array.from(this.conversations.values()).sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
        )

        sortedConversations.forEach((conversation) => {
            const conversationElement = this.createConversationElement(conversation)
            messagesList.appendChild(conversationElement)
        })
    }

    createConversationElement(conversation) {
        const div = document.createElement("div")
        div.className = `conversation-item ${conversation.unreadCount > 0 ? "unread" : ""} ${this.currentChatId === conversation.id ? "active" : ""}`
        div.onclick = () => this.selectConversation(conversation.id)

        const timeAgo = this.getTimeAgo(conversation.lastMessageTime)
        const statusClass = this.getStatusClass(conversation.status)

        div.innerHTML = `
      <div class="conversation-content" style="display:flex; gap: 10px;">
        <div class="conversation-avatar">
          <img src="${conversation.userAvatar}" alt="${conversation.userName}">
        </div>
        <div class="conversation-info">
          <div class="conversation-header">
            <h6 class="conversation-name">${conversation.userName}</h6>
          </div>
          <div class="conversation-preview" style="overflow:hidden;">
            <span class="last-message">${conversation.lastMessage}</span>
          </div>
        </div>
        <span class="status-dot ${statusClass}"></span>
      </div>
    `

        return div
    }

    selectConversation(conversationId) {
        this.currentChatId = conversationId
        const conversation = this.conversations.get(conversationId)

        if (!conversation) return

        document.querySelectorAll(".conversation-item").forEach((item) => {
            item.classList.remove("active")
        })
        event.currentTarget.classList.add("active")

        if (conversation.unreadCount > 0) {
            conversation.unreadCount = 0
            this.renderConversationsList()
            this.updateCounts()
        }

        this.showChatWindow(conversation)
    }

    showChatWindow(conversation) {
        const chatPlaceholder = document.getElementById("chatPlaceholder")
        const chatWindow = document.getElementById("chatWindow")

        chatPlaceholder.style.display = "none"
        chatWindow.style.display = "flex"

        document.getElementById("chatUserAvatar").src = conversation.userAvatar
        document.getElementById("chatUserName").textContent = conversation.userName

        const statusIndicator = document.getElementById("chatUserStatus")
        const statusText = document.getElementById("chatUserStatusText")

        if (conversation.isOnline) {
            statusIndicator.className = "status-indicator online"
            statusText.textContent = "Đang online"
        } else {
            statusIndicator.className = "status-indicator offline"
            statusText.textContent = `Hoạt động ${this.getTimeAgo(conversation.lastMessageTime)}`
        }

        this.loadChatMessages(conversation)
    }

    loadChatMessages(conversation) {
        const messagesArea = document.getElementById("chatMessagesArea")
        messagesArea.innerHTML = ""

        conversation.messages.forEach((message) => {
            const messageElement = this.createMessageElement(message, conversation)
            messagesArea.appendChild(messageElement)
        })

        this.scrollToBottom()
    }

    createMessageElement(message, conversation) {
        const div = document.createElement("div")
        div.className = `chat-message ${message.senderType}`
        div.dataset.messageId = message.id

        const time = this.formatTime(message.timestamp)
        const isAdmin = message.senderType === "admin"

        if (isAdmin) {
            div.innerHTML = `
        <div class="message-content admin">
          <div class="message-avatar">
            <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="Admin">
          </div>
          <div class="message-bubble admin">
            <p>${this.escapeHtml(message.message)}</p>
            <div class="message-meta">
              <span class="message-status ${message.status}">
                <i class="fas ${this.getStatusIcon(message.status)}"></i>
              </span>
            </div>
          </div>
        </div>
      `
        } else {
            div.innerHTML = `
        <div class="message-content user">
          <div class="message-bubble user">
            <p>${this.escapeHtml(message.message)}</p>
            <div class="message-meta">
              <span class="message-time">${time}</span>
            </div>
          </div>
          <div class="message-avatar">
            <img src="${conversation.userAvatar}" alt="${conversation.userName}">
          </div>
        </div>
      `
        }

        return div
    }

    sendMessage() {
        const messageInput = document.getElementById("messageInput")
        const message = messageInput.value.trim()

        if (!message || !this.currentChatId) return

        const conversation = this.conversations.get(this.currentChatId)
        if (!conversation) return

        const newMessage = {
            id: Date.now(),
            senderId: "admin",
            senderType: "admin",
            message: message,
            timestamp: new Date(),
            status: "sent",
        }

        conversation.messages.push(newMessage)
        conversation.lastMessage = message
        conversation.lastMessageTime = new Date()

        messageInput.value = ""
        this.autoResizeTextarea()

        this.loadChatMessages(conversation)
        this.renderConversationsList()

        this.sendMessageViaWebSocket(newMessage, conversation)

        setTimeout(() => {
            newMessage.status = "delivered"
            this.updateMessageStatus(newMessage.id, "delivered")
        }, 1000)

        setTimeout(() => {
            newMessage.status = "read"
            this.updateMessageStatus(newMessage.id, "read")
        }, 3000)
    }

    sendMessageViaWebSocket(message, conversation) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
                JSON.stringify({
                    type: "admin_message",
                    conversationId: conversation.id,
                    userId: conversation.userId,
                    message: message.message,
                    timestamp: message.timestamp.toISOString(),
                }),
            )
        }
    }

    handleTyping() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentChatId) {
            this.ws.send(
                JSON.stringify({
                    type: "admin_typing",
                    conversationId: this.currentChatId,
                }),
            )
        }

        this.typingTimeout = setTimeout(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentChatId) {
                this.ws.send(
                    JSON.stringify({
                        type: "admin_stop_typing",
                        conversationId: this.currentChatId,
                    }),
                )
            }
        }, 1000)
    }

    insertQuickResponse(response) {
        const messageInput = document.getElementById("messageInput")
        messageInput.value = response
        messageInput.focus()
        this.autoResizeTextarea()
    }

    autoResizeTextarea() {
        const textarea = document.getElementById("messageInput")
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
    }

    filterConversations(searchTerm) {
        const conversations = document.querySelectorAll(".conversation-item")

        conversations.forEach((conv) => {
            const name = conv.querySelector(".conversation-name").textContent.toLowerCase()
            const message = conv.querySelector(".last-message").textContent.toLowerCase()

            if (name.includes(searchTerm.toLowerCase()) || message.includes(searchTerm.toLowerCase())) {
                conv.style.display = "block"
            } else {
                conv.style.display = "none"
            }
        })
    }

    setActiveFilter(filter) {
        document.querySelectorAll(".filter-tab").forEach((tab) => {
            tab.classList.remove("active")
        })
        document.querySelector(`[data-filter="${filter}"]`).classList.add("active")

        const conversations = document.querySelectorAll(".conversation-item")

        conversations.forEach((conv) => {
            const conversation = Array.from(this.conversations.values()).find((c) => conv.onclick.toString().includes(c.id))

            if (!conversation) return

            let show = false
            switch (filter) {
                case "all":
                    show = true
                    break
                case "unread":
                    show = conversation.unreadCount > 0
                    break
                case "online":
                    show = conversation.isOnline
                    break
            }

            conv.style.display = show ? "block" : "none"
        })
    }

    updateCounts() {
        const allCount = this.conversations.size
        const unreadCount = Array.from(this.conversations.values()).reduce(
            (sum, conv) => sum + (conv.unreadCount > 0 ? 1 : 0),
            0,
        )
        const onlineCount = Array.from(this.conversations.values()).reduce((sum, conv) => sum + (conv.isOnline ? 1 : 0), 0)

        document.getElementById("allCount").textContent = allCount
        document.getElementById("unreadCount").textContent = unreadCount
        document.getElementById("onlineCount").textContent = onlineCount
        document.getElementById("messagesBadge").textContent = unreadCount
    }

    connectWebSocket() {
        try {
            this.ws = new WebSocket("ws://localhost:3001/admin/chat")

            this.ws.onopen = () => {
                console.log("Admin WebSocket connected")
            }

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                this.handleWebSocketMessage(data)
            }

            this.ws.onclose = () => {
                console.log("Admin WebSocket disconnected")
                setTimeout(() => this.connectWebSocket(), 5000)
            }

            this.ws.onerror = (error) => {
                console.error("Admin WebSocket error:", error)
            }
        } catch (error) {
            console.error("WebSocket connection failed:", error)
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case "new_message":
                this.handleNewMessage(data)
                break
            case "user_typing":
                this.showUserTyping(data.conversationId)
                break
            case "user_stop_typing":
                this.hideUserTyping()
                break
            case "user_online":
                this.updateUserStatus(data.userId, true)
                break
            case "user_offline":
                this.updateUserStatus(data.userId, false)
                break
        }
    }

    handleNewMessage(data) {
        let conversation = this.conversations.get(`user_${data.userId}`)

        if (!conversation) {
            conversation = {
                id: `user_${data.userId}`,
                userId: data.userId,
                userName: data.userName || "Khách hàng mới",
                userEmail: data.userEmail || "",
                userAvatar: data.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
                lastMessage: data.message,
                lastMessageTime: new Date(data.timestamp),
                unreadCount: 1,
                isOnline: true,
                status: "pending",
                messages: [],
            }
            this.conversations.set(conversation.id, conversation)
        }

        const newMessage = {
            id: data.messageId || Date.now(),
            senderId: data.userId,
            senderType: "user",
            message: data.message,
            timestamp: new Date(data.timestamp),
            status: "delivered",
        }

        conversation.messages.push(newMessage)
        conversation.lastMessage = data.message
        conversation.lastMessageTime = new Date(data.timestamp)

        if (this.currentChatId !== conversation.id) {
            conversation.unreadCount++
        }

        this.renderConversationsList()
        this.updateCounts()

        if (this.currentChatId === conversation.id) {
            this.loadChatMessages(conversation)
        }

        this.showNotification(`Tin nhắn mới từ ${conversation.userName}`, data.message)
    }

    showUserTyping(conversationId) {
        if (this.currentChatId === conversationId) {
            document.getElementById("chatTypingIndicator").style.display = "flex"
            this.scrollToBottom()
        }
    }

    hideUserTyping() {
        document.getElementById("chatTypingIndicator").style.display = "none"
    }

    updateUserStatus(userId, isOnline) {
        const conversation = Array.from(this.conversations.values()).find((c) => c.userId === userId)

        if (conversation) {
            conversation.isOnline = isOnline
            this.renderConversationsList()

            if (this.currentChatId === conversation.id) {
                this.showChatWindow(conversation)
            }
        }
    }

    updateMessageStatus(messageId, status) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
        if (messageElement) {
            const statusIcon = messageElement.querySelector(".message-status i")
            if (statusIcon) {
                statusIcon.className = `fas ${this.getStatusIcon(status)}`
            }
        }
    }

    showNotification(title, message) {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: message,
                icon: "/placeholder.svg?height=64&width=64&text=PBD",
            })
        }
    }

    startPeriodicUpdates() {
        setInterval(() => {
            this.updateOnlineStatus()
        }, 30000)

        if (Notification.permission === "default") {
            Notification.requestPermission()
        }
    }

    updateOnlineStatus() {
        this.conversations.forEach((conversation) => {
            if (Math.random() < 0.1) {
                conversation.isOnline = !conversation.isOnline
            }
        })
        this.renderConversationsList()
        this.updateCounts()
    }

    scrollToBottom() {
        const messagesArea = document.getElementById("chatMessagesArea")
        messagesArea.scrollTop = messagesArea.scrollHeight
    }

    getTimeAgo(date) {
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffMinutes < 1) return "Vừa xong"
        if (diffMinutes < 60) return `${diffMinutes} phút trước`
        if (diffHours < 24) return `${diffHours} giờ trước`
        if (diffDays < 7) return `${diffDays} ngày trước`
        return date.toLocaleDateString("vi-VN")
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    getStatusClass(status) {
        const classes = {
            active: "status-active",
            pending: "status-pending",
            resolved: "status-resolved",
            closed: "status-closed",
        }
        return classes[status] || "status-pending"
    }

    getStatusIcon(status) {
        const icons = {
            sent: "fa-check",
            delivered: "fa-check-double",
            read: "fa-check-double",
        }
        return icons[status] || "fa-clock"
    }

    escapeHtml(text) {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    }

    markAllAsRead() {
        let unreadCount = 0
        this.conversations.forEach((conversation) => {
            if (conversation.unreadCount > 0) {
                unreadCount += conversation.unreadCount
                conversation.unreadCount = 0
            }
        })

        this.renderConversationsList()
        this.updateCounts()

        if (unreadCount > 0) {
            this.showToast(`Đã đánh dấu ${unreadCount} tin nhắn là đã đọc!`, "success")
        } else {
            this.showToast("Không có tin nhắn chưa đọc nào!", "info")
        }
    }

    refreshMessages() {
        const refreshBtn = document.querySelector('[onclick="refreshMessages()"]')
        const icon = refreshBtn.querySelector("i")

        icon.classList.add("fa-spin")
        refreshBtn.disabled = true

        this.showToast("Đang làm mới danh sách tin nhắn...", "info")

        setTimeout(() => {
            this.loadConversations()
            icon.classList.remove("fa-spin")
            refreshBtn.disabled = false
            this.showToast("Đã làm mới danh sách tin nhắn thành công!", "success")
        }, 1500)
    }

    viewUserProfile() {
        if (!this.currentChatId) return

        const conversation = this.conversations.get(this.currentChatId)
        if (!conversation) return

        const modal = new this.bootstrap.Modal(document.getElementById("userProfileModal"))
        const content = document.getElementById("userProfileContent")

        content.innerHTML = `
      <div class="row">
        <div class="col-md-4 text-center">
          <img src="${conversation.userAvatar}" alt="${conversation.userName}" class="profile-avatar-large mb-3">
          <div class="user-status-badge ${conversation.isOnline ? "online" : "offline"}">
            <i class="fas fa-circle"></i>
            ${conversation.isOnline ? "Đang online" : "Offline"}
          </div>
        </div>
        <div class="col-md-8">
          <h5>${conversation.userName}</h5>
          <p class="text-muted">${conversation.userEmail}</p>
          
          <div class="user-stats mt-4">
            <div class="row">
              <div class="col-6">
                <div class="stat-item">
                  <h6>Tin nhắn</h6>
                  <span class="stat-value">${conversation.messages.length}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-item">
                  <h6>Trạng thái</h6>
                  <span class="stat-value">${this.getStatusText(conversation.status)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="user-info mt-4">
            <h6>Thông tin bổ sung</h6>
            <p><strong>ID:</strong> ${conversation.userId}</p>
            <p><strong>Lần cuối online:</strong> ${this.formatTime(conversation.lastMessageTime)}</p>
            <p><strong>Tham gia:</strong> ${new Date().toLocaleDateString("vi-VN")}</p>
          </div>
        </div>
      </div>
    `

        modal.show()
    }

    addNote() {
        if (!this.currentChatId) return

        const modal = new this.bootstrap.Modal(document.getElementById("addNoteModal"))
        document.getElementById("noteContent").value = ""
        modal.show()
    }

    saveNote() {
        const noteContent = document.getElementById("noteContent").value.trim()
        const isPrivate = document.getElementById("privateNote").checked

        if (!noteContent) {
            this.showToast("Vui lòng nhập nội dung ghi chú!", "warning")
            return
        }

        this.showToast("Đã lưu ghi chú thành công!", "success")

        const modal = this.bootstrap.Modal.getInstance(document.getElementById("addNoteModal"))
        modal.hide()
    }

    blockUser() {
        if (!this.currentChatId) return

        const conversation = this.conversations.get(this.currentChatId)
        if (!conversation) return

        if (confirm(`Bạn có chắc chắn muốn chặn người dùng ${conversation.userName}?`)) {
            this.showToast(`Đã chặn người dùng ${conversation.userName}!`, "success")
        }
    }

    attachFile() {
        const modal = new this.bootstrap.Modal(document.getElementById("fileUploadModal"))
        document.getElementById("fileInput").value = ""
        document.getElementById("filePreview").innerHTML = ""
        modal.show()
    }

    previewFiles(files) {
        const preview = document.getElementById("filePreview")
        preview.innerHTML = ""

        Array.from(files).forEach((file) => {
            const fileItem = document.createElement("div")
            fileItem.className = "file-item"
            fileItem.innerHTML = `
        <div class="file-info">
          <i class="fas ${this.getFileIcon(file.type)}"></i>
          <span class="file-name">${file.name}</span>
          <span class="file-size">(${this.formatFileSize(file.size)})</span>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `
            preview.appendChild(fileItem)
        })
    }

    uploadFiles() {
        const files = document.getElementById("fileInput").files
        if (files.length === 0) return

        this.showToast(`Đang tải lên ${files.length} file...`, "info")

        setTimeout(() => {
            this.showToast("Đã tải lên file thành công!", "success")
            const modal = this.bootstrap.Modal.getInstance(document.getElementById("fileUploadModal"))
            modal.hide()
        }, 2000)
    }

    addEmoji() {
        const messageInput = document.getElementById("messageInput")
        const emojis = ["😊", "👍", "❤️", "😂", "🎉", "👏", "🔥", "💯"]
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        messageInput.value += randomEmoji
        messageInput.focus()
    }

    getFileIcon(mimeType) {
        if (mimeType.startsWith("image/")) return "fa-image"
        if (mimeType.startsWith("video/")) return "fa-video"
        if (mimeType.startsWith("audio/")) return "fa-music"
        if (mimeType.includes("pdf")) return "fa-file-pdf"
        if (mimeType.includes("word")) return "fa-file-word"
        if (mimeType.includes("excel")) return "fa-file-excel"
        return "fa-file"
    }

    formatFileSize(bytes) {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    getStatusText(status) {
        const texts = {
            active: "Đang hoạt động",
            pending: "Chờ xử lý",
            resolved: "Đã giải quyết",
            closed: "Đã đóng",
        }
        return texts[status] || "Không xác định"
    }

    showToast(message, type = "info") {
        const toastContainer = document.getElementById("toast-container") || this.createToastContainer()
        const toastId = "toast-" + Date.now()

        const bgClass =
            type === "success"
                ? "bg-success"
                : type === "danger"
                    ? "bg-danger"
                    : type === "warning"
                        ? "bg-warning"
                        : "bg-info"
        const iconClass =
            type === "success"
                ? "fa-check-circle"
                : type === "danger"
                    ? "fa-exclamation-circle"
                    : type === "warning"
                        ? "fa-exclamation-triangle"
                        : "fa-info-circle"

        const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `

        toastContainer.insertAdjacentHTML("beforeend", toastHtml)
        const toastElement = document.getElementById(toastId)
        const toast = new this.bootstrap.Toast(toastElement)
        toast.show()

        toastElement.addEventListener("hidden.bs.toast", () => {
            toastElement.remove()
        })
    }

    createToastContainer() {
        const container = document.createElement("div")
        container.id = "toast-container"
        container.className = "toast-container position-fixed top-0 end-0 p-3"
        container.style.zIndex = "9999"
        document.body.appendChild(container)
        return container
    }
}

// Global functions for HTML onclick handlers
let adminMessenger

function markAllAsRead() {
    adminMessenger.markAllAsRead()
}

function refreshMessages() {
    adminMessenger.refreshMessages()
}

function viewUserProfile() {
    adminMessenger.viewUserProfile()
}

function addNote() {
    adminMessenger.addNote()
}

function saveNote() {
    adminMessenger.saveNote()
}

function blockUser() {
    adminMessenger.blockUser()
}

function attachFile() {
    adminMessenger.attachFile()
}

function uploadFiles() {
    adminMessenger.uploadFiles()
}

function addEmoji() {
    adminMessenger.addEmoji()
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    adminMessenger = new AdminMessenger()
})
