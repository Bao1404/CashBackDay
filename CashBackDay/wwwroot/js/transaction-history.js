// Transaction History Page JavaScript
class TransactionHistory {
    constructor() {
        this.transactions = []
        this.filteredTransactions = []
        this.currentPage = 1
        this.itemsPerPage = 10
        this.init()
    }

    init() {
        this.loadTransactions()
        this.bindEvents()
        this.renderTransactions()
        this.updateSummaryCards()
    }

    loadTransactions() {
        // Mock transaction data
        this.transactions = [
            {
                id: "TXN001",
                date: "2024-12-15 14:30:25",
                exchange: "VPS",
                exchangeName: "VPS Securities",
                transactionValue: 2500000,
                fee: 3750,
                refund: 1125,
                status: "completed",
                refundRate: 30,
            },
            {
                id: "TXN002",
                date: "2024-12-14 09:15:10",
                exchange: "SSI",
                exchangeName: "SSI Securities",
                transactionValue: 1800000,
                fee: 2700,
                refund: 675,
                status: "completed",
                refundRate: 25,
            },
            {
                id: "TXN003",
                date: "2024-12-13 16:45:30",
                exchange: "HSC",
                exchangeName: "HSC Securities",
                transactionValue: 3200000,
                fee: 4800,
                refund: 1680,
                status: "pending",
                refundRate: 35,
            },
            {
                id: "TXN004",
                date: "2024-12-12 11:20:15",
                exchange: "VPS",
                exchangeName: "VPS Securities",
                transactionValue: 1500000,
                fee: 2250,
                refund: 675,
                status: "completed",
                refundRate: 30,
            },
            {
                id: "TXN005",
                date: "2024-12-11 08:30:45",
                exchange: "SSI",
                exchangeName: "SSI Securities",
                transactionValue: 2200000,
                fee: 3300,
                refund: 825,
                status: "completed",
                refundRate: 25,
            },
        ]

        this.filteredTransactions = [...this.transactions]
    }

    bindEvents() {
        // Filter events
        document.getElementById("dateRange").addEventListener("change", () => this.applyFilters())
        document.getElementById("exchangeFilter").addEventListener("change", () => this.applyFilters())
        document.getElementById("statusFilter").addEventListener("change", () => this.applyFilters())
        document.getElementById("searchInput").addEventListener("input", () => this.applyFilters())

        // Export button
        document.querySelector('[onclick="exportData()"]').addEventListener("click", (e) => {
            e.preventDefault()
            this.exportData()
        })

        // Refresh button
        document.querySelector('[onclick="refreshData()"]').addEventListener("click", (e) => {
            e.preventDefault()
            this.refreshData()
        })
    }

    applyFilters() {
        const dateRange = document.getElementById("dateRange").value
        const exchange = document.getElementById("exchangeFilter").value
        const status = document.getElementById("statusFilter").value
        const search = document.getElementById("searchInput").value.toLowerCase()

        this.filteredTransactions = this.transactions.filter((transaction) => {
            // Date filter
            if (dateRange && dateRange !== "custom") {
                const days = Number.parseInt(dateRange)
                const transactionDate = new Date(transaction.date)
                const cutoffDate = new Date()
                cutoffDate.setDate(cutoffDate.getDate() - days)
                if (transactionDate < cutoffDate) return false
            }

            // Exchange filter
            if (exchange && transaction.exchange !== exchange) return false

            // Status filter
            if (status && transaction.status !== status) return false

            // Search filter
            if (search && !transaction.id.toLowerCase().includes(search)) return false

            return true
        })

        this.currentPage = 1
        this.renderTransactions()
        this.updateSummaryCards()
    }

    renderTransactions() {
        const tbody = document.getElementById("transactionTableBody")
        const startIndex = (this.currentPage - 1) * this.itemsPerPage
        const endIndex = startIndex + this.itemsPerPage
        const pageTransactions = this.filteredTransactions.slice(startIndex, endIndex)

        tbody.innerHTML = ""

        pageTransactions.forEach((transaction) => {
            const row = this.createTransactionRow(transaction)
            tbody.appendChild(row)
        })

        this.updatePagination()
    }

