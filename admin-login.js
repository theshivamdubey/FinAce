// Admin Login Configuration
const ADMIN_CREDENTIALS = {
  "admin@finace": "FinAce2024!",
};

// DOM Elements
const loginForm = document.getElementById("loginForm");
const adminIdInput = document.getElementById("adminId");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const rememberMeCheckbox = document.getElementById("rememberMe");

// Initialize the login page
document.addEventListener("DOMContentLoaded", function () {
  initializeLoginPage();
});

function initializeLoginPage() {
  // Check if user is already logged in
  if (checkExistingSession()) {
    redirectToAdmin();
    return;
  }

  // Load saved credentials if "Remember me" was checked
  loadSavedCredentials();

  // Setup event listeners
  setupLoginEventListeners();

  // Add some visual enhancements
  addVisualEffects();
}

function setupLoginEventListeners() {
  // Form submission
  loginForm.addEventListener("submit", handleLogin);

  // Input validation on typing
  adminIdInput.addEventListener("input", clearError);
  passwordInput.addEventListener("input", clearError);

  // Enter key handling
  document.addEventListener("keypress", function (e) {
    if (
      e.key === "Enter" &&
      (adminIdInput === document.activeElement ||
        passwordInput === document.activeElement)
    ) {
      handleLogin(e);
    }
  });

  // Focus effects
  [adminIdInput, passwordInput].forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });
}

function handleLogin(e) {
  e.preventDefault();

  const adminId = adminIdInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  // Clear previous errors
  clearError();

  // Validate inputs
  if (!adminId || !password) {
    showError("Please fill in all fields");
    return;
  }

  // Show loading state
  showLoading();

  // Simulate authentication delay
  setTimeout(() => {
    if (authenticateUser(adminId, password)) {
      // Save session
      createSession(adminId, rememberMe);

      // Show success animation
      showSuccess();

      // Redirect after animation
      setTimeout(() => {
        redirectToAdmin();
      }, 1500);
    } else {
      hideLoading();
      showError("Invalid Admin ID or Password. Please try again.");
      // Shake animation for wrong credentials
      shakeForm();
    }
  }, 1000);
}

function authenticateUser(adminId, password) {
  // In a real application, this would connect to a secure backend
  // For demo purposes, we're using predefined credentials
  return ADMIN_CREDENTIALS[adminId] === password;
}

function createSession(adminId, rememberMe) {
  const sessionData = {
    adminId: adminId,
    loginTime: new Date().getTime(),
    rememberMe: rememberMe,
  };

  // Store session in localStorage
  localStorage.setItem("adminSession", JSON.stringify(sessionData));

  // If remember me is checked, also store credentials
  if (rememberMe) {
    localStorage.setItem(
      "adminCredentials",
      JSON.stringify({
        adminId: adminId,
        rememberMe: true,
      })
    );
  } else {
    // Remove saved credentials if remember me is unchecked
    localStorage.removeItem("adminCredentials");
  }
}

function checkExistingSession() {
  const sessionData = localStorage.getItem("adminSession");

  if (!sessionData) {
    return false;
  }

  try {
    const session = JSON.parse(sessionData);
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - session.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxAge) {
      // Session expired
      localStorage.removeItem("adminSession");
      return false;
    }

    return true;
  } catch (error) {
    // Invalid session data
    localStorage.removeItem("adminSession");
    return false;
  }
}

function loadSavedCredentials() {
  const savedCredentials = localStorage.getItem("adminCredentials");

  if (savedCredentials) {
    try {
      const credentials = JSON.parse(savedCredentials);
      if (credentials.rememberMe) {
        adminIdInput.value = credentials.adminId;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
      }
    } catch (error) {
      // Invalid saved data
      localStorage.removeItem("adminCredentials");
    }
  }
}

function redirectToAdmin() {
  // Add a flag to indicate admin login
  sessionStorage.setItem("adminLoggedIn", "true");
  sessionStorage.setItem("adminLoginTime", new Date().getTime().toString());

  // Redirect to main website with admin panel open
  window.location.href = "index.html#admin";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}

function clearError() {
  errorMessage.classList.remove("show");
  errorMessage.textContent = "";
}

function showLoading() {
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.innerHTML = `
        <div class="loading show">
            <div class="spinner"></div>
            Authenticating...
        </div>
    `;
  loginBtn.disabled = true;
}

function hideLoading() {
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.innerHTML = `
        <i class="fas fa-sign-in-alt"></i>
        Login to Admin Panel
    `;
  loginBtn.disabled = false;
}

function showSuccess() {
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.innerHTML = `
        <div class="success-animation show">
            <i class="fas fa-check-circle"></i>
            <div>Login Successful!</div>
        </div>
    `;
  loginBtn.style.background =
    "linear-gradient(135deg, #10b981 0%, #059669 100%)";
}

function shakeForm() {
  const loginCard = document.querySelector(".login-card");
  loginCard.style.animation = "shake 0.5s ease-in-out";

  setTimeout(() => {
    loginCard.style.animation = "";
  }, 500);
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggleIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function addVisualEffects() {
  // Add CSS for shake animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .form-group.focused input {
            transform: scale(1.02);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .login-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
  document.head.appendChild(style);
}

// Utility function to logout (can be called from main website)
function logout() {
  localStorage.removeItem("adminSession");
  localStorage.removeItem("adminCredentials");
  sessionStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminLoginTime");
  window.location.href = "admin-login.html";
}

// Make logout function available globally
window.logout = logout;

// Security: Prevent right-click and F12 in production
if (
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
      e.preventDefault();
    }
  });
}
