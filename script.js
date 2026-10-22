/* =========================================================
   LUCIDE ICONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

});


/* =========================================================
   GSAP
========================================================= */

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   CURSOR SPOTLIGHT
========================================================= */

const cursorGlow = document.getElementById("cursorGlow");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;

document.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursor() {

    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(animateCursor);

}

animateCursor();


/* =========================================================
   SCROLL PROGRESS + BACK TO TOP
========================================================= */

const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;
    const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }

    if (backToTop) {
        backToTop.classList.toggle("visible", scrollTop > 600);
    }

});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


mobileMenuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

});


document
    .querySelectorAll("#mobileMenu a")
    .forEach((link) => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");

        });

    });


/* =========================================================
   HERO ENTRANCE ANIMATION
========================================================= */

const heroTimeline = gsap.timeline({
    defaults: {
        ease: "power4.out"
    }
});


heroTimeline

    .from(".hero-badge", {
        opacity: 0,
        y: 30,
        duration: 0.7
    })

    .from(".hero-small-text", {
        opacity: 0,
        y: 25,
        duration: 0.6
    }, "-=0.4")

    .from(".hero-title", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1
    }, "-=0.4")

    .from(".hero-role", {
        opacity: 0,
        x: -30,
        duration: 0.7
    }, "-=0.6")

    .from(".hero-description", {
        opacity: 0,
        y: 25,
        duration: 0.7
    }, "-=0.4")

    .from(".hero-content .neon-button, .hero-content .outline-button", {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.6
    }, "-=0.4")

    .from(".hero-metric", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5
    }, "-=0.3")

    .from(".hero-socials a", {
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.5
    }, "-=0.3")

    .from(".badge-swing", {
        y: -520,
        opacity: 0,
        duration: 1.5,
        ease: "bounce.out",
        onComplete: () => startBadgeIdle()
    }, "-=1")

    .from(".floating-card", {
        opacity: 0,
        scale: 0.7,
        stagger: 0.15,
        duration: 0.6
    }, "-=0.5");


/* =========================================================
   CARNET COLGANTE: péndulo + arrastre + holográfico
========================================================= */

const badgeSwing = document.getElementById("photoFrame");
const idCard = document.getElementById("idCard");
const badgeWrapper = document.querySelector(".hero-photo-wrapper");

const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let idleTimeline = null;
let isDragging = false;

gsap.set(badgeSwing, { transformOrigin: "50% 0%" });


/* ---------- Balanceo suave en reposo ---------- */

function startBadgeIdle() {

    if (reduceMotion || isDragging) return;

    if (idleTimeline) idleTimeline.kill();

    idleTimeline = gsap.timeline({ repeat: -1 });

    idleTimeline
        .to(badgeSwing, { rotation: 2.6, duration: 1.4, ease: "sine.inOut" })
        .to(badgeSwing, { rotation: -2.6, duration: 2.8, ease: "sine.inOut" })
        .to(badgeSwing, { rotation: 0, duration: 1.4, ease: "sine.inOut" });

}


/* ---------- Arrastrar el carnet ---------- */

function pivotPoint() {

    const rect = badgeWrapper.getBoundingClientRect();

    return {
        x: rect.left + rect.width / 2,
        y: rect.top
    };

}

idCard.addEventListener("pointerdown", (event) => {

    isDragging = true;

    if (idleTimeline) idleTimeline.kill();

    gsap.killTweensOf(badgeSwing);

    idCard.setPointerCapture(event.pointerId);
    idCard.classList.add("dragging");

    gsap.to(idCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3
    });

});

