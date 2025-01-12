document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-message');

    loginButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMessage.textContent = 'Veuillez entrer votre identifiant et votre mot de passe.';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            const query = `
                SELECT id, username, mail, role, genre, date_nais, reset_token
                FROM users
                WHERE mail = ?
                AND password = ?
                LIMIT 1
            `;

            const response = await fetch('../modele/connexion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    params: [username, password]
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const result = await response.json();

            if (result.length > 0) {
                const user = result[0];
                sessionStorage.setItem('user', JSON.stringify({
                    id: user.id, // L'ID de l'utilisateur
                    username: user.username, // Le nom de l'utilisateur
                    mail: user.mail, // (optionnel) l'email ou d'autres informations si nécessaires
                }));
                console.log(sessionStorage.getItem('user'));
                alert('Connexion réussie !');
                

                window.location.href = 'acceuil_co.html?user_id{sessionUser.id}';
            } else {
                errorMessage.textContent = 'Identifiant ou mot de passe incorrect.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
            errorMessage.style.display = 'block';
        }
    });
});
