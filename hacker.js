// Инициализация Transformers.js
const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');

let generator = null; // Будет GPT-модель

const output = document.getElementById('output');
const input = document.getElementById('cmd');
const typeSound = document.getElementById('typeSound');
let history = [];
let historyIndex = -1;

// Добавляем CRT и трещины
document.querySelector('.terminal').classList.add('crt');
for (let i = 0; i < 3; i++) {
  const crack = document.createElement('div');
  crack.className = 'crack';
  crack.style.left = Math.random() * 100 + '%';
  crack.style.top = Math.random() * 100 + '%';
  document.querySelector('.terminal').appendChild(crack);
}

// Загружаем GPT-модель при старте (один раз)
async function loadModel() {
  try {
    generator = await pipeline('text-generation', 'Xenova/distilgpt2');
    typeLine("[SYSTEM] ИИ-бот загружен. Используй 'ai <вопрос>' для взлома разума.", 'success');
  } catch (error) {
    typeLine("[ERROR] Не удалось загрузить ИИ. Проверь интернет.", 'error');
  }
}

// Приветствие
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("ИИ-бот активирован: 'ai Привет, кто ты?'");
typeLine("");
loadModel(); // Запускаем загрузку

// Обработка ввода
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
  } else if (e.key === 'ArrowUp') {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    } else if (historyIndex === 0) {
      historyIndex = -1;
      input.value = '';
    }
    e.preventDefault();
  } else if (e.key.length === 1) {
    typeSound.currentTime = 0;
    typeSound.volume = 0.1;
    typeSound.play();
  }
});

function processCommand(cmd) {
  const lower = cmd.toLowerCase();

  if (lower === 'help') {
    typeLine("Доступные команды:");
    typeLine("  msg <текст>  — отправить анонимное сообщение");
    typeLine("  ai <вопрос>  — спросить у ИИ-бота (GPT-style)");
    typeLine("  clear        — очистить терминал");
    typeLine("  hack         — запустить симуляцию взлома");
    typeLine("  whoami       — кто ты?");
  } else if (lower.startsWith('msg ')) {
    const msg = cmd.slice(4).trim();
    if (msg) {
      typeLine(`[ANON] ${msg}`, 'msg');
      setTimeout(() => typeLine(`[SYSTEM] Сообщение доставлено в darknet.`, 'system'), 800);
    }
  } else if (lower.startsWith('ai ')) {
    const question = cmd.slice(3).trim();
    if (question && generator) {
      typeLine(`[ИИ] Обрабатываю запрос: "${question}"...`, 'system');
      aiChat(question);
    } else if (!generator) {
      typeLine("[ERROR] ИИ не загружен. Подожди 10-20 сек.", 'error');
    } else {
      typeLine("[ERROR] Укажи вопрос после 'ai'.", 'error');
    }
  } else if (lower === 'clear') {
    output.innerHTML = '';
  } else if (lower === 'hack') {
    hackSimulation();
  } else if (lower === 'whoami') {
    typeLine("Вы — АНОНИМ. IP скрыт. Следов нет.");
  } else {
    typeLine(`bash: ${cmd}: команда не найдена. Введите 'help'`, 'error');
  }
}

async function aiChat(question) {
  try {
    // Генерируем ответ (короткий, чтобы быстро)
    const output = await generator(`Human: ${question}\nAI:`, {
      max_new_tokens: 50, // Короткие ответы для скорости
      temperature: 0.7,
      do_sample: true
    });
    
    const response = output[0].generated_text.split('AI:')[1]?.trim() || 'Не понял запрос.';
    typeLine(`[ИИ] ${response}`, 'ai');
  } catch (error) {
    typeLine("[ИИ] Ошибка генерации. Попробуй проще.", 'error');
  }
}

function addLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function typeLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `line ${type}`;
  output.appendChild(line);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      line.textContent += text[i];
      typeSound.currentTime = 0;
      typeSound.volume = 0.08;
      typeSound.play();
      i++;
    } else {
      clearInterval(interval);
    }
    output.scrollTop = output.scrollHeight;
  }, 30);
}

// Симуляция взлома
function hackSimulation() {
  const steps = [
    "Инициализация бэкдора...",
    "Сканирование портов: 22, 80, 443 [OPEN]",
    "Инъекция SQL: ' OR 1=1--",
    "Получение root-доступа...",
    "Установка кейлоггера...",
    "Шифрование данных AES-256...",
    "Удаление логов...",
    "🔥 ВЗЛОМ УСПЕШЕН 🔥"
  ];

  let i = 0;
  const run = () => {
    if (i < steps.length) {
      typeLine(steps[i], i === steps.length - 1 ? 'success' : '');
      i++;
      setTimeout(run, 1200);
    }
  };
  run();
}