    createTransactionRow(transaction) {
        const row = document.createElement("tr")
        row.className = "transaction-row"

        const statusClass =
            transaction.status === "completed" ? "success" : transaction.status === "pending" ? "warning" : "danger"
        const statusText =
            transaction.status === "completed" ? "Hoàn thành" : transaction.status === "pending" ? "Đang xử lý" : "Thất bại"

        row.innerHTML = `
            <td>
                <div class="transaction-date">
                    <strong>${this.formatDate(transaction.date)}</strong><br>
                    <small class="text-muted">${this.formatTime(transaction.date)}</small>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="/placeholder.svg?height=30&width=30&text=${transaction.exchange} 
                         alt="${transaction.exchange}" class="me-2 rounded">
                    <span>${transaction.exchangeName}</span>
                </div>
            </td>
            <td>
                <code class="transaction-id">${transaction.id}</code>
            </td>
            <td class="fw-bold">${this.formatCurrency(transaction.transactionValue)}</td>
            <td class="text-danger">${this.formatCurrency(transaction.fee)}</td>
            <td class="text-success fw-bold">+${this.formatCurrency(transaction.refund)}</td>
            <td><span class="badge bg-${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-warning" onclick="transactionHistory.viewDetail('${transaction.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `

        return row
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage)
        const pagination = document.querySelector(".pagination")

        pagination.innerHTML = ""

