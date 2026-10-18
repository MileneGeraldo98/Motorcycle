const LoginForm = document.querySelector("#LoginForm");
const senha = document.querySelector("#senha");
const email = document.querySelector("#email");

LoginForm.addEventListener("submit", (event) =>{
    event.preventDefault();

    if (email.value === "" || senha.value === "") {
        alert("Preencha todos os campos");
        return;
    }

       window.location.href = "../Home/home.html";
});