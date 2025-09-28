// Trading Floors Page JavaScript

// Mock trading floors data
const mockTradingFloors = [
    {
        id: "floor1",
        name: "VPS Securities",
        type: "stock",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 80,
        referralCode: "VPS2024PBD",
        description: "Công ty Chứng khoán VPS - Đối tác uy tín với hơn 15 năm kinh nghiệm",
        features: ["Giao dịch cổ phiếu", "Phái sinh", "Trái phiếu", "Quỹ mở"],
        rating: 4.8,
        totalUsers: 12500,
        website: "https://vps.com.vn",
        minDeposit: 100000,
    },
    {
        id: "floor2",
        name: "SSI Securities",
        type: "stock",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 75,
        referralCode: "SSI2024PBD",
        description: "Công ty Chứng khoán SSI - Sàn giao dịch hàng đầu Việt Nam",
        features: ["Giao dịch cổ phiếu", "Margin", "Phái sinh", "Tư vấn đầu tư"],
        rating: 4.7,
        totalUsers: 18200,
        website: "https://ssi.com.vn",
        minDeposit: 50000,
    },
    {
        id: "floor3",
        name: "Binance",
        type: "crypto",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 70,
        referralCode: "BIN2024PBD",
        description: "Sàn giao dịch tiền điện tử lớn nhất thế giới",
        features: ["Spot Trading", "Futures", "Options", "Staking"],
        rating: 4.6,
        totalUsers: 25000,
        website: "https://binance.com",
        minDeposit: 10000,
    },
    {
        id: "floor4",
        name: "HSC Securities",
        type: "stock",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 65,
        referralCode: "HSC2024PBD",
        description: "Công ty Chứng khoán HSC - Dịch vụ chuyên nghiệp",
        features: ["Giao dịch cổ phiếu", "Trái phiếu", "Tư vấn", "Nghiên cứu"],
        rating: 4.5,
        totalUsers: 8900,
        website: "https://hsc.com.vn",
        minDeposit: 100000,
    },
    {
        id: "floor5",
        name: "FBS Forex",
        type: "forex",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 60,
        referralCode: "FBS2024PBD",
        description: "Sàn giao dịch Forex uy tín quốc tế",
        features: ["Forex", "CFD", "Metals", "Commodities"],
        rating: 4.4,
        totalUsers: 15600,
        website: "https://fbs.com",
        minDeposit: 1000,
    },
    {
        id: "floor6",
        name: "TCBS Securities",
        type: "stock",
        logo: "https://cashback.exchange/image/exchanges/binance.png",
        refundPercentage: 55,
        referralCode: "TCBS2024PBD",
        description: "Công ty Chứng khoán Techcombank - Công nghệ hiện đại",
        features: ["Giao dịch cổ phiếu", "Phái sinh", "Margin", "Robo Advisory"],
        rating: 4.3,
        totalUsers: 11200,
        website: "https://tcbs.com.vn",
        minDeposit: 50000,
    },
]

let currentFloors = [...mockTradingFloors]
let currentViewMode = "grid"

// Declare variables
// Initialize page after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize page after DOM is loaded
    setTimeout(() => {
        loadTradingFloors()
        setupEventListeners()
        setupFilters()
    }, 100)
})

// Use the global functions from script.js
const { formatCurrency, debounce, showToast, showLoading, hideLoading, validateEmail, validatePhone } =
    window.PaybackDay || {
        formatCurrency: (amount) => amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        debounce: (func, wait) => {
            let timeout
            return function (...args) {
                clearTimeout(timeout)
                timeout = setTimeout(() => func.apply(this, args), wait)
            }
        },
        showToast: (message, type) => alert(`${type}: ${message}`),
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
        validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        validatePhone: (phone) => /^\d{10}$/.test(phone),
    }

// Initialize page
// document.addEventListener("DOMContentLoaded", () => {
//   loadTradingFloors()
//   setupEventListeners()
//   setupFilters()
// })

// Load and display trading floors
function loadTradingFloors() {
    const container = document.getElementById("tradingFloorsContainer")
    container.innerHTML = ""

    currentFloors.forEach((floor) => {
        const floorCard = currentViewMode === "grid" ? createFloorCardGrid(floor) : createFloorCardList(floor)
        container.appendChild(floorCard)
    })
}

