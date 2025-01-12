document.addEventListener('DOMContentLoaded', () => {
    const connexionBtn = document.querySelector('.connexion-btn');

    // Gestion du bouton "Connexion"
    connexionBtn.addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirige vers la page de connexion
    });
});
