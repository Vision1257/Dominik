<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Anmeldung</h1>
    <p>Bitte füllen Sie die nachfolgenden Eingabefelder aus:</p>
    <form action="formular_auswertung.php" method="POST">
        <p>Vorname: <input type="text" name="vorname"></p>
        <p>Nachname: <input type="text" name="nachname"></p>
        <p>Wohnort: <input type="text" name="ort"></p>
        <p>Geburtsdatum:
            <input type="text" name="tag" size="2" maxlenght="2">
            .
            <input type="text" name="monat" size="2" maxlenght="2">
            .
            <input type="text" name="jahr" size="4" maxlenght="4">
        </p>

        <p><input type="submit" value="Abschicken">
            <input type="reset" value="Zurücksetzen">
        </p>
    </form>
</body>

</html>