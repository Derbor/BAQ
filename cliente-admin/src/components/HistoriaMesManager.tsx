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
        </div>
      ))}

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
