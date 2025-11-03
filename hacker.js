// === УМНЫЙ РУССКИЙ ИИ (RUGPT-3 SMALL + FEW-SHOT PROMPT) ===
let generator = null;
let aiEnabled = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// Suppress WARN от ONNXRuntime
const originalWarn = console.warn;
console.warn = function(...args) {
  if (args[0] && args[0].toString().includes('onnxruntime') && args[0].toString().includes('CleanUnusedInitializersAndNodeArgs')) {
    return;
  }
  originalWarn.apply(console, args);
};

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
    generator = await pipeline('text-generation', 'Xenova/sberbank-ai/rugpt3small_based_on_gpt2');
    aiEnabled = true;
    retryCount = 0;
    clearInterval(progressInterval);
    updateProgressBar(progressLine, 100, "[AI] ГОТОВ. Пиши: ai <вопрос>");
    progressLine.className = 'line success';
  } catch (e) {
    clearInterval(progressInterval);
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      updateProgressBar(progressLine, 0, "[AI] Ошибка — перезагрузка... (" + retryCount + "/" + MAX_RETRIES + ")");
      setTimeout(() => loadAI(), 3000);
    } else {
      updateProgressBar(progressLine, 0, "[AI] Ошибка. Проверь интернет или перезагрузи страницу.");
      progressLine.className = 'line error';
    }
  }
};

function updateProgressBar(line, percent, text) {
  const barLength = 10;
  const filled = Math.floor((percent / 100) * barLength);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  line.textContent = `${text} [${bar}] ${Math.floor(percent)}%`;
  scrollToBottom();
}

// === ОСНОВНОЙ КОД ===
const output = document.getElementById('output');
const input = document.getElementById('cmd');
const typeSound = document.getElementById('typeSound');
let history = [], historyIndex = -1;

// Эффекты
const terminal = document.querySelector('.terminal');
if (terminal) {
  terminal.classList.add('crt');
  for (let i = 0; i < 5; i++) {
    const crack = document.createElement('div');
    crack.className = 'crack';
    crack.style.left = Math.random() * 100 + '%';
    crack.style.top = Math.random() * 100 + '%';
    terminal.appendChild(crack);
  }
}

// Приветствие
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("Команды: help, msg, hack, clear, ai on");
typeLine("");

// Ввод
if (input) {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendCommand();
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

function sendCommand() {
  if (enterBtn.classList.contains('sending')) return;
  
  const cmd = input.value.trim();
  if (!cmd) return;
  
  enterBtn.textContent = 'Отправка...';
  enterBtn.classList.add('sending');
  enterBtn.disabled = true;
  
  addLine(`guest@anon:~$ ${cmd}`, 'input');
  processCommand(cmd);
  history.unshift(cmd);
  historyIndex = -1;
  input.value = '';
  
  setTimeout(() => {
    enterBtn.textContent = 'Enter';
    enterBtn.classList.remove('sending', 'processing');
    enterBtn.disabled = false;
  }, 4000);
}

function processCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  
  if (lower === 'help') {
    enterBtn.textContent = 'Выполняю...';
    enterBtn.classList.add('processing');
    typeLine("msg <текст> — анонимка");
    typeLine("hack — симуляция");
    typeLine("clear — очистить");
    typeLine("ai on — включить ИИ");
    typeLine("ai <вопрос> — спросить (теперь на русском умнее!)");
    setTimeout(() => enterBtn.classList.remove('processing'), 500);
  } else if (lower === 'ai on') {
    loadAI();
    enterBtn.textContent = 'Загружается...';
    enterBtn.classList.add('processing');
  } else if (lower.startsWith('ai ')) {
    const q = cmd.slice(3).trim();
    if (!q) {
      typeLine("Ошибка: вопрос?", 'error');
      enterBtn.classList.remove('processing');
      return;
    }
    if (!aiEnabled) {
      typeLine("Сначала: ai on", 'error');
      enterBtn.classList.remove('processing');
      return;
    }
    
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
    setTimeout(() => enterBtn.classList.remove('processing'), 500);
  } else if (lower === 'clear') {
    enterBtn.textContent = 'Очищаю...';
    enterBtn.classList.add('processing');
    output.innerHTML = '';
    setTimeout(() => enterBtn.classList.remove('processing'), 300);
  } else if (lower === 'hack') {
    enterBtn.textContent = 'Взламываю...';
    enterBtn.classList.add('processing');
    hackSimulation();
  } else {
    enterBtn.textContent = 'Ошибка...';
    enterBtn.classList.add('sending');
    typeLine(`bash: ${cmd}: не найдено`, 'error');
    setTimeout(() => enterBtn.classList.remove('sending'), 1000);
  }
}

// generateAI (усиленный промпт с few-shot для логики)
async function generateAI(q, thinkingInterval, thinkingLine) {
  try {
    // Few-shot: Примеры "учат" модель отвечать без повторения
    const prompt = `Ты — умный хакерский ассистент. Отвечай на русском, кратко, логично, подробно, без повторения вопроса. Будь полезным напарником.  
Q: Что ты умеешь? A: Я генерирую код, считаю математику, взламываю симуляции, отвечаю на вопросы по киберу. Давай взломаем?  
Q: Как взломать WiFi? A: Используй aircrack-ng: 1. airodump-ng wlan0 для скана. 2. airocrack-ng -w wordlist -b BSSID capture.cap для brute-force. Будь осторожен, это нелегально.  
Q: ${q}\nA:`; // Few-shot: 2 примера "учат" не повторять
    const res = await generator(prompt, { 
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true,
      repetition_penalty: 1.5, // Ещё сильнее
      pad_token_id: generator.tokenizer.eos_token_id // Конец предложения
    });
    let ans = res[0].generated_text.split('A:')[1]?.trim() || "Не понял.";
    
    // Улучшенный парсинг: Если 'A:' не нашлось, берём после \n
    if (!ans) {
      ans = res[0].generated_text.split('\n')[res[0].generated_text.split('\n').length - 1].trim();
    }
    
    // Post-processing: Удаляем вопрос, повторения, обрезаем
    ans = ans.replace(new RegExp(q, 'i'), ''); // Удаляем вопрос (case-insensitive)
    ans = ans.replace(/(\b\w+\b)(?=\s+\1)/g, ''); // Удаляем повторяющиеся слова
    ans = ans.substring(0, 300) + (ans.length > 300 ? '...' : '');
    
    if (ans.startsWith('?') || ans.includes(lower)) { // Если всё равно эхо — добавляем префикс
      ans = "Ответ: " + ans;
    }
    
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    
    streamResponse(`[AI] ${ans}`, 'ai');
  } catch (e) {
    clearInterval(thinkingInterval);
    output.removeChild(thinkingLine);
    typeLine("[AI] Ошибка.", 'error');
  }
}

// Остальные функции (streamResponse, typeLine, addLine, scrollToBottom, hackSimulation) — как раньше (не меняй)
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

function addLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
  return line;
}

function scrollToBottom() {
  if (output) output.scrollTop = output.scrollHeight;
}

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

// Приветствие
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("Команды: help, msg, hack, clear, ai on");
typeLine("");

loadAI(); // Автозагрузка
