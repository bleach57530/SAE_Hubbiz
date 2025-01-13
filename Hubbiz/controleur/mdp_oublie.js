const CONNEXION_URL = '../modele/connexion.php';
const SENDMAIL_URL = '../modele/sendmail.php';

document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input'); // Ajout du champ mot de passe
  const emailMessage = document.getElementById('email-message');

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    emailMessage.textContent = '';

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim(); // Récupère le mot de passe

    // Afficher les informations utilisateur dans la console avant de vérifier
    console.log("Informations utilisateur avant la vérification :", {
      email: emailValue,
      password: passwordValue
    });