idCard.addEventListener("pointermove", (event) => {

    /* Efecto holográfico + reflejo siguiendo el cursor */

    const rect = idCard.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    idCard.style.setProperty("--gx", `${px * 100}%`);
    idCard.style.setProperty("--gy", `${py * 100}%`);
    idCard.style.setProperty("--hx", `${px * 100}%`);
    idCard.style.setProperty("--hy", `${py * 100}%`);

    if (isDragging) {

        const pivot = pivotPoint();

        const dx = event.clientX - pivot.x;
        const dy = Math.max(event.clientY - pivot.y, 60);

        let angle = -Math.atan2(dx, dy) * (180 / Math.PI);

        angle = Math.max(-38, Math.min(38, angle));

        gsap.to(badgeSwing, {
            rotation: angle,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true
        });

        return;

    }

    /* Inclinación 3D sutil al pasar el mouse */

    if (event.pointerType === "mouse") {

        gsap.to(idCard, {
            transformPerspective: 900,
            rotateY: (px - 0.5) * 14,
            rotateX: -(py - 0.5) * 14,
            duration: 0.4,
            ease: "power2.out"
        });

    }

});

function releaseBadge() {

    if (!isDragging) return;

    isDragging = false;

    idCard.classList.remove("dragging");

    gsap.to(badgeSwing, {
        rotation: 0,
        duration: 2.6,
        ease: "elastic.out(1, 0.28)",
        overwrite: true,
        onComplete: startBadgeIdle
    });

}

idCard.addEventListener("pointerup", releaseBadge);
idCard.addEventListener("pointercancel", releaseBadge);

idCard.addEventListener("pointerleave", () => {

    if (isDragging) return;

    gsap.to(idCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out"
    });

    idCard.style.setProperty("--gx", "50%");
    idCard.style.setProperty("--gy", "0%");
    idCard.style.setProperty("--hx", "50%");
    idCard.style.setProperty("--hy", "50%");

});


/* ---------- Código de barras generado ---------- */

(function buildBarcode() {

    const target = document.getElementById("idBarcode");

    if (!target) return;

    let seed = 0;

    "LDM-2026-MONTERO".split("").forEach((char) => {
        seed = (seed * 31 + char.charCodeAt(0)) % 2147483647;
    });

    const random = () => {
        seed = (seed * 48271) % 2147483647;
        return seed / 2147483647;
    };

    let x = 0;
    let bars = "";

    while (x < 196) {

        const width = random() > 0.6 ? 3 : random() > 0.5 ? 2 : 1;
        const gap = random() > 0.5 ? 2 : 1;

        bars += `<rect x="${x}" y="0" width="${width}" height="34" fill="currentColor"/>`;

        x += width + gap;

    }

    target.innerHTML =
        `<svg viewBox="0 0 ${x} 34" preserveAspectRatio="none">${bars}</svg>`;

})();


/* =========================================================
   SCROLL REVEALS
========================================================= */

gsap.utils.toArray(".reveal").forEach((element) => {

    gsap.fromTo(
        element,

        {
            opacity: 0,
            y: 60,
            scale: 0.96
        },

        {
            opacity: 1,
            y: 0,
            scale: 1,

            duration: 1,

            ease: "power3.out",

            scrollTrigger: {

                trigger: element,

                start: "top 85%",

                toggleActions:
                    "play none none reverse"

            }

        }
    );

});


/* =========================================================
   SECTION HEADERS
========================================================= */

gsap.utils.toArray(".section-header").forEach((header) => {

    gsap.from(header, {

        opacity: 0,
        x: -50,

        duration: 1,

        ease: "power3.out",

        scrollTrigger: {

            trigger: header,

            start: "top 85%"

        }

    });

});


/* =========================================================
   TECH CARDS STAGGER
========================================================= */

gsap.utils.toArray(".tech-grid").forEach((grid) => {

    const cards =
        grid.querySelectorAll(".tech-card");

    gsap.from(cards, {

        opacity: 0,
        y: 30,
        scale: 0.85,

        stagger: 0.07,

        duration: 0.5,

        ease: "back.out(1.7)",

        scrollTrigger: {

            trigger: grid,

            start: "top 85%"

        }

    });

});


/* =========================================================
   PROJECT CARDS 
========================================================= */

