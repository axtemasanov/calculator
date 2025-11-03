// === ИМПОРТ TRANSFORMERS.JS (БЕСПЛАТНЫЙ GPT В БРАУЗЕРЕ) ===
let generator = null;
const loadModel = async () => {
  try {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    generator = await pipeline('text-generation', 'Xenova/distilgpt2', { 
      quantized: true,
      progress_callback: (x) => console.log('Loading model...', x)
    });
    typeLine("[AI] ИИ-бот активирован. Используй: ai <вопрос>", 'success');
  } catch (e) {
    typeLine("[ERROR] ИИ не загрузился. Нет интернета?", 'error');
  }
};
loadModel();

// === ОСНОВНЫЕ ПЕРЕМЕННЫЕ ===
const output = document.getElementById('output');
const input = document.getElementById('cmd');
const typeSound = document.getElementById('typeSound');
let history = [];
let historyIndex = -1;

// === ЭФФЕКТЫ ===
document.querySelector('.terminal').classList.add('crt');
for (let i = 0; i < 3; i++) {
  const crack = document.createElement('div');
  crack.className = 'crack';
  crack.style.left = Math.random() * 100 + '%';
  crack.style.top = Math.random() * 100 + '%';
  document.querySelector('.terminal').appendChild(crack);
}

// === ПРИВЕТСТВИЕ ===
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("ИИ-бот: введи 'ai Привет' для теста");
typeLine("");

// === ВВОД ===
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      addLine(`guest@anon:~$ ${cmd}`, 'input');
      processCommand(cmd);
      history.unshift(cmd);
      historyIndex = -1;
    }
    input.value = '';
  } else if (e.key === 'ArrowUp' && history.length > 0) {
    if (historyIndex < history.length - 1) historyIndex++;
    input.value = history[historyIndex] || '';
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (historyIndex > 0) historyIndex--;
    input.value = historyIndex === -1 ? '' : history[historyIndex];
    e.preventDefault();
  } else if (e.key.length === 1) {
    typeSound.currentTime = 0;
    typeSound.volume = 0.08;
    typeSound.play();
  }
});

// === КОМАНДЫ ===
function processCommand(cmd) {
  const lower = cmd.toLowerCase();

  if (lower === 'help') {
    typeLine("Команды:");
    typeLine("  msg <текст>  — анонимка");
    typeLine("  ai <вопрос>  — спроси у ИИ");
    typeLine("  hack         — симуляция взлома");
    typeLine("  clear        — очистить");
    typeLine("  whoami       — кто ты?");
  }
  else if (lower.startsWith('msg ')) {
    const msg = cmd.slice(4);
    typeLine(`[ANON] ${msg}`, 'msg');
    setTimeout(() => typeLine("[SYSTEM] Доставлено."), 800);
  }
  else if (lower.startsWith('ai ')) {
    const question = cmd.slice(3).trim();
    if (!question) {
      typeLine("Ошибка: напиши вопрос после 'ai'", 'error');
      return;
    }
    if (!generator) {
      typeLine("ИИ загружается... подожди 10 сек", 'system');
      return;
    }
    typeLine(`[AI] Думаю над: "${question}"...`, 'system');
    generateAIResponse(question);
  }
  else if (lower === 'clear') output.innerHTML = '';
  else if (lower === 'hack') hackSimulation();
  else if (lower === 'whoami') typeLine("Ты — АНОНИМ. IP: 127.0.0.1. Следов нет.");
  else typeLine(`bash: ${cmd}: команда не найдена`, 'error');
}

// === ИИ ОТВЕТ ===
async function generateAIResponse(question) {
  try {
    const result = await generator(`Q: ${question}\nA:`, {
      max_new_tokens: 60,
      temperature: 0.8,
      do_sample: true,
      top_p: 0.9
    });
    const answer = result[0].generated_text.split('A:')[1]?.trim() || "Не понял...";
    typeLine(`[AI] ${answer}`, 'ai');
  } catch (e) {
    typeLine("[AI] Ошибка. Попробуй позже.", 'error');
  }
}

// === АНИМАЦИЯ ПЕЧАТИ ===
function typeLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  output.appendChild(line);
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      line.textContent += text[i++];
      typeSound.currentTime = 0; typeSound.play();
    } else clearInterval(interval);
    output.scrollTop = output.scrollHeight;
  }, 25);
}

function addLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// === СИМУЛЯЦИЯ ВЗЛОМА ===
function hackSimulation() {
  const steps = [
    "Сканирую сеть...",
    "Порт 443: OPEN",
    "SQL-инъекция: SUCCESS",
    "Root-доступ получен",
    "Логи стёрты",
    "ВЗЛОМ УСПЕШЕН"
  ];
  let i = 0;
  const run = () => {
    if (i < steps.length) typeLine(steps[i++], i === steps.length ? 'success' : '');
    else return;
    setTimeout(run, 1000);
  };
  run();
}
