import React, { useState, useMemo, useEffect } from 'react';

interface MessageForm {
  _id?: string;
  internalTitle: string;
  subject: string;
  message: string;
  imageUrl?: string;
  videoUrl?: string;
  tier?: string;
}

interface SavedMessage {
  id: string;
  internalTitle: string;
  subject: string;
  tier: string;
}

export const AdminMessageForm: React.FC = () => {
  const [formData, setFormData] = useState<MessageForm>({
    internalTitle: '',
    subject: '',
    message: '',
    imageUrl: '',
    videoUrl: '',
    tier: 'Tier 1'
  });

  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [status, setStatus] = useState('');
  const [htmlContent, setHtmlContent] = useState('');


const handleSave = async () => {
  const payload = {
    html: previewHtml
  };

  try {
    const res = await fetch('/api/save-historia-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('✅ Historia guardada correctamente.');
    } else {
      alert('❌ Error al guardar la historia.');
    }
  } catch (err) {
    alert('❌ Error de red al guardar.');
    console.error(err);
  }
};



useEffect(() => {
  fetch('/api/list-templates')
    .then(async res => {
      try {
        const data = await res.json();
        const realTemplates = (data.templates || []).map((t: any) => ({
          id: t._id,
          internalTitle: t.internalTitle,
          subject: t.subject,
          tier: t.tier
        }));

        const demoTemplates: SavedMessage[] = [
          { id: 'demo1', internalTitle: 'Bienvenida Nuevos Donantes', subject: '¡Gracias por unirte a nuestra misión!', tier: 'Donante Único' },
          { id: 'demo2', internalTitle: 'Actualización Mensual - Micro', subject: 'Tu impacto este mes 🌱', tier: 'Tier 1' },
          { id: 'demo3', internalTitle: 'Campaña Especial de Recaudación', subject: '¡Ayúdanos a llegar más lejos!', tier: 'Recurrente' },
          { id: 'demo4', internalTitle: 'Recordatorio para completar tu apoyo', subject: '¿Nos ayudas a continuar?', tier: 'Abandonado' }
        ];

        setSavedMessages([...demoTemplates, ...realTemplates]);
      } catch (jsonErr) {
        console.warn('❌ JSON parsing failed, using demo templates:', jsonErr);

        // Only fallback to demo if JSON fails
        setSavedMessages([
          { id: 'demo1', internalTitle: 'Bienvenida Nuevos Donantes', subject: '¡Gracias por unirte a nuestra misión!', tier: 'Donante Único' },
          { id: 'demo2', internalTitle: 'Actualización Mensual - Micro', subject: 'Tu impacto este mes 🌱', tier: 'Tier 1' },
          { id: 'demo3', internalTitle: 'Campaña Especial de Recaudación', subject: '¡Ayúdanos a llegar más lejos!', tier: 'Recurrente' },
          { id: 'demo4', internalTitle: 'Recordatorio para completar tu apoyo', subject: '¿Nos ayudas a continuar?', tier: 'Abandonado' }
        ]);
      }
    })
    .catch(err => {
      console.warn('❌ Fetch failed completely:', err);
    });
}, []);


  const handleChange = (field: keyof MessageForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const loadMessage = async () => {
    if (!selectedMessageId) return;
    try {
      const res = await fetch(`/api/get-template?id=${selectedMessageId}`);
      const data = await res.json();
      setFormData({
        internalTitle: data.internalTitle || '',
        subject: data.subject,
        message: data.message,
        imageUrl: extractImageUrl(data.html_template),
        videoUrl: extractVideoUrl(data.html_template),
        tier: data.tier
      });
    } catch {
      setStatus('❌ No se pudo cargar la plantilla.');
    }
  };

  const openMediaUpload = () => {
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
          if (type === 'image') {
            setFormData(prev => ({ ...prev, imageUrl: url }));
          } else if (type === 'video') {
            setFormData(prev => ({ ...prev, videoUrl: url }));
          }
        }
      }
    );
  };

  const renderedHtml = useMemo(() => {
    return `
      <html>
        <body style="font-family: sans-serif; background-color: #f9f9f9; padding: 2rem;">
          <p>Estimado/a <strong>{{name}}</strong>,</p>
          <p>${formData.message.replace(/\n/g, '<br />')}</p>
          ${formData.imageUrl ? `<img src="${formData.imageUrl}" alt="Imagen relacionada" style="max-width: 100%; margin-top: 1rem;" />` : ''}
          ${formData.videoUrl ? `<p><a href="${formData.videoUrl}" target="_blank">Ver video relacionado</a></p>` : ''}

<table cellspacing="0" cellpadding="0" style="margin: 2rem auto 0 auto;">
  <tr>
    <td align="center" style="padding: 0.5rem;">
      <a href="https://tusitio.com/historia-del-mes" 
         style="background-color: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        📖 Leer Historia del Mes
      </a>
    </td>
    <td align="center" style="padding: 0.5rem;">
      <a href="https://tusitio.com/donar" 
         style="background-color: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        💖 Donar Ahora
      </a>
    </td>
  </tr>
</table>


          <p style="margin-top: 2rem;">Gracias por tu apoyo.<br />— El equipo BAQ</p>
        </body>
      </html>
    `;
  }, [formData]);

  const whatsappTemplate = useMemo(() => {
    return `
Estimado/a *{{name}}*,

${formData.message}

${formData.imageUrl ? `📷 Imagen: ${formData.imageUrl}` : ''}
${formData.videoUrl ? `🎥 Video: ${formData.videoUrl}` : ''}

Gracias por tu apoyo.
— El equipo
`;
  }, [formData]);

  const handleSubmit = async () => {
    const payload = {
      id: selectedMessageId || undefined,
      internalTitle: formData.internalTitle,
      subject: formData.subject,
      tier: formData.tier,
      message: formData.message,
      html_template: renderedHtml,
      whatsapp_template: whatsappTemplate
    };

    try {
      const res = await fetch('/api/store-message-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setStatus(res.ok ? '✅ Plantilla guardada correctamente.' : '❌ Error al guardar.');
    } catch {
      setStatus('❌ Error de red.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2>📬 Mensajería para Donadores</h2>

      <label>📂 Plantillas guardadas:</label>
      <select
        value={selectedMessageId}
        onChange={e => setSelectedMessageId(e.target.value)}
        style={inputStyle}
      >
        <option value="">-- Seleccionar mensaje para editar --</option>
        {savedMessages.map(msg => (
          <option key={msg.id} value={msg.id}>
            {msg.internalTitle} ({msg.tier})
          </option>
        ))}
      </select>

      <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: '#ccc' }}>
        Puedes <strong>crear una nueva plantilla</strong> llenando el formulario, o 
        <strong> editar una existente</strong> seleccionándola arriba.
      </p>

      
<div style={{ marginBottom: '1.5rem' }}>
  <button onClick={loadMessage} style={buttonStyle}>
    ✏️ Editar Plantilla
  </button>
</div>

<div style={{ marginBottom: '1rem' }}>
  <label>Nivel de membresía (tier):</label>
  <select value={formData.tier} onChange={handleChange('tier')} style={inputStyle}>
    <option value="Tier 1">Tier 1 – Micro</option>
    <option value="Tier 2">Tier 2 – Básico</option>
    <option value="Tier 3">Tier 3 – Medio</option>
    <option value="Tier 4">Tier 4 – Grande</option>
    <option value="Recurrente">Recurrente</option>
    <option value="Abandonado">Abandonado</option>
    <option value="Donante Único">Donante Único</option>
    <option value="Todos">Todos</option>
  </select>
</div>

      <label>Nombre interno de la plantilla:</label>
      <input type="text" value={formData.internalTitle} onChange={handleChange('internalTitle')} style={inputStyle} />

      <label>Asunto del mensaje (subject):</label>
      <input type="text" value={formData.subject} onChange={handleChange('subject')} style={inputStyle} />

      <label>Mensaje (usa {"{{name}}"})</label>
      <textarea rows={6} value={formData.message} onChange={handleChange('message')} style={textareaStyle} />

      <label>URL de imagen:</label>
      <input type="text" value={formData.imageUrl} onChange={handleChange('imageUrl')} style={inputStyle} />

      <label>URL de video:</label>
      <input type="text" value={formData.videoUrl} onChange={handleChange('videoUrl')} style={inputStyle} />

      <button onClick={openMediaUpload} style={buttonStyle}>📤 Subir Imagen o Video</button>
      <button onClick={handleSubmit} style={{ ...buttonStyle, background: '#4caf50' }}>💾 Guardar Mensaje</button>

      <h3 style={{ marginTop: '2rem', color: '#ccc' }}>👁️ Vista previa email</h3>
      <div style={previewBox} dangerouslySetInnerHTML={{ __html: renderedHtml.replace('{{name}}', 'Nombre de Ejemplo') }} />

      <h3 style={{ marginTop: '2rem', color: '#ccc' }}>📱 Vista previa WhatsApp</h3>
      <pre style={whatsappBox}>{whatsappTemplate.replace('{{name}}', 'Nombre de Ejemplo')}</pre>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
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
  minHeight: '120px'
};

const containerStyle: React.CSSProperties = {
  padding: '2rem',
  background: '#1f1f1f',
  borderRadius: '12px',
  color: '#f0f0f0',
  maxWidth: '700px',
  margin: '2rem auto',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
};

const buttonStyle: React.CSSProperties = {
  background: '#2196f3',
  color: '#fff',
  padding: '0.6rem 1.2rem',
  marginBottom: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const previewBox: React.CSSProperties = {
  background: '#fff',
  color: '#000',
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
};

const whatsappBox: React.CSSProperties = {
  background: '#e5ffe5',
  color: '#000',
  padding: '1rem',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap',
  marginTop: '1rem',
  fontFamily: 'monospace'
};

const extractImageUrl = (html: string): string => {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : '';
};

const extractVideoUrl = (html: string): string => {
  const match = html.match(/<a[^>]+href="([^"]+)"[^>]*>Ver video/i);
  return match ? match[1] : '';
};
