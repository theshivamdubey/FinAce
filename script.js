// Global Variables
let currentEditingPost = null;
let currentEditingAffiliate = null;
let isAdminLoggedIn = false;

// Visitor Counter
let visitorCount = 0;
let uniqueVisitors = 0;

// Storage versioning to refresh data on code updates
const STORAGE_VERSION = '20251028-1';
const STORAGE_KEYS = {
  BLOG: 'finlinksBlogPosts',
  AFF: 'finlinksAffiliateLinks',
  VERSION: 'finlinksVersion',
};

// Default Sample Data (In a real app, this would come from a database)
const defaultBlogPosts = [
  {
    id: 1,
    title: "Kotak811 Super Savings Account",
    content:
      "Key features of Kotak811 Super Savings A/c Get flat 5% cashback up to â‚¹500 every month on your Debit Card spends You don't have to maintain any balance to remain a part of this program. Which type of transactions will be considered for cashback? Debit Card spends via ECOM (E-commerce) & POS (Point of sales) will be considered. Your cashback will be credited to your account by 30th of the next month of the qualification month. It'll be credited in your account. 811 Super membership will be live for one year form date of subscription. You will not be eligible for 5% cashback for the month(s) you do not make a deposit. Annual Program fees -:Â  â‚¹300 For Account",
    category: "financial",
    image:
      "https://res.cloudinary.com/diawzhidw/image/upload/v1761322403/mazzoecfcrop0iq0wk13.jpg?w=400&h=200&fit=crop",
    date: "2025-10-21",
    pinned: true,
    viewCount: 0,
  },
  {
    id: 2,
    title: "HDFC Millennia Debit Card",
    content:
      "Earn up to â‚¹4,800 cashback annually with 5% cashback on PayZapp and SmartBuy, 2.5% on all online spends, and 1% on offline spends and wallet reloads. Tips: Use Amazon pay wallet load money 40k. cashback limit - â‚¹400/month Max Cashback Credit time - 90 days ",
    category: "financial",
    image:
      "https://res.cloudinary.com/diawzhidw/image/upload/v1761323240/lkvrk28f5lsf3zwyfnxa.jpg?w=400&h=200&fit=crop",
    date: "2025-10-23",
    pinned: false,
    viewCount: 0,
  },
  {
    id: 3,
    title: "Roar Bank Credit Card",
    content:
      "Offered by Unity Small Finance Bank Lifetime Free Card: No joining, annual, or renewal fees with zero hidden costs. 62 Days Interest-Free Credit:(including a 3-day grace period).2-in-1 Card (Credit + Savings): The card is bundled with a savings account, allowing you to manage both credit and savings from one place. You earn attractive interest (up to 7.5% p.a.) on your savings balance. Cashback Up to 20%: Earn up to 20% cashback on select categories (e.g., movies, entertainment, pet stores, restaurants) each month. You can pick categories for cashback every month, subject to monthly caps.Instant Approval & Digital Onboarding: 100% paperless application process, quick registration (approx. 3 minutes), and instant credit limit decision. Cashback limit 2500 per Month",
    category: "financial",
    image:
      "https://res.cloudinary.com/diawzhidw/image/upload/v1761323740/hcxutiw49dd4o9fkpd5s.jpg?w=400&h=200&fit=crop",
    date: "2025-10-25",
    pinned: false,
    viewCount: 0,
  },
];

const defaultAffiliateLinks = [
  {
    id: 1,
    title: "Financial Planning Book Collection",
    description:
      "Essential books for understanding personal finance, budgeting, and investment strategies. Perfect for beginners and those looking to deepen their financial knowledge.",
    platform: "amazon",
    url: "https://amazon.in/financial-books",
    price: "â‚¹2,499",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Budget Planner & Expense Tracker",
    description:
      "Organize your finances with this comprehensive budget planner. Track expenses, set financial goals, and take control of your money management.",
    platform: "flipkart",
    url: "https://flipkart.com/budget-planner",
    price: "â‚¹899",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "Investment Calculator & Tools",
    description:
      "Professional-grade financial calculators to help you plan investments, calculate returns, and make informed financial decisions.",
    platform: "amazon",
    url: "https://amazon.in/investment-calculator",
    price: "â‚¹1,299",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    featured: false,
  },
];

// Initialize data arrays (will be loaded from localStorage or defaults)
let blogPosts = [];
let affiliateLinks = [];

// CHANGED: Declare DOM element variables here, but don't assign them
let blogGrid,
  affiliateGrid,
  adminModal,
  postModal,
  affiliateModal,
  adminBtn,
  mobileMenuToggle,
  navMenu;

