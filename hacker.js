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

// Приветствие
typeLine("Добро пожаловать в АНОНИМНЫЙ ТЕРМИНАЛ v9.99");
typeLine("Подключение к darknet... [OK]");
typeLine("Аутентификация: GUEST MODE");
typeLine("Введите сообщение или команду. Для помощи — 'help'");
typeLine("");

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
    typeLine("  clear        — очистить терминал");
    typeLine("  hack         — запустить симуляцию взлома");
    typeLine("  whoami       — кто ты?");
  } else if (lower.startsWith('msg ')) {
    const msg = cmd.slice(4).trim();
    if (msg) {
      typeLine(`[ANON] ${msg}`, 'msg');
      setTimeout(() => typeLine(`[SYSTEM] Сообщение доставлено в darknet.`, 'system'), 800);
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