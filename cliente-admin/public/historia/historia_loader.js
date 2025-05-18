document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("story-container");
  const nameEl = document.getElementById("greeting");
  const donationEl = document.getElementById("donation-amount");

  // 1. Get user email from URL or fallback
  const urlParams = new URLSearchParams(window.location.search);
  const targetEmail = urlParams.get("email") || "pepito92@email.com";

  // 2. Fetch donor analytics
  try {
    const resDonor = await fetch("http://162.243.77.211:8081/analitics");
    const analytics = await resDonor.json();

    console.log("✅ Donor analytics:", analytics);

    const donorEntry = Object.values(analytics).find(
      entry => entry.email === targetEmail
    );

    if (donorEntry) {
      const name = donorEntry.name || "amig@";
      const amount = donorEntry.total_amount || "0";

      nameEl.textContent = `Hola, ${name}.`;
      donationEl.textContent = `Has donado un total de $${amount}. ¡Gracias de corazón! ❤️`;
    } else {
      nameEl.textContent = "Hola, amig@.";
      donationEl.style.display = "none";
    }
  } catch (err) {
    console.error("❌ Error al cargar datos del donante:", err);
    nameEl.textContent = "Hola, amig@.";
    donationEl.style.display = "none";
  }

  // 3. Fetch Historia del Mes
  try {
    const resHistoria = await fetch("http://162.243.77.211:8081/get-all-templates?type=MAIL");
    const data = await resHistoria.json();

    console.log("✅ Plantillas recibidas:", data);

    const historia = data
      .filter(t => t[3] === "Historia del Mes")
      .sort((a, b) => b[0] - a[0])[0];

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
