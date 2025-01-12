document.getElementById("inscriptionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Récupération des valeurs du formulaire
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const genre = document.getElementById("genre").value; // Récupération du genre
    const password = document.getElementById("password").value;