gsap.utils.toArray(".project-card").forEach((card, index) => {

    gsap.from(card, {
        opacity: 0,
        y: 60,
        rotateX: 8,
        scale: 0.96,
        duration: 1,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

});


/* =========================================================
   3D TILT
========================================================= */

const tiltCards =
    document.querySelectorAll(".tilt-card");


tiltCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        if (window.innerWidth < 768) return;

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -5;

        const rotateY =
            ((x - centerX) / centerX) * 5;

        card.style.setProperty(
            "--mouse-x",
            `${x}px`
        );

        card.style.setProperty(
            "--mouse-y",
            `${y}px`
        );

        gsap.to(card, {

            rotateX,
            rotateY,

            duration: 0.35,

            ease: "power2.out",

            transformPerspective: 1000

        });

    });


    card.addEventListener("mouseleave", () => {

        gsap.to(card, {

            rotateX: 0,
            rotateY: 0,

            duration: 0.6,

            ease: "power3.out"

        });

    });

});


/* =========================================================
   PARTICLES
========================================================= */

const canvas =
    document.getElementById("particlesCanvas");

const ctx =
    canvas.getContext("2d");


let particles = [];

let particleMouse = {
    x: null,
    y: null
};


function resizeCanvas() {

    canvas.width =
        window.innerWidth *
        window.devicePixelRatio;

    canvas.height =
        window.innerHeight *
        window.devicePixelRatio;

    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;

    ctx.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
    );

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


document.addEventListener(
    "mousemove",
    (event) => {

        particleMouse.x =
            event.clientX;

        particleMouse.y =
            event.clientY;

    }
);


class Particle {

    constructor() {

        this.x =
            Math.random() *
            window.innerWidth;

        this.y =
            Math.random() *
            window.innerHeight;

        this.size =
            Math.random() * 1.4 + 0.3;

        this.speedX =
            (Math.random() - 0.5) *
            0.25;

        this.speedY =
            (Math.random() - 0.5) *
            0.25;

        this.opacity =
            Math.random() *
            0.4 +
            0.1;

    }