// Update the createFloorCardGrid function to match the new design
function createFloorCardGrid(floor) {
    const col = document.createElement("div")
    col.className = "col-md-6 col-lg-4 mb-4"

    col.innerHTML = `
    <div class="trading-floor-card" onclick="viewFloorDetail('${floor.id}')">
      <div class="card-image">
        <img src="${floor.logo}" alt="${floor.name}" class="img-fluid">
        <div class="refund-badge">${floor.refundPercentage}% Hoàn Tiền</div>
      </div>
      <div class="card-content">
        <h5 class="card-title">${floor.name}</h5>
        <p class="card-subtitle">Mã giới thiệu: ${floor.referralCode}</p>
        
        <div class="floor-stats mb-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="stat-label">Đánh giá:</span>
            <div class="rating-stars">
              ${generateStars(floor.rating)}
              <small class="ms-1">(${floor.rating})</small>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="stat-label">Người dùng:</span>
            <span class="stat-value">${floor.totalUsers.toLocaleString("vi-VN")}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="stat-label">Nạp tối thiểu:</span>
            <span class="stat-value text-success">${formatCurrency(floor.minDeposit)}</span>
          </div>
        </div>
        
        <div class="floor-actions d-flex gap-2">
          <button class="btn btn-warning flex-fill" onclick="event.stopPropagation(); connectToFloor('${floor.id}')">
            <i class="fas fa-link me-1"></i>Kết Nối
          </button>
          <button class="btn btn-outline-warning" onclick="event.stopPropagation(); viewFloorDetail('${floor.id}')">
            <i class="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
    </div>
  `

    return col
}

// Update the createFloorCardList function
function createFloorCardList(floor) {
    const col = document.createElement("div")
    col.className = "col-12 mb-3"

    col.innerHTML = `
    <div class="trading-floor-card list-view">
      <div class="card-content">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="${floor.logo}" alt="${floor.name}" class="floor-logo-small">
            <div class="mt-2">
              <span class="badge bg-warning text-dark">${floor.refundPercentage}%</span>
            </div>
          </div>
          <div class="col-md-4">
            <h5 class="floor-name">${floor.name}</h5>
            <p class="floor-description">${floor.description}</p>
            <div class="d-flex align-items-center">
              ${generateStars(floor.rating)}
              <small class="ms-2">(${floor.rating}) • ${floor.totalUsers.toLocaleString("vi-VN")} người dùng</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="floor-details">
              <div class="detail-item">
                <small class="detail-label">Loại sàn:</small>
                <span class="badge bg-secondary ms-1">${getFloorTypeText(floor.type)}</span>
              </div>
              <div class="detail-item">
                <small class="detail-label">Nạp tối thiểu:</small>
                <span class="detail-value text-success ms-1">${formatCurrency(floor.minDeposit)}</span>
              </div>
              <div class="detail-item">
                <small class="detail-label">Mã giới thiệu:</small>
                <code class="referral-code ms-1">${floor.referralCode}</code>
              </div>
            </div>
          </div>
          <div class="col-md-3 text-end">
            <div class="d-flex flex-column gap-2">
              <button class="btn btn-warning" onclick="connectToFloor('${floor.id}')">
                <i class="fas fa-link me-1"></i>Kết Nối
              </button>
              <button class="btn btn-outline-warning" onclick="viewFloorDetail('${floor.id}')">
                <i class="fas fa-info-circle me-1"></i>Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

    return col
}

// Get floor type text
function getFloorTypeText(type) {
    const typeMap = {
        stock: "Chứng khoán",
        crypto: "Tiền điện tử",
        forex: "Forex",
    }
    return typeMap[type] || type
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    let stars = ""

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>'
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>'
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>'
    }

    return stars
}

// Setup event listeners
function setupEventListeners() {
    // View mode toggle
    document.querySelectorAll('input[name="viewMode"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            currentViewMode = this.id === "gridView" ? "grid" : "list"
            loadTradingFloors()
        })
    })

    // Sort dropdown
    document.getElementById("sortBy").addEventListener("change", function () {
        sortFloors(this.value)
    })
}

// Setup filters
function setupFilters() {
    document.getElementById("floorTypeFilter").addEventListener("change", applyFilters)
    document.getElementById("refundFilter").addEventListener("change", applyFilters)
    document.getElementById("searchInput").addEventListener("input", debounce(applyFilters, 300))
}

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById("floorTypeFilter").value
    const refundFilter = document.getElementById("refundFilter").value
    const searchTerm = document.getElementById("searchInput").value.toLowerCase()

    currentFloors = mockTradingFloors.filter((floor) => {
        // Type filter
        if (typeFilter && floor.type !== typeFilter) {
            return false
        }

        // Refund filter
        if (refundFilter && floor.refundPercentage < Number.parseInt(refundFilter)) {
            return false
        }

        // Search filter
        if (
            searchTerm &&
            !floor.name.toLowerCase().includes(searchTerm) &&
            !floor.description.toLowerCase().includes(searchTerm)
        ) {
            return false
        }

        return true
    })

    loadTradingFloors()
}

// Sort floors
function sortFloors(sortBy) {
    switch (sortBy) {
        case "refund":
            currentFloors.sort((a, b) => b.refundPercentage - a.refundPercentage)
            break
        case "name":
            currentFloors.sort((a, b) => a.name.localeCompare(b.name))
            break
        case "rating":
            currentFloors.sort((a, b) => b.rating - a.rating)
            break
    }

    loadTradingFloors()
}

// View floor detail
function viewFloorDetail(floorId) {
    const floor = mockTradingFloors.find((f) => f.id === floorId)
    if (!floor) return

    document.getElementById("floorDetailTitle").textContent = floor.name

    const modalBody = document.getElementById("floorDetailBody")
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4 text-center">
                <img src="${floor.logo}" alt="${floor.name}" class="img-fluid mb-3" style="max-width: 120px;">
                <h4>${floor.name}</h4>
                <p class="text-muted">${getFloorTypeText(floor.type)}</p>
                <div class="mb-3">
                    ${generateStars(floor.rating)}
                    <div class="mt-1">
                        <small class="text-muted">${floor.rating}/5 (${floor.totalUsers.toLocaleString("vi-VN")} người dùng)</small>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <h5>Thông Tin Chi Tiết</h5>
                <p>${floor.description}</p>
                
                <div class="row mb-3">
                    <div class="col-6">
                        <strong>Hoàn tiền:</strong>
                        <span class="badge bg-success ms-2">${floor.refundPercentage}%</span>
                    </div>
                    <div class="col-6">
                        <strong>Nạp tối thiểu:</strong>
                        <span class="text-success ms-2">${formatCurrency(floor.minDeposit)}</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <strong>Mã giới thiệu:</strong>
                    <div class="d-flex align-items-center mt-1">
                        <code class="bg-light p-2 rounded me-2 flex-grow-1">${floor.referralCode}</code>
                        <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard('${floor.referralCode}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mb-3">
                    <strong>Dịch vụ:</strong>
                    <div class="mt-2">
                        ${floor.features.map((feature) => `<span class="badge bg-light text-dark me-1 mb-1">${feature}</span>`).join("")}
                    </div>
                </div>
                
                <div class="mb-3">
                    <strong>Website:</strong>
                    <a href="${floor.website}" target="_blank" class="ms-2">${floor.website}</a>
                </div>
            </div>
        </div>
    `

    // Set up connect button
    document.getElementById("connectFloorBtn").onclick = () => connectToFloor(floorId)

    const modal = document.getElementById("floorDetailModal")
    modal.style.display = "block"
}

