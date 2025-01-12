class Post {
  constructor(id, userId, title, content, like = 0, createdAt, expiresAt) {
      this.id = id; // ID du post
      this.userId = userId; // ID de l'utilisateur
      this.title = title; // Titre du post
      this.content = content; // Contenu du post
      this.like = like; // Nombre de likes
      this.createdAt = createdAt; // Date de création
      this.expiresAt = expiresAt; // Date d'expiration
  }

  // Méthode pour convertir un post en objet pour l'insertion dans la base de données
  toObject() {
      return {
          id: this.id,
          user_id: this.userId,
          title: this.title,
          content: this.content,
          like: this.like,
          created_at: this.createdAt,
          expires_at: this.expiresAt,
      };
  }
}

export default Post;
