(function () {
  const content = window.NVTC_CONTENT || {};
  const shopState = {
    productId: "",
    variantId: ""
  };

  const navItems = [
    { page: "home", href: "index.html", label: "Home" },
    { page: "resolutions", href: "resolutions.html", label: "Current Resolutions" },
    { page: "press", href: "press.html", label: "News & Press" },
    { page: "shop", href: "shop.html", label: "Shop" },
    { page: "eyesore", href: "eyesore.html", label: "Architectural Eyesore of the Week" },
    { page: "about", href: "about.html", label: "About Council" },
    { page: "contact", href: "contact.html", label: "Contact" }
  ];

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate + "T00:00:00");
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function formatCurrency(amount) {
    if (Number.isInteger(amount)) return `$${amount}`;
    return `$${Number(amount).toFixed(2)}`;
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
        const current = item.page === currentPage ? ' aria-current="page"' : "";
        return `<li><a class="${active}" href="${item.href}"${current}>${item.label}</a></li>`;
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

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
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

    const items = content.press
      .slice()
      .sort((a, b) => new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00"))
      .slice(0, 3);

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
          ${
            item.image
              ? `<img class="resolution-photo" src="${item.image}" alt="${item.imageAlt || item.title}" loading="lazy" decoding="async" fetchpriority="low" />`
              : ""
          }
          <p>${item.excerpt}</p>
          <details>
            <summary>Read full text</summary>
            <div class="details-body">
              ${safeArray(item.body).map((paragraph) => `<p>${paragraph}</p>`).join("")}
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

    const sortedPress = content.press
      .slice()
      .sort((a, b) => new Date(b.date + "T00:00:00") - new Date(a.date + "T00:00:00"));

    target.innerHTML = sortedPress
      .map(
        (post, index) => `
        <article class="press-item reveal" id="${post.id}" style="animation-delay:${index * 70}ms">
          <p class="eyebrow">${post.tag}</p>
          <h2>${post.title}</h2>
          <p class="meta"><time datetime="${post.date}">${formatDate(post.date)}</time></p>
          <p>${post.excerpt}</p>
          <details>
            <summary>Read full bulletin</summary>
            <div class="details-body">${
              Array.isArray(post.body)
                ? post.body.map((paragraph) => `<p>${paragraph}</p>`).join("")
                : `<p>${post.body}</p>`
            }</div>
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
          ${
            featured.image
              ? `<img class="eyesore-photo" src="${featured.image}" alt="${featured.imageAlt || featured.title}" loading="eager" decoding="async" fetchpriority="high" />`
              : ""
          }
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
            ${
              entry.image
                ? `<img class="eyesore-photo" src="${entry.image}" alt="${entry.imageAlt || entry.title}" loading="lazy" decoding="async" fetchpriority="low" />`
                : ""
            }
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

  function getShopData() {
    return content.shop || {};
  }

  function getShopProducts() {
    return safeArray(getShopData().products);
  }

  function getPosterVariants() {
    return safeArray(getShopData().posterVariants);
  }

  function getProductById(productId) {
    return getShopProducts().find((item) => item.id === productId) || null;
  }

  function getVariantsForProduct(product) {
    if (!product) return [];
    if (Array.isArray(product.variants) && product.variants.length) return product.variants;
    if (product.kind === "poster") return getPosterVariants();
    return [];
  }

  function getVariant(product, variantId) {
    const variants = getVariantsForProduct(product);
    if (!variants.length) return null;
    return variants.find((item) => item.id === variantId) || variants[0];
  }

  function getProductPriceLabel(product) {
    const variants = getVariantsForProduct(product);
    if (!variants.length) return "Price unavailable";
    const prices = variants.map((item) => Number(item.price));
    const low = Math.min(...prices);
    const high = Math.max(...prices);
    return low === high ? formatCurrency(low) : `From ${formatCurrency(low)}`;
  }

  function getKindLabel(product) {
    return product.kind === "kit" ? "Field Kit" : "Art Poster";
  }

  function populateOrderItemSelect() {
    const itemSelect = document.querySelector("#shop-order-item");
    if (!itemSelect) return;

    itemSelect.innerHTML = getShopProducts()
      .map((product) => `<option value="${product.id}">${product.title}</option>`)
      .join("");
  }

  function populateOrderVariantSelect(product, preferredVariantId) {
    const variantSelect = document.querySelector("#shop-order-variant");
    if (!variantSelect) return;

    const variants = getVariantsForProduct(product);
    variantSelect.innerHTML = variants
      .map((variant) => `<option value="${variant.id}">${variant.label} — ${formatCurrency(variant.price)}</option>`)
      .join("");

    if (!variants.length) return;

    const selectedVariant = getVariant(product, preferredVariantId);
    variantSelect.value = selectedVariant?.id || variants[0].id;
  }

  function syncOrderControls(product, variant) {
    const itemSelect = document.querySelector("#shop-order-item");
    const variantSelect = document.querySelector("#shop-order-variant");

    if (itemSelect && product) {
      itemSelect.value = product.id;
    }

    if (product) {
      populateOrderVariantSelect(product, variant?.id || "");
    }

    if (variantSelect && variant) {
      variantSelect.value = variant.id;
    }
  }

  function updateShopSummary() {
    const summaryTarget = document.querySelector("#shop-order-summary");
    const venmoTarget = document.querySelector("#shop-venmo-handle");
    const venmoNoteTarget = document.querySelector("#shop-venmo-note");
    const shippingTarget = document.querySelector("#shop-shipping-note");

    if (!summaryTarget || !venmoTarget || !venmoNoteTarget || !shippingTarget) return;

    const shop = getShopData();
    const product = getProductById(shopState.productId) || getShopProducts()[0];
    if (!product) return;

    const variant = getVariant(product, shopState.variantId);
    if (!variant) return;

    summaryTarget.innerHTML = `
      <p><strong>Selected item:</strong> ${product.title}</p>
      <p><strong>Variant:</strong> ${variant.label}</p>
      <p><strong>Price:</strong> ${formatCurrency(variant.price)}</p>
    `;

    venmoTarget.textContent = shop.venmoHandle || "@noevalleytowncouncil";
    venmoNoteTarget.textContent =
      "In your Venmo note, include item name, your email, and shipping name. Then complete the backup form below for fulfillment.";
    shippingTarget.textContent =
      `Shipping: ${formatCurrency(shop.shippingFlatRate || 6)} flat per order. Free shipping over ${formatCurrency(
        shop.freeShippingOver || 60
      )}. ${shop.shippingWindow || "Ships within 5–7 business days"}.`;
  }

  function setShopSelection(productId, variantId) {
    const fallbackProduct = getShopProducts()[0];
    const product = getProductById(productId) || fallbackProduct;
    if (!product) return;

    const variant = getVariant(product, variantId);
    if (!variant) return;

    shopState.productId = product.id;
    shopState.variantId = variant.id;

    syncOrderControls(product, variant);
    updateShopSummary();
  }

  function closeShopModal() {
    const modal = document.querySelector("#shop-modal");
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function openShopModal(productId) {
    const modal = document.querySelector("#shop-modal");
    const modalContent = document.querySelector("#shop-modal-content");
    if (!modal || !modalContent) return;

    const product = getProductById(productId);
    if (!product) return;

    const variants = getVariantsForProduct(product);
    const initialVariant = variants[0];
    const media = product.image
      ? `<img src="${product.image}" alt="${product.imageAlt || product.title}" loading="eager" decoding="async" />`
      : '<div class="shop-image-placeholder">Poster preview pending committee approval.</div>';

    modalContent.innerHTML = `
      <div class="shop-modal-layout">
        <div class="shop-modal-media">${media}</div>
        <div class="shop-modal-copy">
          <p class="eyebrow">${getKindLabel(product)}</p>
          <h2 id="shop-modal-title">${product.title}</h2>
          <p>${product.shortDescription}</p>
          <p class="shop-detail-note">${product.detail}</p>
          <label for="shop-modal-variant">Choose size or variant</label>
          <select id="shop-modal-variant" ${variants.length <= 1 ? "disabled" : ""}>
            ${variants
              .map((variant) => `<option value="${variant.id}">${variant.label} — ${formatCurrency(variant.price)}</option>`)
              .join("")}
          </select>
          <p class="shop-modal-price" id="shop-modal-price">Price: ${initialVariant ? formatCurrency(initialVariant.price) : "TBD"}</p>
          <button class="button button-primary" type="button" data-shop-modal-order="${product.id}">Order This Item</button>
        </div>
      </div>
    `;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector("[data-shop-close]");
    if (closeButton) closeButton.focus();

    const variantSelect = modalContent.querySelector("#shop-modal-variant");
    const priceTarget = modalContent.querySelector("#shop-modal-price");

    if (variantSelect && priceTarget) {
      variantSelect.addEventListener("change", () => {
        const selectedVariant = getVariant(product, variantSelect.value);
        priceTarget.textContent = `Price: ${selectedVariant ? formatCurrency(selectedVariant.price) : "TBD"}`;
      });
    }

    const orderButton = modalContent.querySelector("[data-shop-modal-order]");
    if (orderButton) {
      orderButton.addEventListener("click", () => {
        const variant = variantSelect ? getVariant(product, variantSelect.value) : getVariant(product, "");
        setShopSelection(product.id, variant?.id || "");
        closeShopModal();
        const orderPanel = document.querySelector("#shop-order-panel");
        if (orderPanel) {
          orderPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  function renderShopPage() {
    const target = document.querySelector("#shop-products");
    const products = getShopProducts();
    if (!target || !products.length) return;

    target.innerHTML = products
      .map(
        (product, index) => `
        <article class="shop-card reveal" style="animation-delay:${index * 50}ms">
          <div class="shop-media">
            ${
              product.image
                ? `<img src="${product.image}" alt="${product.imageAlt || product.title}" loading="lazy" decoding="async" fetchpriority="low" />`
                : '<div class="shop-image-placeholder">Poster preview pending committee approval.</div>'
            }
          </div>
          <div class="shop-card-copy">
            <p class="eyebrow">${getKindLabel(product)}</p>
            <h3>${product.title}</h3>
            <p class="shop-price">${getProductPriceLabel(product)}</p>
            <p>${product.shortDescription}</p>
            <div class="cta-row">
              <button class="button button-secondary" type="button" data-shop-details="${product.id}">View Details</button>
              <button class="button button-primary" type="button" data-shop-order="${product.id}">Order</button>
            </div>
          </div>
        </article>
      `
      )
      .join("");

    populateOrderItemSelect();

    const firstProduct = products[0];
    const firstVariant = getVariant(firstProduct, "");
    if (firstProduct && firstVariant) {
      setShopSelection(firstProduct.id, firstVariant.id);
    }

    target.addEventListener("click", (event) => {
      const detailsButton = event.target.closest("[data-shop-details]");
      if (detailsButton) {
        openShopModal(detailsButton.getAttribute("data-shop-details"));
        return;
      }

      const orderButton = event.target.closest("[data-shop-order]");
      if (orderButton) {
        const product = getProductById(orderButton.getAttribute("data-shop-order"));
        const variant = getVariant(product, "");
        if (!product || !variant) return;
        setShopSelection(product.id, variant.id);
        const orderPanel = document.querySelector("#shop-order-panel");
        if (orderPanel) {
          orderPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    const modal = document.querySelector("#shop-modal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        const closeTrigger = event.target.closest("[data-shop-close]");
        if (closeTrigger) closeShopModal();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) closeShopModal();
      });
    }

    const itemSelect = document.querySelector("#shop-order-item");
    const variantSelect = document.querySelector("#shop-order-variant");

    if (itemSelect) {
      itemSelect.addEventListener("change", () => {
        const product = getProductById(itemSelect.value);
        const variant = getVariant(product, "");
        if (!product || !variant) return;
        setShopSelection(product.id, variant.id);
      });
    }

    if (variantSelect) {
      variantSelect.addEventListener("change", () => {
        setShopSelection(shopState.productId, variantSelect.value);
      });
    }
  }

  function setupShopOrderForm() {
    const form = document.querySelector("#shop-order-form");
    const status = document.querySelector("#shop-order-status");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const address = String(formData.get("shipping_address") || "").trim();
      const productId = String(formData.get("item") || shopState.productId || "");
      const quantity = Math.max(1, Number(formData.get("quantity") || 1));
      const note = String(formData.get("note") || "").trim();

      if (!name || !email || !address || !productId) {
        status.textContent = "Please complete name, email, shipping address, and item before preparing your order.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
        return;
      }

      const product = getProductById(productId);
      const variant = getVariant(product, String(formData.get("variant") || shopState.variantId || ""));
      if (!product || !variant) {
        status.textContent = "Please select a valid product and variant.";
        status.classList.remove("is-success");
        status.classList.add("is-error");
        return;
      }

      setShopSelection(product.id, variant.id);

      const shop = getShopData();
      const shippingFlatRate = Number(shop.shippingFlatRate || 6);
      const freeShippingOver = Number(shop.freeShippingOver || 60);
      const subtotal = variant.price * quantity;
      const shipping = subtotal >= freeShippingOver ? 0 : shippingFlatRate;
      const total = subtotal + shipping;
      const orderEmail = shop.orderEmail || "towncouncilnoevalley@gmail.com";
      const subject = `NVTC Order Request: ${product.title}`;

      const bodyLines = [
        "Noe Valley Town Council Shop Order",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Shipping Address: ${address}`,
        `Item: ${product.title}`,
        `Variant: ${variant.label}`,
        `Quantity: ${quantity}`,
        `Unit Price: ${formatCurrency(variant.price)}`,
        `Subtotal: ${formatCurrency(subtotal)}`,
        `Shipping: ${shipping ? formatCurrency(shipping) : "Free"}`,
        `Estimated Total: ${formatCurrency(total)}`,
        `Venmo Handle: ${shop.venmoHandle || "@noevalleytowncouncil"}`,
        "",
        "Optional Note:",
        note || "(none)",
        "",
        "Please confirm fulfillment details and shipping timeline."
      ];

      const mailto = `mailto:${orderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        bodyLines.join("\n")
      )}`;

      window.location.href = mailto;

      status.textContent =
        "Order draft prepared. Your email app should open now. After Venmo payment, your order will be queued for fulfillment.";
      status.classList.remove("is-error");
      status.classList.add("is-success");
    });
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
    renderShopPage();
    setupShopOrderForm();
    setupContactForm();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
