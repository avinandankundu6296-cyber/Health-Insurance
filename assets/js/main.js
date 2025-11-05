// --- Mock Login ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("userId").value.trim();
      const pass = document.getElementById("password").value.trim();
      if (user && pass) {
        localStorage.setItem("loggedInUser", user);
        localStorage.setItem("selectedRole", "HOADMIN"); // default on first login
        window.location.href = "home.html";
      } else alert("Enter User ID & Password");
    });
  }

  // --- Load Saved Role (on Home / Policy Management / others) ---
  const roleSelect = document.getElementById("roleSelect");
  if (roleSelect) {
    const savedRole = localStorage.getItem("selectedRole") || "HOADMIN";
    roleSelect.value = savedRole;
  }

  // --- Display User Welcome (on any page) ---
  const welcome = document.getElementById("welcomeUser");
  if (welcome) {
    const user = localStorage.getItem("loggedInUser") || "User";
    welcome.textContent = `Welcome, ${user}`;
  }

  // --- Show Proposal Number if Present ---
  const ref = document.getElementById("proposalRef");
  if (ref) {
    ref.textContent = `Proposal No: ${localStorage.getItem("proposalNo") || "--"}`;
  }
});

// --- Navigation ---
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function selectRole(role) {
  if (role === "Policy Management") window.location.href = "policy-management.html";
}

function goTo(page) {
  window.location.href = page;
}

// --- Change Role (Global Function for Dropdowns) ---
function changeRole() {
  const role = document.getElementById("roleSelect").value;
  localStorage.setItem("selectedRole", role);
  window.location.href = "home.html";
}

// --- Proposal Number Logic ---
function generateProposalNumber() {
  const productCode = document.getElementById("productSelect").value;
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const proposalNo = `${productCode}/00/${dateStr}/001`;
  const policyNo = `POL/${proposalNo}`;
  localStorage.setItem("proposalNo", proposalNo);
  localStorage.setItem("policyNo", policyNo);
  document.getElementById("proposalDisplay").textContent = `Proposal No: ${proposalNo}`;
}

// --- Role → Modules Mapping ---
const roleModules = {
  "COPS": ["Policy Management", "Accounting"],
  "BOPS": ["Policy Management", "IT Operations", "Administration"],
  "HOADMIN": ["Accounting", "Administration", "Policy Management", "IT Operations", "Business Partners", "Claims", "Documents", "Providers"],
  "UWR": ["Policy Management", "Underwriting Review"],
  "COQC": ["Policy Management", "Quality Check"]
};

// --- Icon Mapping for Modules ---
const moduleIcons = {
  "Policy Management": "folder-cog",
  "Accounting": "wallet",
  "Administration": "settings",
  "IT Operations": "server",
  "Business Partners": "users",
  "Claims": "file-text",
  "Documents": "file-stack",
  "Providers": "building-2",
  "Underwriting Review": "clipboard-check",
  "Quality Check": "check-circle"
};

let selectedRole = "HOADMIN"; // default

// --- Render Lucide Icons ---
if (typeof lucide !== "undefined") lucide.createIcons();

// --- Display Modules (used on Home) ---
function displayModules() {
  const roleSelect = document.getElementById("roleSelect");
  const moduleList = document.getElementById("moduleList");
  const currentRole = document.getElementById("currentRole");

  // Load from dropdown or saved state
  selectedRole = roleSelect ? roleSelect.value : localStorage.getItem("selectedRole") || "HOADMIN";
  localStorage.setItem("selectedRole", selectedRole);

  if (currentRole) currentRole.textContent = selectedRole;
  if (!moduleList) return;

  moduleList.innerHTML = "";
  const modules = roleModules[selectedRole];

  if (!modules || modules.length === 0) {
    moduleList.innerHTML = `<p class="text-gray-500 text-center col-span-2">No modules available for this role.</p>`;
    return;
  }

  // Create Module Cards
  modules.forEach(mod => {
    const icon = moduleIcons[mod] || "circle";
    const div = document.createElement("div");
    div.className =
      "flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 p-4 rounded-lg shadow-md transition transform hover:-translate-y-1 cursor-pointer";
    div.innerHTML = `
      <i data-lucide="${icon}" class="w-8 h-8 mb-2"></i>
      <span class="font-semibold text-center">${mod}</span>
    `;
    div.onclick = () => handleModuleClick(mod);
    moduleList.appendChild(div);
  });

  // Refresh icons
  lucide.createIcons();
}

// --- Handle Module Click ---
function handleModuleClick(module) {
  localStorage.setItem("selectedRole", selectedRole);
  localStorage.setItem("selectedModule", module);

  if (module === "Policy Management") {
    window.location.href = "policy-management.html";
  } else {
    alert(`${module} module is not available in Sprint 1 (Coming Soon).`);
  }
}
