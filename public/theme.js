// theme.js
// Include this on every page, anywhere before </body> (next to your other <script> tags).
// Inserts a "Theme: System / Light / Dark" row directly above "Sign Out" in the sidebar.
// Cycles System -> Light -> Dark -> System... on click, and persists the choice.
// "System" means: follow the OS/browser's prefers-color-scheme automatically.

(function () {
  const STORAGE_KEY = 'flexfit-theme'; // stored value is one of: 'system' | 'light' | 'dark'
  const ORDER = ['system', 'light', 'dark'];
  const LABELS = { system: 'Theme: System', light: 'Theme: Light', dark: 'Theme: Dark' };

  const media = window.matchMedia('(prefers-color-scheme: dark)');

  function resolvedTheme(mode) {
    if (mode === 'system') return media.matches ? 'dark' : 'light';
    return mode;
  }

  function applyMode(mode) {
    document.documentElement.setAttribute('data-theme', resolvedTheme(mode));
    document.documentElement.setAttribute('data-theme-mode', mode);
    localStorage.setItem(STORAGE_KEY, mode);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = LABELS[mode];
  }

  function getMode() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ORDER.includes(stored) ? stored : 'system';
  }

  function cycleMode() {
    const current = getMode();
    const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
    applyMode(next);
  }

  function insertToggleButton() {
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
    btn.style.marginTop = 'auto';
    btn.onclick = cycleMode;

    signOutLink.parentNode.insertBefore(btn, signOutLink);
    btn.textContent = LABELS[getMode()];
  }

  // Apply saved mode immediately, before the rest of the page paints.
  applyMode(getMode());

  // If the user is on "system" and the OS theme changes while the page is open, follow it live.
  media.addEventListener('change', () => {
    if (getMode() === 'system') applyMode('system');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertToggleButton);
  } else {
    insertToggleButton();
  }
})();