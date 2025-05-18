import React, { useState } from 'react';

interface StorySection {
  title: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
}

export const HistoriaMesManager: React.FC = () => {
  const [title, setTitle] = useState('Logros del Mes');
  const [intro, setIntro] = useState('Este mes hemos logrado grandes cosas gracias a tu ayuda.');
  const [sections, setSections] = useState<StorySection[]>([
    { title: '', text: '', imageUrl: '', videoUrl: '' },
    { title: '', text: '', imageUrl: '', videoUrl: '' },
    { title: '', text: '', imageUrl: '', videoUrl: '' }
  ]);

  const handleSectionChange = (index: number, field: keyof StorySection, value: string) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };


const saveHtmlToServer = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/save-historia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: previewHtml }),
    });

    if (res.ok) {
      alert('✅ Historia guardada y publicada.');
    } else {
      alert('❌ Error al guardar.');
    }
  } catch (err) {
    console.error('❌ Error al guardar en el servidor', err);
  }
};

const openCloudinaryWidget = (index: number) => {
  // @ts-ignore
  window.cloudinary.openUploadWidget(
    {
      cloudName: 'drxkkydfp',
      uploadPreset: 'donor_unsigned',
      sources: ['local', 'url', 'camera', 'dropbox'],
      multiple: false,
      resourceType: 'auto',
      clientAllowedFormats: ['image', 'video']
    },
    (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        const url = result.info.secure_url;
        const type = result.info.resource_type;
        const updated = [...sections];
        if (type === 'image') updated[index].imageUrl = url;
        else if (type === 'video') updated[index].videoUrl = url;
        setSections(updated);
      }
    }
  );
};


const saveHtmlToAPI = async () => {
  try {
    const res = await fetch('http://162.243.77.211:8081/create-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: previewHtml,
        name: 'Historia del Mes',
        recurrent: false,
        type: 'MAIL'
      }),
    });

    if (res.ok) {
      alert('✅ Historia enviada al API exitosamente.');
    } else {
      const err = await res.text();
      console.error('❌ API error:', err);
      alert('❌ Error al guardar la historia en el API.');
    }
  } catch (error) {
    console.error('❌ Error de red o API', error);
    alert('❌ Error al comunicarse con el API.');
  }
};




  const previewHtml = `
    <html>
      <body style="font-family: sans-serif; padding: 2rem; background: #fdfdfd; color: #333;">
        <h1 style="text-align: center;">${title}</h1>
        <p style="font-size: 1.2rem; text-align: center;">${intro}</p>
        <hr />
        ${sections
          .map(
            section => `
          <section style="margin: 2rem 0;">
            <h2>${section.title}</h2>
            <p>${section.text.replace(/\n/g, '<br />')}</p>
            ${
              section.imageUrl
                ? `<img src="${section.imageUrl}" style="max-width: 100%; margin: 1rem 0;" />`
                : ''
            }
            ${
              section.videoUrl
                ? `<p><a href="${section.videoUrl}" target="_blank">🎥 Ver video</a></p>`
                : ''
            }
          </section>`

          )
          .join('')}
        <hr />
        <footer style="text-align: center; margin-top: 3rem;">
          <p>Gracias por ser parte de nuestro impacto positivo ❤️</p>
        </footer>
      </body>
    </html>
  `;

  return (
    <div style={containerStyle}>
      <h2>📖 Historia del Mes</h2>

      <label>Título principal:</label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={inputStyle}
      />

      <label>Introducción:</label>
      <textarea
        rows={3}
        value={intro}
        onChange={e => setIntro(e.target.value)}
        style={textareaStyle}
      />

      <hr style={{ margin: '2rem 0' }} />

{sections.map((section, index) => (
  <div key={index} style={{ marginBottom: '2rem' }}>
    <h3>Sección {index + 1}</h3>
    <label>Título de sección:</label>
    <input
      type="text"
      value={section.title}
      onChange={e => handleSectionChange(index, 'title', e.target.value)}
      style={inputStyle}
    />

    <label>Texto:</label>
    <textarea
      rows={4}
      value={section.text}
      onChange={e => handleSectionChange(index, 'text', e.target.value)}
      style={textareaStyle}
    />

    <label>Imagen (URL):</label>
    <input
      type="text"
      value={section.imageUrl}
      onChange={e => handleSectionChange(index, 'imageUrl', e.target.value)}
      style={inputStyle}
    />

    <label>Video (URL):</label>
    <input
      type="text"
      value={section.videoUrl}
      onChange={e => handleSectionChange(index, 'videoUrl', e.target.value)}
      style={inputStyle}
    />

    {/* ✅ Upload Button Here */}
    <button
      onClick={() => openCloudinaryWidget(index)}
      style={{
        background: '#2196f3',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '1rem'
      }}
    >
      📤 Subir Imagen o Video
    </button>
  </div>
))}


{/* <button
  onClick={() => {
    fetch('http://localhost:3000/api/save-historia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: previewHtml }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert('📄 Página actualizada con éxito');
        else alert('❌ Falló al guardar');
      });
  }}
>
  💾 Guardar y Publicar Historia del Mes
</button> */}

<button onClick={saveHtmlToAPI} style={{ marginLeft: '1rem' }}>
  📤 Publicar Historia del Mes al API
</button>




      <h3 style={{ marginTop: '2rem' }}>🖼️ Vista previa</h3>
      <div
        style={previewBox}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '2rem',
  background: '#1f1f1f',
  borderRadius: '12px',
  color: '#f0f0f0',
  maxWidth: '800px',
  margin: '2rem auto',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  marginBottom: '1rem',
  background: '#2a2a2a',
  color: '#fff',
  border: '1px solid #444',
  borderRadius: '5px'
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '100px'
};

const previewBox: React.CSSProperties = {
  background: '#fff',
  color: '#000',
  padding: '2rem',
  borderRadius: '8px',
  marginTop: '1rem',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
};