// Mobile Menu Toggle Function
function toggleMobileMenu() {
  // CHANGED: Check if elements exist before toggling
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  }
}

// DOM Elements
// CHANGED: Removed definitions from here

// Visitor Counter Functions
function initializeVisitorCounter() {
  // Load visitor data from localStorage
  const storedData = localStorage.getItem("visitorData");
  if (storedData) {
    const data = JSON.parse(storedData);
    visitorCount = data.totalVisits || 0;
    uniqueVisitors = data.uniqueVisitors || 0;
  }

  // Check if this is a new session
  const sessionId = sessionStorage.getItem("visitorSession");
  if (!sessionId) {
    // New visitor
    visitorCount++;
    uniqueVisitors++;

    // Generate new session ID
    const newSessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("visitorSession", newSessionId);

    // Save updated data
    saveVisitorData();
  } else {
    // Returning visitor in same session
    visitorCount++;
    saveVisitorData();
  }

  // Update visitor display if admin panel is open
  updateVisitorDisplay();
}

function saveVisitorData() {
  const data = {
    totalVisits: visitorCount,
    uniqueVisitors: uniqueVisitors,
    lastVisit: new Date().toISOString(),
  };
  localStorage.setItem("visitorData", JSON.stringify(data));
}

function updateVisitorDisplay() {
  updateDashboardStats();
}

function updateDashboardStats() {
  const totalVisitsElement = document.getElementById("totalVisits");
  const uniqueVisitorsElement = document.getElementById("uniqueVisitors");
  const lastVisitElement = document.getElementById("lastVisit");
  const totalPostViewsElement = document.getElementById("totalPostViews");
  const mostViewedCountElement = document.getElementById("mostViewedCount");
  const dashTotalPostsEl = document.getElementById("dashTotalPosts");
  const dashTotalProductsEl = document.getElementById("dashTotalProducts");

  if (totalVisitsElement) {
    totalVisitsElement.textContent = visitorCount.toLocaleString();
  }

  if (uniqueVisitorsElement) {
    uniqueVisitorsElement.textContent = uniqueVisitors.toLocaleString();
  }

  if (lastVisitElement) {
    const storedData = localStorage.getItem("visitorData");
    if (storedData) {
      const data = JSON.parse(storedData);
      const lastVisit = new Date(data.lastVisit);
      lastVisitElement.textContent =
        lastVisit.toLocaleDateString() + " " + lastVisit.toLocaleTimeString();
    }
  }

  if (totalPostViewsElement) {
    const totalViews = getTotalPostViews();
    totalPostViewsElement.textContent = totalViews.toLocaleString();
  }

  if (mostViewedCountElement) {
    const mostViewed = getMostViewedPost();
    const topViews = mostViewed ? mostViewed.viewCount || 0 : 0;
    mostViewedCountElement.textContent = topViews.toLocaleString();
  }

  if (dashTotalPostsEl) {
    dashTotalPostsEl.textContent = blogPosts.length.toString();
  }
  if (dashTotalProductsEl) {
    dashTotalProductsEl.textContent = affiliateLinks.length.toString();
  }
}

