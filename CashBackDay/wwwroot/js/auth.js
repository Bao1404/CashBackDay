// Authentication JavaScript

// Import Bootstrap
const bootstrap = window.bootstrap

// Initialize authentication pages
document.addEventListener("DOMContentLoaded", () => {
    initializeAuthPage()
})

// Use global functions from script.js or fallback to simple functions
const { validateEmail, validatePhone, showLoading, hideLoading } = window.PaybackDay || {
    validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    validatePhone: (phone) => /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(phone),
    showLoading: (btn) => {
        const originalText = btn.innerHTML
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...'
        btn.disabled = true
        return originalText
    },
    hideLoading: (btn, originalText) => {
        btn.innerHTML = originalText
        btn.disabled = false
    },
}

// Use showToast from layout (global scope)
// Remove the showToast fallback from this file

// Initialize authentication page
function initializeAuthPage() {
    // Setup password strength checker
    const passwordInput = document.getElementById("registerPassword")
    if (passwordInput) {
        passwordInput.addEventListener("input", checkPasswordStrength)
    }

    // Setup verification code input
    const verificationInput = document.getElementById("verificationCode")
    if (verificationInput) {
        verificationInput.addEventListener("input", formatVerificationCode)
    }

    // Setup phone number formatting
    const phoneInput = document.getElementById("phone")
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            formatPhoneNumber(this)
        })
    }
}


// Setup login form
function setupLoginForm() {
    const form = document.getElementById("loginForm")
    form.addEventListener("submit", handleLogin)
}

// Setup register form
function setupRegisterForm() {
    const form = document.getElementById("registerForm")
    form.addEventListener("submit", handleRegister)
}

// Setup forgot password form
function setupForgotPasswordForm() {
    const form = document.getElementById("forgotPasswordForm")
    form.addEventListener("submit", handleForgotPassword)
}

//// Handle login
//function handleLogin(e) {
//    e.preventDefault()

//    const email = document.getElementById("email").value
//    const password = document.getElementById("password").value
//    const rememberMe = document.getElementById("rememberMe").checked

//    // Validate inputs
//    if (!validateEmail(email)) {
//        showToast("Email không hợp lệ!", "danger")
//        return
//    }

//    if (password.length < 6) {
//        showToast("Mật khẩu phải có ít nhất 6 ký tự!", "danger")
//        return
//    }

//    // Simulate login process
//    const submitBtn = document.querySelector("#loginForm button[type='submit']")
//    const originalText = showLoading(submitBtn)

//    setTimeout(() => {
//        hideLoading(submitBtn, originalText)

//        // Simulate successful login
//        if (email === "demo@paybackday.vn" && password === "123456") {
//            // Store login state
//            if (rememberMe) {
//                localStorage.setItem("paybackday_user", JSON.stringify({ email, loginTime: Date.now() }))
//            } else {
//                sessionStorage.setItem("paybackday_user", JSON.stringify({ email, loginTime: Date.now() }))
//            }

//            // Show success modal
//            const modal = new bootstrap.Modal(document.getElementById("successModal"))
//            modal.show()
//        } else {
//            showToast("Email hoặc mật khẩu không đúng!", "danger")
//        }
//    }, 2000)
//}

// Handle register
function handleRegister(e) {
    e.preventDefault()

    const currentStep = document.querySelector(".form-step.active")
    if (currentStep.id !== "step3") {
        return
    }

    const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("registerEmail").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("registerPassword").value,
        confirmPassword: document.getElementById("confirmPassword").value,
        verificationCode: document.getElementById("verificationCode").value,
        agreeTerms: document.getElementById("agreeTerms").checked,
        agreeMarketing: document.getElementById("agreeMarketing").checked,
    }

    // Validate form
    if (!validateRegisterForm(formData)) {
        return
    }

    // Simulate registration process
    const submitBtn = document.querySelector("#registerForm button[type='submit']")
    const originalText = showLoading(submitBtn)

    setTimeout(() => {
        hideLoading(submitBtn, originalText)

        // Store user data
        localStorage.setItem(
            "paybackday_user",
            JSON.stringify({
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                registrationTime: Date.now(),
            }),
        )

        // Show success modal
        const modal = new bootstrap.Modal(document.getElementById("registerSuccessModal"))
        modal.show()
    }, 2000)
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault()

    const email = document.getElementById("resetEmail").value

    if (!validateEmail(email)) {
        showToast("Email không hợp lệ!", "danger")
        return
    }

    const submitBtn = document.querySelector("#forgotPasswordForm button[type='submit']")
    const originalText = showLoading(submitBtn)

    setTimeout(() => {
        hideLoading(submitBtn, originalText)

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"))
        modal.hide()

        showToast("Link đặt lại mật khẩu đã được gửi đến email của bạn!", "success")
        document.getElementById("forgotPasswordForm").reset()
    }, 2000)
}

