// Глобальные переменные
let generator = null;
let aiEnabled = false;
let history = [];
let historyIndex = -1;
let output = document.getElementById('output');
let input = document.getElementById('cmd');
let typeSound = document.getElementById('typeSound');

// Глобальная функция processCommand
function processCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  if (lower === 'help') {
    typeLine("msg <текст> — анонимка");
    typeLine("hack — симуляция");
    typeLine("clear — очистить");
    typeLine("ai on — включить ИИ");
    typeLine("ai <вопрос> — спросить");
  } else if (lower === 'ai on') {
    loadAI();
  } else if (lower.startsWith('ai ')) {
    const q = cmd.slice(3).trim();
    if (!q) { typeLine("Ошибка: вопрос?", 'error'); return; }
    if (!aiEnabled) { typeLine("Сначала: ai on", 'error'); return; }
    
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
    typeLine(`[ANON] ${cmd.slice(4)}`, 'msg');
  } else if (lower === 'clear') {
    output.innerHTML = '';
  } else if (lower === 'hack') {
    hackSimulation();
  } else {
    typeLine(`bash: ${cmd}: не найдено`, 'error');
  }
}

// Загрузка ИИ
const loadAI = async () => {
  if (aiEnabled) return;
  
  let progressLine = addLine("[AI] Загрузка модели... [░░░░░░░░░░] 0%", 'progress-line');
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;
    updateProgressBar(progressLine, progress, "Загрузка модели...");
    if (progress >= 100) clearInterval(progressInterval);
  }, 2000);

  try {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    generator = await pipeline('text-generation', 'Xenova/distilgpt2');
    aiEnabled = true;
    clearInterval(progressInterval);
    updateProgressBar(progressLine, 100, "[AI] ГОТОВ. Пиши: ai <вопрос>");
    progressLine.className = 'line success';
  } catch (e) {
    clearInterval(progressInterval);
    updateProgressBar(progressLine, 0, "[AI] Ошибка загрузки. Нет интернета?");
    progressLine.className = 'line error';
  }
};

function updateProgressBar(line, percent, text) {
  const barLength = 10;
  const filled = Math.floor((percent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  line.textContent = `${text} [${bar}] ${Math.floor(percent)}%`;
  scrollToBottom();
}

// Генерация ИИ
async function generateAI(q, thinkingInterval, thinkingLine) {
  try {
    const res = await generator(`Q: ${q}\nA:`, { max_new_tokens: 80 });
    const ans = res[0].generated_text.split('A:')[1]?.trim() || "Не понял.";
    
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    
    streamResponse(`[AI] ${ans}`, 'ai');
  } catch (e) {
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    typeLine("[AI] Ошибка.", 'error');
  }
}

// Поток ответа
function streamResponse(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type} streaming`;
  line.textContent = '';
  output.appendChild(line);
  let i = 0;
  const int = setInterval(() => {
    if (i < text.length) {
      line.textContent += text[i++];
      if (typeSound) typeSound.play().catch(() => {});
      scrollToBottom();
    } else {
      clearInterval(int);
      line.classList.remove('streaming');
    }
  }, 50);
}

// Печать посимвольно
function typeLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = '';
  output.appendChild(line);
  let i = 0;
  const int = setInterval(() => {
    if (i < text.length) {
      line.textContent += text[i++];
      if (typeSound) typeSound.play().catch(() => {});
    } else clearInterval(int);
    scrollToBottom();
  }, 25);
}

// Добавление строки
function addLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
  return line;
}

// Скролл вниз
function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

// Симуляция взлома
function hackSimulation() {
  const steps = ["Сканирую сеть...", "Взлом порта 443...", "Root-доступ...", "ВЗЛОМ УСПЕШЕН!"];
  let i = 0;
  const run = () => { 
    if (i < steps.length) { 
      typeLine(steps[i++], i === steps.length ? 'success' : ''); 
      setTimeout(run, 1200); 
    } 
  };
  run();
}

// Эффекты (при загрузке)
const terminal = document.querySelector('.terminal');
if (terminal) {
  terminal.classList.add('crt');
  for (let i = 0; i < 3; i++) {
    const crack = document.createElement('div');
    crack.className = 'crack';
    crack.style.left = Math.random() * 100 + '%';
    crack.style.top = Math.random() * 100 + '%';
    terminal.appendChild(crack);
  }
}

// Приветствие (при загрузке)
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("Команды: help, msg, hack, clear, ai on");
typeLine("");

// Ввод (keydown)
if (input) {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = input.value.trim();
      if (cmd) {
        addLine(`guest@anon:~$ ${cmd}`, 'input');
        processCommand(cmd);
        history.unshift(cmd);
        historyIndex = -1;
      }
      input.value = '';
    } else if (e.key === 'ArrowUp' && history.length) {
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      input.value = history[historyIndex] || '';
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      historyIndex = Math.max(historyIndex - 1, -1);
      input.value = historyIndex === -1 ? '' : history[historyIndex];
      e.preventDefault();
    } else if (e.key.length === 1) {
      if (typeSound) typeSound.play().catch(() => {});
    }
  });

  input.addEventListener('touchstart', () => input.focus());
}
