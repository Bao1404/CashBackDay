// Wallets Page JavaScript

// Mock wallet data
const mockWallets = [
    {
        id: "wallet1",
        name: "Tài Khoản Chính",
        type: "bank",
        address: "1234567890",
        balance: 2850000,
        description: "Vietcombank - Chi nhánh Quận 1",
        isDefault: true,
        createdAt: "2024-01-15",
    },
    {
        id: "wallet2",
        name: "Ví MoMo",
        type: "momo",
        address: "0901234567",
        balance: 400000,
        description: "Ví điện tử MoMo",
        isDefault: false,
        createdAt: "2024-01-18",
    },
    {
        id: "wallet3",
        name: "Ví Crypto",
        type: "crypto",
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        balance: 0,
        description: "Bitcoin Wallet",
        isDefault: false,
        createdAt: "2024-01-20",
    },
]

// Mock recent transactions
const mockRecentTransactions = [
    {
        id: "wt1",
        date: "2024-01-22 14:30:00",
        type: "deposit",
        wallet: "Tài Khoản Chính",
        amount: 150000,
        status: "completed",
    },
    {
        id: "wt2",
        date: "2024-01-22 10:15:00",
        type: "withdraw",
        wallet: "Ví MoMo",
        amount: -100000,
        status: "completed",
    },
    {
        id: "wt3",
        date: "2024-01-21 16:45:00",
        type: "deposit",
        wallet: "Tài Khoản Chính",
        amount: 200000,
        status: "pending",
    },
]

// Declare variables
// Use the global functions from script.js
const { formatCurrency, formatDate, showToast, generateId, validatePhone, showLoading, hideLoading } =
    window.PaybackDay || {
        formatCurrency: (amount) => amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        formatDate: (date) => new Date(date).toLocaleString("vi-VN"),
        showToast: (message, type) => alert(`${type}: ${message}`),
        generateId: () => Math.random().toString(36).substr(2, 9),
        validatePhone: (phone) => /^\d{10}$/.test(phone),
        showLoading: (btn) => {
            const originalText = btn.textContent
            btn.textContent = "Đang xử lý..."
            btn.disabled = true
            return originalText
        },
        hideLoading: (btn, originalText) => {
            btn.textContent = originalText
            btn.disabled = false
        },
    }

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    // Initialize page after DOM is loaded
    setTimeout(() => {
        loadWallets()
        loadRecentTransactions()
        setupEventListeners()
    }, 100)
})

// Load and display wallets
function loadWallets() {
    const container = document.getElementById("walletContainer")
    container.innerHTML = ""

    mockWallets.forEach((wallet) => {
        const walletCard = createWalletCard(wallet)
        container.appendChild(walletCard)
    })
}

// Create wallet card
function createWalletCard(wallet) {
    const col = document.createElement("div")
    col.className = "col-md-6 col-lg-4 mb-4"

    const typeClass = getWalletTypeClass(wallet.type)
    const typeIcon = getWalletTypeIcon(wallet.type)

    col.innerHTML = `
    <div class="wallet-card ${typeClass}">
      <div class="card-body position-relative" style="padding: 30px;">
        ${wallet.isDefault ? '<div class="position-absolute top-0" style="margin-top: 5px;"><span class="badge bg-warning text-dark">Mặc định</span></div>' : ""}
        
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div class="wallet-info">
            <h5 class="wallet-name">${wallet.name}</h5>
            <small class="wallet-description">${wallet.description}</small>
          </div>
          <div class="wallet-icon">
            <i class="${typeIcon}"></i>
          </div>
        </div>
        
        <div class="wallet-balance mb-3">
          <small class="balance-label">Số dư khả dụng</small>
          <h3 class="balance-amount">${formatCurrency(wallet.balance)}</h3>
        </div>
        
        <div class="wallet-address mb-3">
          <small class="address-label">Địa chỉ/Số tài khoản</small>
          <div class="d-flex align-items-center">
            <code class="wallet-address-code flex-grow-1">${maskAddress(wallet.address)}</code>
            <button class="btn btn-sm btn-outline-warning ms-2" onclick="copyToClipboard('${wallet.address}')">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
        
        <div class="wallet-actions d-flex gap-2">
          <button class="btn btn-warning btn-sm flex-fill" onclick="openWithdrawModal('${wallet.id}')">
            <i class="fas fa-arrow-up me-1"></i>Rút
          </button>
          <button class="btn btn-outline-warning btn-sm" onclick="editWallet('${wallet.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="deleteWallet('${wallet.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `

    return col
}

// Get wallet type CSS class
function getWalletTypeClass(type) {
    const classMap = {
        bank: "bank",
        momo: "momo",
        zalopay: "zalopay",
        crypto: "crypto",
    }
    return classMap[type] || "bank"
}

// Get wallet type icon
function getWalletTypeIcon(type) {
    const iconMap = {
        bank: "fas fa-university",
        momo: "fas fa-mobile-alt",
        zalopay: "fas fa-wallet",
        crypto: "fab fa-bitcoin",
    }
    return iconMap[type] || "fas fa-wallet"
}

// Mask address for security
function maskAddress(address) {
    if (address.length <= 8) return address
    return address.substring(0, 4) + "****" + address.substring(address.length - 4)
}

// Load recent transactions
function loadRecentTransactions() {
    const tbody = document.getElementById("recentTransactionsBody")
    tbody.innerHTML = ""

    mockRecentTransactions.forEach((transaction) => {
        const row = createTransactionRow(transaction)
        tbody.appendChild(row)
    })
}

