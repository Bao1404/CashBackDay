// Tutorials Page JavaScript

// Mock video tutorials data
const mockVideos = [
    {
        id: "video1",
        title: "Hướng Dẫn Đăng Ký Tài Khoản PaybackDay",
        description: "Video hướng dẫn chi tiết cách đăng ký tài khoản PaybackDay và thiết lập thông tin cơ bản.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "5:30",
        category: "getting-started",
        views: 12500,
        uploadDate: "2024-01-20",
        featured: true,
    },
    {
        id: "video2",
        title: "Cách Kết Nối Với Sàn Giao Dịch",
        description: "Hướng dẫn kết nối tài khoản PaybackDay với các sàn giao dịch chứng khoán và crypto.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "8:15",
        category: "getting-started",
        views: 9800,
        uploadDate: "2024-01-18",
    },
    {
        id: "video3",
        title: "Chiến Lược Giao Dịch Cổ Phiếu Hiệu Quả",
        description: "Chia sẻ các chiến lược giao dịch cổ phiếu phổ biến và cách áp dụng trong thực tế.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "15:45",
        category: "trading",
        views: 15600,
        uploadDate: "2024-01-15",
    },
    {
        id: "video4",
        title: "Hướng Dẫn Rút Tiền Về Ví",
        description: "Chi tiết cách rút tiền hoàn từ PaybackDay về các loại ví: ngân hàng, MoMo, ZaloPay.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "6:20",
        category: "withdrawal",
        views: 8900,
        uploadDate: "2024-01-12",
    },
    {
        id: "video5",
        title: "Phân Tích Kỹ Thuật Cơ Bản",
        description: "Giới thiệu các công cụ phân tích kỹ thuật cơ bản trong giao dịch chứng khoán.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "12:30",
        category: "trading",
        views: 11200,
        uploadDate: "2024-01-10",
    },
    {
        id: "video6",
        title: "Quản Lý Rủi Ro Trong Đầu Tư",
        description: "Các nguyên tắc quản lý rủi ro quan trọng mà mọi nhà đầu tư cần biết.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "10:15",
        category: "advanced",
        views: 7800,
        uploadDate: "2024-01-08",
    },
    {
        id: "video7",
        title: "Giao Dịch Crypto Cho Người Mới",
        description: "Hướng dẫn cơ bản về giao dịch tiền điện tử và các lưu ý quan trọng.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "9:45",
        category: "trading",
        views: 13400,
        uploadDate: "2024-01-05",
    },
    {
        id: "video8",
        title: "Thiết Lập Ví Crypto An Toàn",
        description: "Cách tạo và bảo mật ví tiền điện tử, backup seed phrase đúng cách.",
        thumbnail: "https://cashback.exchange/image/exchanges/bingx.png",
        duration: "7:30",
        category: "withdrawal",
        views: 6700,
        uploadDate: "2024-01-03",
    },
]

let currentVideos = [...mockVideos]
let displayedVideos = 6 // Number of videos to show initially

// Declare variables
const bootstrap = window.bootstrap

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    // Initialize page after DOM is loaded
    setTimeout(() => {
        loadVideos()
        setupEventListeners()
        setupFilters()
    }, 100)
})

// Use the global functions from script.js
const { formatDate, debounce } = window.PaybackDay || {
    formatDate: (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN")
    },
    debounce: (func, wait) => {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    },
}

// Load and display videos
function loadVideos() {
    const container = document.getElementById("videoContainer")
    container.innerHTML = ""

    const videosToShow = currentVideos.slice(0, displayedVideos)

    videosToShow.forEach((video) => {
        const videoCard = createVideoCard(video)
        container.appendChild(videoCard)
    })

    // Update load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    if (currentVideos.length <= displayedVideos) {
        loadMoreBtn.style.display = "none"
    } else {
        loadMoreBtn.style.display = "block"
    }
}

// Create video card
function createVideoCard(video) {
    const col = document.createElement("div")
    col.className = "col-md-6 col-lg-4 mb-4"

    col.innerHTML = `
    <div class="video-card" onclick="playVideo('${video.id}')">
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}" class="img-fluid">
        <div class="play-button">
          <i class="fas fa-play"></i>
        </div>
        <div class="video-duration">${video.duration}</div>
        ${video.featured ? '<div class="featured-badge">Nổi bật</div>' : ""}
      </div>
      <div class="video-content">
        <h6 class="video-title">${video.title}</h6>
        <p class="video-description">${video.description}</p>
        <div class="video-meta">
          <div class="d-flex justify-content-between align-items-center">
            <small class="views-count">
              <i class="fas fa-eye me-1"></i>${video.views.toLocaleString("vi-VN")} lượt xem
            </small>
            <small class="upload-date">${formatDate(video.uploadDate)}</small>
          </div>
        </div>
        <div class="video-category mt-2">
          <span class="badge bg-warning text-dark">${getCategoryText(video.category)}</span>
        </div>
      </div>
    </div>
  `

    return col
}

