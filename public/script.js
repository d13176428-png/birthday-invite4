// =========================
// ТАЙМЕР
// =========================

const partyDate = new Date("2026-09-27T14:00:00+03:00");


function updateTimer(){

    const now = new Date();

    const diff = partyDate - now;


    if(diff <= 0){

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;

    }


    const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        diff / (1000 * 60 * 60) % 24
    );


    const minutes = Math.floor(
        diff / (1000 * 60) % 60
    );


    const seconds = Math.floor(
        diff / 1000 % 60
    );



    document.getElementById("days").textContent =
        String(days).padStart(2,"0");


    document.getElementById("hours").textContent =
        String(hours).padStart(2,"0");


    document.getElementById("minutes").textContent =
        String(minutes).padStart(2,"0");


    document.getElementById("seconds").textContent =
        String(seconds).padStart(2,"0");

}


setInterval(updateTimer,1000);

updateTimer();





// =========================
// МУЗЫКА
// =========================


const music = document.getElementById("bgMusic");


if(music){


    music.volume = 0;



    window.addEventListener(
        "load",
        async()=>{


        try{


            await music.play();



            let volume = 0;



            const fade = setInterval(()=>{


                volume += 0.02;



                if(volume >= 0.25){


                    music.volume = 0.25;


                    clearInterval(fade);


                }
                else{


                    music.volume = volume;


                }


            },100);



        }


        catch(error){


            console.log(
                "Автозапуск музыки запрещён браузером"
            );


        }



    });



}






// =========================
// ФОРМА TELEGRAM
// =========================


const form =
document.getElementById("rsvpForm");


const message =
document.getElementById("formMessage");


const button =
document.getElementById("submitBtn");



const popup =
document.getElementById("successOverlay");


const closePopup =
document.getElementById("closeSuccessBtn");




function openPopup(){


    if(popup){

        popup.classList.add("active");

    }


}




function closePopupFunc(){


    if(popup){

        popup.classList.remove("active");

    }


}



if(closePopup){

    closePopup.addEventListener(
        "click",
        closePopupFunc
    );

}



if(popup){

    popup.addEventListener(
        "click",
        function(e){

            if(e.target === popup){

                closePopupFunc();

            }

        }
    );

}






if(form){



form.addEventListener(
"submit",
async function(e){


e.preventDefault();



const data = {


name:
document.getElementById("name").value,


guests:
document.getElementById("guests").value,


status:
document.getElementById("status").value,


comment:
document.getElementById("comment").value


};




if(!data.name.trim()){


message.textContent =
"Введите имя";


return;


}




button.disabled = true;


button.textContent =
"ОТПРАВКА...";



try{


const response =
await fetch(
"/api/rsvp",
{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:
JSON.stringify(data)


}
);



const result =
await response.json();





if(result.ok){


message.textContent =
"Отправлено ✓";


form.reset();


openPopup();



}

else{


message.textContent =
"Ошибка отправки";


}




}



catch(error){


console.log(error);


message.textContent =
"Ошибка соединения";


}




finally{


button.disabled = false;


button.textContent =
"ПОДТВЕРДИТЬ УЧАСТИЕ";


}



});


}
