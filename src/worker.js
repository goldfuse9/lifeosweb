// Worker pro lifeos.romarte.cz: statické soubory z web/ + přihláška testerů pro Android.
// POST /api/tester  { email, jmeno?, web? (honeypot) }
// 1) vždy zapíše přihlášku do logu (Cloudflare → Workers → lifeosweb → Logs),
// 2) když existuje vazba LIFEOS_MAIL (send_email), pošle upozornění e-mailem.

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;

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
      await env.LIFEOS_MAIL.send({
        from: { email: env.MAIL_FROM || 'web@romarte.cz', name: 'LifeOS web' },
        to: env.MAIL_TO || 'artejsem@gmail.com',
        replyTo: email,
        subject: 'Nový tester LifeOS (Android): ' + email,
        text:
          'Nová přihláška do testování LifeOS pro Android.\n\n' +
          'E-mail (Google účet): ' + email + '\n' +
          (jmeno ? 'Jméno: ' + jmeno + '\n' : '') +
          'Čas: ' + when + '\n' +
          (country ? 'Země: ' + country + '\n' : '') +
          '\nDalší krok: Google Play Console → LifeOS → Testování → Interní testování → Testeři → přidat e-mail do seznamu,\n' +
          'pak mu pošli odkaz pro připojení k testování (odpověz rovnou na tento e-mail).\n',
      });
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