// Get category text in Vietnamese
function getCategoryText(category) {
    const categoryMap = {
        "getting-started": "Bắt đầu",
        trading: "Giao dịch",
        withdrawal: "Rút tiền",
        advanced: "Nâng cao",
    }
    return categoryMap[category] || category
}

// Setup event listeners
function setupEventListeners() {
    // Load more button
    document.getElementById("loadMoreBtn").addEventListener("click", () => {
        displayedVideos += 6
        loadVideos()
    })

    // Category cards
    document.querySelectorAll(".category-card").forEach((card) => {
        card.addEventListener("click", function () {
            const category = this.dataset.category
            filterByCategory(category)
        })
    })
}

// Setup filters
function setupFilters() {
    document.getElementById("categoryFilter").addEventListener("change", function () {
        filterByCategory(this.value)
    })

    document.getElementById("searchVideos").addEventListener(
        "input",
        debounce(function () {
            searchVideos(this.value)
        }, 300),
    )
}

// Filter by category
function filterByCategory(category) {
    if (category) {
        currentVideos = mockVideos.filter((video) => video.category === category)
    } else {
        currentVideos = [...mockVideos]
    }

    displayedVideos = 6
    loadVideos()

    // Update category filter dropdown
    document.getElementById("categoryFilter").value = category || ""
}

// Search videos
function searchVideos(searchTerm) {
    if (searchTerm.trim() === "") {
        currentVideos = [...mockVideos]
    } else {
        const term = searchTerm.toLowerCase()
        currentVideos = mockVideos.filter(
            (video) => video.title.toLowerCase().includes(term) || video.description.toLowerCase().includes(term),
        )
    }

    displayedVideos = 6
    loadVideos()
}

// Play video
function playVideo(videoId) {
    const video = mockVideos.find((v) => v.id === videoId)
    if (!video) return

    // Update modal title
    document.getElementById("videoModalTitle").textContent = video.title

    // Update video description
    const descriptionDiv = document.getElementById("videoDescription")
    descriptionDiv.innerHTML = `
        <h6>${video.title}</h6>
        <p>${video.description}</p>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <small class="text-muted">
                    <i class="fas fa-eye me-1"></i>${video.views.toLocaleString("vi-VN")} lượt xem
                </small>
                <small class="text-muted ms-3">
                    <i class="fas fa-calendar me-1"></i>${formatDate(video.uploadDate)}
                </small>
            </div>
            <span class="badge bg-primary">${getCategoryText(video.category)}</span>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary">
                <i class="fas fa-thumbs-up me-1"></i>Thích
            </button>
            <button class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-share me-1"></i>Chia sẻ
            </button>
            <button class="btn btn-sm btn-outline-info">
                <i class="fas fa-bookmark me-1"></i>Lưu
            </button>
        </div>
    `

    // Load related videos
    loadRelatedVideos(video)

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("videoModal"))
    modal.show()

    // Increment view count (in real app, this would be an API call)
    video.views++
}

// Load related videos
function loadRelatedVideos(currentVideo) {
    const relatedDiv = document.getElementById("relatedVideos")

    // Get videos from same category, excluding current video
    const relatedVideos = mockVideos
        .filter((v) => v.id !== currentVideo.id && v.category === currentVideo.category)
        .slice(0, 3)

    relatedDiv.innerHTML = relatedVideos
        .map(
            (video) => `
        <div class="card mb-2" style="cursor: pointer;" onclick="playVideo('${video.id}')">
            <div class="row g-0">
                <div class="col-4">
                    <img src="${video.thumbnail}" class="img-fluid rounded-start" alt="${video.title}" style="height: 60px; object-fit: cover;">
                </div>
                <div class="col-8">
                    <div class="card-body p-2">
                        <h6 class="card-title small mb-1">${video.title}</h6>
                        <small class="text-muted">${video.duration} • ${video.views.toLocaleString("vi-VN")} lượt xem</small>
                    </div>
                </div>
            </div>
        </div>
    `,
        )
        .join("")

    if (relatedVideos.length === 0) {
        relatedDiv.innerHTML = '<p class="text-muted small">Không có video liên quan</p>'
    }
}

// Play featured video
function playFeaturedVideo() {
    const featuredVideo = mockVideos.find((v) => v.featured)
    if (featuredVideo) {
        playVideo(featuredVideo.id)
    }
}
