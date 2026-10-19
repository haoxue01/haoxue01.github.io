// Has to be in the head tag, otherwise a flicker effect will occur.
let toggleTheme = (theme) => {
  setTheme(theme == "dark" ? "light" : "dark");
};

let setTheme = (theme, animate = true) => {
  if (animate) transTheme();
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try { localStorage.setItem("theme", theme); } catch (e) {}
};

let transTheme = () => {
  document.documentElement.classList.add("transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 500);
};

let initTheme = (theme) => {
  if (theme == null) {
    const userPref = window.matchMedia;
    if (userPref && userPref('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }
  }
  setTheme(theme, false);
};

let storedTheme = null;
try { storedTheme = localStorage.getItem("theme"); } catch (e) {}
initTheme(storedTheme);