// Create transaction row
function createTransactionRow(transaction) {
    const row = document.createElement("tr")
    const typeText = transaction.type === "deposit" ? "Nạp tiền" : "Rút tiền"
    const amountClass = transaction.amount > 0 ? "text-success" : "text-danger"

    row.innerHTML = `
        <td>${formatDate(transaction.date)}</td>
        <td>
            <span class="badge ${transaction.type === "deposit" ? "bg-success" : "bg-warning"} text-dark">
                ${typeText}
            </span>
        </td>
        <td>${transaction.wallet}</td>
        <td class="${amountClass} fw-bold">${formatCurrency(Math.abs(transaction.amount))}</td>
        <td>
            <span class="status-${transaction.status}">
                ${getStatusText(transaction.status)}
            </span>
        </td>
    `

    return row
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        completed: "Hoàn thành",
        pending: "Đang xử lý",
        failed: "Thất bại",
    }
    return statusMap[status] || status
}

// Setup event listeners
function setupEventListeners() {
    // Add wallet form
    document.getElementById("addWalletForm").addEventListener("submit", (e) => {
        e.preventDefault()
        addWallet()
    })

    // Withdraw form
    document.getElementById("withdrawForm").addEventListener("submit", (e) => {
        e.preventDefault()
        processWithdraw()
    })
}

// Add new wallet
function addWallet() {
    const name = document.getElementById("walletName").value
    const type = document.getElementById("walletType").value
    const address = document.getElementById("walletAddress").value
    const description = document.getElementById("walletDescription").value

    if (!name || !type || !address) {
        showToast("Vui lòng điền đầy đủ thông tin!", "danger")
        return
    }

    // Validate address based on type
    if (!validateWalletAddress(type, address)) {
        showToast("Địa chỉ/Số tài khoản không hợp lệ!", "danger")
        return
    }

    const newWallet = {
        id: generateId(),
        name,
        type,
        address,
        balance: 0,
        description: description || getDefaultDescription(type),
        isDefault: false,
        createdAt: new Date().toISOString(),
    }

    mockWallets.push(newWallet)
    loadWallets()

    // Close modal and reset form
    const modal = document.getElementById("addWalletModal")
    modal.style.display = "none"
    document.getElementById("addWalletForm").reset()

    showToast("Thêm ví thành công!", "success")
}

// Validate wallet address
function validateWalletAddress(type, address) {
    switch (type) {
        case "bank":
            return /^\d{8,20}$/.test(address)
        case "momo":
        case "zalopay":
            return validatePhone(address)
        case "crypto":
            return address.length >= 26 && address.length <= 62
        default:
            return true
    }
}

// Get default description
function getDefaultDescription(type) {
    const descriptions = {
        bank: "Tài khoản ngân hàng",
        momo: "Ví điện tử MoMo",
        zalopay: "Ví điện tử ZaloPay",
        crypto: "Ví tiền điện tử",
    }
    return descriptions[type] || "Ví thanh toán"
}

// Open withdraw modal
function openWithdrawModal(walletId) {
    const wallet = mockWallets.find((w) => w.id === walletId)
    if (!wallet) return

    // Populate wallet options
    const select = document.getElementById("withdrawWallet")
    select.innerHTML = ""

    mockWallets.forEach((w) => {
        if (w.balance > 0) {
            const option = document.createElement("option")
            option.value = w.id
            option.textContent = `${w.name} (${formatCurrency(w.balance)})`
            if (w.id === walletId) option.selected = true
            select.appendChild(option)
        }
    })

    const modal = document.getElementById("withdrawModal")
    modal.style.display = "block"
}

// Process withdraw
function processWithdraw() {
    const walletId = document.getElementById("withdrawWallet").value
    const amount = Number.parseInt(document.getElementById("withdrawAmount").value)
    const note = document.getElementById("withdrawNote").value

    if (!walletId || !amount) {
        showToast("Vui lòng điền đầy đủ thông tin!", "danger")
        return
    }

    if (amount < 50000) {
        showToast("Số tiền tối thiểu là 50,000 VNĐ!", "danger")
        return
    }

    const wallet = mockWallets.find((w) => w.id === walletId)
    if (!wallet || wallet.balance < amount) {
        showToast("Số dư không đủ!", "danger")
        return
    }

    // Simulate withdraw process
    const btn = document.querySelector("#withdrawModal .btn-success")
    const originalText = showLoading(btn)

    setTimeout(() => {
        // Update wallet balance
        wallet.balance -= amount

        // Add transaction record
        mockRecentTransactions.unshift({
            id: generateId(),
            date: new Date().toISOString(),
            type: "withdraw",
            wallet: wallet.name,
            amount: -amount,
            status: "pending",
        })

        // Refresh displays
        loadWallets()
        loadRecentTransactions()

        // Close modal and reset form
        const modal = document.getElementById("withdrawModal")
        modal.style.display = "none"
        document.getElementById("withdrawForm").reset()

        hideLoading(btn, originalText)
        showToast("Yêu cầu rút tiền đã được gửi!", "success")
    }, 2000)
}

// Edit wallet
function editWallet(walletId) {
    showToast("Tính năng chỉnh sửa ví sẽ được cập nhật sớm!", "info")
}

// Delete wallet
function deleteWallet(walletId) {
    if (confirm("Bạn có chắc chắn muốn xóa ví này?")) {
        const index = mockWallets.findIndex((w) => w.id === walletId)
        if (index > -1) {
            mockWallets.splice(index, 1)
            loadWallets()
            showToast("Đã xóa ví thành công!", "success")
        }
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        () => {
            showToast("Đã sao chép địa chỉ!", "success")
        },
        (err) => {
            console.error("Could not copy text: ", err)
            showToast("Không thể sao chép địa chỉ!", "danger")
        },
    )
}