function resetVisitorCounter() {
  if (
    confirm(
      "Are you sure you want to reset the visitor counter? This action cannot be undone."
    )
  ) {
    visitorCount = 0;
    uniqueVisitors = 0;
    localStorage.removeItem("visitorData");
    sessionStorage.removeItem("visitorSession");
    updateVisitorDisplay();
    showAlert("Visitor counter reset successfully!", "success");
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // CHANGED: Assign DOM Elements *after* DOM is loaded
  blogGrid = document.getElementById("blogGrid");
  affiliateGrid = document.getElementById("affiliateGrid");
  adminModal = document.getElementById("adminModal");
  postModal = document.getElementById("postModal");
  affiliateModal = document.getElementById("affiliateModal");
  adminBtn = document.getElementById("adminBtn"); // This ID doesn't seem to be in index.html, but leaving it
  mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  navMenu = document.querySelector(".nav-menu");

  checkAdminSession();
  loadDataFromStorage();
  loadBlogPosts();
  loadAffiliateLinks(); // Now affiliateGrid will be a valid element
  
  // Fetch shared data file to ensure all users see latest content
  fetchRemoteData();

  setupEventListeners();
  setupSmoothScrolling();
  checkUrlHash();
  initializeVisitorCounter();
}

// Data Persistence Functions
function loadDataFromStorage() {
  // Versioned storage: refresh data when code version changes
  const savedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
  if (savedVersion !== STORAGE_VERSION) {
    blogPosts = [...defaultBlogPosts];
    affiliateLinks = [...defaultAffiliateLinks];
    saveDataToStorage();
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    return;
  }

  // Load blog posts from localStorage
  const savedBlogPosts = localStorage.getItem(STORAGE_KEYS.BLOG);
  if (savedBlogPosts) {
    try {
      blogPosts = JSON.parse(savedBlogPosts);
    } catch (error) {
      console.error("Error loading blog posts from storage:", error);
      blogPosts = [...defaultBlogPosts];
      saveDataToStorage();
    }
  } else {
    // First time - initialize with default data
    blogPosts = [...defaultBlogPosts];
    saveDataToStorage();
  }

  // Load affiliate links from localStorage
  const savedAffiliateLinks = localStorage.getItem(STORAGE_KEYS.AFF);
  if (savedAffiliateLinks) {
    try {
      affiliateLinks = JSON.parse(savedAffiliateLinks);
    } catch (error) {
      console.error("Error loading affiliate links from storage:", error);
      affiliateLinks = [...defaultAffiliateLinks];
      saveDataToStorage();
    }
  } else {
    // First time - initialize with default data
    affiliateLinks = [...defaultAffiliateLinks];
    saveDataToStorage();
  }
}

function saveDataToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(blogPosts));
    localStorage.setItem(STORAGE_KEYS.AFF, JSON.stringify(affiliateLinks));
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
  } catch (error) {
    console.error("Error saving data to storage:", error);
    showAlert(
      "Warning: Unable to save data locally. Changes may be lost on page refresh.",
      "warning"
    );
  }
}

// Utility function to reset data to defaults (for testing)
function resetDataToDefaults() {
  if (
    confirm(
      "Are you sure you want to reset all data to defaults? This will delete all your custom posts and affiliate links."
    )
  ) {
    blogPosts = [...defaultBlogPosts];
    affiliateLinks = [...defaultAffiliateLinks];
    saveDataToStorage();
    loadBlogPosts();
    loadAffiliateLinks();
    if (isAdminLoggedIn) {
      loadAdminPosts();
      loadAdminAffiliate();
    }
    showAlert("Data reset to defaults successfully!", "success");
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", handleNavigation);
  });

  // Mobile menu toggle
  // const mobileMenuToggle = document.querySelector(".mobile-menu-toggle"); // Already defined in initializeApp
  // const navMenu = document.querySelector(".nav-menu"); // Already defined in initializeApp

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    // Close mobile menu when clicking on nav links (except admin/logout)
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (
        !link.classList.contains("admin-nav-link") &&
        !link.classList.contains("logout-nav-link")
      ) {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            closeMobileMenu();
          }
        });
      } else {
        // For admin/logout links, close menu after a short delay
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              closeMobileMenu();
            }, 300);
          }
        });
      }
    });
  }

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleFilter);
  });

  // Admin panel - removed direct click listener, now handled by checkAdminAccess()

  // Modal close buttons
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeAllModals);
  });

  // Admin tabs
  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", switchAdminTab);
  });

  // Form submissions
  document
    .getElementById("postForm")
    .addEventListener("submit", handlePostSubmit);
  document
    .getElementById("affiliateForm")
    .addEventListener("submit", handleAffiliateSubmit);

  // Add buttons
  // The following event listeners are commented out because the target elements
  // with IDs 'addPostBtn' and 'addAffiliateBtn' do not exist in the HTML.
  // The functionality is already handled via onclick attributes on the buttons.
  // document
  //   .getElementById("addPostBtn")
  //   .addEventListener("click", () => openPostModal());
  // document
  //   .getElementById("addAffiliateBtn")
  //   .addEventListener("click", () => openAffiliateModal());

  // CTA button
  const ctaBtn = document.querySelector(".cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      const blogSection = document.getElementById("blog");
      if (blogSection) blogSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      closeAllModals();
    }
  });

  // Close mobile menu when clicking outside
  window.addEventListener("click", function (event) {
    const nav = document.querySelector(".nav");
    // const mobileMenuToggle = document.querySelector(".mobile-menu-toggle"); // Already defined

    if (
      nav &&
      mobileMenuToggle &&
      !nav.contains(event.target) &&
      window.innerWidth <= 768
    ) {
      closeMobileMenu();
    }
  });

  // Handle window resize
  window.addEventListener("resize", handleWindowResize);
}

