<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fake Store API - Fetch Übung</title>
  <style>body {
  font-family: sans-serif;
  margin: 2rem;
}

button {
  padding: 10px 15px;
  cursor: pointer;
}
</style>
</head>
<body>

  <h1>Fake Store API Übung</h1>
  <button id="loadBtn">User zu Warenkorb 5 laden</button>
  <p>Gefundener Benutzername: <strong id="output">-</strong></p>

  <script src="script.js"></script>

</body>
</html>







const btn=document.getElementById("loadBtn");

btn.addEventListener("click", () => {

    fetch("https://fakestoreapi.com/carts/6")
        .then(response => response.json())
        .then(cart => fetch("https://fakestoreapi.com/users/" + cart.userId))
        .then(response => response.json())
        .then(user => {
            document.getElementById("output").textContent = user.username;
        });

});
