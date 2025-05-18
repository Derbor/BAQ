import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function sendEmails(data) {
  try {
    const response = await fetch('https://mail.andresgaibor.trade/correo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const result = await response.json();
    } else {
      const text = await response.text();
    }
  } catch (error) {
    console.error('Error enviando correos:', error);
  }
}

async function main() {
  try {
    // SUBSCRIBED USERS EMAILS
    const response = await fetch('http://162.243.77.211:8081/mails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurrent: true })
    });

    const data = await response.json();
    console.warn('Suscritos:', data);
    await sendEmails(data);

    // NOT SUBSCRIBED USERS EMAILS
    const responseNotSubscribed = await fetch('http://162.243.77.211:8081/mails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurrent: false })
    });

    const notSubscribedEmails = await responseNotSubscribed.json();
    console.warn('No suscritos:', notSubscribedEmails);
    await sendEmails(notSubscribedEmails);

  } catch (err) {
    console.error('Error en el cronjob:', err);
  }
}

main();
