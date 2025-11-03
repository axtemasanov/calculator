// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let generator = null;
let aiEnabled = false;
let history = [];
let historyIndex = -1;
let output = document.getElementById('output');
let input = document.getElementById('cmd');
let typeSound = document.getElementById('typeSound');
let enterBtn = document.getElementById('enterBtn');

// Функция отправки команды (для кнопки)
function sendCommand() {
  if (enterBtn.classList.contains('sending')) return; // Блокировка спама
  
  const cmd = input.value.trim();
  if (!cmd) return;
  
  // Немедленная обратная связь: меняем кнопку
  enterBtn.textContent = 'Отправка...';
  enterBtn.classList.add('sending');
  enterBtn.disabled = true;
  
  addLine(`guest@anon:~$ ${cmd}`, 'input');
  processCommand(cmd);
  history.unshift(cmd);
  historyIndex = -1;
  input.value = '';
  
  // Таймаут для возврата кнопки (после ответа)
  setTimeout(() => {
    enterBtn.textContent = 'Enter';
    enterBtn.classList.remove('sending');
    enterBtn.disabled = false;
  }, 2000); // 2 сек, или удлини, если ИИ долго думает
}

// processCommand (с прогрессом для ИИ)
function processCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  
  if (lower === 'help') {
    enterBtn.textContent = 'Выполняю...';
    enterBtn.classList.add('processing');
    typeLine("msg <текст> — анонимка");
    typeLine("hack — симуляция");
    typeLine("clear — очистить");
    typeLine("ai on — включить ИИ");
    typeLine("ai <вопрос> — спросить");
    setTimeout(() => {
      enterBtn.textContent = 'Enter';
      enterBtn.classList.remove('processing');
    }, 500);
  } else if (lower === 'ai on') {
    loadAI();
    enterBtn.textContent = 'Загружается...';
    enterBtn.classList.add('processing');
  } else if (lower.startsWith('ai ')) {
    const q = cmd.slice(3).trim();
    if (!q) { 
      typeLine("Ошибка: вопрос?", 'error');
      resetButton();
      return; 
    }
    if (!aiEnabled) { 
      typeLine("Сначала: ai on", 'error');
      resetButton();
      return; 
    }
    
    // Прогресс "ДУМАЮ..." 
    enterBtn.textContent = 'Думаю...';
    enterBtn.classList.add('processing');
    let thinkingLine = addLine(`[AI] Думаю... [░░░░░░░░░░]`, 'thinking');
    let dots = 0;
    let barPos = 0;
    const thinkingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      barPos = (barPos + 1) % 10;
      const bar = '█'.repeat(barPos) + '░'.repeat(10 - barPos);
      thinkingLine.textContent = `[AI] Думаю${'.'.repeat(dots)} [${bar}]`;
      scrollToBottom();
    }, 500);

    generateAI(q, thinkingInterval, thinkingLine);
  } else if (lower.startsWith('msg ')) {
    enterBtn.textContent = 'Отправляю...';
    enterBtn.classList.add('processing');
    typeLine(`[ANON] ${cmd.slice(4)}`, 'msg');
    setTimeout(resetButton, 500);
  } else if (lower === 'clear') {
    enterBtn.textContent = 'Очищаю...';
    enterBtn.classList.add('processing');
    output.innerHTML = '';
    setTimeout(resetButton, 300);
  } else if (lower === 'hack') {
    enterBtn.textContent = 'Взламываю...';
    enterBtn.classList.add('processing');
    hackSimulation();
  } else {
    enterBtn.textContent = 'Ошибка...';
    enterBtn.classList.add('sending');
    typeLine(`bash: ${cmd}: не найдено`, 'error');
    setTimeout(resetButton, 1000);
  }
}

// Сброс кнопки
function resetButton() {
  enterBtn.textContent = 'Enter';
  enterBtn.classList.remove('sending', 'processing');
  enterBtn.disabled = false;
}

// Остальные функции (loadAI, generateAI, streamResponse, typeLine, addLine, scrollToBottom, hackSimulation) — как в предыдущем коде
// (Копировать оттуда, чтобы не повторять — они не изменились)

const loadAI = async () => {
  // ... (как раньше)
};

async function generateAI(q, thinkingInterval, thinkingLine) {
  try {
    const res = await generator(`Q: ${q}\nA:`, { max_new_tokens: 80 });
    const ans = res[0].generated_text.split('A:')[1]?.trim() || "Не понял.";
    
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    
    streamResponse(`[AI] ${ans}`, 'ai');
    setTimeout(resetButton, 1000); // Сброс после ответа
  } catch (e) {
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    typeLine("[AI] Ошибка.", 'error');
    resetButton();
  }
}

// ... (остальные функции без изменений: streamResponse, typeLine, addLine, scrollToBottom, hackSimulation, и приветствие/эффекты)