    update() {

        this.x += this.speedX;
        this.y += this.speedY;


        if (this.x < 0)
            this.x = window.innerWidth;

        if (this.x > window.innerWidth)
            this.x = 0;

        if (this.y < 0)
            this.y = window.innerHeight;

        if (this.y > window.innerHeight)
            this.y = 0;


        if (particleMouse.x !== null) {

            const dx =
                this.x -
                particleMouse.x;

            const dy =
                this.y -
                particleMouse.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (distance < 120) {

                const force =
                    (120 - distance) /
                    120;

                this.x +=
                    (dx / distance) *
                    force *
                    0.8;

                this.y +=
                    (dy / distance) *
                    force *
                    0.8;

            }

        }

    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(96, 165, 250, ${this.opacity})`;

        ctx.fill();

    }

}


function createParticles() {

    particles = [];

    const amount =
        Math.min(
            110,
            Math.floor(
                window.innerWidth / 10
            )
        );


    for (let i = 0; i < amount; i++) {

        particles.push(
            new Particle()
        );

    }

}


createParticles();


function connectParticles() {

    for (
        let a = 0;
        a < particles.length;
        a++
    ) {

        for (
            let b = a + 1;
            b < particles.length;
            b++
        ) {

            const dx =
                particles[a].x -
                particles[b].x;

            const dy =
                particles[a].y -
                particles[b].y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance < 110) {

                const opacity =
                    0.08 *
                    (1 - distance / 110);


                ctx.beginPath();

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.strokeStyle =
                    `rgba(59, 130, 246, ${opacity})`;

                ctx.lineWidth = 0.5;

                ctx.stroke();

            }

        }

    }

}


function animateParticles() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    particles.forEach((particle) => {

        particle.update();
        particle.draw();

    });


    connectParticles();

    requestAnimationFrame(
        animateParticles
    );

}


animateParticles();


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const submitBtn =
    document.getElementById("submitBtn");


contactForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const subject =
            document.getElementById("subject").value;

        const message =
            document.getElementById("message").value;


        /*
         * =====================================================
         * DEMO
         * =====================================================
         *
         * Como esta es una web estática, el formulario no
         * puede enviar correos por sí solo.
         *
         * Para producción puedes conectarlo con:
         *
         * - Formspree
         * - Web3Forms
         * - EmailJS
         * - Resend + API
         * - Vercel Functions
         *
         * =====================================================
         */


        const mailto =
            `mailto:luisdavidmontero10.8@gmail.com` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(
                `Nombre: ${name}\n` +
                `Correo: ${email}\n\n` +
                `Mensaje:\n${message}`
            )}`;


        /* Estado "enviando" -> icono avión volando */

        if (submitBtn && !submitBtn.classList.contains("is-sending")) {

            submitBtn.classList.add("is-sending");

            const icon = submitBtn.querySelector("svg");
            const label = submitBtn.querySelector(".submit-btn-label");

            const currentLang =
                localStorage.getItem("portfolio_lang") || "es";

            if (label) {
                label.textContent =
                    translations[currentLang]?.["contact.sending"] || "Enviando...";
            }

            setTimeout(() => {

                window.location.href = mailto;

                submitBtn.classList.remove("is-sending");
                submitBtn.classList.add("is-sent");

                if (label) {
                    label.textContent =
                        translations[currentLang]?.["contact.sent"] ||
                        "¡Listo! Abriendo tu cliente de correo…";
                }

                formMessage.textContent =
                    "Abriendo tu cliente de correo...";

                setTimeout(() => {

                    submitBtn.classList.remove("is-sent");

                    if (label) {
                        label.textContent =
                            translations[currentLang]?.["contact.formSubmit"] ||
                            "Enviar mensaje";
                    }

                }, 3200);

            }, 650);

            return;

        }


        window.location.href = mailto;

        formMessage.textContent =
            "Abriendo tu cliente de correo...";

    }
);


/* =========================================================
   COPIAR CORREO AL PORTAPAPELES
========================================================= */

const copyToast =
    document.getElementById("copyToast");

let copyToastTimer = null;

document.querySelectorAll("[data-copy-email]").forEach((btn) => {

    btn.addEventListener("click", async (event) => {

        event.preventDefault();

        const value = btn.getAttribute("data-copy-email");

        try {

            await navigator.clipboard.writeText(value);

        } catch (err) {

            const temp = document.createElement("textarea");
            temp.value = value;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);

        }

        btn.classList.add("copied");

        setTimeout(() => btn.classList.remove("copied"), 1800);

        if (copyToast) {

            copyToast.classList.add("show");

            clearTimeout(copyToastTimer);

            copyToastTimer = setTimeout(() => {
                copyToast.classList.remove("show");
            }, 2000);

        }

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("main section");

const navLinks =
    document.querySelectorAll(".nav-link");


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    navLinks.forEach((link) => {

                        link.classList.remove(
                            "active"
                        );

                    });


                    const activeLink =
                        document.querySelector(
                            `.nav-link[href="#${entry.target.id}"]`
                        );


                    if (activeLink) {

                        activeLink.classList.add(
                            "active"
                        );

                    }

                }

            });

        },

        {
            threshold: 0.35
        }
    );


sections.forEach((section) => {

    observer.observe(section);

});


/* =========================================================
   SMOOTH ANCHOR OFFSET
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach((anchor) => {

        anchor.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");

                if (
                    targetId === "#" ||
                    !targetId
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                const offset =
                    70;


                const position =
                    target.offsetTop -
                    offset;


                window.scrollTo({

                    top: position,

                    behavior: "smooth"

                });

            }
        );

    });

/* =========================================================
INTERNATIONALIZATION (I18N) - IDIOMAS
========================================================= */

