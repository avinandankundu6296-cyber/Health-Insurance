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
        window.location.href = "home.html";
      } else alert("Enter User ID & Password");
    });
  }
});

// --- Navigation ---
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
function selectRole(role) {
  if (role === "Policy Management") window.location.href = "policy-management.html";
}
function goTo(page) {
  window.location.href = page;
}

// --- Proposal Number Logic ---
function generateProposalNumber() {
  const productCode = document.getElementById("productSelect").value;
  const today = new Date();
  const dateStr = today.toISOString().slice(0,10).replace(/-/g, "");
  const proposalNo = `${productCode}/00/${dateStr}/001`;
  const policyNo = `POL/${proposalNo}`;
  localStorage.setItem("proposalNo", proposalNo);
  localStorage.setItem("policyNo", policyNo);
  document.getElementById("proposalDisplay").textContent = `Proposal No: ${proposalNo}`;
}

// --- Show proposal in form page ---
document.addEventListener("DOMContentLoaded", () => {
  const ref = document.getElementById("proposalRef");
  if (ref) {
    ref.textContent = `Proposal No: ${localStorage.getItem("proposalNo") || "--"}`;
  }
});


// --- Role → Module Mapping ---
const roleModules = {
  "COPS": ["Policy Management", "Accounting"],
  "BOPS": ["Policy Management", "IT Operations", "Administration"],
  "HOADMIN": ["Administration", "Accounting", "IT Operations"],
  "UWR": ["Policy Management", "Underwriting Review"],
  "COQC": ["Policy Management", "Quality Check"]
};

let selectedRole = "BOPS"; // default role

// --- Display Modules Dynamically ---
function displayModules() {
  const roleSelect = document.getElementById("roleSelect");
  const moduleList = document.getElementById("moduleList");
  const currentRole = document.getElementById("currentRole");

  selectedRole = roleSelect.value;
  currentRole.textContent = selectedRole;
  moduleList.innerHTML = "";

  const modules = roleModules[selectedRole];
  if (!modules || modules.length === 0) {
    moduleList.innerHTML = `<p class="text-gray-500 text-center">No modules available for this role.</p>`;
    return;
  }

  // Create module cards
  modules.forEach(mod => {
    const div = document.createElement("div");
    div.textContent = mod;
    div.className =
      "p-4 text-center border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white text-blue-700 font-semibold transition";
    div.onclick = () => handleModuleClick(mod);
    moduleList.appendChild(div);
  });
}

// --- Module Click Handler ---
function handleModuleClick(module) {
  localStorage.setItem("selectedRole", selectedRole);
  localStorage.setItem("selectedModule", module);

  if (module === "Policy Management") {
    window.location.href = "policy-management.html";
  } else {
    alert(`${module} module is not available in Sprint 1 (Coming Soon).`);
  }
}

// --- Logout ---
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}


