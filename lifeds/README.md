# lifeds.romarte.cz — Digitální školka

Čisté HTML (`site/index.html`), bez buildu. Odkazuje na aplikaci pro rodiče (lifeos.romarte.cz).

## Cloudflare
1. **Workers & Pages → Create** → import repozitáře `lifeosweb`.
2. Název **`lifeds`**, **Advanced settings → Path: `/lifeds`**, build příkaz výchozí.
3. Projekt → **Settings → Domains & Routes → Add → Custom domain** → `lifeds.romarte.cz`
   (DNS záznam Cloudflare přidá sám).
