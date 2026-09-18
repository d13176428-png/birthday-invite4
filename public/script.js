// =========================
// COUNTDOWN
// =========================

const partyDate = new Date("2026-09-27T14:00:00+03:00");


function setText(id, value){

    const element = document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}



function updateTimer(){

    const now = new Date();

    const difference = partyDate - now;



    if(difference <= 0){

        setText("days","00");
        setText("hours","00");
        setText("minutes","00");
        setText("seconds","00");

        return;

    }



    const days = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        difference /
        (1000 * 60 * 60)
        % 24
    );


    const minutes = Math.floor(
        difference /
        (1000 * 60)
        % 60
    );


    const seconds = Math.floor(
        difference /
        1000
        % 60
    );



    setText(
        "days",
        String(days).padStart(2,"0")
    );


    setText(
        "hours",
        String(hours).padStart(2,"0")
    );


    setText(
        "minutes",
        String(minutes).padStart(2,"0")
    );


    setText(
        "seconds",
        String(seconds).padStart(2,"0")
    );

}


setInterval(updateTimer,1000);

updateTimer();





// =========================
// MUSIC AUTOPLAY FADE IN
// =========================


const music = document.getElementById("bgMusic");


if(music){


    music.volume = 0;



    window.addEventListener("load", async()=>{


        try{


            await music.play();



            let volume = 0;



            const fade = setInterval(()=>{


                volume += 0.02;



                if(volume >= 0.25){


                    music.volume = 0.25;


                    clearInterval(fade);


                    return;

                }



                music.volume = volume;



            },100);



            console.log(
                "Музыка запущена"
            );


        }

        catch(error){


            console.log(
                "Автозапуск музыки заблокирован браузером"
            );


        }



    });


}







// =========================
// RSVP FORM
// =========================


const form =
document.getElementById("rsvpForm");


const message =
document.getElementById("formMessage");


const button =
document.getElementById("submitBtn");



const successOverlay =
document.getElementById("successOverlay");



const successName =
document.getElementById("successName");



const closeSuccessBtn =
document.getElementById("closeSuccessBtn");





function openSuccess(name){


    if(successName){

        successName.textContent = name;

    }



    if(successOverlay){

        successOverlay.classList.add(
            "active"
        );

    }


}




function closeSuccess(){


    if(successOverlay){

        successOverlay.classList.remove(
            "active"
        );

    }


}



if(closeSuccessBtn){


    closeSuccessBtn.addEventListener(
        "click",
        closeSuccess
    );


}




if(successOverlay){


    successOverlay.addEventListener(
        "click",
        function(event){


            if(event.target === successOverlay){

                closeSuccess();

            }


        }
    );


}






if(form){


form.addEventListener(
"submit",
async function(event){


event.preventDefault();



const data = {


name:
document.getElementById("name").value.trim(),


guests:
document.getElementById("guests").value,


status:
document.getElementById("status").value,


comment:
document.getElementById("comment").value.trim()


};





if(!data.name){


message.textContent =
"Введите имя";


return;


}





button.disabled = true;


button.textContent =
"ОТПРАВКА...";



message.textContent =
"Отправляем...";






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
"Готово";


openSuccess(data.name);



form.reset();



document.getElementById("guests").value =
"1";



}

else{


message.textContent =
result.error ||
"Ошибка отправки";


}





}

catch(error){


console.error(error);


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
