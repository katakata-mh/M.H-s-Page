/* -------------------------------
   ページ読み込み時の初期化
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    console.log("Mypage.js 読み込み完了");
    setupLinks();
    setupHamburgerMenu();
    setupIntroSection();
    setupDogFollower();
    setupAccordion();
});

/* -------------------------------
    リンクの自動設定＋現在ページ無効化
-------------------------------- */
function setupLinks() {
    const linkMap = {
        "link-logo": "home.html",
        "link-home-menu": "home.html",
        "link-intro-menu": "intro.html",
        "link-projects-menu": "projects.html",
        "link-pj1-menu": "pj_site.html",
        "link-pj2-menu": "pj_pgosys.html",
        "link-pro_pj1": "pj_site.html",
        "link-pro_pj2": "pj_pgosys.html",
        "link-intro-summary": "intro.html",
        "link-projects-summary": "projects.html",
        "link-home-footer": "home.html",
        "link-intro-footer": "intro.html",
        "link-projects-footer": "projects.html",
        "link-pj1-footer": "pj_site.html",
        "link-pj2-footer": "pj_pgosys.html"
    };

    const currentPage = location.href.split("/").pop();

    Object.entries(linkMap).forEach(([id, url]) => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute("href", url);
            if (url === currentPage && id !== "link-logo") {
                element.classList.add("disabled");
                element.style.pointerEvents = "none";
                element.style.opacity = "0.5";
            }
        }
    });
}

/* -------------------------------
    ハンバーガーメニューの表示制御
-------------------------------- */
let hideTimer;
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.getElementById('menu');

    if (hamburger && menu) {
        hamburger.addEventListener('mouseenter', cancelHideMenu);
        menu.addEventListener('mouseenter', cancelHideMenu);
        hamburger.addEventListener('mouseleave', scheduleHideMenu);
        menu.addEventListener('mouseleave', scheduleHideMenu);
    }
}
function scheduleHideMenu() {
    hideTimer = setTimeout(() => {
        const menu = document.getElementById('menu');
        if (menu) menu.style.display = 'none';
    }, 1000);
}
function cancelHideMenu() {
    clearTimeout(hideTimer);
}
function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }
}

/* -------------------------------
    犬が画像上をついてくる
-------------------------------- */
function setupDogFollower() {
    const topImage = document.querySelector('.top-image');
    const dog = document.querySelector('.doggif');

    if (!topImage || !dog) return;

    let targetX = 60;
    let targetY = topImage.getBoundingClientRect().height - 40;
    let currentX = targetX;
    let currentY = targetY;
    let prevX = targetX;

    dog.style.left = `${targetX}px`;
    dog.style.top = `${targetY}px`;

    let idleTimer;
    let mouseMoved = false;

    // アニメーション
    function animate() {
        currentX += (targetX - currentX) * 0.04;
        currentY += (targetY - currentY) * 0.04;

        dog.style.left = `${currentX}px`;
        dog.style.top = `${currentY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // ランダムに歩く
    function walkRandomly() {
        const rect = topImage.getBoundingClientRect();
        const maxX = rect.width - 40;
        const maxY = rect.height - 30;
        const minX = 40;
        const minY = 30;

        targetX = Math.random() * (maxX - minX) + minX;
        targetY = Math.random() * (maxY - minY) + minY;

        dog.src = (targetX > prevX) ? 'images/R_dog.gif' : 'images/L_dog.gif';
        prevX = targetX;

        if (!mouseMoved) {
            setTimeout(walkRandomly, 4000);
        }
    }
    walkRandomly();

    // マウスについてくる
    topImage.addEventListener('mousemove', (e) => {
        mouseMoved = true;
        clearTimeout(idleTimer);

        const rect = topImage.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const maxX = rect.width - 40;
        const maxY = rect.height - 30;
        const minX = 40;
        const minY = 30;

        x = Math.max(minX, Math.min(x, maxX));
        y = Math.max(minY, Math.min(y, maxY));

        targetX = x;
        targetY = y;

        if (targetX > prevX && !dog.src.includes('R_dog.gif')) {
            dog.src = 'images/R_dog.gif';
        } else if (targetX < prevX && !dog.src.includes('L_dog.gif')) {
            dog.src = 'images/L_dog.gif';
        }

        prevX = targetX;

        idleTimer = setTimeout(() => {
            mouseMoved = false;
            walkRandomly();
        }, 5000);
    });
}

/* -------------------------------
   自己紹介セクションの切り替え＋フェード
-------------------------------- */
function setupIntroSection() {
    const buttons = document.querySelectorAll(".link-buttons button");
    const sections = document.querySelectorAll(".content-section");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-section");

            sections.forEach(section => {
                section.style.display = "none";
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = "block";

                const lines = targetSection.querySelectorAll("p");
                lines.forEach((line, index) => {
                    line.classList.remove("visible");
                    line.classList.add("fade-line");
                    setTimeout(() => {
                        line.classList.add("visible");
                    }, index * 800);
                });
            }
        });
    });
}

/* -------------------------------
   アコーディオン式Q&A
-------------------------------- */
function setupAccordion() {
    const toggles = document.querySelectorAll('.accordion-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.accordion-item');
            const isOpen = item.classList.contains('active');
            item.classList.toggle('active');
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    });
}