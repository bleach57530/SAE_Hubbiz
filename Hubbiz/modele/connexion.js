document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"; // Vérifie l'état de connexion
    const connexionBtn = document.querySelector(".connexion-btn");
    const profileBtn = document.querySelector(".profile-btn");
    const addPostBtn = document.querySelector(".add-post-btn");
  
    // Affiche les boutons en fonction de l'état de connexion
    if (isLoggedIn) {
      connexionBtn.style.display = "none";
      profileBtn.style.display = "block";
      addPostBtn.style.display = "block";
    } else {
      connexionBtn.style.display = "block";
      profileBtn.style.display = "none";
      addPostBtn.style.display = "none";
    }
  
    // Redirige vers la page de connexion
    connexionBtn.addEventListener("click", () => {
      sessionStorage.setItem("isLoggedIn", "true"); // Simule la connexion
      window.location.reload();
    });
  
    // Redirige vers la page de profil
    profileBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  });
  