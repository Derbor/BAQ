document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("story-container");

  try {
    const res = await fetch("http://162.243.77.211:8081/get-all-templates?type=MAIL");
    const data = await res.json();

    console.log("✅ Plantillas recibidas:", data);

    // Find the latest "Historia del Mes"
    const historia = data
      .filter(t => t[3] === "Historia del Mes")
      .sort((a, b) => b[0] - a[0]) // Sort by ID descending
      [0]; // Take the most recent one

    if (historia && historia[4]) {
      container.innerHTML = historia[4];
    } else {
      container.innerHTML = "<p>No hay historia disponible aún.</p>";
    }
  } catch (err) {
    console.error("❌ Error al cargar la historia:", err);
    container.innerHTML = "<p>Error al conectar con el servidor.</p>";
  }
});