const translations = {
    es: {
        "nav.home": "Inicio",
        "nav.about": "Sobre mí",
        "nav.skills": "Habilidades",
        "nav.projects": "Proyectos",
        "nav.education": "Formación",
        "nav.contact": "Contacto",
        "nav.talk": "Hablemos",

        "hero.badge": "Disponible para nuevos proyectos",
        "hero.small": "HOLA, SOY",
        "hero.description": "Construyo experiencias digitales modernas, escalables y centradas en el usuario, combinando diseño, tecnología y creatividad.",
        "hero.cv": "Descargar CV",
        "hero.contactBtn": "Contactarme",
        "hero.floating1.label": "Actualmente",
        "hero.floating1.value": "Creando soluciones",
        "hero.floating2.label": "Enfoque",
        "hero.floating2.value": "Innovación",
        "badge.status": "Disponible",
        "badge.degree": "Ingeniero de Sistemas",
        "badge.hint": "Arrastra el carnet",
        "hero.metric1": "CONSTANCIA",
        "hero.metric2": "APRENDIENDO",
        "hero.metric3": "ACTITUD",

        "about.eyebrow": "CONÓCEME",
        "about.title": "Sobre",
        "about.titleSpan": "mí",
        "about.p1": "Ingeniero de Sistemas y Junior Full Stack Developer especializado en crear software eficiente, estructurado y listo para resolver problemas del mundo real a través de la tecnología.",
        "about.p2": "Mi enfoque combina el desarrollo web moderno, la gestión eficiente de bases de datos y la ingeniería de software con una sólida base analítica. Me interesa especialmente construir soluciones limpias, escalables y con un impacto real, integrando tanto la lógica de backend como la creatividad en el desarrollo de experiencias interactivas.",
        "about.p3": "Mi objetivo es seguir creciendo como profesional mientras participo en proyectos donde la tecnología pueda generar un impacto real.",
        "about.stat1.title": "Desarrollo",
        "about.stat1.desc": "Interfaces modernas y aplicaciones web responsivas.",
        "about.stat2.title": "Arquitectura",
        "about.stat2.desc": "Código organizado, escalable y mantenible.",
        "about.stat3.title": "UX/UI",
        "about.stat3.desc": "Experiencias digitales intuitivas y atractivas.",
        "about.stat4.title": "Aprendizaje",
        "about.stat4.desc": "Curiosidad constante por nuevas tecnologías.",

        "skills.eyebrow": "MI STACK",
        "skills.title": "Habilidades",
        "skills.titleSpan": "técnicas",
        "skills.cat.databases": "Bases de datos",
        "skills.cat.tools": "Herramientas",

        "projects.eyebrow": "TRABAJO DESTACADO",
        "projects.title": "Mis",
        "projects.titleSpan": "proyectos",
        "project.featured": "DESTACADO",
        "contact.availability": "Disponible para trabajo remoto y freelance · Tunja, Colombia",

        "project1.type": "VIDEOJUEGO EDUCATIVO",

        "project1.title": "World of Words",
        "project1.desc": "Videojuego educacional de plataformas en 2D diseñado para diagnosticar y fortalecer patrones de lectura y escritura mediante mecánicas interactivas.",
        "project.code": "Ver código",
        "project.demo": "Ver Demo",

        "project2.type": "E-COMMERCE",
        "project2.title": "Tienda Online",
        "project2.desc": "Plataforma e-commerce full-stack con catálogo de productos, filtrado avanzado, carrito dinámico y gestión centralizada de inventario y usuarios.",

        "project3.type": "SISTEMA RPC",
        "project3.title": "Sistema de Encuestas RPC",
        "project3.desc": "Aplicación cliente-servidor para la gestión y realización de encuestas, utilizando llamadas a procedimientos remotos (RPC) para la comunicación eficiente de datos.",

        "education.eyebrow": "RESPALDO ACADÉMICO",
        "education.title": "Educación",
        "education.titleSpan": "y certificaciones",
        "education.degreeType": "TÍTULO PROFESIONAL",
        "education.degreeTitle": "Ingeniería de Sistemas",
        "education.degreeInstitution": "Fundación Universitaria Juan de Castellanos — Tunja · 2021 – 2026",
        "education.degreeDesc": "Formación integral en desarrollo de software, estructuras de datos, bases de datos, redes y gestión de proyectos tecnológicos, con énfasis en construir soluciones aplicadas al mundo real.",
        "education.degreeStatus": "Graduado — Honorífico",
        "education.credCount": "Credenciales verificadas",
        "cert1.title": "Software Development with Claude Code",
        "cert1.date": "Emitido en agosto 2026",
        "cert2.issuer": "DEV SENIOR CODE",
        "cert2.title": "Enterprise Full Stack with Spring Boot 4 and Angular 21",
        "cert2.date": "Emitido en marzo 2026",
        "cert3.title": "Claude with Amazon Bedrock",
        "cert3.date": "Emitido en agosto 2026",
        "cert4.title": "Back-End Development",
        "cert4.date": "Emitido en agosto 2026",
        "cert5.title": "Core Concepts and Architecture",
        "cert5.date": "Emitido en septiembre 2026",
        "cert.view": "Ver credencial",
        "cert1.tag": "IA & Automatización",
        "cert2.tag": "Desarrollo Backend",
        "cert3.tag": "Cloud & IA",
        "cert4.tag": "Desarrollo Backend",
        "cert5.tag": "Bases de Datos",

        "contact.eyebrow": "04 — CONTACTO",
        "contact.title": "¿Tienes una idea?",
        "contact.titleSpan": "Hagámosla realidad.",
        "contact.desc": "Si tienes un proyecto, una oportunidad profesional o simplemente quieres conversar sobre tecnología, no dudes en escribirme.",
        "contact.emailLabel": "Correo",
        "contact.formName": "Nombre",
        "contact.formNamePlaceholder": "Tu nombre",
        "contact.formEmail": "Correo electrónico",
        "contact.formEmailPlaceholder": "tu@email.com",
        "contact.formSubject": "Asunto",
        "contact.formSubjectPlaceholder": "¿En qué podemos trabajar?",
        "contact.formMessage": "Mensaje",
        "contact.formMessagePlaceholder": "Cuéntame sobre tu proyecto...",
        "contact.formSubmit": "Enviar mensaje",
        "contact.available": "Disponible para nuevos proyectos",
        "contact.responseTime": "Respondo en menos de 24h",
        "contact.copied": "Correo copiado",
        "contact.privacy": "Tu información nunca se comparte con terceros.",
        "contact.sending": "Enviando...",
        "contact.sent": "¡Listo! Abriendo tu cliente de correo…",

        "footer.text": "Diseñado y desarrollado con pasión por Luis David.",

        "form.name": "Nombre",
        "form.email": "Correo electrónico",
        "form.subject": "Asunto",
        "form.message": "Mensaje",
        "form.submit": "Enviar mensaje"
    },
    en: {
        "nav.home": "Home",
        "nav.about": "About me",
        "nav.skills": "Skills",
        "nav.projects": "Projects",
        "nav.education": "Education",
        "nav.contact": "Contact",
        "nav.talk": "Let's talk",

        "hero.badge": "Available for new projects",
        "hero.small": "HELLO, I AM",
        "hero.description": "I build modern, scalable, and user-centric digital experiences combining design, technology, and creativity.",
        "hero.cv": "Download CV",
        "hero.contactBtn": "Contact me",
        "hero.floating1.label": "Currently",
        "hero.floating1.value": "Building solutions",
        "hero.floating2.label": "Focus",
        "hero.floating2.value": "Innovation",
        "badge.status": "Available",
        "badge.degree": "Systems Engineer",
        "badge.hint": "Drag the badge",
        "hero.metric1": "CONSISTENCY",
        "hero.metric2": "LEARNING",
        "hero.metric3": "ATTITUDE",

        "about.eyebrow": "GET TO KNOW ME",
        "about.title": "About",
        "about.titleSpan": "me",
        "about.p1": "Systems Engineer and Junior Full Stack Developer specialized in building efficient, structured software ready to solve real-world problems through technology.",
        "about.p2": "My approach combines modern web development, efficient database management, and software engineering with a solid analytical foundation. I am especially interested in building clean, scalable solutions with a real impact, integrating both backend logic and creativity in interactive experiences.",
        "about.p3": "My goal is to continue growing as a professional while participating in projects where technology can make a real impact.",
        "about.stat1.title": "Development",
        "about.stat1.desc": "Modern interfaces and responsive web applications.",
        "about.stat2.title": "Architecture",
        "about.stat2.desc": "Organized, scalable, and maintainable code.",
        "about.stat3.title": "UX/UI",
        "about.stat3.desc": "Intuitive and engaging digital experiences.",
        "about.stat4.title": "Learning",
        "about.stat4.desc": "Constant curiosity for new technologies.",

        "skills.eyebrow": "MY STACK",
        "skills.title": "Technical",
        "skills.titleSpan": "skills",
        "skills.cat.databases": "Databases",
        "skills.cat.tools": "Tools",

        "projects.eyebrow": "FEATURED WORK",
        "projects.title": "My",
        "projects.titleSpan": "projects",

        "project.featured": "FEATURED",
        "contact.availability": "Available for remote and freelance work · Tunja, Colombia",

        "project1.type": "EDUCATIONAL GAME",
        "project1.title": "World of Words",
        "project1.desc": "An educational 2D platformer game designed to diagnose and strengthen lectowriting patterns through interactive gameplay mechanics.",
        "project.code": "View code",
        "project.demo": "View Demo",

        "project2.type": "E-COMMERCE",
        "project2.title": "Online Store",
        "project2.desc": "Full-stack e-commerce platform with product catalog, advanced filtering, dynamic cart, and centralized inventory and user management",

        "project3.type": "RPC SYSTEM",
        "project3.title": "RPC Survey System",
        "project3.desc": "Client-server application for managing and conducting surveys, utilizing Remote Procedure Calls (RPC) for efficient data communication.",

        "education.eyebrow": "ACADEMIC BACKGROUND",
        "education.title": "Education",
        "education.titleSpan": "& certifications",
        "education.degreeType": "PROFESSIONAL DEGREE",
        "education.degreeTitle": "Systems Engineering",
        "education.degreeInstitution": "Fundación Universitaria Juan de Castellanos — Tunja · 2021 – 2026",
        "education.degreeDesc": "Comprehensive training in software development, data structures, databases, networking, and technology project management, emphasizing real-world applied solutions.",
        "education.degreeStatus": "Graduated — Honors",
        "education.credCount": "Verified credentials",
        "cert1.title": "Software Development with Claude Code",
        "cert1.date": "Issued August 2026",
        "cert2.issuer": "DEV SENIOR CODE",
        "cert2.title": "Enterprise Full Stack with Spring Boot 4 and Angular 21",
        "cert2.date": "Issued March 2026",
        "cert3.title": "Claude with Amazon Bedrock",
        "cert3.date": "Issued August 2026",
        "cert4.title": "Back-End Development",
        "cert4.date": "Issued August 2026",
        "cert5.title": "Core Concepts and Architecture",
        "cert5.date": "Issued September 2026",
        "cert.view": "View credential",
        "cert1.tag": "AI & Automation",
        "cert2.tag": "Backend Development",
        "cert3.tag": "Cloud & AI",
        "cert4.tag": "Backend Development",
        "cert5.tag": "Databases",


        "contact.eyebrow": "04 — CONTACT",
        "contact.title": "Got an idea?",
        "contact.titleSpan": "Let's make it happen.",
        "contact.desc": "If you have a project, a professional opportunity, or just want to chat about technology, feel free to reach out.",
        "contact.emailLabel": "Email",
        "contact.formName": "Name",
        "contact.formNamePlaceholder": "Your name",
        "contact.formEmail": "Email address",
        "contact.formEmailPlaceholder": "you@email.com",
        "contact.formSubject": "Subject",
        "contact.formSubjectPlaceholder": "What can we work on?",
        "contact.formMessage": "Message",
        "contact.formMessagePlaceholder": "Tell me about your project...",
        "contact.formSubmit": "Send message",
        "contact.available": "Available for new projects",
        "contact.responseTime": "I reply within 24h",
        "contact.copied": "Email copied",
        "contact.privacy": "Your information is never shared with third parties.",
        "contact.sending": "Sending...",
        "contact.sent": "Done! Opening your email client…",

        "footer.text": "Designed and developed with passion by Luis David.",

        "form.name": "Name",
        "form.email": "Email",
        "form.subject": "Subject",
        "form.message": "Message",
        "form.submit": "Send message"


    }
};

