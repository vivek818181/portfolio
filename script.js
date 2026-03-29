/* ================= TYPING EFFECT ================= */
var typed = new Typed('#typing-text', {
    strings: [
        'AI Student',
        'Data Analyst',
        'Web Developer',
        'Problem Solver'
    ],
    typeSpeed: 60,
    backSpeed: 40,
    loop: true
});


/* ================= SCROLL PROGRESS ================= */
window.onscroll = function () {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    let height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    let scrolled = (winScroll / height) * 100;

    document.getElementById("progress-bar").style.width = scrolled + "%";
};


/* ================= THEME TOGGLE ================= */
function toggleTheme() {
    document.body.classList.toggle('light-theme');

    const btn = document.querySelector('nav button');

    btn.innerHTML = document.body.classList.contains('light-theme')
        ? '☀️'
        : '🌙';
}