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

    if (!emailValue || !passwordValue) {
      emailMessage.textContent = 'Veuillez saisir un e-mail et un mot de passe.';
      emailMessage.className = 'message error';
      return;
    }

    try {
      // 1) Vérifier si l'e-mail et le mot de passe correspondent
      const checkQuery = `
        SELECT username
        FROM users
        WHERE username = :username AND password_hash = :password
        LIMIT 1
      `;

      // On logge pour debug
      console.log("Vérification des informations envoyées :", { emailValue, passwordValue });

      const checkResponse = await fetch(CONNEXION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: checkQuery,
          params: { username: emailValue, password: passwordValue }
        })
      });

      if (!checkResponse.ok) {
        throw new Error(`Erreur HTTP de vérification : ${checkResponse.status}`);
      }

      const checkData = await checkResponse.json();

   