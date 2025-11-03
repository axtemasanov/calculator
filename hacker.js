// АДАПТАЦИЯ ПОД МОБИЛЬНЫЙ: Обработчик изменения viewport (тулбар/клавиатура)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const terminal = document.querySelector('.terminal');
    const inputLine = document.querySelector('.input-line');
    if (terminal && inputLine) {
      terminal.style.height = `calc(100dvh - ${inputLine.offsetHeight}px - env(safe-area-inset-bottom))`;
      terminal.scrollTop = terminal.scrollHeight; // Скролл к низу
    }
  }, 100); // Дебounce для плавности
});

// Фикс для visualViewport (Android/Chrome)
if ('visualViewport' in window) {
  window.visualViewport.addEventListener('resize', () => {
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      terminal.style.height = `${window.visualViewport.height}px`;
    }
  });
}

// Фикс фокуса на поле ввода
const cmd = document.getElementById('cmd');
if (cmd) {
  cmd.addEventListener('focus', () => {
    setTimeout(() => {
      window.scrollTo(0, 1); // Лёгкий скролл, чтобы тулбар не мешал
    }, 300);
  });
}
