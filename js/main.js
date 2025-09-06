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
// ---- Carrusel auto + drag + click para descripción ----
const container = document.querySelector('.carousel-container');
const track = document.querySelector('.carousel-track');
let cards = Array.from(track.querySelectorAll('.card'));

let index = 0;
let autoScrollTimer = null;
let slideDistance = 0;   // px a desplazar por cada índice
let visibleCount = 3;    // cuantas tarjetas se ven a la vez
let maxIndex = Math.max(0, cards.length - visibleCount);
const AUTO_INTERVAL = 3000; // ms

// Calcula tamaños y variables dependientes del layout
function updateSizes() {
  // Re-ligar lista de cards por si el cliente añade nuevas
  cards = Array.from(track.querySelectorAll('.card'));
  if (cards.length === 0) return;

  // ancho de la primera tarjeta
  const cardRect = cards[0].getBoundingClientRect();
  const cardWidth = cardRect.width;

  // obtener gap CSS (fallback 0)
  const style = window.getComputedStyle(track);
  const gap = parseFloat(style.gap || style.columnGap || '0') || 0;

  slideDistance = Math.round(cardWidth + gap);

  // cuantas tarjetas caben en el contenedor entero
  visibleCount = Math.max(1, Math.floor(container.clientWidth / slideDistance));
  maxIndex = Math.max(0, cards.length - visibleCount);

  // ajustar índice si quedó fuera de rango
  if (index > maxIndex) index = 0;

  // aplicar posición actual sin animación extra
  goToIndex(index, false);
}

// Mover a un índice (con/sin animación)
function goToIndex(i, animate = true) {
  // limitar i entre 0 y maxIndex
  index = Math.max(0, Math.min(i, maxIndex));
  if (animate) {
    track.style.transition = 'transform 0.5s ease';
  } else {
    track.style.transition = 'none';
  }
  const x = -(index * slideDistance);
  track.style.transform = `translateX(${x}px)`;
}

// Función next (ciclo)
function moveNext() {
  if (index >= maxIndex) {
    index = 0;
  } else {
    index++;
  }
  goToIndex(index, true);
}

// Auto-scroll
function startAutoScroll() {
  stopAutoScroll();
  autoScrollTimer = setInterval(moveNext, AUTO_INTERVAL);
}
function stopAutoScroll() {
  if (autoScrollTimer) clearInterval(autoScrollTimer);
  autoScrollTimer = null;
}

// Drag / Swipe (mouse + touch)
let isDragging = false;
let startX = 0;
let currentTranslate = 0;

function pointerDown(e) {
  stopAutoScroll();
  isDragging = true;
  startX = (e.touches ? e.touches[0].clientX : e.clientX);
  // quitar transición para arrastrar suave
  track.style.transition = 'none';
}
function pointerMove(e) {
  if (!isDragging) return;
  const currentX = (e.touches ? e.touches[0].clientX : e.clientX);
  const dx = currentX - startX;
  const baseX = -index * slideDistance;
  track.style.transform = `translateX(${baseX + dx}px)`;
}
function pointerUp(e) {
  if (!isDragging) return;
  isDragging = false;
  const endX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
  const dx = endX - startX;

  // Umbral de swipe (50px)
  if (dx > 50 && index > 0) {
    goToIndex(index - 1, true);
  } else if (dx < -50 && index < maxIndex) {
    goToIndex(index + 1, true);
  } else {
    goToIndex(index, true);
  }

  startAutoScroll();
}

// Click en tarjeta → activar descripción (y desactivar otras)
function setupCardClicks() {
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // si se estaba arrastrando, ignorar click accidental
      if (isDragging) return;

      // toggle: si ya estaba activa, la desactivamos; si no, activamos esta y desactivamos otras
      const already = card.classList.contains('active');
      cards.forEach(c => c.classList.remove('active'));
      if (!already) card.classList.add('active');
    });
  });

  // click fuera de cualquier tarjeta cierra la descripción activa
  document.addEventListener('click', (e) => {
    if (!track.contains(e.target)) {
      cards.forEach(c => c.classList.remove('active'));
    }
  });
}

// Inicialización
function initCarousel() {
  // listeners pointer (soporta touch y mouse)
  track.addEventListener('mousedown', pointerDown);
  track.addEventListener('touchstart', pointerDown, {passive:true});

  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('touchmove', pointerMove, {passive:true});

  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('touchend', pointerUp);

  // recalcular en resize / load / orientationchange
  window.addEventListener('resize', () => {
    updateSizes();
  });
  window.addEventListener('orientationchange', () => updateSizes());
  window.addEventListener('load', () => updateSizes());

  setupCardClicks();
  updateSizes();
  startAutoScroll();
}

// Ejecutar (DOM ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}
