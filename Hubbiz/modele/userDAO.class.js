import Connexion from "../modele/connexion.php"; // Lien vers connexion.php
import User from "./user.class.js"; // Classe utilisateur simple pour manipuler les données utilisateur

class UserDAO {
    constructor() {
        this.connexion = new Connexion(); // Connexion abstraite à votre backend
    }


    async addUser(user) {
        const query = `
            INSERT INTO users (id, username, mail, password, role, created_at, genre, date_nais)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            user.id,         // ID généré via getNextUserId()
            user.username,   // Nom d'utilisateur
            user.mail,       // Email
            user.password,   // Mot de passe
            user.role || "user", // Rôle par défaut "user"
            user.created_at, // Date actuelle générée côté client
            user.genre,      // Genre
            user.date_nais   // Date de naissance
        ];
    
        try {
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query, params: params }),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }
    
            const result = await response.json();
            return result.success ? result : null;
        } catch (error) {
            console.error("Erreur dans addUser :", error);
            throw error;
        }
    }
    
    

    async getNextUserId() {
        const query = `
            SELECT MAX(id) AS maxId
            FROM users
        `;
        try {
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query }),
            });
    
            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }
    
            const result = await response.json();
            return result.length > 0 ? result[0].maxId + 1 : 1; // Retourne 1 si la table est vide
        } catch (error) {
            console.error("Erreur dans getNextUserId :", error);
            throw error;
        }
    }
    

    // Récupérer un utilisateur par nom d'utilisateur
    async getByUsername(username) {
        const query = `
            SELECT id, username, mail, role, created_at, genre, date_nais, reset_token
            FROM users
            WHERE username = ?
        `;
        try {
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query, params: [username] }),
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const results = await response.json();
            return results.length > 0 ? new User(...Object.values(results[0])) : null;
        } catch (error) {
            console.error("Erreur dans getByUsername :", error);
            throw error;
        }
    }

    // Récupérer tous les utilisateurs
    async getAllUsers() {
        const query = `
            SELECT id, username, mail, password, role, created_at, genre, date_nais, reset_token
            FROM users
        `;
        try {
            const response = await fetch("../modele/connexion.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query }),
            });

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const results = await response.json();

            return results.map(
                (user) =>
                    new User(
                        user.id,
                        user.username,
                        user.mail,
                        user.password,
                        user.role,
                        user.created_at,
                        user.genre,
                        user.date_nais,
                        user.reset_token
                    )
            );
        } catch (error) {
            console.error("Erreur dans getAllUsers :", error);
            throw error;
        }
    }
}

export default UserDAO;
