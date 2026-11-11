const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function safeUrl(value = "") {
  const input = String(value).trim();
  if (!input) return "";
  if (/^#[a-z0-9_-]+$/i.test(input)) return input;
  if (/^(\.\.\/|\.\/|\/)/.test(input)) return input;

  try {
    const url = new URL(input, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function imagePath(value = "") {
  const path = String(value).trim();
  if (path.startsWith("/images/") || path.startsWith("images/")) return path;
  try {
    const url = new URL(path);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function button(text, href, className = "pill") {
  const url = safeUrl(href);
  if (!url || !text) return "";
  return `<a class="${className}" href="${escapeHtml(url)}">${escapeHtml(text)} <span aria-hidden="true">→</span></a>`;
}

function videoEmbed(value = "") {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0]
        : url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];
      if (!id || !/^[\w-]+$/.test(id)) return null;
      const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
      const playlist = url.searchParams.get("list");
      if (playlist) embed.searchParams.set("list", playlist);
      return embed.href;
    }

    if (["drive.google.com", "docs.google.com"].includes(host)) {
      const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get("id");
      if (id) return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    }
  } catch {
    return null;
  }
  return null;
}

function renderVideo(video, index) {
  if (video.enabled === false) return "";
  const title = escapeHtml(video.title || `Video ${index + 1}`);
  const description = video.description ? `<p class="video-intro">${escapeHtml(video.description)}</p>` : "";
  const embed = videoEmbed(video.url);
  const player = embed
    ? `<div class="video-frame"><iframe src="${escapeHtml(embed)}" title="${title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    : `<p class="video-intro">This video link could not be embedded. <a href="${escapeHtml(safeUrl(video.url))}">Open the video</a>.</p>`;
  return `<section class="video-section" aria-labelledby="video-title-${index}"><h2 class="video-heading" id="video-title-${index}">${title}</h2>${description}${player}</section>`;
}

function renderSite(site) {
  document.title = `${site.siteTitle || "Portfolio"} — Portfolio`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && site.metaDescription) metaDescription.content = site.metaDescription;

  const heroImage = imagePath(site.hero?.image);
  const shop = site.shop || {};
  const about = site.about || {};
  const artist = site.artist || {};
  const contact = site.contact || {};

  const gallery = (site.gallery || []).map((item, index) => {
    const src = imagePath(item.image);
    if (!src) return "";
    const image = `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.imageAlt || item.title || "Portfolio image")}" loading="lazy">`;
    const content = item.title ? `${image}<figcaption>${escapeHtml(item.title)}</figcaption>` : image;
    const href = safeUrl(item.link);
    return `<figure class="object-card">${href ? `<a href="${escapeHtml(href)}">${content}</a>` : content}</figure>`;
  }).join("");

  const previousProjectLink = safeUrl(artist.previousProjectLink);
  const previousProject = previousProjectLink && artist.previousProjectText
    ? `<p>You may know me from my earlier project <a href="${escapeHtml(previousProjectLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(artist.previousProjectText)}</a></p>`
    : "";
  const email = String(contact.email || "").trim();
  const phone = String(contact.phone || "").trim();
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "";

  const app = document.getElementById("site-root");
  app.innerHTML = `
    <header class="hero" id="top">
      ${heroImage ? `<img class="hero-art" src="${escapeHtml(heroImage)}" alt="${escapeHtml(site.hero.imageAlt || "")}">` : ""}
      <nav class="nav" aria-label="Main navigation">
        <a class="brand" href="#top">${escapeHtml(site.siteTitle || "Home")}</a>
        <a href="#shop">shop</a><a href="#about">about</a><a href="#bio">bio</a><a href="#contact">contact</a>
      </nav>
      ${button(site.hero?.buttonText, site.hero?.buttonLink)}
    </header>
    <main>
      <section class="products" id="shop" aria-label="Featured rugs">
        <article class="product-photo">
          ${imagePath(shop.photoImage) ? `<img src="${escapeHtml(imagePath(shop.photoImage))}" alt="${escapeHtml(shop.photoAlt || "")}" loading="lazy">` : ""}
          ${button(shop.photoButtonText, shop.photoButtonLink)}
        </article>
        <article class="product-feature">
          <div class="feature-item">
            ${imagePath(shop.featuredImage) ? `<img src="${escapeHtml(imagePath(shop.featuredImage))}" alt="${escapeHtml(shop.featuredImageAlt || shop.featuredTitle || "")}" loading="lazy">` : ""}
            <div class="feature-copy">${escapeHtml(shop.featuredTitle || "")}${shop.featuredDimensions ? `<br>${escapeHtml(shop.featuredDimensions)}` : ""}</div>
          </div>
          ${button(shop.featuredButtonText, shop.featuredButtonLink, "pill feature-buy")}
          <div class="feature-copy secondary-product">${escapeHtml(shop.secondaryTitle || "")}${shop.secondaryDimensions ? `<br>${escapeHtml(shop.secondaryDimensions)}` : ""}</div>
        </article>
      </section>
      <section class="about-room" id="about">
        <div class="about-copy">
          ${about.paragraphOne ? `<p>${escapeHtml(about.paragraphOne)}</p>` : ""}
          ${about.paragraphTwo ? `<p>${escapeHtml(about.paragraphTwo)}</p>` : ""}
        </div>
        <figure>${imagePath(about.roomImage) ? `<img src="${escapeHtml(imagePath(about.roomImage))}" alt="${escapeHtml(about.roomImageAlt || "")}" loading="lazy">` : ""}</figure>
      </section>
      <section class="objects" aria-label="Tufted wall art gallery">${gallery}</section>
      <section class="artist" id="bio">
        <div class="artist-photo">${imagePath(artist.portrait) ? `<img src="${escapeHtml(imagePath(artist.portrait))}" alt="${escapeHtml(artist.portraitAlt || "Artist portrait")}" loading="lazy">` : ""}</div>
        <div class="artist-copy">
          ${artist.intro ? `<p>${escapeHtml(artist.intro)}</p>` : ""}
          ${previousProject}
          ${artist.biography ? `<p>${escapeHtml(artist.biography)}</p>` : ""}
          ${artist.extraText ? `<p>${escapeHtml(artist.extraText)}</p>` : ""}
        </div>
      </section>
      ${(site.videos || []).map(renderVideo).join("")}
    </main>
    <footer id="contact"><div class="contact"><h2>CONTACT</h2>
      ${email ? `<p><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>` : ""}
      ${phone ? `<p><a href="${escapeHtml(phoneHref)}">${escapeHtml(phone)}</a></p>` : ""}
    </div></footer>`;
}

fetch("content/site.json", { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error(`Could not load site content (${response.status})`);
    return response.json();
  })
  .then(renderSite)
  .catch((error) => {
    console.error(error);
    document.getElementById("site-root").innerHTML = '<p class="loading-message">The site content could not be loaded. Please check that <code>content/site.json</code> exists and preview the site through a local web server.</p>';
  });
