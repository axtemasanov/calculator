// === БЕСПЛАТНЫЙ ИИ В БРАУЗЕРЕ (Hugging Face) ===
let generator = null;
let aiEnabled = false;

const loadAI = async () => {
  if (aiEnabled) return;
  typeLine("[AI] Загрузка модели... (10-20 сек)", 'system');
  try {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
    generator = await pipeline('text-generation', 'Xenova/distilgpt2');
    aiEnabled = true;
    typeLine("[AI] ГОТОВ. Пиши: ai <вопрос>", 'success');
  } catch (e) {
    typeLine("[AI] Ошибка загрузки. Нет интернета?", 'error');
  }
};

// === ОСНОВНОЙ КОД ===
const output = document.getElementById('output');
const input = document.getElementById('cmd');
const typeSound = document.getElementById('typeSound');
let history = [], historyIndex = -1;

// Эффекты
document.querySelector('.terminal').classList.add('crt');
for (let i = 0; i < 3; i++) {
  const crack = document.createElement('div');
  crack.className = 'crack';
  crack.style.left = Math.random() * 100 + '%';
  crack.style.top = Math.random() * 100 + '%';
  document.querySelector('.terminal').appendChild(crack);
}

// Приветствие
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("Команды: help, msg, hack, clear, ai on");
typeLine("");

// Ввод
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      addLine(`guest@anon:~$ ${cmd}`, 'input');
      processCommand(cmd);
      history.unshift(cmd); historyIndex = -1;
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
    typeSound.currentTime = 0; typeSound.volume = 0.08; typeSound.play();
  }
});

function processCommand(cmd) {
  const lower = cmd.toLowerCase();
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
    typeLine(`[AI] Думаю...`, 'system');
    generateAI(q);
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

async function generateAI(q) {
  try {
    const res = await generator(`Q: ${q}\nA:`, { max_new_tokens: 50 });
    const ans = res[0].generated_text.split('A:')[1]?.trim() || "Не понял.";
    typeLine(`[AI] ${ans}`, 'ai');
  } catch (e) {
    typeLine("[AI] Ошибка.", 'error');
  }
}

function typeLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  output.appendChild(line);
  let i = 0;
  const int = setInterval(() => {
    if (i < text.length) {
      line.textContent += text[i++];
      typeSound.currentTime = 0; typeSound.play();
    } else clearInterval(int);
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
