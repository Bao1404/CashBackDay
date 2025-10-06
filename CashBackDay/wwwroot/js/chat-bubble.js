// User Chat Bubble System with Enhanced Animations
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chathub")
    .build();

connection.start().then(() => {
    console.log("User connected to SignalR!");
});

connection.on("ReceiveMessage", (sender, message, time) => {
    addMessageToChat(sender, message, time, "admin");
});

function sendUserMessage(message) {
    connection.invoke("SendMessageToAdmin", message)
        .catch(err => console.error(err));
}
class UserChatBubble {
    constructor() {
        this.isOpen = false
        this.unreadCount = 0
        this.messages = []
        this.isTyping = false
        this.currentUser = this.getCurrentUser()
        this.typingTimeout = null
        this.init()
    }

    getCurrentUser() {
        return {
            id: localStorage.getItem("userId") || "guest_" + Date.now(),
            name: localStorage.getItem("userName") || "Khách hàng",
            email: localStorage.getItem("userEmail") || "",
        }
    }

    init() {
        this.createChatBubble()
        this.loadMessages()
        this.bindEvents()
        this.startAutoResponder()
    }

    createChatBubble() {
        const chatHTML = `
      <div id="userChatBubble" class="user-chat-bubble">
        <div class="chat-bubble-toggle" onclick="window.userChatBubble.toggleChat()">
          <i class="fas fa-comments"></i>
          <div class="chat-notification-badge" id="chatNotificationBadge">0</div>
        </div>
        
        <div class="chat-bubble-window" id="chatBubbleWindow">
          <div class="chat-bubble-header">
            <div>
              <h6>💬 Hỗ trợ PaybackDay</h6>
              <small>🟢 Chúng tôi luôn sẵn sàng hỗ trợ bạn</small>
            </div>
            <button class="chat-bubble-close" onclick="window.userChatBubble.closeChat()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="chat-bubble-messages" id="chatBubbleMessages">
            <div class="chat-bubble-message admin">
              <div class="message-bubble admin">
                Xin chào! 👋 Tôi có thể giúp gì cho bạn hôm nay?
                <span class="message-time">Vừa xong</span>
              </div>
            </div>
          </div>
          
          <div class="chat-typing-indicator" id="chatTypingIndicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="typing-text">Admin đang nhập...</span>
          </div>
          
          <div class="chat-bubble-input-area">
            <div class="chat-bubble-input-wrapper">
              <textarea 
                type="text" 
                id="chatBubbleInput" 
                class="chat-bubble-input" 
                placeholder="Nhập tin nhắn của bạn..."
                rows="1"
                onkeypress="window.userChatBubble.handleKeyPress(event)"
              ></textarea>
              <button class="chat-bubble-send" onclick="window.userChatBubble.sendMessage()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `

        document.body.insertAdjacentHTML("beforeend", chatHTML)
    }