document.addEventListener("DOMContentLoaded", () => {
    const langToggle = document.getElementById("langToggle");
    const langText = document.getElementById("langText");

    // Obtener idioma guardado o por defecto 'es'
    let currentLang = localStorage.getItem("portfolio_lang") || "es";
    setLanguage(currentLang);

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            currentLang = currentLang === "es" ? "en" : "es";
            localStorage.setItem("portfolio_lang", currentLang);
            setLanguage(currentLang);
        });
    }

    function setLanguage(lang) {
        if (langText) {
            langText.textContent = lang === "es" ? "EN" : "ES";
        }

        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Actualizar placeholders de los inputs del formulario si es necesario
        if (lang === "en") {
            document.getElementById("name").placeholder = "Your name";
            document.getElementById("email").placeholder = "you@email.com";
            document.getElementById("subject").placeholder = "What can we work on?";
            document.getElementById("message").placeholder = "Tell me about your project...";
        } else {
            document.getElementById("name").placeholder = "Tu nombre";
            document.getElementById("email").placeholder = "tu@email.com";
            document.getElementById("subject").placeholder = "¿En qué podemos trabajar?";
            document.getElementById("message").placeholder = "Cuéntame sobre tu proyecto...";
        }
    }
});

/* =========================================================
   UPGRADE: spotlight, imanes, código animado, marquesina
========================================================= */