// Mobile Menu Functions
function toggleMobileMenu() {
  // const mobileMenuToggle = document.querySelector(".mobile-menu-toggle"); // Already defined
  // const navMenu = document.querySelector(".nav-menu"); // Already defined

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
}

function closeMobileMenu() {
  // const mobileMenuToggle = document.querySelector(".mobile-menu-toggle"); // Already defined
  // const navMenu = document.querySelector(".nav-menu"); // Already defined

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function handleWindowResize() {
  // Close mobile menu if window is resized to desktop size
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
}

// Navigation handling
function handleNavigation(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute("href").substring(1);
  const targetSection = document.getElementById(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({ behavior: "smooth" });

    // Update active nav link
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    e.target.classList.add("active");
  }
}

// Filter handling
function handleFilter(e) {
  const filterType = e.target.dataset.filter;
  const platform = e.target.dataset.platform;

  // Update active filter button
  e.target.parentNode
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  if (filterType) {
    filterBlogPosts(filterType);
  }

  if (platform) {
    filterAffiliateLinks(platform);
  }
}

// Load and display blog posts
function loadBlogPosts() {
  if (!blogGrid) return; // Add guard clause
  blogGrid.innerHTML = "";

  // Sort posts (pinned first, then by date)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  sortedPosts.forEach((post) => {
    const postElement = createBlogPostElement(post);
    blogGrid.appendChild(postElement);
  });
}