    bindEvents() {
        // Auto-resize textarea
        const input = document.getElementById("chatBubbleInput")
        input.addEventListener("input", () => {
            input.style.height = "auto"
            input.style.height = Math.min(input.scrollHeight, 100) + "px"
        })

        // Click outside to close
        document.addEventListener("click", (e) => {
            const chatBubble = document.querySelector(".user-chat-bubble")
            if (!chatBubble.contains(e.target) && this.isOpen) {
                this.closeChat()
            }
        })
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat()
        } else {
            this.openChat()
        }
    }

    openChat() {
        const window = document.getElementById("chatBubbleWindow")
        const toggle = document.querySelector(".chat-bubble-toggle")

        window.classList.add("show")
        toggle.classList.add("active")
        this.isOpen = true

        // Reset unread count
        this.unreadCount = 0
        this.updateNotificationBadge()

        // Focus input
        setTimeout(() => {
            document.getElementById("chatBubbleInput").focus()
        }, 300)

        // Scroll to bottom
        this.scrollToBottom()
    }

    closeChat() {
        const window = document.getElementById("chatBubbleWindow")
        const toggle = document.querySelector(".chat-bubble-toggle")

        window.classList.remove("show")
        toggle.classList.remove("active")
        this.isOpen = false
    }

    handleKeyPress(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            this.sendMessage()
        }
    }

    sendMessage() {
        const input = document.getElementById("chatBubbleInput")
        const message = input.value.trim()

        if (!message) return

        // Add user message with animation
        this.addMessage(message, "user")
        input.value = ""
        input.style.height = "auto"

        // Show typing indicator with delay
        setTimeout(() => {
            this.showTypingIndicator()
        }, 10)

        // Simulate admin response with realistic delay
        setTimeout(
            () => {
                this.hideTypingIndicator()
                this.generateAutoResponse(message)
            },
            1000 + Math.random() * 2000,
        )
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById("chatBubbleMessages")
        const time = new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })

        const messageHTML = `
      <div class="chat-bubble-message ${sender}">
        <div class="message-bubble ${sender}">
          ${text}
          <span class="message-time">${time}</span>
        </div>
      </div>
    `

        messagesContainer.insertAdjacentHTML("beforeend", messageHTML)
        this.scrollToBottom()

        // Add to messages array
        this.messages.push({ text, sender, time })

        // Update notification if chat is closed
        if (!this.isOpen && sender === "admin") {
            this.unreadCount++
            this.updateNotificationBadge()
        }

        // Save messages to localStorage
        this.saveMessages()
    }

    showTypingIndicator() {
        const indicator = document.getElementById("chatTypingIndicator")
        indicator.style.display = "flex"
        this.isTyping = true
        this.scrollToBottom()
    }

    hideTypingIndicator() {
        const indicator = document.getElementById("chatTypingIndicator")
        indicator.style.display = "none"
        this.isTyping = false
    }

    generateAutoResponse(userMessage) {
        const responses = {
            // Greetings
            "xin chào": "Xin chào! Rất vui được hỗ trợ bạn. Bạn cần giúp đỡ gì ạ?",
            hello: "Hello! Tôi có thể giúp gì cho bạn?",
            chào: "Chào bạn! Tôi là trợ lý ảo của PaybackDay. Có gì tôi có thể hỗ trợ không?",

            // Account related
            "tài khoản":
                'Về vấn đề tài khoản, bạn có thể:\n• Xem thông tin trong mục "Hồ sơ"\n• Liên hệ hotline 1900 123 456\n• Gửi email support@paybackday.vn',
            "đăng ký":
                'Để đăng ký tài khoản PaybackDay:\n1. Nhấn "Đăng ký" ở góc phải\n2. Điền thông tin cá nhân\n3. Xác thực email\n4. Hoàn tất!',
            "đăng nhập":
                "Nếu gặp vấn đề đăng nhập:\n• Kiểm tra email/mật khẩu\n• Thử reset mật khẩu\n• Liên hệ hỗ trợ nếu cần",

            // Refund related
            "hoàn tiền":
                'Về hoàn tiền:\n• Thời gian: 24-48h sau giao dịch\n• Tỷ lệ: 25-35% phí giao dịch\n• Xem chi tiết trong "Lịch sử"',
            tiền: "PaybackDay hoàn lại 25-35% phí giao dịch chứng khoán. Bạn muốn biết thêm về điều gì?",

            // Exchange related
            sàn: "Chúng tôi hỗ trợ:\n• VPS Securities (30% hoàn)\n• SSI Securities (25% hoàn)\n• HSC Securities (35% hoàn)\n• Và nhiều sàn khác!",
            "kết nối":
                'Để kết nối sàn giao dịch:\n1. Vào mục "Sàn giao dịch"\n2. Chọn sàn muốn kết nối\n3. Nhập thông tin đăng nhập\n4. Xác thực và hoàn tất',

            // Support
            "hỗ trợ":
                "Chúng tôi hỗ trợ 24/7 qua:\n📞 Hotline: 1900 123 456\n📧 Email: support@paybackday.vn\n💬 Chat này\n🕐 Giờ hành chính: 8h-18h",
            "liên hệ":
                'Bạn có thể liên hệ:\n• Chat trực tuyến (hiện tại)\n• Hotline: 1900 123 456\n• Email: support@paybackday.vn\n• Trang "Liên hệ"',

            // How to use
            "cách dùng":
                "Cách sử dụng PaybackDay:\n1. Đăng ký tài khoản\n2. Kết nối sàn giao dịch\n3. Giao dịch bình thường\n4. Nhận hoàn tiền tự động!",
            "hướng dẫn":
                'Xem video hướng dẫn chi tiết tại mục "Hướng dẫn" hoặc tôi có thể giải thích cụ thể điều gì bạn muốn biết?',

            // Security
            "bảo mật":
                "PaybackDay đảm bảo bảo mật:\n🔒 Mã hóa SSL 256-bit\n🔐 Xác thực 2 bước\n🛡️ Không lưu mật khẩu\n✅ Tuân thủ chuẩn quốc tế",
            "an toàn": "Hoàn toàn an toàn! Chúng tôi chỉ đọc dữ liệu giao dịch, không can thiệp vào tài khoản của bạn.",

            // Fees
            phí: "PaybackDay hoàn toàn MIỄN PHÍ! Chúng tôi chỉ nhận hoa hồng từ sàn giao dịch và chia sẻ lại cho bạn.",
            "miễn phí": "Đúng vậy! PaybackDay hoàn toàn miễn phí cho người dùng. Bạn chỉ có lợi, không mất gì cả! 😊",

            // Wallet
            ví: "Về ví PaybackDay:\n💰 Quản lý số dư\n💸 Rút tiền về ngân hàng\n📊 Theo dõi giao dịch\n🔄 Chuyển tiền nhanh chóng",
            "rút tiền":
                "Rút tiền từ ví:\n• Phí: 5,000 VNĐ/lần\n• Thời gian: 1-3 ngày\n• Tối thiểu: 50,000 VNĐ\n• Hỗ trợ các ngân hàng lớn",

            // Default responses
            default: [
                'Tôi hiểu bạn đang hỏi về "{query}". Bạn có thể liên hệ hotline 1900 123 456 để được hỗ trợ chi tiết hơn.',
                'Về vấn đề này, tôi khuyên bạn nên xem mục "Hướng dẫn" hoặc liên hệ đội ngũ hỗ trợ.',
                "Cảm ơn câu hỏi của bạn! Để được hỗ trợ tốt nhất, vui lòng liên hệ support@paybackday.vn",
                "Tôi sẽ chuyển câu hỏi này đến đội ngũ chuyên môn. Bạn có thể để lại thông tin liên hệ không?",
            ],
        }

        let response = ""
        const query = userMessage.toLowerCase()

        // Find matching response
        for (const [key, value] of Object.entries(responses)) {
            if (key !== "default" && query.includes(key)) {
                response = value
                break
            }
        }

        // Use default response if no match
        if (!response) {
            const defaultResponses = responses.default
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)].replace("{query}", userMessage)
        }

        this.addMessage(response, "admin")
    }

    updateNotificationBadge() {
        const badge = document.getElementById("chatNotificationBadge")
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount > 99 ? "99+" : this.unreadCount
            badge.style.display = "flex"
        } else {
            badge.style.display = "none"
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById("chatBubbleMessages")
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight
        }, 100)
    }

    loadMessages() {
        // Load saved messages from localStorage
        const saved = localStorage.getItem("paybackday_chat_messages")
        if (saved) {
            this.messages = JSON.parse(saved)
            this.renderMessages()
        }
    }

    saveMessages() {
        localStorage.setItem("paybackday_chat_messages", JSON.stringify(this.messages))
    }

    renderMessages() {
        const messagesContainer = document.getElementById("chatBubbleMessages")
        messagesContainer.innerHTML = ""

        this.messages.forEach((msg) => {
            const messageHTML = `
        <div class="chat-bubble-message ${msg.sender}">
          <div class="message-bubble ${msg.sender}">
            ${msg.text}
            <span class="message-time">${msg.time}</span>
          </div>
        </div>
      `
            messagesContainer.insertAdjacentHTML("beforeend", messageHTML)
        })

        this.scrollToBottom()
    }

    startAutoResponder() {
        // Simulate receiving messages occasionally
        setInterval(() => {
            if (!this.isOpen && Math.random() < 0.1) {
                // 10% chance every interval
                const promoMessages = [
                    "Bạn có biết PaybackDay đang có chương trình hoàn tiền lên đến 35%? 🎉",
                    "Tip: Kết nối nhiều sàn để tối ưu hóa hoàn tiền! 💡",
                    "Đã kiểm tra số dư ví hôm nay chưa? 💰",
                    "Video hướng dẫn mới đã có! Xem ngay để không bỏ lỡ. 📺",
                ]

                const randomMessage = promoMessages[Math.floor(Math.random() * promoMessages.length)]
                this.addMessage(randomMessage, "admin")
            }
        }, 300000) // Every 5 minutes
    }

    // Public method to open chat from external calls
    openChatExternal() {
        this.openChat()
    }
}

// Initialize chat bubble when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.userChatBubble = new UserChatBubble()
})

// Export for external use
if (typeof module !== "undefined" && module.exports) {
    module.exports = UserChatBubble
}
