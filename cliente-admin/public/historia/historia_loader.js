fetch('/api/historia-del-mes')
  .then(res => res.json())
  .then(data => {
    document.getElementById('story-title').textContent = data.title;
    document.getElementById('story-date').textContent = new Date(data.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    document.getElementById('story-body').innerHTML = data.content;

    if (data.imageUrl) {
      document.getElementById('story-media').innerHTML = `
        <img src="${data.imageUrl}" alt="Imagen del mes" />
      `;
    } else if (data.videoUrl) {
      document.getElementById('story-media').innerHTML = `
        <iframe src="${data.videoUrl}" frameborder="0" allowfullscreen></iframe>
      `;
    }
  })
  .catch(err => {
    document.getElementById('story-body').innerHTML = '<p>Error al cargar la historia.</p>';
  });