//// Validate register form
//function validateRegisterForm(data) {
//    if (!data.firstName || !data.lastName) {
//        showToast("Vui lòng nhập đầy đủ họ tên!", "danger")
//        return false
//    }

//    if (!validateEmail(data.email)) {
//        showToast("Email không hợp lệ!", "danger")
//        return false
//    }

//    if (!validatePhone(data.phone)) {
//        showToast("Số điện thoại không hợp lệ!", "danger")
//        return false
//    }

//    if (data.password.length < 8) {
//        showToast("Mật khẩu phải có ít nhất 8 ký tự!", "danger")
//        return false
//    }

//    if (data.password !== data.confirmPassword) {
//        showToast("Mật khẩu xác nhận không khớp!", "danger")
//        return false
//    }

//    if (data.verificationCode.length !== 6) {
//        showToast("Mã xác thực không hợp lệ!", "danger")
//        return false
//    }

//    if (!data.agreeTerms) {
//        showToast("Vui lòng đồng ý với điều khoản sử dụng!", "danger")
//        return false
//    }

//    return true
//}

// Registration steps navigation
function nextStep(step) {
    const currentStep = document.querySelector(".form-step.active")
    const currentStepNumber = getCurrentStepNumber()

     //Validate current step
    //if (!validateCurrentStep(currentStep)) {
    //    return
    //}

    // Hide current step
    currentStep.classList.remove("active")
    document.querySelector(`.step[data-step="${currentStepNumber}"]`).classList.remove("active")

    // Show next step
    document.getElementById(`step${step}`).classList.add("active")
    document.querySelector(`.step[data-step="${step}"]`).classList.add("active")

    // Send verification code if moving to step 2
    if (step === 2) {
        sendVerificationCode()
    }
}

function prevStep(step) {
    const currentStepNumber = getCurrentStepNumber()

    // Hide current step
    document.querySelector(".form-step.active").classList.remove("active")
    document.querySelector(`.step[data-step="${currentStepNumber}"]`).classList.remove("active")

    // Show previous step
    document.getElementById(`step${step}`).classList.add("active")
    document.querySelector(`.step[data-step="${step}"]`).classList.add("active")
}

function getCurrentStepNumber() {
    const activeStep = document.querySelector(".form-step.active")
    return Number.parseInt(activeStep.id.replace("step", ""))
}

 //Validate current step
function validateCurrentStep(stepElement) {
    const stepNumber = Number.parseInt(stepElement.id.replace("step", ""))

    switch (stepNumber) {
        case 1:
            return validateStep1()
        case 2:
            return validateStep2()
        default:
            return true
    }
}

function validateStep1() {
    const fullName = document.getElementById("fullName").value.trim()
    const email = document.getElementById("registerEmail").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const password = document.getElementById("registerPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (!fullName) {
        showToast("Vui lòng nhập đầy đủ họ tên!", "danger")
        return false
    }

    if (!validateEmail(email)) {
        showToast("Email không hợp lệ!", "danger")
        return false
    }

    if (!validatePhone(phone)) {
        showToast("Số điện thoại không hợp lệ!", "danger")
        return false
    }

    if (password.length < 8) {
        showToast("Mật khẩu phải có ít nhất 8 ký tự!", "danger")
        return false
    }

    if (password !== confirmPassword) {
        showToast("Mật khẩu xác nhận không khớp!", "danger")
        return false
    }

    return true
}

function validateStep2() {
    const code = document.getElementById("verificationCode").value.trim()
    if (code.length !== 6) {
        showToast("Vui lòng nhập đầy đủ mã xác thực!", "danger")
        return false
    }
    return true
}