        // Previous button
        const prevLi = document.createElement("li")
        prevLi.className = `page-item ${this.currentPage === 1 ? "disabled" : ""}`
        prevLi.innerHTML = `
            <a class="page-link" href="#" onclick="transactionHistory.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </a>
        `
        pagination.appendChild(prevLi)

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                const li = document.createElement("li")
                li.className = `page-item ${i === this.currentPage ? "active" : ""}`
                li.innerHTML = `<a class="page-link" href="#" onclick="transactionHistory.goToPage(${i})">${i}</a>`
                pagination.appendChild(li)
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                const li = document.createElement("li")
                li.className = "page-item disabled"
                li.innerHTML = '<span class="page-link">...</span>'
                pagination.appendChild(li)
            }
        }

        // Next button
        const nextLi = document.createElement("li")
        nextLi.className = `page-item ${this.currentPage === totalPages ? "disabled" : ""}`
        nextLi.innerHTML = `
            <a class="page-link" href="#" onclick="transactionHistory.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        `
        pagination.appendChild(nextLi)
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage)
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page
            this.renderTransactions()
        }
    }

    updateSummaryCards() {
        const totalValue = this.filteredTransactions.reduce((sum, t) => sum + t.transactionValue, 0)
        const totalRefund = this.filteredTransactions.reduce((sum, t) => sum + t.refund, 0)
        const totalTransactions = this.filteredTransactions.length
        const avgRefundRate =
            totalTransactions > 0
                ? this.filteredTransactions.reduce((sum, t) => sum + t.refundRate, 0) / totalTransactions
                : 0

        // Update summary cards
        const summaryNumbers = document.querySelectorAll(".summary-number")
        if (summaryNumbers[0]) summaryNumbers[0].textContent = this.formatCurrency(totalValue)
        if (summaryNumbers[1]) summaryNumbers[1].textContent = this.formatCurrency(totalRefund)
        if (summaryNumbers[2]) summaryNumbers[2].textContent = totalTransactions.toLocaleString()
        if (summaryNumbers[3]) summaryNumbers[3].textContent = avgRefundRate.toFixed(1) + "%"
    }

    viewDetail(transactionId) {
        const transaction = this.transactions.find((t) => t.id === transactionId)
        if (!transaction) return

        const modal = document.getElementById("transactionDetailModal")
        const content = document.getElementById("transactionDetailContent")

        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Thông tin giao dịch</h6>
                    <table class="table table-sm">
                        <tr><td>Mã giao dịch:</td><td><code>${transaction.id}</code></td></tr>
                        <tr><td>Thời gian:</td><td>${this.formatDateTime(transaction.date)}</td></tr>
                        <tr><td>Sàn giao dịch:</td><td>${transaction.exchangeName}</td></tr>
                        <tr><td>Giá trị giao dịch:</td><td class="fw-bold">${this.formatCurrency(transaction.transactionValue)}</td></tr>
                        <tr><td>Phí giao dịch:</td><td class="text-danger">${this.formatCurrency(transaction.fee)}</td></tr>
                        <tr><td>Tỷ lệ hoàn:</td><td class="text-warning">${transaction.refundRate}%</td></tr>
                        <tr><td>Tiền hoàn:</td><td class="text-success fw-bold">+${this.formatCurrency(transaction.refund)}</td></tr>
                        <tr><td>Trạng thái:</td><td><span class="badge bg-${transaction.status === "completed" ? "success" : "warning"}">${transaction.status === "completed" ? "Hoàn thành" : "Đang xử lý"}</span></td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Chi tiết hoàn tiền</h6>
                    <div class="refund-breakdown">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Phí giao dịch:</span>
                            <span>${this.formatCurrency(transaction.fee)}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Tỷ lệ hoàn (${transaction.refundRate}%):</span>
                            <span class="text-success">+${this.formatCurrency(transaction.refund)}</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between fw-bold">
                            <span>Tổng tiền hoàn:</span>
                            <span class="text-success">+${this.formatCurrency(transaction.refund)}</span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <h6>Trạng thái xử lý</h6>
                        <div class="progress mb-2">
                            <div class="progress-bar bg-success" style="width: ${transaction.status === "completed" ? "100" : "75"}%"></div>
                        </div>
                        <small class="text-muted">
                            ${transaction.status === "completed" ? "Đã hoàn thành" : "Đang xử lý - dự kiến hoàn thành trong 24h"}
                        </small>
                    </div>
                </div>
            </div>
        `

        const bootstrap = window.bootstrap // Declare the bootstrap variable
        const bootstrapModal = new bootstrap.Modal(modal)
        bootstrapModal.show()
    }

    exportData() {
        const button = event.target
        const originalText = button.innerHTML

        button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang xuất...'
        button.disabled = true

        setTimeout(() => {
            // Create CSV content
            const headers = ["Thời gian", "Sàn giao dịch", "Mã GD", "Giá trị GD", "Phí GD", "Tiền hoàn", "Trạng thái"]
            const csvContent = [
                headers.join(","),
                ...this.filteredTransactions.map((t) =>
                    [
                        this.formatDateTime(t.date),
                        t.exchangeName,
                        t.id,
                        t.transactionValue,
                        t.fee,
                        t.refund,
                        t.status === "completed" ? "Hoàn thành" : "Đang xử lý",
                    ].join(","),
                ),
            ].join("\n")

            // Download file
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = `PaybackDay_Transactions_${new Date().toISOString().split("T")[0]}.csv`
            link.click()

            button.innerHTML = originalText
            button.disabled = false

            this.showToast("Xuất dữ liệu thành công!", "success")
        }, 2000)
    }

    refreshData() {
        const button = event.target
        const originalText = button.innerHTML

        button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang tải...'
        button.disabled = true

        setTimeout(() => {
            this.loadTransactions()
            this.renderTransactions()
            this.updateSummaryCards()

            button.innerHTML = originalText
            button.disabled = false

            this.showToast("Dữ liệu đã được cập nhật!", "success")
        }, 1500)
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    showToast(message, type = "success") {
        const toastContainer = document.getElementById("toastContainer") || this.createToastContainer()
        const toastId = "toast-" + Date.now()
        const bgClass = type === "success" ? "bg-success" : type === "danger" ? "bg-danger" : "bg-info"

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `

        toastContainer.insertAdjacentHTML("beforeend", toastHTML)
        const toastElement = document.getElementById(toastId)
        const toast = new window.bootstrap.Toast(toastElement) // Use window.bootstrap
        toast.show()

        toastElement.addEventListener("hidden.bs.toast", () => {
            toastElement.remove()
        })
    }

    createToastContainer() {
        const container = document.createElement("div")
        container.id = "toastContainer"
        container.className = "toast-container position-fixed top-0 end-0 p-3"
        container.style.zIndex = "9999"
        document.body.appendChild(container)
        return container
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.transactionHistory = new TransactionHistory()
})

// Global functions for onclick handlers
function exportData() {
    if (window.transactionHistory) {
        window.transactionHistory.exportData()
    }
}

function refreshData() {
    if (window.transactionHistory) {
        window.transactionHistory.refreshData()
    }
}

function toggleView() {
    // Toggle between table and card view
    const table = document.querySelector(".table-responsive")
    const button = event.target

    if (table.classList.contains("card-view")) {
        table.classList.remove("card-view")
        button.innerHTML = '<i class="fas fa-th-list me-1"></i>Chế độ thẻ'
    } else {
        table.classList.add("card-view")
        button.innerHTML = '<i class="fas fa-table me-1"></i>Chế độ bảng'
    }
}