// Connect to floor
function connectToFloor(floorId) {
    const floor = mockTradingFloors.find((f) => f.id === floorId)
    if (!floor) return

    // Pre-fill referral code
    document.getElementById("referralCode").value = floor.referralCode

    const modal = document.getElementById("connectFloorModal")
    modal.style.display = "block"
}

// Process connection
function connectToFloorProcess() {
    const referralCode = document.getElementById("referralCode").value
    const email = document.getElementById("userEmail").value
    const phone = document.getElementById("userPhone").value
    const agreeTerms = document.getElementById("agreeTerms").checked

    if (!email || !phone || !agreeTerms) {
        showToast("Vui lòng điền đầy đủ thông tin và đồng ý điều khoản!", "danger")
        return
    }

    if (!validateEmail(email)) {
        showToast("Email không hợp lệ!", "danger")
        return
    }

    if (!validatePhone(phone)) {
        showToast("Số điện thoại không hợp lệ!", "danger")
        return
    }

    // Simulate connection process
    const btn = document.querySelector("#connectFloorModal .btn-success")
    const originalText = showLoading(btn)

    setTimeout(() => {
        hideLoading(btn, originalText)

        // Close modal and reset form
        const modal = document.getElementById("connectFloorModal")
        modal.style.display = "none"
        document.getElementById("connectFloorForm").reset()

        showToast("Kết nối thành công! Chúng tôi sẽ liên hệ với bạn sớm.", "success")
    }, 2000)
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        () => {
            showToast("Đã sao chép mã giới thiệu!", "success")
        },
        (err) => {
            console.error("Could not copy text: ", err)
            showToast("Không thể sao chép mã!", "danger")
        },
    )
}
