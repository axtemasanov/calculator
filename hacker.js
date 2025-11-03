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
