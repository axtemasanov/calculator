
import telebot
import random
from telebot import types

# Твой токен от BotFather
TOKEN = '8514752470:AAGjaRIn7HM5HNMn7g9eCY3FWuUBur_r_DU'
bot = telebot.TeleBot(TOKEN)

# База данных для "умных" ответов (можно расширить)
GREETINGS = ["Привет, новичок! 🚀 Готов к эпичным чатам? Расскажи о себе!", 
             "Йо! 👋 Добро пожаловать в нашу тусовку. Что новенького?", 
             "Эй, звезда! 🌟 Группа рада тебе. Давай зажжём!"]

MOTIVATIONS = ["Не грусти! Помни: каждый день — шанс на новый мем. 💪", 
               "Грусть? Это временно. Завтра будет лучше. А пока — кофе? ☕"]

COMPLIMENTS = ["Круто! Ты — легенда. 🔥 Продолжай в том же духе!", 
               "Ого, это огонь! 👏 Группа в восторге."]

QUOTES = ["'Будь собой — все остальные роли уже заняты.' — Оскар Уайльд", 
          "'Жизнь — как велосипед: чтобы удержать равновесие, нужно двигаться.' — Альберт Эйнштейн", 
          "'Секрет успеха — начать.' — Марк Твен"]

JOKES = ["Почему программист не может найти любовь? Потому что у него всегда 'if else' вместо 'и да'! 😆", 
         "Что сказал кофе чашке? 'Ты меня держишь в напряжении!' ☕😂"]

# Обработчик новых участников
@bot.message_handler(content_types=['new_chat_members'])
def welcome_new_member(message):
    for member in message.new_chat_members:
        if member.id != bot.get_me().id:  # Не приветствовать самого бота
            greeting = random.choice(GREETINGS)
            bot.reply_to(message, f"{member.first_name}, {greeting}")

# Команда /start
@bot.message_handler(commands=['start'])
def start_command(message):
    markup = types.InlineKeyboardMarkup()
    btn1 = types.InlineKeyboardButton("💡 Умная цитата", callback_data="quote")
    btn2 = types.InlineKeyboardButton("😂 Шутка", callback_data="meme")
    markup.add(btn1, btn2)
    bot.reply_to(message, "Привет! Я — стильный бот твоей группы. Выбери опцию:", reply_markup=markup)

# Обработчики кнопок
@bot.callback_query_handler(func=lambda call: True)
def callback_handler(call):
    if call.data == "quote":
        quote = random.choice(QUOTES)
        bot.answer_callback_query(call.id, quote)
        bot.edit_message_text(quote, call.message.chat.id, call.message.message_id)
    elif call.data == "meme":
        joke = random.choice(JOKES)
        bot.answer_callback_query(call.id, joke)
        bot.edit_message_text(joke, call.message.chat.id, call.message.message_id)

# Реакция на ключевые слова
@bot.message_handler(func=lambda message: any(word in message.text.lower() for word in ['грустно', 'плохо']))
def motivate(message):
    motivation = random.choice(MOTIVATIONS)
    bot.reply_to(message, motivation)

@bot.message_handler(func=lambda message: any(word in message.text.lower() for word in ['круто', 'супер']))
def compliment(message):
    compliment_msg = random.choice(COMPLIMENTS)
    bot.reply_to(message, compliment_msg)

# Простая модерация: удаление спама (ссылки без текста)
@bot.message_handler(func=lambda message: message.text and 'http' in message.text and len(message.text) < 20)
def moderate_spam(message):
    bot.delete_message(message.chat.id, message.message_id)
    bot.reply_to(message, "Эй, спам не катит! 😎 Добавь текст, или модеры скажут 'пока'.")

# Запуск бота
if __name__ == '__main__':
    print("Бот запущен! Ждёт сообщений...")
    bot.polling(none_stop=True)
