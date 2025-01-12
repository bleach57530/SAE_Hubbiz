<?php
header('Content-Type: application/json');

// Informations de connexion
$host = 'devbdd.iutmetz.univ-lorraine.fr';
$user = 'incedal1u_appli';
$password = '32210888';
$database = 'incedal1u_SAE';

try {
    // Connexion à la base de données
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Lire les données envoyées depuis JS
    $request = json_decode(file_get_contents('php://input'), true);
    $query = $request['query'] ?? '';
    $params = $request['params'] ?? [];

    if (!empty($query)) {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        // Toujours renvoyer les résultats complets de la requête
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Si aucun résultat (par exemple, INSERT/UPDATE/DELETE), renvoyer une confirmation
        if (empty($result)) {
            echo json_encode(['message' => 'Requête exécutée avec succès']);
        } else {
            echo json_encode($result);
        }
    } else {
        echo json_encode(['error' => 'Requête vide']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
file_put_contents('log.txt', print_r($request, true));
