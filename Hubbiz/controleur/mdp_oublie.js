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

      // Si aucune correspondance trouvée dans la base de données
      if (!Array.isArray(checkData) || checkData.length === 0) {
        emailMessage.textContent = 'L\'e-mail ou le mot de passe est incorrect.';
        emailMessage.className = 'message error';
        return;
      }

      // Succès de la connexion
      emailMessage.textContent = 'Connexion réussie !';
      emailMessage.className = 'message success';

      // 2) Envoyer l'e-mail via sendmail.php
      const formData = new FormData();
      formData.append('email', emailValue);

      const mailResponse = await fetch(SENDMAIL_URL, {
        method: 'POST',
        body: formData
      });

      if (!mailResponse.ok) {
        throw new Error(`Erreur HTTP envoi mail : ${mailResponse.status}`);
      }

      const mailData = await mailResponse.json();
      if (mailData.success) {
        // Succès : l'e-mail a été envoyé
        emailMessage.textContent = `Un e-mail de réinitialisation a été envoyé à ${emailValue}.`;
        emailMessage.className = 'message success';
      } else {
        // Erreur du côté de sendmail
        emailMessage.textContent = mailData.error || 'Erreur lors de l\'envoi du mail.';
        emailMessage.className = 'message error';
      }
    } catch (error) {
      console.error(error);
      emailMessage.textContent = "Une erreur s'est produite.";
      emailMessage.className = 'message error';
    }
  });
});
