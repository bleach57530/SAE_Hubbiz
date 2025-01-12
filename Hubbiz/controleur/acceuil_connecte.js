document.addEventListener('DOMContentLoaded', async () => {
    const actuButton = document.querySelector(".tab.active");

    actuButton.addEventListener("click", () => {
        window.location.href = "https://factuel.univ-lorraine.fr/";
    });

    // Gestion du clic sur le bouton "Événement"
    const eventButton = document.querySelector(".tab:not(.active)");
    eventButton.addEventListener("click", () => {
        window.location.href = "https://factuel.univ-lorraine.fr/taxonomy/term/2967";
    });

    const postsContainer = document.getElementById('posts-container');
    const profileButton = document.querySelector('.profile-btn');

    // Fonction pour créer un élément HTML pour un post
    const createPostElement = (post) => {
        const truncatedContent = post.content ? post.content.substring(0, 20) : 'Contenu indisponible'; // Tronque à 20 caractères
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2 class="post-title">${post.title || 'Titre indisponible'}</h2>
            <p class="post-content">
                ${truncatedContent}<span class="fade-effect"></span>
            </p>
            <span class="post-meta">
                Posté par 
                <a href="#" class="profile-link" data-user-id="${post.user_id}">
                    ${post.user_id || 'Utilisateur inconnu'}
                </a> 
                le ${post.created_at ? new Date(post.created_at).toLocaleString() : 'Date inconnue'}
            </span>
        `;

        // Rediriger vers la page de détails avec l'ID du post
        postElement.addEventListener('click', (event) => {
            if (!event.target.classList.contains('profile-link')) {
                window.location.href = `post.html?id=${post.id}`;
            }
        });

        // Rediriger vers la page de profil de l'utilisateur
        const profileLink = postElement.querySelector('.profile-link');
        profileLink.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêcher l'événement parent de se déclencher
            const userId = event.target.getAttribute('data-user-id');
            if (userId) {
                window.location.href = `profile.html?user_id=${userId}`;
            }
        });

        return postElement;
    };

    // Fonction pour charger les posts depuis la base de données
    const loadPosts = async () => {
        const query = `
            SELECT id, user_id, title, content, created_at, expires_at
            FROM posts
            ORDER BY created_at DESC
        `;

        try {
            const response = await fetch('../modele/connexion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const posts = await response.json();
            console.log('Posts reçus :', posts);

            // Vérifiez si les données sont vides
            if (!posts || posts.length === 0) {
                postsContainer.innerHTML = '<p>Aucun post disponible.</p>';
                return;
            }

            // Affichez les posts
            postsContainer.innerHTML = ''; // Nettoyer le conteneur
            posts.forEach((post) => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des posts :', error);
            postsContainer.innerHTML = '<p>Impossible de charger les posts. Veuillez réessayer plus tard.</p>';
        }
    };

    // Charger les posts au démarrage
    await loadPosts();

    // Redirection pour le bouton "Profil"
    profileButton.addEventListener('click', () => {
        const user = JSON.parse(sessionStorage.getItem('user')); // Récupérer l'utilisateur connecté depuis le sessionStorage
        console.log("Utilisateur connecté :", user); // Debug pour vérifier le contenu du sessionStorage
        if (user && user.username) {
            window.location.href = `profile.html?user_id=${user.id}`;
        } else {
            console.warn("Aucune donnée utilisateur trouvée dans le sessionStorage.");
            alert('Utilisateur non connecté. Veuillez vous reconnecter.');
        }
    });

    // Redirection pour le bouton "Ajouter un post"
    const addPostButton = document.querySelector('.add-post-btn');
    addPostButton.addEventListener('click', () => {
        window.location.href = 'ajouter.html';
    });
});
