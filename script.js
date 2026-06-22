const API_KEY = "fe_oa_197f7a0f928a9145dfc102c6a8aa2d49bdeff699d58c3a30";

const chatBox = document.getElementById("chat-box");

function addMessage(type, text){

    const div = document.createElement("div");
    div.className = `message ${type}`;

    div.innerHTML = `<span>${text}</span>`;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(){

    const input = document.getElementById("message");

    const message = input.value.trim();

    if(!message) return;

    addMessage("user", message);

    input.value = "";

    addMessage("ai", "Sedang berpikir...");

    try{

        const response = await fetch(
            "https://api.freemodel.dev/v1/chat/completions",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + API_KEY
                },
                body:JSON.stringify({
                    model:"gpt-5.4-mini",
                    messages:[
                        {
                            role:"system",
                            content:"Kamu adalah guru sekolah Indonesia yang ramah dan mudah dipahami."
                        },
                        {
                            role:"user",
                            content:message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        chatBox.lastChild.remove();

        const answer =
            data.choices?.[0]?.message?.content ||
            "Tidak ada jawaban.";

        addMessage("ai", answer);

    }
    catch(error){

        chatBox.lastChild.remove();

        addMessage(
            "ai",
            "Gagal menghubungi AI. Periksa API Key."
        );

        console.error(error);
    }
}
