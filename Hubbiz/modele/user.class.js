class User {
    constructor(id = 0, username = '', mail = '', passwordHash = '', role = '', createdAt = '', genre = '', dateNais = '', resetToken = null) {
        this.id = id;
        this.username = username;
        this.mail = mail;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.genre = genre;
        this.dateNais = dateNais;
        this.resetToken = resetToken;
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }

    getMail() {
        return this.mail;
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    getRole() {
        return this.role;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getGenre() {
        return this.genre;
    }

    getDateNais() {
        return this.dateNais;
    }

    getResetToken() {
        return this.resetToken;
    }

    setId(id) {
        this.id = id;
    }

    setUsername(username) {
        this.username = username;
    }

    setMail(mail) {
        this.mail = mail;
    }

    setPasswordHash(passwordHash) {
        this.passwordHash = passwordHash;
    }

    setRole(role) {
        this.role = role;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    setGenre(genre) {
        this.genre = genre;
    }

    setDateNais(dateNais) {
        this.dateNais = dateNais;
    }

    setResetToken(resetToken) {
        this.resetToken = resetToken;
    }
}

export default User;
