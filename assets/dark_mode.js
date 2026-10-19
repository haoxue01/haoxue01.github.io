$(document).ready(function() {
    const mode_toggle = document.getElementById("light-toggle");
    const current = () => document.documentElement.getAttribute("data-theme");
    mode_toggle.addEventListener("click", function() {
        toggleTheme(current());
    });
    mode_toggle.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme(current());
        }
    });
});
