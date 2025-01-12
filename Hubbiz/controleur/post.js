document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("backButton").addEventListener("click", () => {
        window.history.back(); // Revenir à la page précédente
    });

    document.getElementById("shareButton").addEventListener("click", async () => {
        try {
            const shareUrl = window.location.href; // URL actuelle de la page
            if (navigator.share) {
                // Utilisation de l'API Web Share si disponible
                await navigator.share({
                    title: document.querySelector(".post-title").textContent || "Post",
                    text: "Découvrez ce post !",
                    url: shareUrl,
                });
                
            }
        } catch (error) {
            console.error("Erreur lors du partage :", error);
            alert("Impossible de partager ce post. Veuillez réessayer.");
        }
    });
    
    const postId = new URLSearchParams(window.location.search).get("id");

    if (!postId) {
        alert("Aucun post spécifié !");
        window.location.href = "acceuil_co.html";
        return;
    }

    function timeAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffMs = now - createdDate;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
        } else if (diffHours > 0) {
            return `${diffHours} heure${diffHours > 1 ? "s" : ""}`;
        } else {
            return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
        }
    }

    try {
        const response = await fetch("../modele/connexion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    SELECT 
                        p.title AS title,
                        p.content AS content,
                        p.created_at AS createdAt,
                        u.username AS author
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    WHERE p.id = ?
                `,
                params: [postId],
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const post = await response.json();

        if (post.length === 0) {
            alert("Post introuvable !");
            window.location.href = "acceuil_co.html";
            return;
        }

        const postTitleElement = document.querySelector(".post-title");
        const postContentElement = document.querySelector(".post-content");
        const postAuthorElement = document.querySelector(".author");
        const postDateElement = document.querySelector(".post-date");

        postTitleElement.textContent = post[0].title || "Titre introuvable";
        postContentElement.textContent = post[0].content || "Contenu introuvable";
        postAuthorElement.textContent = post[0].author || "Auteur inconnu";
        postDateElement.textContent = `Il y a ${timeAgo(post[0].createdAt)}`;
    } catch (error) {
        console.error("Erreur lors du chargement du post :", error);
        alert("Impossible de charger le post. Veuillez réessayer.");
    }

    const sessionUser = JSON.parse(sessionStorage.getItem("user"));

    if (!sessionUser || !sessionUser.username) {
        alert("Vous n'êtes pas connecté !");
        window.location.href = "login.html";
        return;
    }

    async function loadComments(postId) {
      
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        SELECT 
                            c.id AS id,
                            c.content AS comment,
                            c.created_at AS createdAt,
                            u.username AS author
                        FROM comments c
                        JOIN users u ON c.user_id = u.id
                        WHERE c.post_id = ?
                        ORDER BY c.created_at DESC
                    `,
                    params: [postId],
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const comments = await response.json();
            const commentsList = document.getElementById("comments-list");
            const commentCount = document.getElementById("comment-count");
            const commentButton = document.querySelector(".comment-button");

            if (!commentsList || !commentCount || !commentButton) {
                console.error("Un élément nécessaire est introuvable dans le DOM.");
                return;
            }

            if (!Array.isArray(comments) || comments.length === 0) {
                commentsList.innerHTML = "<li>Aucun commentaire pour ce post.</li>";
                commentCount.textContent = "0";
                commentButton.textContent = "💬 0 commentaires";
            } else {
                commentsList.innerHTML = "";
                comments.forEach((comment) => {
                    const li = document.createElement("li");
                    li.setAttribute("data-comment-id", comment.id);
                    li.innerHTML = `
                        <strong>${comment.author}</strong>: 
                        ${comment.comment} <br> 
                        <small>${timeAgo(comment.createdAt)}</small>
                        <button class="delete-comment-btn">🗑️</button>
                    `;
                    commentsList.appendChild(li);
                });

                commentCount.textContent = comments.length;
                commentButton.textContent = `💬 ${comments.length} commentaire${comments.length > 1 ? "s" : ""}`;
            }
        } 


    await loadComments(postId);

    async function fetchUserId(username) {
        try {
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `SELECT id FROM users WHERE username = ?`,
                    params: [username],
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const result = await response.json();
            if (result.length === 0) {
                throw new Error("Utilisateur introuvable.");
            }

            return result[0].id;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
            throw error;
        }
    }

    const addCommentButton = document.getElementById("add-comment-button");
    addCommentButton.addEventListener("click", async () => {
        const newComment = document.getElementById("new-comment").value;

        if (!newComment.trim()) {
            alert("Le commentaire ne peut pas être vide.");
            return;
        }

        try {
            const userId = await fetchUserId(sessionUser.username);

            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        INSERT INTO comments (post_id, user_id, content)
                        VALUES (?, ?, ?)
                    `,
                    params: [postId, userId, newComment],
                }),
            });

            const result = await response.json();
            location.reload();
            if (result === 'Requête exécutée avec succès') {
                location.reload();
                const commentsList = document.getElementById("comments-list");
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${sessionUser.username}</strong>: 
                    ${newComment} <br> 
                    <small>${timeAgo(new Date())}</small>
                    <button class="delete-comment-btn">🗑️</button>
                `;
                
                commentsList.prepend(li);

                const commentCount = document.getElementById("comment-count");
                const commentButton = document.querySelector(".comment-button");
                const currentCount = parseInt(commentCount.textContent, 10);

                commentCount.textContent = currentCount + 1;
                commentButton.textContent = `💬 ${currentCount + 1} commentaire${currentCount + 1 > 1 ? "s" : ""}`;

                document.getElementById("new-comment").value = "";
                location.reload();
            } 
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible d'ajouter le commentaire.");
        }
    });

    const commentsList = document.getElementById("comments-list");
    commentsList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-comment-btn")) {
            const commentElement = event.target.closest("li");
            const commentId = commentElement.getAttribute("data-comment-id");

            if (confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
                try {
                    const response = await fetch("../modele/connexion.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            query: `DELETE FROM comments WHERE id = ?`,
                            params: [commentId],
                        }),
                    });

                    const result = await response.json();
                    location.reload();

                    if (result === 'Requête exécutée avec succès') {
                        commentElement.remove();

                        const commentCount = document.getElementById("comment-count");
                        const commentButton = document.querySelector(".comment-button");
                        const currentCount = parseInt(commentCount.textContent, 10);

                        commentCount.textContent = currentCount - 1;
                        commentButton.textContent = `💬 ${currentCount - 1} commentaire${currentCount - 1 > 1 ? "s" : ""}`;
                    } 
                    
                } catch (error) {
                    console.error("Erreur :", error);
                    alert("Impossible de supprimer le commentaire.");
                }
            }
        }
    });
});
