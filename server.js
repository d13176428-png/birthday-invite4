require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/rsvp", async (req, res) => {
    try {
        console.log("Получены данные:", req.body);

        const {
            name,
            guests,
            status,
            comment
        } = req.body;


        if (!name || name.trim() === "") {
            return res.status(400).json({
                error: "Введите имя"
            });
        }


        const statusText = status === "yes"
            ? "✅ ПРИДЁТ"
            : "❌ НЕ СМОЖЕТ";


        const message = `
🖤 НОВЫЙ ОТВЕТ НА ПРИГЛАШЕНИЕ

👤 Имя:
${name}

👥 Количество гостей:
${guests || 1}

${statusText}

💬 Комментарий:
${comment || "Нет комментария"}

🕐 Время:
${new Date().toLocaleString("ru-RU")}
        `;


        console.log("Отправляем в Telegram:");
        console.log(message);


        if (!BOT_TOKEN || !CHAT_ID) {
            console.log("❌ Нет данных Telegram в .env");

            return res.status(500).json({
                error: "Telegram не настроен"
            });
        }


        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            }
        );


        const telegramResult = await telegramResponse.json();


        console.log("Ответ Telegram:");
        console.log(telegramResult);


        if (!telegramResult.ok) {

            return res.status(500).json({
                error: "Telegram ошибка",
                telegram: telegramResult
            });

        }


        res.json({
            ok: true
        });


    } catch (error) {

        console.error("Ошибка:");
        console.error(error);


        res.status(500).json({
            error: "Ошибка сервера"
        });

    }
});


app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log(`🖤 Сайт запущен: http://localhost:${PORT}`);
    console.log("================================");
    console.log("");

});