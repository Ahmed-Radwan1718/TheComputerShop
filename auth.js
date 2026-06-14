const SUPABASE_URL = "https://nwzlbxenuiznaydxhhso.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_FKLvX-BMUIwXgv9PKwryRQ_Si9-lkjp";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function createFloatingAccountMenu() {
  if (document.querySelector(".floating-account")) {
    return;
  }

  const floatingAccount = document.createElement("div");
  floatingAccount.className = "floating-account";

  floatingAccount.innerHTML = `
    <button class="floating-account-button" type="button" aria-label="Account menu" aria-expanded="false">
      <img src="user.png" alt="Account">
    </button>

    <div class="floating-account-menu">
      <div class="account-menu-guest">
        <a href="login.html">Log In</a>
        <a href="signup.html">Create Account</a>
      </div>

      <div class="account-menu-authenticated">
        <a href="account.html">My Account</a>
        <button type="button" id="floating-account-logout">Log Out</button>
      </div>
    </div>
  `;

  document.body.appendChild(floatingAccount);

  const accountButton = floatingAccount.querySelector(".floating-account-button");
  const logoutButton = floatingAccount.querySelector("#floating-account-logout");

  accountButton.addEventListener("click", (event) => {
    event.stopPropagation();
    floatingAccount.classList.toggle("open");
    accountButton.setAttribute(
      "aria-expanded",
      floatingAccount.classList.contains("open") ? "true" : "false"
    );
  });

  document.addEventListener("click", (event) => {
    if (!floatingAccount.contains(event.target)) {
      floatingAccount.classList.remove("open");
      accountButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      floatingAccount.classList.remove("open");
      accountButton.setAttribute("aria-expanded", "false");
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;
      logoutButton.textContent = "Logging Out...";

      await supabaseClient.auth.signOut();

      document.body.classList.remove("user-is-logged-in");
      window.location.href = "login.html";
    });
  }
}

async function updateAccountMenuState() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    document.body.classList.add("user-is-logged-in");
  } else {
    document.body.classList.remove("user-is-logged-in");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  createFloatingAccountMenu();
  await updateAccountMenuState();

  supabaseClient.auth.onAuthStateChange(() => {
    updateAccountMenuState();
  });
});
