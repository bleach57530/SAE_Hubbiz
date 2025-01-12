import Connexion from './connexion.js';

class PostDAO {
    constructor() {
        this.db = new Connexion(); // Instance pour exécuter les requêtes SQL
    }

    // Ajouter un nouveau post
    async addPost(post) {
        try {
            const query = `
                INSERT INTO posts (id, user_id, title, content, like, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                post.id,
                post.userId || null,
                post.title,
                post.content,
                post.like,
                post.createdAt,
                post.expiresAt,
            ];
            const result = await this.db.execSQL(query, values);

            return result.affectedRows > 0; // Retourne true si l'insertion a réussi
        } catch (error) {
            console.error("Erreur lors de l'ajout du post :", error);
            throw error;
        }
    }

    // Mettre à jour les likes d'un post
    async updateLikes(postId, likeCount) {
        try {
            const query = `
                UPDATE posts
                SET like = ?
                WHERE id = ?
            `;
            const values = [likeCount, postId];
            const result = await this.db.execSQL(query, values);

            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la mise à jour des likes :", error);
            throw error;
        }
    }

    // Obtenir un post par ID
    async getPostById(postId) {
        try {
            const query = `
                SELECT id, user_id, title, content, like, created_at, expires_at
                FROM posts
                WHERE id = ?
            `;
            const result = await this.db.execSQL(query, [postId]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Erreur lors de la récupération du post :", error);
            throw error;
        }
    }
}

export default PostDAO;
