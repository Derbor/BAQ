import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {

    //SUBCRIBED USERS EMAILS
    const response = await fetch('http://192.168.56.1:8081/mails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurrent: true })
    });

    const data = await response.json();
    console.warn(data);

    const sendResponse = await fetch('http://localhost:3000/correo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    await sendResponse.json();

    //NOT SUBSCRIBED USERS EMAILS
    const responseNotSubscribed = await fetch('http://192.168.56.1:8081/mails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurrent: true })
    });

    const notSubscribedEmails = await responseNotSubscribed.json();
    console.warn(data);

    await fetch('http://localhost:3000/correo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notSubscribedEmails)
    });

  } catch (err) {
    console.error('Error en el cronjob:', err);
  }
}

main();
