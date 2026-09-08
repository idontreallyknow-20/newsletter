# Putting a profile picture on the sending address

Inbox apps pick the avatar next to a sender in three different ways. The site only controls one of them (BIMI), the other two are settings you make on accounts. Do all three and most readers see a picture.

The from address is whatever **Settings > From Email** is set to (the example below uses `joseph@dailybriefhq.com`). Whatever it is, everything here has to be done for that exact address.

## 1. Gmail readers: a Google account on the sending address (free, 10 minutes)

Gmail shows the Google profile photo of whoever owns the from address. It does not need to be a Gmail mailbox.

1. Sign out of Google, open [accounts.google.com/signup](https://accounts.google.com/signup) and pick **Use my current email address instead**.
2. Enter the from address. Google emails a verification code to it, so the address has to receive mail. Resend only sends. Add a free forwarding rule at your DNS host (Cloudflare Email Routing, or ImprovMX) that forwards `joseph@dailybriefhq.com` to your personal Gmail, then paste the code.
3. Once the account exists, open [myaccount.google.com](https://myaccount.google.com), click the avatar, upload the photo. A square crop of `public/joseph.jpg` works.
4. Set the name on the account to `Joseph Leung`, the same name as **Settings > From Name**.

Gmail picks the photo up within a day or two. Send yourself a test from the dashboard to check.

The same forwarding rule fixes replies: the footer says "Reply to this email and I will read it", which is only true if the address actually lands somewhere.

## 2. Other clients: Gravatar (free, 2 minutes)

Some clients and browser extensions look the from address up on Gravatar. Sign up at [gravatar.com](https://gravatar.com) with the same photo and add the from address to the account. Low cost, low coverage, no reason not to.

## 3. Yahoo, Apple Mail, Fastmail, La Poste: BIMI (free, DNS only)

BIMI is a DNS record that points at a logo. The logo is already in this repo at `public/bimi.svg` and is served at `https://dailybriefhq.com/bimi.svg` without login. It follows the SVG Tiny Portable/Secure profile the spec requires (square, solid background, `baseProfile="tiny-ps"`, a `<title>`, no scripts or external references).

BIMI only works if DMARC is enforcing. Check what you have:

```bash
dig +short TXT _dmarc.dailybriefhq.com
```

You need `p=quarantine` or `p=reject` (not `p=none`), with no `pct` below 100. Resend already signs with DKIM and gives you SPF, so a safe record is:

```
_dmarc.dailybriefhq.com  TXT  "v=DMARC1; p=quarantine; rua=mailto:<your personal email>; adkim=s; aspf=s"
```

Then add the BIMI record:

```
default._bimi.dailybriefhq.com  TXT  "v=BIMI1; l=https://dailybriefhq.com/bimi.svg; a=;"
```

Give it an hour, then paste the domain into [bimigroup.org/bimi-generator](https://bimigroup.org/bimi-generator/) to validate the record and the SVG.

**Gmail and BIMI.** Gmail (and Apple Mail on the blue-check path) only show a BIMI logo if the record also points at a Verified Mark Certificate or Common Mark Certificate (`a=` in the record). Those are sold by DigiCert and Entrust for roughly USD 1,000 to 1,500 a year and need a registered trademark or a logo in use for twelve months. Not worth it for this list. Step 1 covers Gmail for free.

## Checking

Send a test issue from the dashboard to a Gmail account, a Yahoo account, and an iPhone. Gmail should show the Google photo, Yahoo the BIMI logo, iOS Mail the BIMI logo (it accepts records without a certificate on most versions). If Gmail shows a letter instead of the photo, the Google account's email is not exactly the from address, or the photo has not propagated yet.
