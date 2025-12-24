async function login(event) {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  const res = await fetch(BASE_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password })
  });

  const data = await res.json();

  if (res.status !== 200) {
    document.getElementById("msg").innerText = "Usuário ou senha inválidos.";
    return;
  }

  localStorage.setItem("token", data.token);

  window.location.href = "home.html";
}