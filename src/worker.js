// Worker pro lifeos.romarte.cz: statické soubory z web/ + přihláška testerů pro Android.
// POST /api/tester  { email, jmeno?, web? (honeypot) }
// 1) vždy zapíše přihlášku do logu (Cloudflare → Workers → lifeosweb → Logs),
// 2) když existuje vazba LIFEOS_MAIL (send_email), pošle upozornění e-mailem.

import { EmailMessage } from 'cloudflare:email';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;


// Jednoduchá MIME zpráva (UTF-8, base64) — funguje s vazbou send_email z Email Routingu.
function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function mime({ from, to, replyTo, subject, text }) {
  const body = b64(text).replace(/.{76}/g, '$&\r\n');
  return [
    'From: "LifeOS web" <' + from + '>',
    'To: <' + to + '>',
    'Reply-To: <' + replyTo + '>',
    'Subject: =?UTF-8?B?' + b64(subject) + '?=',
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <' + crypto.randomUUID() + '@romarte.cz>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

async function tester(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Neplatný požadavek.' }, 400);
  }
  // honeypot: roboti vyplní skryté pole, lidé ne — tvářit se úspěšně, nic nedělat
  if (data.web) return json({ ok: true });

  const email = String(data.email || '').trim().toLowerCase();
  const jmeno = String(data.jmeno || '').trim().slice(0, 80);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Zkontroluj prosím e-mail.' }, 422);

  const when = new Date().toISOString();
  const country = request.cf && request.cf.country ? request.cf.country : '';
  console.log(JSON.stringify({ type: 'android-tester', email, jmeno, when, country }));

  if (env.LIFEOS_MAIL) {
    try {
      const from = env.MAIL_FROM || 'web@romarte.cz';
      const to = env.MAIL_TO || 'artejsem@gmail.com';
      const text =
        'Nová přihláška do testování LifeOS pro Android.\n\n' +
        'E-mail (Google účet): ' + email + '\n' +
        (jmeno ? 'Jméno: ' + jmeno + '\n' : '') +
        'Čas: ' + when + '\n' +
        (country ? 'Země: ' + country + '\n' : '') +
        '\nDalší krok: Google Play Console → LifeOS → Testování → Interní testování → Testeři → přidat e-mail do seznamu,\n' +
        'pak mu pošli odkaz pro připojení k testování (odpověz rovnou na tento e-mail).\n';
      await env.LIFEOS_MAIL.send(new EmailMessage(from, to, mime({ from, to, replyTo: email, subject: 'Nový tester LifeOS (Android): ' + email, text })));
    } catch (e) {
      console.log(JSON.stringify({ type: 'mail-error', code: e && e.code, message: e && e.message }));
    }
  }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/tester') {
      if (request.method !== 'POST') return json({ ok: false, error: 'Použij POST.' }, 405);
      return tester(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
