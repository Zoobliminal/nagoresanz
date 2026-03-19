<?php
/* 
   PHP OAuth Gateway for Decap CMS / Netlify CMS 
   Host this file at: /admin/oauth/index.php
*/

define('CLIENT_ID', 'Ov23lixUsV5a8hAl8Pxi'); // Cambia esto por tu Client ID de GitHub
define('CLIENT_SECRET', '8026fa99082660b50d94578fa3d9eb8c45c31ec3'); // Cambia esto por tu Client Secret de GitHub

$redirect_uri = 'https://' . $_SERVER['HTTP_HOST'] . '/admin/oauth/index.php';

// Si no hay código ni estado, iniciamos el flujo de GitHub
if (!isset($_GET['code'])) {
    $state = bin2hex(random_bytes(16));
    setcookie('oauth_state', $state, time() + 300, '/', '', true, true);

    $url = 'https://github.com/login/oauth/authorize?' . http_build_query([
        'client_id' => CLIENT_ID,
        'redirect_uri' => $redirect_uri,
        'scope' => 'repo,user',
        'state' => $state
    ]);

    header('Location: ' . $url);
    exit;
}

// Si hay código, intercambiamos por un token
if (isset($_GET['code'])) {
    // Validar estado para seguridad
    if (!isset($_GET['state']) || $_GET['state'] !== $_COOKIE['oauth_state']) {
        die('Error de validación de estado (CSRF). Por favor, intenta de nuevo.');
    }

    $ch = curl_init('https://github.com/login/oauth/access_token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'client_id' => CLIENT_ID,
        'client_secret' => CLIENT_SECRET,
        'code' => $_GET['code'],
        'redirect_uri' => $redirect_uri
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (isset($response['access_token'])) {
        $token = $response['access_token'];

        // El script de Decap espera un mensaje postMessage para cerrar la ventana y loguear
        echo "<script>
            const message = {
                token: '{$token}',
                provider: 'github'
            };
            window.opener.postMessage('authorization:github:success:' + JSON.stringify(message), window.location.origin);
            window.close();
        </script>";
        exit;
    } else {
        echo "Error al obtener el token: " . print_r($response, true);
    }
}
?>