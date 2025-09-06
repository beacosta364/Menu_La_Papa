const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

// Toggle menú al presionar el ícono hamburguesa
menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); 
    navMenu.classList.toggle("show");
});

// Cerrar menú si el usuario hace click fuera
document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("show") &&
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navMenu.classList.remove("show");
    }
});

// cerrar al hacer clic en un enlace del menú
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("show");
    });
});


////////////////////////////////////////////////////////////////

// Scroll suave con JS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        block: "start"
        });
    });
});


///////////////////////////////////////////////////////////////////////////////////////////

// Typewriter Effect para seccion INICIO
const words = ["Sabor", "Servicio", "Ambiente"];
let wordIndex = 0;
let charIndex = 0;
let currentWord = "";
let isDeleting = false;

const changingText = document.getElementById("changing-text");

function typeEffect() {
    currentWord = words[wordIndex];

    if (!isDeleting) {
        changingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500); 
            return;
        }
    } else {
        changingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 80 : 150);
}

// Iniciar efecto
document.addEventListener("DOMContentLoaded", typeEffect);
//////////////////////////////////////////////////////////////////////////////////////////////////////