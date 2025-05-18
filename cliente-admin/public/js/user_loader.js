document.addEventListener("DOMContentLoaded", async () => {
  const greetingEl = document.getElementById("greeting");

  try {
    // 🔧 Replace with the correct API once you know it
    const res = await fetch("http://your-api-url.com/get-user-name?id=123");
    const data = await res.json();

    const name = data?.name || "amig@";  // Fallback if name is missing
    greetingEl.textContent = `Hola, ${name}.`;
  } catch (err) {
    console.error("❌ Error al cargar el nombre:", err);
    greetingEl.textContent = "Hola, amig@.";
  }
});
