const formulario = document.querySelector("form");
const inputCorreo = document.querySelector("#correo-electronico");
const inputContrasena = document.querySelector("#contrasena-cifrada");
const saludoKult = document.querySelector("#saludokult");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value.trim();

    // 1. Validar que el correo contenga el símbolo '@'
    if (!correo.includes("@")) {
        saludoKult.textContent = "Ingrese un correo válido";
        return;
    }

    // 2. Validar que la contraseña tenga al menos 8 caracteres
    if (contrasena.length < 8) {
        saludoKult.textContent = "La contraseña debe tener al menos 8 caracteres";
        return;
    }

    // 3. Si se cumplen ambas condiciones
    saludoKult.textContent = "bienvenid@ a su cuenta";
});