// Create blog post element
function createBlogPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.className = `blog-card fade-in ${post.pinned ? "pinned" : ""}`;

  postDiv.innerHTML = `
        ${
          post.image
            ? `<img src="${post.image}" alt="${post.title}" loading="lazy">`
            : ""
        }
        <div class="blog-content">
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 150)}...</p>
            <div class="blog-meta">
                <span class="blog-category ${
                  post.category
                }">${post.category.toUpperCase()}</span>
                <span class="blog-date">${formatDate(post.date)}</span>
            </div>
            <button class="read-more" onclick="viewBlogPost(${post.id})">
                Read More <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;

  return postDiv;
}

// Load and display affiliate links
function loadAffiliateLinks() {
  if (!affiliateGrid) return; // Add guard clause
  affiliateGrid.innerHTML = "";

  // Sort affiliate links (featured first)
  const sortedLinks = [...affiliateLinks].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  sortedLinks.forEach((link) => {
    const linkElement = createAffiliateElement(link);
    affiliateGrid.appendChild(linkElement);
  });
}

// Create affiliate link element
function createAffiliateElement(link) {
  const linkDiv = document.createElement("div");
  linkDiv.className = `affiliate-card fade-in ${
    link.featured ? "featured" : ""
  }`;

  linkDiv.innerHTML = `
        ${
          link.image
            ? `<img src="${link.image}" alt="${link.title}" loading="lazy">`
            : ""
        }
        <div class="affiliate-content">
            <h3>${link.title}</h3>
            <p>${link.description}</p>
            <div class="affiliate-meta">
                <span class="affiliate-platform ${
                  link.platform
                }">${link.platform.toUpperCase()}</span>
                <span class="affiliate-price">${link.price}</span>
            </div>
            <button class="view-product" onclick="openAffiliateLink('${
              link.url
            }')">
                View Product <i class="fas fa-external-link-alt"></i>
            </button>
        </div>
    `;

  return linkDiv;
}

// Filter blog posts
function filterBlogPosts(filter) {
  const posts =
    filter === "all"
      ? blogPosts
      : filter === "pinned"
      ? blogPosts.filter((post) => post.pinned)
      : blogPosts.filter((post) => post.category === filter);

  if (!blogGrid) return;
  blogGrid.innerHTML = "";
  posts.forEach((post) => {
    const postElement = createBlogPostElement(post);
    blogGrid.appendChild(postElement);
  });
}

// Filter affiliate links
function filterAffiliateLinks(platform) {
  const links =
    platform === "all"
      ? affiliateLinks
      : affiliateLinks.filter((link) => link.platform === platform);

  if (!affiliateGrid) return;
  affiliateGrid.innerHTML = "";
  links.forEach((link) => {
    const linkElement = createAffiliateElement(link);
    affiliateGrid.appendChild(linkElement);
  });
}

// Fetch latest data from shared JSON file
async function fetchRemoteData() {
  try {
    const res = await fetch(`data.json?v=${STORAGE_VERSION}`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();

    if (Array.isArray(data.posts)) {
      blogPosts = data.posts;
    }
    if (Array.isArray(data.affiliates)) {
      affiliateLinks = data.affiliates;
    }

    // Persist and re-render
    saveDataToStorage();
    loadBlogPosts();
    loadAffiliateLinks();
    if (isAdminLoggedIn) {
      loadAdminPosts();
      loadAdminAffiliate();
      updateDashboardStats();
    }
  } catch (e) {
    console.warn('Could not fetch data.json', e);
  }
}

// Export site data for deployment to data.json
function exportSiteData() {
  const payload = {
    posts: blogPosts,
    affiliates: affiliateLinks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Admin Panel Functions
function openAdminPanel() {
  if (!adminModal) return;
  adminModal.style.display = "block";
  // Always show dashboard tab by default
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(".tab-btn[data-tab='dashboard']").classList.add("active");
  document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));
  document.getElementById("dashboard-tab").classList.add("active");
  loadAdminPosts();
  loadAdminAffiliate();
  updateDashboardStats();
}

function closeAllModals() {
  if (adminModal) adminModal.style.display = "none";
  if (postModal) postModal.style.display = "none";
  if (affiliateModal) affiliateModal.style.display = "none";
  currentEditingPost = null;
  currentEditingAffiliate = null;
}

function switchAdminTab(e) {
  const tabName = e.target.dataset.tab;
  switchAdminTabByName(tabName);
}

// Allow switching tabs programmatically from quick action buttons
function switchAdminTabByName(tabName) {
  // Update active tab button
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const btn = document.querySelector(`.tab-btn[data-tab='${tabName}']`);
  if (btn) btn.classList.add("active");

  // Show corresponding tab content
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  if (tabName === "dashboard") {
    const el = document.getElementById("dashboard-tab");
    if (el) el.classList.add("active");
  } else if (tabName === "posts") {
    const el = document.getElementById("posts-tab");
    if (el) el.classList.add("active");
  } else if (tabName === "affiliate") {
    const el = document.getElementById("affiliate-tab");
    if (el) el.classList.add("active");
  }
}

// Post Management
function openPostModal(post = null) {
  currentEditingPost = post;
  const modal = document.getElementById("postModal");
  const title = document.getElementById("postModalTitle");
  const form = document.getElementById("postForm");

  if (post) {
    title.textContent = "Edit Post";
    document.getElementById("postTitle").value = post.title;
    document.getElementById("postContent").value = post.content;
    document.getElementById("postCategory").value = post.category;
    document.getElementById("postImage").value = post.image || "";
    document.getElementById("postPinned").checked = post.pinned;
  } else {
    title.textContent = "Add New Post";
    form.reset();
  }

  modal.style.display = "block";
}

function handlePostSubmit(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById("postTitle").value,
    content: document.getElementById("postContent").value,
    category: document.getElementById("postCategory").value,
    image: document.getElementById("postImage").value,
    pinned: document.getElementById("postPinned").checked,
  };

  if (currentEditingPost) {
    // Update existing post
    const index = blogPosts.findIndex(
      (post) => post.id === currentEditingPost.id
    );
    blogPosts[index] = {
      ...currentEditingPost,
      ...formData,
      date: new Date().toISOString().split("T")[0],
    };
    showAlert("Post updated successfully!", "success");
  } else {
    // Add new post
    const newPost = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split("T")[0],
      viewCount: 0,
    };
    blogPosts.unshift(newPost);
    showAlert("Post added successfully!", "success");
  }

  // Save to localStorage
  saveDataToStorage();

  loadBlogPosts();
  loadAdminPosts();
  closeAllModals();
}

// Affiliate Management
function openAffiliateModal(link = null) {
  currentEditingAffiliate = link;
  const modal = document.getElementById("affiliateModal");
  const title = document.getElementById("affiliateModalTitle");
  const form = document.getElementById("affiliateForm");

  if (link) {
    title.textContent = "Edit Affiliate Link";
    document.getElementById("affiliateTitle").value = link.title;
    document.getElementById("affiliateDescription").value = link.description;
    document.getElementById("affiliatePlatform").value = link.platform;
    document.getElementById("affiliateUrl").value = link.url;
    document.getElementById("affiliatePrice").value = link.price;
    document.getElementById("affiliateImage").value = link.image || "";
  } else {
    title.textContent = "Add New Affiliate Link";
    form.reset();
  }

  modal.style.display = "block";
}

function handleAffiliateSubmit(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById("affiliateTitle").value,
    description: document.getElementById("affiliateDescription").value,
    platform: document.getElementById("affiliatePlatform").value,
    url: document.getElementById("affiliateUrl").value,
    price: document.getElementById("affiliatePrice").value,
    image: document.getElementById("affiliateImage").value,
  };

  if (currentEditingAffiliate) {
    // Update existing affiliate link
    const index = affiliateLinks.findIndex(
      (link) => link.id === currentEditingAffiliate.id
    );
    affiliateLinks[index] = {
      ...currentEditingAffiliate,
      ...formData,
    };
    showAlert("Affiliate link updated successfully!", "success");
  } else {
    // Add new affiliate link
    const newLink = {
      id: Date.now(),
      ...formData,
      featured: false,
    };
    affiliateLinks.unshift(newLink);
    showAlert("Affiliate link added successfully!", "success");
  }

  // Save to localStorage
  saveDataToStorage();

  loadAffiliateLinks();
  loadAdminAffiliate();
  closeAllModals();
}

// Admin List Functions
function loadAdminPosts() {
  const adminPostsList = document.getElementById("adminPostsList");
  adminPostsList.innerHTML = "";

  blogPosts.forEach((post) => {
    const postElement = createAdminPostElement(post);
    adminPostsList.appendChild(postElement);
  });
}

function createAdminPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "admin-item";

  postDiv.innerHTML = `
        <div class="admin-item-header">
            <h3 class="admin-item-title">${post.title} ${
    post.pinned ? "ðŸ“Œ" : ""
  }</h3>
            <div class="admin-item-actions">
                <button class="btn btn-primary" onclick="openPostModal(${JSON.stringify(
                  post
                ).replace(/"/g, "&quot;")})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn ${
                  post.pinned ? "btn-secondary" : "btn-success"
                }" onclick="togglePinPost(${post.id})">
                    <i class="fas fa-thumbtack"></i> ${
                      post.pinned ? "Unpin" : "Pin"
                    }
                </button>
                <button class="btn btn-warning" onclick="resetPostViewCount(${
                  post.id
                })">
                    <i class="fas fa-eye"></i> Reset Views
                </button>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
        <div class="admin-item-content">${post.content.substring(
          0,
          200
        )}...</div>
        <div class="admin-item-meta">
            <span class="blog-category ${
              post.category
            }">${post.category.toUpperCase()}</span>
            <span class="blog-date">${formatDate(post.date)}</span>
            <span class="view-count">
                <i class="fas fa-eye"></i> ${post.viewCount || 0} views
            </span>
        </div>
    `;

  return postDiv;
}

function loadAdminAffiliate() {
  const adminAffiliateList = document.getElementById("adminAffiliateList");
  adminAffiliateList.innerHTML = "";

  affiliateLinks.forEach((link) => {
    const linkElement = createAdminAffiliateElement(link);
    adminAffiliateList.appendChild(linkElement);
  });
}

function createAdminAffiliateElement(link) {
  const linkDiv = document.createElement("div");
  linkDiv.className = "admin-item";

  linkDiv.innerHTML = `
        <div class="admin-item-header">
            <h3 class="admin-item-title">${link.title} ${
    link.featured ? "â­" : ""
  }</h3>
            <div class="admin-item-actions">
                <button class="btn btn-primary" onclick="openAffiliateModal(${JSON.stringify(
                  link
                ).replace(/"/g, "&quot;")})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn ${
                  link.featured ? "btn-secondary" : "btn-success"
                }" onclick="toggleFeatureAffiliate(${link.id})">
                    <i class="fas fa-star"></i> ${
                      link.featured ? "Unfeature" : "Feature"
                    }
                </button>
                <button class="btn btn-danger" onclick="deleteAffiliate(${
                  link.id
                })">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
        <div class="admin-item-content">${link.description.substring(
          0,
          200
        )}...</div>
        <div class="admin-item-meta">
            <span class="affiliate-platform ${
              link.platform
            }">${link.platform.toUpperCase()}</span>
            <span class="affiliate-price">${link.price}</span>
        </div>
    `;

  return linkDiv;
}

// CRUD Operations
function togglePinPost(postId) {
  const post = blogPosts.find((p) => p.id === postId);
  if (post) {
    post.pinned = !post.pinned;
    saveDataToStorage();
    loadBlogPosts();
    loadAdminPosts();
    showAlert(
      `Post ${post.pinned ? "pinned" : "unpinned"} successfully!`,
      "success"
    );
  }
}

function toggleFeatureAffiliate(linkId) {
  const link = affiliateLinks.find((l) => l.id === linkId);
  if (link) {
    link.featured = !link.featured;
    saveDataToStorage();
    loadAffiliateLinks();
    loadAdminAffiliate();
    showAlert(
      `Affiliate link ${
        link.featured ? "featured" : "unfeatured"
      } successfully!`,
      "success"
    );
  }
}

function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    blogPosts = blogPosts.filter((p) => p.id !== postId);
    saveDataToStorage();
    loadBlogPosts();
    loadAdminPosts();
    showAlert("Post deleted successfully!", "success");
  }
}

function deleteAffiliate(linkId) {
  if (confirm("Are you sure you want to delete this affiliate link?")) {
    affiliateLinks = affiliateLinks.filter((l) => l.id !== linkId);
    saveDataToStorage();
    loadAffiliateLinks();
    loadAdminAffiliate();
    showAlert("Affiliate link deleted successfully!", "success");
  }
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function openAffiliateLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function viewBlogPost(postId) {
  const post = blogPosts.find((p) => p.id === postId);
  if (post) {
    // Increment view count for this post
    incrementPostViewCount(postId);

    // In a real app, this would navigate to a full post page
    alert(`Viewing: ${post.title}\n\n${post.content}`);
  }
}

// Post View Counter Functions
function incrementPostViewCount(postId) {
  const post = blogPosts.find((p) => p.id === postId);
  if (post) {
    // Check if user has already viewed this post in this session
    const viewedPosts = JSON.parse(
      sessionStorage.getItem("viewedPosts") || "[]"
    );

    if (!viewedPosts.includes(postId)) {
      // First time viewing this post in this session
      post.viewCount = (post.viewCount || 0) + 1;
      viewedPosts.push(postId);

      // Save to session storage
      sessionStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));

      // Save to localStorage
      saveDataToStorage();

      // Update admin display if admin panel is open
      if (
        isAdminLoggedIn &&
        adminModal &&
        adminModal.style.display === "block"
      ) {
        loadAdminPosts();
        updateDashboardStats();
      }
    }
  }
}

function getTotalPostViews() {
  return blogPosts.reduce((total, post) => total + (post.viewCount || 0), 0);
}

function getMostViewedPost() {
  return blogPosts.reduce((mostViewed, post) => {
    return (post.viewCount || 0) > (mostViewed.viewCount || 0)
      ? post
      : mostViewed;
  }, blogPosts[0] || null);
}

function resetPostViewCount(postId) {
  if (confirm("Are you sure you want to reset the view count for this post?")) {
    const post = blogPosts.find((p) => p.id === postId);
    if (post) {
      post.viewCount = 0;
      saveDataToStorage();
      loadAdminPosts();
      updateDashboardStats();
      showAlert("Post view count reset successfully!", "success");
    }
  }
}

function resetAllPostViewCounts() {
  if (
    confirm(
      "Are you sure you want to reset view counts for ALL posts? This action cannot be undone."
    )
  ) {
    blogPosts.forEach((post) => {
      post.viewCount = 0;
    });
    saveDataToStorage();
    loadAdminPosts();
    updateDashboardStats();
    showAlert("All post view counts reset successfully!", "success");
  }
}

function setupSmoothScrolling() {
  // Update active nav link on scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

function showAlert(message, type = "info") {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  // Create new alert
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  // Insert at the top of the modal body
  const modalBody = document.querySelector(".modal-body");
  if (modalBody) {
    // Add guard clause
    modalBody.insertBefore(alert, modalBody.firstChild);
  }

  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Close modal function for external use
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Initialize loading states
function showLoading(element) {
  element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

// Search functionality (can be added later)
function searchContent(query) {
  // Implementation for search functionality
  console.log("Searching for:", query);
}

// Admin Authentication Functions
function checkAdminSession() {
  const sessionData = localStorage.getItem("adminSession");
  const sessionLogin = sessionStorage.getItem("adminLoggedIn");

  if (sessionData && sessionLogin) {
    try {
      const session = JSON.parse(sessionData);
      const currentTime = new Date().getTime();
      const sessionAge = currentTime - session.loginTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge <= maxAge) {
        isAdminLoggedIn = true;
        showAdminControls();
        return true;
      } else {
        // Session expired
        clearAdminSession();
      }
    } catch (error) {
      clearAdminSession();
    }
  }

  isAdminLoggedIn = false;
  hideAdminControls();
  return false;
}

function checkAdminAccess() {
  if (isAdminLoggedIn) {
    openAdminPanel();
  } else {
    // Redirect to login page
    window.location.href = "admin-login.html";
  }
}

function showAdminControls() {
  const adminNavItem = document.getElementById("adminNavItem");
  const logoutNavItem = document.getElementById("logoutNavItem");

  if (adminNavItem) {
    adminNavItem.style.display = "block";
  }
  if (logoutNavItem) {
    logoutNavItem.style.display = "block";
  }
}

function hideAdminControls() {
  const adminNavItem = document.getElementById("adminNavItem");
  const logoutNavItem = document.getElementById("logoutNavItem");

  // Keep Admin link visible even when logged out; only hide Logout
  if (adminNavItem) {
    adminNavItem.style.display = "block";
  }
  if (logoutNavItem) {
    logoutNavItem.style.display = "none";
  }
}

function logout() {
  if (confirm("Are you sure you want to logout from the admin panel?")) {
    clearAdminSession();
    showAlert("Logged out successfully!", "success");

    // Reload page to refresh state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

function clearAdminSession() {
  localStorage.removeItem("adminSession");
  localStorage.removeItem("adminCredentials");
  sessionStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminLoginTime");
  isAdminLoggedIn = false;
  hideAdminControls();
}

function checkUrlHash() {
  // Check if user was redirected from login page
  if (window.location.hash === "#admin") {
    // Remove hash from URL
    history.replaceState(null, null, window.location.pathname);

    // Open admin panel if logged in
    if (isAdminLoggedIn) {
      setTimeout(() => {
        openAdminPanel();
      }, 500);
    }
  }
}

// Session timeout warning
function setupSessionTimeout() {
  if (isAdminLoggedIn) {
    const sessionData = localStorage.getItem("adminSession");
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const currentTime = new Date().getTime();
      const sessionAge = currentTime - session.loginTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const remainingTime = maxAge - sessionAge;

      // Show warning 5 minutes before expiry
      if (remainingTime > 5 * 60 * 1000) {
        setTimeout(() => {
          if (isAdminLoggedIn) {
            showSessionWarning();
          }
        }, remainingTime - 5 * 60 * 1000);
      }
    }
  }
}

function showSessionWarning() {
  const warning = document.createElement("div");
  warning.className = "session-warning";
  warning.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Your session will expire in 5 minutes. <a href="#" onclick="extendSession()">Extend session</a></span>
            <button onclick="this.parentElement.parentElement.remove()">Ã—</button>
        </div>
    `;

  document.body.appendChild(warning);

  // Auto remove after 30 seconds
  setTimeout(() => {
    if (warning.parentElement) {
      warning.remove();
    }
  }, 30000);
}

