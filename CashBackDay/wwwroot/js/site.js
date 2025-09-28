// Global JavaScript functions and utilities

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize Bootstrap and global functionality
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))

    // Set active navigation
    setActiveNavigation()

    // Add smooth scrolling
    addSmoothScrolling()

    // Initialize animations
    initializeAnimations()
})

// Set active navigation based on current page
//function setActiveNavigation() {
//    const currentPage = window.location.pathname.split("/").pop() || "index.html"
//    const navLinks = document.querySelectorAll(".navbar-nav .nav-link")

//    navLinks.forEach((link) => {
//        const href = link.getAttribute("href")
//        if (href === currentPage || (currentPage === "" && href === "index.html")) {
//            link.classList.add("active")
//        } else {
//            link.classList.remove("active")
//        }
//    })
//}

 Add smooth scrolling to anchor links
function addSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    anchorLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href").substring(1)
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
                e.preventDefault()
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        })
    })
}

// Initialize animations
function initializeAnimations() {
    // Animate counters when they come into view
    observeElements(".stat-number", (element) => {
        const text = element.textContent
        const number = Number.parseInt(text.replace(/[^\d]/g, ""))
        if (number) {
            animateValue(element, 0, number, 2000)
        }
    })

    // Add fade-in animation to cards
    observeElements(".summary-card, .data-card, .trading-floor-card, .video-card", (element) => {
        element.classList.add("fade-in-up")
    })
}

// Format currency (VND)
function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

// Show loading state
function showLoading(element) {
    element.classList.add("loading")
    const originalText = element.innerHTML
    element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...'
    return originalText
}

// Hide loading state
function hideLoading(element, originalText) {
    element.classList.remove("loading")
    element.innerHTML = originalText
}

// Show toast notification
function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toastContainer") || createToastContainer()

    const toastId = "toast-" + Date.now()
    const bgClass =
        type === "success" ? "bg-success" : type === "danger" ? "bg-danger" : type === "warning" ? "bg-warning" : "bg-info"

    const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `

    toastContainer.insertAdjacentHTML("beforeend", toastHTML)

    const toastElement = document.getElementById(toastId)
    const toast = new bootstrap.Toast(toastElement)
    toast.show()

    // Remove toast element after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove()
    })
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement("div")
    container.id = "toastContainer"
    container.className = "toast-container position-fixed top-0 end-0 p-3"
    container.style.zIndex = "9999"
    document.body.appendChild(container)
    return container
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            showToast("Đã sao chép vào clipboard!", "success")
        })
        .catch(() => {
            showToast("Không thể sao chép!", "danger")
        })
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// Validate phone number (Vietnamese format)
function validatePhone(phone) {
    const re = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
    return re.test(phone)
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9)
}

// Debounce function
//function debounce(func, wait) {
//    let timeout
//    return function executedFunction(...args) {
//        const later = () => {
//            clearTimeout(timeout)
//            func(...args)
//        }
//        clearTimeout(timeout)
//        timeout = setTimeout(later, wait)
//    }
//}

// Local storage helpers
//const Storage = {
//    set: (key, value) => {
//        try {
//            localStorage.setItem(key, JSON.stringify(value))
//        } catch (e) {
//            console.error("Error saving to localStorage:", e)
//        }
//    },

//    get: (key) => {
//        try {
//            const item = localStorage.getItem(key)
//            return item ? JSON.parse(item) : null
//        } catch (e) {
//            console.error("Error reading from localStorage:", e)
//            return null
//        }
//    },

//    remove: (key) => {
//        try {
//            localStorage.removeItem(key)
//        } catch (e) {
//            console.error("Error removing from localStorage:", e)
//        }
//    },
//}

// Animation helpers
//function animateValue(element, start, end, duration) {
//    const startTime = performance.now()
//    const change = end - start

//    function updateValue(currentTime) {
//        const elapsed = currentTime - startTime
//        const progress = Math.min(elapsed / duration, 1)

//        const current = start + change * progress
//        const formattedValue = Math.floor(current).toLocaleString("vi-VN")

//        // Preserve original text format
//        const originalText = element.dataset.originalText || element.textContent
//        element.textContent = originalText.replace(/[\d,]+/, formattedValue)

//        if (progress < 1) {
//            requestAnimationFrame(updateValue)
//        }
//    }

//    // Store original text
//    element.dataset.originalText = element.textContent
//    requestAnimationFrame(updateValue)
//}

// Intersection Observer for animations
//function observeElements(selector, callback) {
//    const observer = new IntersectionObserver(
//        (entries) => {
//            entries.forEach((entry) => {
//                if (entry.isIntersecting) {
//                    callback(entry.target)
//                    observer.unobserve(entry.target)
//                }
//            })
//        },
//        { threshold: 0.1 },
//    )

//    document.querySelectorAll(selector).forEach((el) => {
//        observer.observe(el)
//    })
//}

// API helpers (mock for demo)
const API = {
    baseURL: "https://api.paybackday.vn",

    request: async (endpoint, options = {}) => {
        // Mock API for demo purposes
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: {} })
            }, 1000)
        })
    },

    get: function (endpoint, options = {}) {
        return this.request(endpoint, { method: "GET", ...options })
    },

    post: function (endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            ...options,
        })
    },

    put: function (endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
            ...options,
        })
    },

    delete: function (endpoint, options = {}) {
        return this.request(endpoint, { method: "DELETE", ...options })
    },
}

// Theme utilities
const Theme = {
    // Toggle between light and dark mode (if needed in future)
    toggle: () => {
        // Implementation for theme switching
    },

    // Get current theme
    getCurrent: () => {
        return "dark" // Always dark for this design
    },
}

// Utility functions for common operations
//const Utils = {
//    // Format large numbers
//    formatNumber: (num) => {
//        if (num >= 1000000000) {
//            return (num / 1000000000).toFixed(1) + "B"
//        }
//        if (num >= 1000000) {
//            return (num / 1000000).toFixed(1) + "M"
//        }
//        if (num >= 1000) {
//            return (num / 1000).toFixed(1) + "K"
//        }
//        return num.toString()
//    },

//    // Truncate text
//    truncateText: (text, maxLength) => {
//        if (text.length <= maxLength) return text
//        return text.substr(0, maxLength) + "..."
//    },

//    // Get time ago
//    timeAgo: (date) => {
//        const now = new Date()
//        const diffTime = Math.abs(now - new Date(date))
//        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

//        if (diffDays === 1) return "1 ngày trước"
//        if (diffDays < 7) return `${diffDays} ngày trước`
//        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`
//        return `${Math.ceil(diffDays / 30)} tháng trước`
//    },
//}

// Export for use in other files
window.PaybackDay = {
    formatCurrency,
    formatDate,
    showLoading,
    hideLoading,
    showToast,
    copyToClipboard,
    validateEmail,
    validatePhone,
    generateId,
    debounce,
    Storage,
    API,
    Theme,
    Utils,
}
