document.addEventListener("DOMContentLoaded", async () => {
  const greetingEl = document.getElementById("greeting");
  const donationEl = document.getElementById("donation-amount");

  try {
    const res = await fetch("http://162.243.77.211:8081/analitics");
    const analyticsData = await res.json();

    // You can select a specific donor ID dynamically or hardcoded (e.g., 3)
   const urlParams = new URLSearchParams(window.location.search);
const donorId = urlParams.get('id') || 3; // fallback to ID 3

    const donor = analyticsData[donorId];

    if (donor) {
      const name = donor.name || "amig@";
      const total = donor.totalDonated;

      greetingEl.textContent = `Hola, ${name}.`;

      if (total !== undefined && total !== null) {
        donationEl.textContent = `Has donado un total de $${total}. ¡Gracias de corazón! ❤️`;
      } else {
        donationEl.style.display = "none";
      }
    } else {
      greetingEl.textContent = "Hola, amig@.";
      donationEl.style.display = "none";
    }

  } catch (err) {
    console.error("❌ Error al cargar los datos del donante:", err);
    greetingEl.textContent = "Hola, amig@.";
    donationEl.style.display = "none";
  }
});
