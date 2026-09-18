console.log("SCRIPT ЗАГРУЖЕН");


const partyDate = new Date("2026-09-27T14:00:00");


function updateTimer() {

    const diff = partyDate - new Date();

    if (diff <= 0) return;


    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");


    if(days){
        days.textContent = Math.floor(diff / 86400000)
            .toString()
            .padStart(2,"0");
    }

    if(hours){
        hours.textContent = Math.floor(diff / 3600000 % 24)
            .toString()
            .padStart(2,"0");
    }

    if(minutes){
        minutes.textContent = Math.floor(diff / 60000 % 60)
            .toString()
            .padStart(2,"0");
    }

    if(seconds){
        seconds.textContent = Math.floor(diff / 1000 % 60)
            .toString()
            .padStart(2,"0");
    }
}


setInterval(updateTimer,1000);
updateTimer();



const form = document.getElementById("rsvpForm");


if(form){

form.addEventListener("submit", async function(e){

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


    console.log("Отправляем:", data);



    try {


        const response = await fetch("/api/rsvp", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(data)

        });



        const result = await response.json();


        console.log("Ответ сервера:", result);



        const message = document.getElementById("formMessage");


        if(result.ok){

            message.textContent = "Спасибо 🖤 Ответ отправлен";

            form.reset();

        } else {

            message.textContent = "Ошибка отправки";

        }



    } catch(error){


        console.error(error);


        document.getElementById("formMessage").textContent =
            "Ошибка соединения";

    }


});


}