// Send verification code
function sendVerificationCode() {
    const phone = document.getElementById("phone").value
    console.log(`Sending verification code to ${phone}`)

    // Start countdown
    startCountdown()

    showToast("Mã xác thực đã được gửi đến số điện thoại của bạn!", "success")
}

// Resend verification code
function resendVerificationCode() {
    sendVerificationCode()
}

// Start countdown for resend button
function startCountdown() {
    const button = document.getElementById("resendCode")
    const countdownElement = document.getElementById("countdown")
    let seconds = 60

    button.disabled = true
    button.style.opacity = "0.5"

    const interval = setInterval(() => {
        seconds--
        countdownElement.textContent = seconds

        if (seconds <= 0) {
            clearInterval(interval)
            button.disabled = false
            button.style.opacity = "1"
            countdownElement.textContent = "60"
            button.innerHTML = "Gửi lại mã"
        }
    }, 1000)
}

// Verify code
function verifyCode() {
    const code = document.getElementById("verificationCode").value.trim()

    if (code.length !== 6) {
        showToast("Vui lòng nhập đầy đủ mã xác thực!", "danger")
        return
    }

    // Simulate verification (accept any 6-digit code)
    if (code.length === 6) {
        nextStep(3)
        showToast("Xác thực thành công!", "success")
    } else {
        showToast("Mã xác thực không đúng!", "danger")
    }
}

// Format verification code input
function formatVerificationCode(e) {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 6) {
        value = value.substring(0, 6)
    }
    e.target.value = value
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById("registerPassword").value
    const strengthFill = document.getElementById("strengthFill")
    const strengthText = document.getElementById("strengthText")

    let strength = 0
    let text = "Yếu"
    let color = "#dc3545"

    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    switch (strength) {
        case 0:
        case 1:
            text = "Rất yếu"
            color = "#dc3545"
            break
        case 2:
            text = "Yếu"
            color = "#fd7e14"
            break
        case 3:
            text = "Trung bình"
            color = "#ffc107"
            break
        case 4:
            text = "Mạnh"
            color = "#20c997"
            break
        case 5:
            text = "Rất mạnh"
            color = "#28a745"
            break
    }

    const percentage = (strength / 5) * 100
    strengthFill.style.width = `${percentage}%`
    strengthFill.style.backgroundColor = color
    strengthText.textContent = text
    strengthText.style.color = color
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId)
    const eye = document.getElementById(`${inputId}-eye`)

    if (input.type === "password") {
        input.type = "text"
        eye.classList.remove("fa-eye")
        eye.classList.add("fa-eye-slash")
    } else {
        input.type = "password"
        eye.classList.remove("fa-eye-slash")
        eye.classList.add("fa-eye")
    }
}

// Social login functions
function loginWithGoogle() {
    showToast("Tính năng đăng nhập Google sẽ được cập nhật sớm!", "info")
}

function loginWithFacebook() {
    showToast("Tính năng đăng nhập Facebook sẽ được cập nhật sớm!", "info")
}

function registerWithGoogle() {
    showToast("Tính năng đăng ký Google sẽ được cập nhật sớm!", "info")
}

function registerWithFacebook() {
    showToast("Tính năng đăng ký Facebook sẽ được cập nhật sớm!", "info")
}

// Redirect to dashboard
function redirectToDashboard() {
    // In a real app, this would redirect to the user dashboard
    window.location.href = "index.html"
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem("paybackday_user") || sessionStorage.getItem("paybackday_user")
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem("paybackday_user") || sessionStorage.getItem("paybackday_user")
    return userData ? JSON.parse(userData) : null
}

// Logout function
function logout() {
    localStorage.removeItem("paybackday_user")
    sessionStorage.removeItem("paybackday_user")
    window.location.href = "login.html"
}

// // Format phone number input
// function formatPhoneNumber(input) {
//   let value = input.value.replace(/\D/g, "")

//   // Limit to 10 digits
//   if (value.length > 10) {
//     value = value.substring(0, 10)
//   }

//   // Format as Vietnamese phone number
//   if (value.length >= 3) {
//     if (value.startsWith("0")) {
//       value = value.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
//     }
//   }

//   input.value = value
// }
