<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=#, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <?php
    $vorname = $_POST["vorname"];
    $nachname = $_POST["nachname"];
    $ort = $_POST["ort"];
    $gebTag = $_POST["tag"];
    $gebMonat = $_POST["monat"];
    $gebJahr = $_POST["jahr"];

    echo "<p>Folgende Daten urden übermittelt</p>";
    echo "<p>Vorname: $vorname </p>" . "<br>";
    echo "<p>Nachname: $nachname </p>" . "<br>";
    echo "<p>Wohnort: $ort </p>" . "<br>";
    echo "<p>Geburtsdatum: $gebTag. $gebMonat. $gebJahr </p>" . "<br>";


    $aktTag =    19;
    $aktMonat =  10;
    $aktJahr =   2026;


    $diff = $aktJahr - $gebJahr;

    $istVollJahr = true;



    //irgendwas ist falsch
    if ($diff > 18) {
        $istVollJahr = true;
    } else {
        if ($diff == 18 && $aktMonat > $gebMonat) {
            $istVollJahr = true;
        } else {
            if ($diff == 18 && $aktMonat < $gebMonat) {
                if ($aktTag >= $gebTag) {
                    $istVollJahr = false;
                } else {
                    if ($diff == 18 && $aktMonat == $gebMonat) {
                        if ($aktTag >= $gebTag) {
                            $istVollJahr = true;
                        }
                        if ($aktTag < $gebTag) {
                            $istVollJahr = false;
                        }
                    }
                }
            }
        }
    }

    if ($istVollJahr == true) {
        echo "<p> $vorname ist volljährig </p>";
    } else {
        echo "<p> $vorname ist nicht volljährig </p>";
    }
    ?>
</body>

</html>