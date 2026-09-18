console.log("script loaded");

const partyDate = new Date("2026-09-27T14:00:00+03:00");

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function updateTimer() {
    const now = new Date();
    const diff = partyDate - now;

    if (diff <= 0) {
        setText("days", "00");
        setText("hours", "00");
        setText("minutes", "00");
        setText("seconds", "00");
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setText("days", String(days).padStart(2, "0"));
    setText("hours", String(hours).padStart(2, "0"));
    setText("minutes", String(minutes).padStart(2, "0"));
    setText("seconds", String(seconds).padStart(2, "0"));
}

setInterval(updateTimer, 1000);
updateTimer();


const form = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const successOverlay = document.getElementById("successOverlay");
const successName = document.getElementById("successName");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

function showSuccess(name) {
    if (successName) {
        successName.textContent = name || "Спасибо";
    }

    if (successOverlay) {
        successOverlay.classList.add("active");
    }
}

function hideSuccess() {
    if (successOverlay) {
        successOverlay.classList.remove("active");
    }
}

if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", hideSuccess);
}

if (successOverlay) {
    successOverlay.addEventListener("click", function (e) {
        if (e.target === successOverlay) {
            hideSuccess();
        }
    });
}

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const guestsInput = document.getElementById("guests");
        const statusInput = document.getElementById("status");
        const commentInput = document.getElementById("comment");

        const data = {
            name: nameInput.value.trim(),
            guests: guestsInput.value || "1",
            status: statusInput.value,
            comment: commentInput.value.trim()
        };

        if (!data.name) {
            formMessage.textContent = "Введите имя";
            return;
        }

        submitBtn.disabled = true;
        formMessage.textContent = "Отправляем...";

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.ok) {
                formMessage.textContent = "Готово. Ответ отправлен 🖤";
                showSuccess(data.name);
                form.reset();

                const guestsField = document.getElementById("guests");
                if (guestsField) guestsField.value = "1";

                const statusField = document.getElementById("status");
                if (statusField) statusField.value = "yes";
            } else {
                formMessage.textContent = result.error || "Ошибка отправки";
                console.log(result);
            }
        } catch (error) {
            console.error(error);
            formMessage.textContent = "Ошибка соединения";
        } finally {
            submitBtn.disabled = false;
        }
    });
}
