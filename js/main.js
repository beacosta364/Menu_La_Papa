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
  cards = Array.from(track.querySelectorAll('.card'));
  if (cards.length === 0) return;

  const cardRect = cards[0].getBoundingClientRect();
  const cardWidth = cardRect.width;

  const style = window.getComputedStyle(track);
  const gap = parseFloat(style.gap || style.columnGap || '0') || 0;

  slideDistance = Math.round(cardWidth + gap);
  visibleCount = Math.max(1, Math.floor(container.clientWidth / slideDistance));
  maxIndex = Math.max(0, cards.length - visibleCount);

  if (index > maxIndex) index = 0;
  goToIndex(index, false);
}

// Mover a un índice (con/sin animación)
function goToIndex(i, animate = true) {
  index = Math.max(0, Math.min(i, maxIndex));
  track.style.transition = animate ? 'transform 0.5s ease' : 'none';
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

function pointerDown(e) {
  stopAutoScroll();
  isDragging = true;
  startX = (e.touches ? e.touches[0].clientX : e.clientX);
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
      if (isDragging) return;

      const already = card.classList.contains('active');
      cards.forEach(c => c.classList.remove('active'));

      if (!already) {
        card.classList.add('active');
        stopAutoScroll();   // 🚨 detener carrusel si hay card activa
      } else {
        startAutoScroll();  // 🚨 reanudar carrusel si se desactiva
      }
    });
  });

  // click fuera de cualquier tarjeta → cerrar y reanudar
  document.addEventListener('click', (e) => {
    if (!track.contains(e.target)) {
      let hadActive = cards.some(c => c.classList.contains('active'));
      cards.forEach(c => c.classList.remove('active'));
      if (hadActive) {
        startAutoScroll();  // 🚨 reanudar cuando se cierre
      }
    }
  });
}

// Inicialización
function initCarousel() {
  track.addEventListener('mousedown', pointerDown);
  track.addEventListener('touchstart', pointerDown, {passive:true});

  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('touchmove', pointerMove, {passive:true});

  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('touchend', pointerUp);

  window.addEventListener('resize', updateSizes);
  window.addEventListener('orientationchange', updateSizes);
  window.addEventListener('load', updateSizes);

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
//////////////////////////////////////////////////////////////////////////////////////
// reservacion
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const form = document.getElementById("reservationForm");

// Cambia rango de horas según el día
dateInput.addEventListener("change", () => {
  const day = new Date(dateInput.value).getDay(); // 0 = domingo
  if (day === 0) {
    // Domingo
    timeInput.min = "12:00";
    timeInput.max = "13:30";
  } else if (day >= 2 && day <= 6) {
    // Martes - Sábado (lunes cerrado)
    timeInput.min = "12:00";
    timeInput.max = "14:00";
  } else {
    // Lunes cerrado
    timeInput.value = "";
    timeInput.min = "";
    timeInput.max = "";
    alert("Lo sentimos, el restaurante está cerrado los lunes.");
  }
  timeInput.value = ""; // reinicia selección al cambiar fecha
});

// Enviar la info a WhatsApp
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const date = dateInput.value;
  const time = timeInput.value;
  const people = document.getElementById("people").value;

  const message = `📅 Reserva de mesa:
👤 Nombre: ${name}
📞 Contacto: ${phone}
📌 Fecha: ${date}
⏰ Hora: ${time}
👥 Personas: ${people}`;

  const restaurantPhone = "573001112233"; // <-- número del restaurante
  const url = `https://wa.me/${restaurantPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});
