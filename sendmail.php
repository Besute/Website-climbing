<?php
$data = json_decode(file_get_contents('php://input'), true);

// HTML-версия письма (без смещений, стандартное выравнивание)
$html_message = "<html>
<head>
    <meta charset='UTF-8'>
    <title>Сообщение с сайта</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; padding: 20px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; }
        hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Заявка с taganrog-climbing.ru</h2>
        <div class='field'><span class='label'>Имя:</span> " . htmlspecialchars($data['Имя'] ?? 'Не указано') . "</div>
        <div class='field'><span class='label'>Фамилия:</span> " . htmlspecialchars($data['Фамилия'] ?? 'Не указана') . "</div>
        <div class='field'><span class='label'>Почта:</span> " . htmlspecialchars($data['Почта'] ?? 'Не указана') . "</div>
        <div class='field'><span class='label'>Телефон:</span> " . htmlspecialchars($data['Телефон'] ?? 'Не указан') . "</div>
        <div class='field message-box'>
            <span class='label'>Сообщение:</span><br>
            " . nl2br(htmlspecialchars($data['Текст'] ?? 'Пустое сообщение')) . "
        </div>
        <hr>
        <small>Отправлено: " . date('Y-m-d H:i:s') . "</small>
    </div>
</body>
</html>";

// Заголовки для HTML-письма
$headers = "From: no-reply@taganrog-climbing.ru\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

mail('mail@taganrog-climbing.ru', 'Пришла новая заявка с сайта taganrog-climbing.ru', $html_message, $headers);
?>