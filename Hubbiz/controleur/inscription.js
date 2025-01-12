document.getElementById("inscriptionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Récupération des valeurs du formulaire
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const genre = document.getElementById("genre").value; // Récupération du genre
    const password = document.getElementById("password").value;

    // Vérification des champs requis
    if (!username || !email || !birthdate || !genre || !password) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    try {
        // Étape 1 : Récupérer l'ID maximum existant (MAX(id)) et générer un nouvel ID
        const getIdResponse = await fetch("../modele/connexion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: "SELECT MAX(id) AS maxId FROM users",
                params: [],
            }),
        });

        if (!getIdResponse.ok) {
            throw new Error("Erreur lors de la récupération de l'ID maximum.");
        }

        const idResult = await getIdResponse.json();
        const nextId = idResult[0]?.maxId ? idResult[0].maxId + 1 : 1;

        // Étape 2 : Insérer le nouvel utilisateur avec les informations du formulaire
        const createdAt = new Date().toISOString().split("T")[0]; // Date actuelle formatée (YYYY-MM-DD)

        const addUserResponse = await fetch("../modele/connexion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    INSERT INTO users (id, username, mail, password, role, created_at, genre, date_nais)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                params: [nextId, username, email, password, "user", createdAt, genre, birthdate],
            }),
        });