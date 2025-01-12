document.addEventListener("DOMContentLoaded", async () => {
    const backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "acceuil_co.html"; // Redirige vers la page d'accueil
        });
    }

    try {
        const userId = getUserId();
        if (!userId) {
            alert("Utilisateur non identifié !");
            window.location.href = "login.html";
            return;
        }

        const userData = await fetchUserData(userId);
        if (!userData) {
            alert("Utilisateur introuvable !");
            window.location.href = "login.html";
            return;
        }

        updateUserProfile(userData);

        // Charger les posts récents avec effet fade
        const postsList = document.getElementById("postsList");
        postsList.innerHTML = ""; // Effacer l'ancien contenu
        const recentPosts = await fetchUserPosts(userId);

        if (recentPosts.length > 0) {
            recentPosts.forEach((post) => {
                const li = document.createElement("li");
                li.classList.add("post-item");
                li.innerHTML = `
                    <span class="truncated-text">${truncateWithFade(post.content, 20)}</span>
                    <small class="post-date"> - Posté le ${new Date(post.postDate).toLocaleDateString()}</small>
                `;
                postsList.appendChild(li);
            });
        } else {
            postsList.innerHTML = "<li>Aucun post récent.</li>";
        }
    } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error);
        alert("Impossible de charger le profil. Veuillez réessayer.");
    }
});

// Fonction pour tronquer le texte avec un effet fade
function truncateWithFade(text, maxLength) {
    if (text.length <= maxLength) {
        return text; // Pas besoin de tronquer
    }
    const truncated = text.substring(0, maxLength); // Tronquer après maxLength
    return `
        ${truncated}<span class="fade-effect">...</span>
    `;
}

// Fonction pour récupérer l'user_id depuis sessionStorage ou l'URL
function getUserId() {
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    if (sessionUser && sessionUser.id) {
        return sessionUser.id;
    }

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    if (userId) {
        return userId;
    }

    console.error("Aucun user_id trouvé !");
    return null;
}

// Fonction pour récupérer les données utilisateur
async function fetchUserData(userId) {
    try {
        const response = await fetch("../modele/connexion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    SELECT 
                        users.username, 
                        users.mail, 
                        users.date_nais AS birthDate, 
                        users.created_at AS accountCreationDate, 
                        COUNT(posts.id) AS postCount
                    FROM users
                    LEFT JOIN posts ON users.id = posts.user_id
                    WHERE users.id = ?
                    GROUP BY users.id
                `,
                params: [userId],
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const userData = await response.json();
        return userData[0]; // Retourner le premier résultat
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        return null;
    }
}

// Fonction pour mettre à jour les informations du profil
function updateUserProfile(user) {
    document.getElementById("firstName").textContent = user.username || "Nom utilisateur";
    document.getElementById("email").textContent = user.mail || "Non défini";
    document.getElementById("birthDate").textContent = user.birthDate
        ? new Date(user.birthDate).toLocaleDateString()
        : "Non défini";
    document.getElementById("accountCreationDate").textContent = user.accountCreationDate
        ? new Date(user.accountCreationDate).toLocaleDateString()
        : "Non défini";
    document.getElementById("postCount").textContent = user.postCount || "0";
}

// Fonction pour récupérer les posts récents de l'utilisateur
async function fetchUserPosts(userId) {
    try {
        const response = await fetch("../modele/connexion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    SELECT 
                        posts.content, 
                        posts.created_at AS postDate
                    FROM posts
                    WHERE posts.user_id = ?
                    ORDER BY posts.created_at DESC
                    LIMIT 5;
                `,
                params: [userId],
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const posts = await response.json();
        return posts; // Retourner les posts récents
    } catch (error) {
        console.error("Erreur lors de la récupération des posts récents :", error);
        return [];
    }
}
