(function () {
  const content = window.NVTC_CONTENT || {};

  const navItems = [
    { page: "home", href: "index.html", label: "Home" },
    { page: "resolutions", href: "resolutions.html", label: "Current Resolutions" },
    { page: "press", href: "press.html", label: "News & Press" },
    { page: "eyesore", href: "eyesore.html", label: "Architectural Eyesore of the Week" },
    { page: "about", href: "about.html", label: "About Council" },
    { page: "contact", href: "contact.html", label: "Contact" }
  ];

  function formatDate(isoDate) {
    const date = new Date(isoDate + "T00:00:00");
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function getResolutionsNewestFirst() {
    if (!Array.isArray(content.resolutions)) return [];
    return content.resolutions
      .slice()
      .sort((a, b) => new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00"));
  }

  function insertHeader() {
    const mount = document.querySelector('[data-component="header"]');
    if (!mount) return;

    const currentPage = document.body.dataset.page;
    const navLinks = navItems
      .map((item) => {
        const active = item.page === currentPage ? "is-active" : "";
        return `<li><a class="${active}" href="${item.href}">${item.label}</a></li>`;
      })
      .join("");

    mount.innerHTML = `
      <header class="site-header">
        <div class="container header-row">
          <a class="site-title" href="index.html">${content.site?.name || "Noe Valley Town Council"}</a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span class="sr-only">Toggle navigation</span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav id="site-nav" class="site-nav" aria-label="Primary">
            <ul>${navLinks}</ul>
          </nav>
        </div>
      </header>
    `;

    const toggle = mount.querySelector(".nav-toggle");
    const nav = mount.querySelector(".site-nav");
    const navLinksElements = mount.querySelectorAll(".site-nav a");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("nav-open", !expanded);
    });

    navLinksElements.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  function insertFooter() {
    const mount = document.querySelector('[data-component="footer"]');
    if (!mount) return;

    mount.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <h2 class="footer-heading">Noe Valley Town Council</h2>
            <p class="footer-copy">${content.site?.tagline || "Unofficial neighborhood governance for official neighborhood feelings."}</p>
            <p class="fine-print">A parody civic project. Not affiliated with the City and County of San Francisco.</p>
          </div>
          <div>
            <h2 class="footer-heading">Contact</h2>
            <p><a href="mailto:${content.site?.email || "towncouncilnoevalley@gmail.com"}">${content.site?.email || "towncouncilnoevalley@gmail.com"}</a></p>
            <p>Public hearing line: ${content.site?.phone || "(415) 494-7160"}</p>
          </div>
          <div>
            <h2 class="footer-heading">Follow</h2>
            <p>Instagram (Coming Soon!)</p>
            <p>X / Twitter (Coming Soon!)</p>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>© <span id="footer-year"></span> Noe Valley Town Council.</p>
          <a href="contact.html">Submit a Concern</a>
        </div>
      </footer>
    `;

    const yearTarget = mount.querySelector("#footer-year");
    if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());
  }

  function renderFeaturedResolutions() {
    const target = document.querySelector("#home-resolutions");
    if (!target) return;

    const items = getResolutionsNewestFirst().slice(0, 3);
    target.innerHTML = items
      .map(
        (item, index) => `
        <article class="card reveal" style="animation-delay:${index * 90}ms">
          <p class="eyebrow">${item.code}</p>
          <h3><a href="resolutions.html#${item.id}">${item.title}</a></h3>
          <p class="meta"><time datetime="${item.date}">${formatDate(item.date)}</time> · ${item.status}</p>
          <p>${item.excerpt}</p>
          <a class="text-link" href="resolutions.html#${item.id}">Read full resolution</a>
        </article>
      `
      )
      .join("");
  }

  function renderHomePress() {
    const target = document.querySelector("#home-press");
    if (!target || !Array.isArray(content.press)) return;

    const items = content.press.slice(0, 3);
    if (!items.length) {
      target.innerHTML = `
        <article class="list-item reveal">
          <p class="eyebrow">Public Information Office</p>
          <h3>No releases published yet</h3>
          <p>News and press statements will appear here once the council begins formal publication.</p>
        </article>
      `;
      return;
    }

    target.innerHTML = items
      .map(
        (post, index) => `
        <article class="list-item reveal" style="animation-delay:${index * 90}ms">
          <p class="eyebrow">${post.tag} · <time datetime="${post.date}">${formatDate(post.date)}</time></p>
          <h3><a href="press.html#${post.id}">${post.title}</a></h3>
          <p>${post.excerpt}</p>
        </article>
      `
      )
      .join("");
  }

  function renderHomeEyesore() {
    const target = document.querySelector("#home-eyesore");
    if (!target || !Array.isArray(content.eyesores)) return;

    if (!content.eyesores.length) {
      target.innerHTML = `
        <article class="feature-panel reveal">
          <p class="eyebrow">Architectural Review Desk</p>
          <h3>No featured case yet</h3>
          <p>The first Architectural Eyesore of the Week will be posted after initial committee review.</p>
        </article>
      `;
      return;
    }

    const featured = content.eyesores[0];
    target.innerHTML = `
      <article class="feature-panel reveal">
        ${featured.image ? `<img class="eyesore-photo" src="${featured.image}" alt="${featured.imageAlt || featured.title}" />` : ""}
        <p class="eyebrow">${featured.week}</p>
        <h3>${featured.title}</h3>
        <p><strong>Location:</strong> ${featured.location}</p>
        <p>${featured.offense}</p>
        <a class="button button-secondary" href="eyesore.html#${featured.id}">Read Full Commentary</a>
      </article>
    `;
  }

  function statusClass(status) {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function renderResolutionsPage() {
    const target = document.querySelector("#resolutions-list");
    if (!target) return;

    target.innerHTML = getResolutionsNewestFirst()
      .map(
        (item, index) => `
        <article class="resolution-item reveal" id="${item.id}" style="animation-delay:${index * 70}ms">
          <div class="resolution-top">
            <p class="eyebrow">${item.code}</p>
            <p class="status ${statusClass(item.status)}">${item.status}</p>
          </div>
          <h2>${item.title}</h2>
          <p class="meta"><time datetime="${item.date}">${formatDate(item.date)}</time></p>
          <p>${item.excerpt}</p>
          <details>
            <summary>Read full text</summary>
            <div class="details-body">
              ${item.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
            </div>
          </details>
        </article>
      `
      )
      .join("");
  }

  function renderPressPage() {
    const target = document.querySelector("#press-list");
    if (!target || !Array.isArray(content.press)) return;

    if (!content.press.length) {
      target.innerHTML = `
        <article class="press-item reveal">
          <p class="eyebrow">Pending Publication</p>
          <h2>No Press Releases Yet</h2>
          <p class="meta">Archive status: empty</p>
          <p>The council has not published any News & Press releases yet.</p>
        </article>
      `;
      return;
    }

    target.innerHTML = content.press
      .map(
        (post, index) => `
        <article class="press-item reveal" id="${post.id}" style="animation-delay:${index * 70}ms">
          <p class="eyebrow">${post.tag}</p>
          <h2>${post.title}</h2>
          <p class="meta"><time datetime="${post.date}">${formatDate(post.date)}</time></p>
          <p>${post.excerpt}</p>
          <details>
            <summary>Read full bulletin</summary>
            <div class="details-body"><p>${post.body}</p></div>
          </details>
        </article>
      `
      )
      .join("");
  }

  function renderEyesorePage() {
    const featuredTarget = document.querySelector("#eyesore-featured");
    const archiveTarget = document.querySelector("#eyesore-archive");
    if (!Array.isArray(content.eyesores)) return;

    if (!content.eyesores.length) {
      if (featuredTarget) {
        featuredTarget.innerHTML = `
          <article class="eyesore-feature reveal">
            <p class="eyebrow">Archive Pending</p>
            <h2>No Featured Eyesore Yet</h2>
            <p class="meta">No cases on file</p>
            <p>Architectural Eyesore content has not been published yet.</p>
          </article>
        `;
      }
      if (archiveTarget) {
        archiveTarget.innerHTML = "";
      }
      return;
    }

    if (featuredTarget) {
      const featured = content.eyesores[0];
      featuredTarget.innerHTML = `
        <article class="eyesore-feature reveal" id="${featured.id}">
          ${featured.image ? `<img class="eyesore-photo" src="${featured.image}" alt="${featured.imageAlt || featured.title}" />` : ""}
          <p class="eyebrow">${featured.week}</p>
          <h2>${featured.title}</h2>
          <p class="meta">${featured.location}</p>
          <p><strong>Primary Finding:</strong> ${featured.offense}</p>
          ${featured.commentary.map((item) => `<p>${item}</p>`).join("")}
          ${featured.ruling ? `<p class="ruling"><strong>Council Ruling:</strong> ${featured.ruling}</p>` : ""}
        </article>
      `;
    }

    if (archiveTarget) {
      const archiveItems = content.eyesores.slice(1);
      archiveTarget.innerHTML = archiveItems
        .map(
          (entry, index) => `
          <article class="archive-item reveal" id="${entry.id}" style="animation-delay:${index * 80}ms">
            ${entry.image ? `<img class="eyesore-photo" src="${entry.image}" alt="${entry.imageAlt || entry.title}" />` : ""}
            <p class="eyebrow">${entry.week}</p>
            <h3>${entry.title}</h3>
            <p class="meta">${entry.location}</p>
            <p>${entry.offense}</p>
            <details>
              <summary>Open case notes</summary>
              <div class="details-body">
                ${entry.commentary.map((item) => `<p>${item}</p>`).join("")}
                ${entry.ruling ? `<p><strong>Ruling:</strong> ${entry.ruling}</p>` : ""}
              </div>
            </details>
          </article>
        `
        )
        .join("");
    }
  }

  function setupContactForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#contact-status");

    if (!form || !status) return;

    const nextField = form.querySelector("#form-next");
    if (nextField) {
      nextField.value = `${window.location.origin}${window.location.pathname}?submitted=1`;
    }

    const query = new URLSearchParams(window.location.search);
    if (query.get("submitted") === "1") {
      status.textContent =
        "Submission received and forwarded. Your concern has been routed to the appropriate committee.";
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  function init() {
    insertHeader();
    insertFooter();
    renderFeaturedResolutions();
    renderHomePress();
    renderHomeEyesore();
    renderResolutionsPage();
    renderPressPage();
    renderEyesorePage();
    setupContactForm();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