function extendSession() {
  const sessionData = localStorage.getItem("adminSession");
  if (sessionData) {
    const session = JSON.parse(sessionData);
    session.loginTime = new Date().getTime();
    localStorage.setItem("adminSession", JSON.stringify(session));

    showAlert("Session extended successfully!", "success");

    // Remove warning
    const warning = document.querySelector(".session-warning");
    if (warning) {
      warning.remove();
    }
  }
}

// Add session warning styles
function addSessionWarningStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .session-warning {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f59e0b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        
        .warning-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .warning-content a {
            color: white;
            text-decoration: underline;
            font-weight: bold;
        }
        
        .warning-content button {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 10px;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);
}

// Initialize session timeout when page loads
document.addEventListener(
  "DOMContentLoaded",
  function () {
    addSessionWarningStyles();
    setTimeout(setupSessionTimeout, 1000);

    // Initialize mobile menu toggle
    // if (mobileMenuToggle) { // This is now assigned in initializeApp
    //   mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    //   // Close menu when clicking on links
    //   document.querySelectorAll(".nav-link").forEach((link) => {
    //     link.addEventListener("click", () => {
    //       if (navMenu.classList.contains("active")) {
    //         toggleMobileMenu();
  }
  //     });
  //   });
  // }
);

// Export functions for external use
window.openPostModal = openPostModal;
window.openAffiliateModal = openAffiliateModal;
window.closeModal = closeModal;
window.viewBlogPost = viewBlogPost;
window.openAffiliateLink = openAffiliateLink;
window.checkAdminAccess = checkAdminAccess;
window.logout = logout;
window.extendSession = extendSession;
window.resetDataToDefaults = resetDataToDefaults;
window.resetPostViewCount = resetPostViewCount;
window.resetAllPostViewCounts = resetAllPostViewCounts;
window.updateDashboardStats = updateDashboardStats;
window.exportSiteData = exportSiteData;
window.switchAdminTabByName = switchAdminTabByName;
