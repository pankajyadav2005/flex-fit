// theme.js
// Include this on every page, right after style.css is applied (anywhere before </body> is fine,
// e.g. next to the other <script> tags at the bottom).
// It inserts a black/white theme toggle button directly above "Sign Out" in the sidebar,
// and applies/remembers the chosen theme via localStorage + a data-theme attribute on <html>.

(function () {
  const STORAGE_KEY = 'flexfit-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function insertToggleButton() {
    // Finds the "Sign Out" link (matches the sidebar-signout class used across FlexFit pages)
    // and inserts the theme button immediately before it.
    const signOutLink = document.querySelector('.sidebar-signout[onclick*="signOut"]')
      || Array.from(document.querySelectorAll('.sidebar-signout')).find(el => /sign out/i.test(el.textContent))
      || document.querySelector('.sidebar-signout');

    if (!signOutLink || document.getElementById('theme-toggle-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'sidebar-signout';
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'left';
    btn.style.width = '100%';
    btn.style.font = 'inherit';
    btn.style.color = 'inherit';
    btn.onclick = toggleTheme;

    signOutLink.parentNode.insertBefore(btn, signOutLink);
    btn.textContent = (document.documentElement.getAttribute('data-theme') === 'dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  }

  // Apply saved theme immediately (before paint would be ideal, but this still runs
  // before the rest of body content is interactive).
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertToggleButton);
  } else {
    insertToggleButton();
  }
})();