(function () {

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    /* Spotlight que sigue al cursor dentro de cada tarjeta */
    document.querySelectorAll(".tech-card, .stat-card, .tilt-card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - r.left}px`);
            card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
    });

    /* Botones magnéticos */
    if (!rm && fine) {
        document.querySelectorAll(".neon-button, .outline-button, .contact-link-icon").forEach((b) => {
            b.addEventListener("pointermove", (e) => {
                const r = b.getBoundingClientRect();
                gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3 });
            });
            b.addEventListener("pointerleave", () => {
                gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
            });
        });
    }

    /* Línea de acento que se dibuja en cada categoría de habilidades */
    document.querySelectorAll(".skill-category").forEach((cat) => {
        ScrollTrigger.create({ trigger: cat, start: "top 85%", onEnter: () => cat.classList.add("is-in") });
    });

    /* Código que se escribe solo */
    const typed = document.getElementById("codeTyped");

    if (typed) {
        const text =
            `const luis = {
  role: "Full Stack Developer",
  base: "Tunja, CO",
  degree: "Systems Engineering",
  learning: true,
  status: "building"
};`;

        if (rm) {
            typed.textContent = text;
        } else {
            new IntersectionObserver((entries, obs) => {
                if (!entries[0].isIntersecting) return;
                obs.disconnect();
                let i = 0;
                const timer = setInterval(() => {
                    typed.textContent = text.slice(0, ++i);
                    if (i >= text.length) clearInterval(timer);
                }, 28);
            }, { threshold: 0.4 }).observe(typed);
        }
    }



})();