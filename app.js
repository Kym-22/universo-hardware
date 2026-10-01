"use strict";
const main = document.querySelector("#main");
const state = {
  data: null,
  images: [],
  search: "",
  category: "todos",
  sort: "order",
  page: 1,
};
const escapeHTML = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
const e = escapeHTML;
const imageFor = (key) => state.images.find((x) => x.key === key && x.path);
const categoryFor = (id) => state.data.categories.find((c) => c.id === id);
const safeURL = (v) => {
  try {
    const u = new URL(v, location.href);
    return ["http:", "https:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
};
const photo = (key, alt, extra = "") => {
  const img = imageFor(key);
  return img
    ? /* HTML */ `<img
        src="${e(img.path)}"
        alt="${e(alt)}"
        loading="lazy"
        ${extra}
      />`
    : /* HTML */ `<div class="missing-art">
        <span class="symbol" aria-hidden="true">${key ? "▤" : "+"}</span>
      </div>`;
};
const countFor = (id) =>
  state.data.comparisons.filter((c) => c.category === id).length;
const ready = (c) =>
  c.products.every((p) => p.model && p.image) &&
  Boolean(c.recommendation.reason);
const badge = (c) =>
  c.status === "researched" ? "Ver comparativa" : "Investigación pendiente";
const circuit = /* HTML */ `<div class="eyebrow">
  Explora · Descubre · Compara
</div>`;

function categoryCard(c, i) {
  return /* HTML */ `<a
    class="category-card ${c.id === "especial" ? "special-card" : ""}"
    href="#categoria/${c.id}"
  >
    <div class="category-photo">
      <span class="photo-num">${String(i + 1).padStart(2, "0")}</span
      >${photo(c.imageKey, c.title)}
    </div>
    <div class="category-body">
      <h3>${e(c.title)}</h3>
      <p>${e(c.description)}</p>
      <span class="text-link">Ver comparaciones</span>
      <span class="count">${countFor(c.id)} fichas</span>
    </div>
  </a>`;
}

function card(c) {
  return /* HTML */ `<a
    class="album-card"
    href="#comparacion/${c.id}"
    aria-label="Ver comparación: ${e(c.title)}"
  >
    <div class="card-meta">
      <span class="index">${e(c.id)}</span
      ><span class="tag">${e(c.family)}</span>
    </div>
    <h3>${e(c.title)}</h3>
    <div class="card-matchup">
      ${c.products
        .map(
          (p, i) =>
            /* HTML */ `<div class="card-contender side-${i}">
              <span class="contender-brand"
                ><span class="identity">${i ? "B" : "A"}</span
                >${e(p.brand)}</span
              >
              <div class="card-art">${productPhoto(p, false)}</div>
              <p class="card-model">${e(p.model)}</p>
            </div>`,
        )
        .join("")}
    </div>
    <div class="card-bottom">
      <strong>Comparar productos</strong
      ><span class="tag">${e(categoryFor(c.category).title)}</span>
    </div>
  </a>`;
}

function priceDisplay(p) {
  const parts = (p.priceText || "N/D").split(";");
  return /* HTML */ `<strong>${e(parts[0])}</strong
    >${parts.length > 1 ? /* HTML */ `<span>${e(parts.slice(1).join(";").trim())}</span>` : ""}`;
}

function home() {
  const featured = state.data.comparisons.find((c) => c.id === "A07");
  return /* HTML */ `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <h1>Componentes y equipos<br />de hardware.</h1>
          <p>
            Compara marcas, características y precios de componentes y equipos
            tecnológicos.
          </p>
          <a class="button" href="#categorias">Ver categorías</a>
          <div class="hero-foot">
            <span>
              <strong>124 comparaciones</strong>Organizadas por componente</span
            >
            <span>
              <strong>248 productos</strong>Dos alternativas por ficha</span
            >
            <span>
              <strong>Recomendaciones</strong>Una elección para cada uso</span
            >
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-orbit"></div>
          ${photo("hero", "Tarjeta madre, memoria RAM, procesador y refrigeración", 'fetchpriority="high"')}
          <span class="hero-label one">Tarjeta madre</span>
          <span class="hero-label two">Procesador (CPU)</span>
          <span class="hero-label three">Memoria RAM</span>
          <span class="hero-label four">Disipador y ventilador</span>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">01 / Categorías</div>
            <h2>Explora por categoría.</h2>
          </div>
          <a class="text-link" href="#categorias">Ver categorías</a>
        </div>
        <div class="category-grid">
          ${state.data.categories.slice(0, 4).map(categoryCard).join("")}
        </div>
      </div>
    </section>
    <section class="section home-comparison">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">02 / Comparar</div>
            <h2>RAM DDR4 de escritorio.</h2>
            <p>Dos kits de 32 GB: Corsair y Kingston.</p>
          </div>
          <a class="text-link" href="#comparacion/A07">Ver ficha completa</a>
        </div>
        <div class="home-featured">
          ${featured.products
            .map(
              (p) => /* HTML */ `
                <article class="home-product">
                  <h3>${e(p.brand)}</h3>
                  ${productPhoto(p)}
                  <p>${e(p.model)}</p>
                  <div class="mini-table">
                    <div>Precio de referencia<span>${price(p)}</span></div>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="recommendation">
          <div class="recommendation-art">
            ${productPhoto(featured.products[featured.recommendation.productIndex ?? 0])}
          </div>
          <div>
            <h2>Producto recomendado</h2>
            <p>${e(featured.recommendation.reason)}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function componentURL(category, family, id) {
  return `#componente/${category}/${encodeURIComponent(family)}${id ? "?id=" + id : ""}`;
}

function categoryComponents(id) {
  const category = categoryFor(id);
  if (!category) return categories();
  const families = [
    ...new Set(
      state.data.comparisons
        .filter((c) => c.category === id)
        .map((c) => c.family),
    ),
  ];
  return /* HTML */ `<section class="page-head">
      <div class="container">
        <div class="return-actions">
          <a class="button secondary" href="#categorias">Volver a categorías</a>
        </div>
        <h1>${e(category.title)}</h1>
      </div>
    </section>
    <section class="section">
      <div class="container component-grid">
        ${families
          .map((f) => {
            const rows = state.data.comparisons.filter(
              (c) => c.category === id && c.family === f,
            );
            const product = rows[0].products[0];
            return /* HTML */ `<a
              class="component-card"
              href="${componentURL(id, f)}"
              ><div class="component-art">${productPhoto(product, false)}</div>
              <h2>${e(f)}</h2>
              <span class="text-link">Ver comparaciones</span></a
            >`;
          })
          .join("")}
      </div>
    </section>`;
}

function componentComparisons(category, family, selected) {
  const rows = state.data.comparisons.filter(
    (c) => c.category === category && c.family === family,
  );
  if (!rows.length) return categoryComponents(category);
  const current = rows.find((c) => c.id === selected) || rows[0];
  const tabs = /* HTML */ `<div class="container comparison-selector">
    <span>${e(family)}</span>
    <nav aria-label="Comparaciones de ${e(family)}">
      ${rows.map((c) => /* HTML */ `<a class="comparison-tab ${c.id === current.id ? "active" : ""}" href="${componentURL(category, family, c.id)}" ${c.id === current.id ? 'aria-current="page"' : ""}>${e(c.title)}</a>`).join("")}
    </nav>
  </div>`;
  let html = detail(current.id);
  const position = rows.indexOf(current);
  const start = html.indexOf('<nav class="detail-nav"');
  const end = html.indexOf("</nav>", start) + 6;
  html =
    html.slice(0, start) +
    /* HTML */ `<nav
      class="detail-nav"
      aria-label="Navegar entre comparaciones"
    >
      ${position > 0 ? /* HTML */ `<a class="button secondary" href="${componentURL(category, family, rows[position - 1].id)}">Anterior</a>` : "<span></span>"}<a
        class="text-link"
        href="#categoria/${category}"
        >Volver a componentes</a
      >${position < rows.length - 1 ? /* HTML */ `<a class="button" href="${componentURL(category, family, rows[position + 1].id)}">Siguiente</a>` : "<span></span>"}
    </nav>` +
    html.slice(end);
  return tabs + html;
}

function categories() {
  return /* HTML */ `<section class="page-head comparison-head">
      <div class="container">
        <div class="return-actions">
          <a class="button secondary" href="#inicio">Volver al inicio</a>
        </div>
        <h1>Categorías</h1>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="category-grid">
          ${state.data.categories.map(categoryCard).join("")}
        </div>
      </div>
    </section>`;
}

function album() {
  const c = categoryFor(state.category);
  return /* HTML */ `<section class="page-head comparison-head">
      <div class="container">
        <div class="return-actions">
          <a class="button secondary" href="#categorias">Volver a categorías</a
          ><a class="text-link" href="#inicio">Volver al inicio</a>
        </div>
        <div class="subrow">
          <div>
            <div class="eyebrow">03 / Explorar</div>
            <h1>${c ? e(c.title) : "El álbum."}</h1>
            <p>
              Encuentra un componente y abre su ficha para comparar dos marcas.
            </p>
          </div>
          <span class="small-note">Precios en USD · Consulta: 30/09/2026</span>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="toolbar">
          <div class="search-row">
            <div class="search-box">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10" cy="10" r="7" />
                <path d="m15 15 6 6" />
              </svg>
              <input
                id="search"
                type="search"
                placeholder="Buscar componente o marca…"
                aria-label="Buscar componente o marca"
                value="${e(state.search)}"
              />
            </div>
            <label class="sr-only" for="sort" hidden>Orden de las fichas</label>
            <select class="sort" id="sort" aria-label="Ordenar fichas">
              <option value="order" ${state.sort === "order" ? "selected" : ""}>
                Orden del álbum
              </option>
              <option value="az" ${state.sort === "az" ? "selected" : ""}>
                Nombre: A–Z
              </option>
              <option value="za" ${state.sort === "za" ? "selected" : ""}>
                Nombre: Z–A
              </option>
            </select>
          </div>
          <div class="filter-row" aria-label="Filtrar por categoría">
            <button
              class="pill ${state.category === "todos" ? "active" : ""}"
              data-filter="todos"
              aria-pressed="${state.category === "todos"}"
            >
              Todos</button
            >${state.data.categories.map((c) => /* HTML */ `<button class="pill ${state.category === c.id ? "active" : ""}" data-filter="${c.id}" aria-pressed="${state.category === c.id}">${e(c.title)}</button>`).join("")}
          </div>
        </div>
        <div id="results" aria-live="polite"></div>
      </div>
    </section>`;
}
const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function results() {
  const term = normalize(state.search.trim());
  let rows = state.data.comparisons.filter(
    (c) =>
      (state.category === "todos" || c.category === state.category) &&
      normalize(
        [
          c.title,
          c.description,
          ...c.products.map((p) => p.brand + " " + p.model),
        ].join(" "),
      ).includes(term),
  );
  if (state.sort !== "order")
    rows.sort(
      (a, b) =>
        a.title.localeCompare(b.title, "es") * (state.sort === "az" ? 1 : -1),
    );
  const perPage = 12,
    pages = Math.max(1, Math.ceil(rows.length / perPage));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * perPage;
  document.querySelector("#results").innerHTML = /* HTML */ `<div
      class="results-line"
    >
      <span
        >${rows.length}
        ${rows.length === 1 ? "ficha encontrada" : "fichas encontradas"}</span
      >
      <span
        >${rows.length ? `${start + 1}–${Math.min(start + perPage, rows.length)} de ${rows.length}` : ""}</span
      >
    </div>
    ${
      rows.length
        ? /* HTML */ `<div class="album-grid">
              ${rows
                .slice(start, start + perPage)
                .map(card)
                .join("")}
            </div>
            ${
              pages > 1
                ? /* HTML */ `<nav
                    class="pagination"
                    aria-label="Páginas del álbum"
                  >
                    <button
                      class="page-button wide"
                      data-page="${state.page - 1}"
                      ${state.page === 1 ? "disabled" : ""}
                    >
                      Anterior</button
                    >${Array.from({ length: pages }, (_, i) => /* HTML */ `<button class="page-button ${state.page === i + 1 ? "active" : ""}" data-page="${i + 1}" ${state.page === i + 1 ? 'aria-current="page"' : ""}>${i + 1}</button>`).join("")}<button
                      class="page-button wide"
                      data-page="${state.page + 1}"
                      ${state.page === pages ? "disabled" : ""}
                    >
                      Siguiente
                    </button>
                  </nav>`
                : ""
            } `
        : /* HTML */ `<div class="empty">
            <h3>No encontramos ese componente.</h3>
            <p>Prueba con otra marca o cambia la categoría.</p>
            <button class="button" data-reset>Restablecer búsqueda</button>
          </div>`
    }`;
}

function price(p) {
  return e(p.priceText || "N/D: sin precio individual registrado");
}

function productPhoto(p, referenceLink = true) {
  const src = p.image.startsWith("assets/products/")
    ? p.image
    : safeURL(p.image);
  return src
    ? /* HTML */ `<img
          src="${e(src)}"
          alt="${e(p.model)}"
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        />
        <div class="image-fallback" hidden>
          La imagen no está disponible.<br />
          ${
            referenceLink
              ? /* HTML */ `<a
                  href="${e(p.imageOriginal || src)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Abrir imagen de referencia</a
                >`
              : /* HTML */ `<span
                  >Consulta las fuentes de la comparación.</span
                >`
          }
        </div>`
    : "<p>Imagen no disponible.</p>";
}

function product(p, c, i) {
  return /* HTML */ `<article class="product">
    <div class="product-heading">
      <h2>${e(p.brand)}</h2>
      <span class="letter">${i ? "B" : "A"}</span>
    </div>
    <div class="product-image">${productPhoto(p)}</div>
    <div class="product-name">
      <h3>${e(p.model)}</h3>
    </div>
    <table>
      <caption hidden>
        Características de ${e(p.model)}
      </caption>
      <tbody>
        ${c.features
          .map(
            (f) =>
              /* HTML */ `<tr>
                <th scope="row">${e(f)}</th>
                <td>${e(p.specs[f] ?? "No indicado en la investigación")}</td>
              </tr>`,
          )
          .join("")}
        <tr>
          <th scope="row">Precio de referencia</th>
          <td class="price-value">${price(p)}</td>
        </tr>
      </tbody>
    </table>
    <div class="product-source">
      <strong>Fuentes del producto</strong>
      <ul>
        ${p.sources
          .filter((x) => safeURL(x.url))
          .map(
            (x) =>
              /* HTML */ `<li>
                <a
                  href="${e(safeURL(x.url))}"
                  target="_blank"
                  rel="noopener noreferrer"
                  >${e(x.type)} · ${e(x.title)}</a
                >
              </li>`,
          )
          .join("")}
      </ul>
      Fecha de consulta: 30/09/2026
    </div>
  </article>`;
}

function detail(id) {
  const c = state.data.comparisons.find((x) => x.id === id);
  if (!c)
    return /* HTML */ `<div class="container error">
      <h1>Ficha no encontrada</h1>
      <a class="button" href="#album">Volver al álbum</a>
    </div>`;
  const position = state.data.comparisons.indexOf(c);
  const previous = state.data.comparisons[position - 1];
  const next = state.data.comparisons[position + 1];
  const category = categoryFor(c.category);
  const rec = c.recommendation;
  const chosen = c.products[rec.productIndex];
  const sources = [
    ...new Map((c.allSources || []).map((x) => [x.url, x])).values(),
  ];
  return /* HTML */ `
    <section class="page-head comparison-head">
      <div class="container">
        <div class="return-actions">
          <a class="button secondary" href="#categoria/${c.category}"
            >Volver a componentes</a
          >
          <a class="text-link" href="#categorias">Categorías</a>
        </div>
        <div class="eyebrow">${e(c.id)} / ${e(c.family)}</div>
        <h1>${e(c.title)}</h1>
        <div class="detail-meta">
          <span>${e(category.title)}</span><span>${e(c.classification)}</span>
        </div>
      </div>
    </section>
    <div class="container detail-main">
      <div class="product-pair">
        ${c.products
          .map(
            (p, i) => /* HTML */ `
              <article class="product side-${i}">
                <div class="product-heading">
                  <span class="identity">${i ? "B" : "A"}</span>
                  <span class="product-brand">${e(p.brand)}</span>
                </div>
                <h2 class="product-model">${e(p.model)}</h2>
                <div class="product-image">${productPhoto(p)}</div>
                ${c.products.some((product) => product.imageNote) ? /* HTML */ `<p class="photo-note">${e(p.imageNote || " ")}</p>` : ""}
                <table class="product-specs">
                  <caption class="sr-only">
                    Características de ${e(p.model)}
                  </caption>
                  <tbody>
                    ${c.features
                      .filter((f) => !/precio/i.test(f))
                      .map(
                        (f) =>
                          /* HTML */ `<tr>
                            <th scope="row">${e(f)}</th>
                            <td>${e(p.specs[f] ?? "No indicado")}</td>
                          </tr>`,
                      )
                      .join("")}
                    <tr class="product-price-row">
                      <th scope="row">Precio · USD</th>
                      <td>${priceDisplay(p)}</td>
                    </tr>
                  </tbody>
                </table>
              </article>
            `,
          )
          .join("")}
      </div>
      <section class="analysis-panel">
        <h2>Comparación</h2>
        <p>${e(c.comparison)}</p>
      </section>
      <section class="recommendation" aria-label="Recomendación de producto">
        <div class="recommendation-art">
          ${chosen ? productPhoto(chosen) : "<span>★</span>"}
        </div>
        <div>
          <div class="eyebrow">Producto recomendado</div>
          <h2>${chosen ? e(chosen.model) : "La elección para este uso"}</h2>
          <p>${e(rec.reason)}</p>
        </div>
      </section>
      <section class="analysis-panel">
        <h2>Compatibilidad y detalles</h2>
        <p>${e(c.compatibility)}</p>
      </section>
      <details class="source-details">
        <summary>Fuentes de esta comparación (${sources.length})</summary>
        <ul>
          ${sources
            .filter((x) => safeURL(x.url))
            .map(
              (x) =>
                /* HTML */ `<li>
                  <span>${e(x.type)}</span
                  ><a
                    href="${e(safeURL(x.url))}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${e(x.title)}</a
                  >
                </li>`,
            )
            .join("")}
        </ul>
      </details>
      <nav class="detail-nav" aria-label="Navegar entre comparaciones">
        ${previous ? /* HTML */ `<a class="button secondary" href="#comparacion/${previous.id}">Anterior</a>` : "<span></span>"}
        <a class="text-link" href="#album">Volver al álbum</a>
        ${next ? /* HTML */ `<a class="button" href="#comparacion/${next.id}">Siguiente</a>` : "<span></span>"}
      </nav>
    </div>
  `;
}

function sources() {
  return /* HTML */ `<section class="page-head">
      <div class="container">
        <div class="eyebrow">Sobre el proyecto</div>
        <h1>Fuentes y créditos.</h1>
        <p>Álbum de componentes de tecnología · Arquitectura de Computadoras</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <section class="reference-directory">
          <h2>Fuentes consultadas</h2>
          ${state.data.categories
            .map((category) => {
              const comparisons = state.data.comparisons.filter(
                (comparison) => comparison.category === category.id,
              );
              return /* HTML */ `<details class="source-details" open>
                <summary>${e(category.title)}</summary>
                <div class="reference-comparisons">
                  ${comparisons
                    .map((comparison) => {
                      const references = [
                        ...new Map(
                          (comparison.allSources || [])
                            .filter((reference) => safeURL(reference.url))
                            .map((reference) => [reference.url, reference]),
                        ).values(),
                      ];
                      return /* HTML */ `<article class="reference-comparison">
                        <h3>
                          <a href="#comparacion/${e(comparison.id)}"
                            >${e(comparison.title)}</a
                          >
                        </h3>
                        <ul>
                          ${references
                            .map(
                              (reference) =>
                                /* HTML */ `<li>
                                  <span>${e(reference.type)}</span>
                                  <a
                                    href="${e(safeURL(reference.url))}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >${e(reference.title)}</a
                                  >
                                </li>`,
                            )
                            .join("")}
                        </ul>
                      </article>`;
                    })
                    .join("")}
                </div>
              </details>`;
            })
            .join("")}
        </section>
        <div class="source-layout credits-layout">
          <section class="source-panel aqua">
            <h2>Nuestro equipo</h2>
            <div class="credit-person">
              <span class="avatar">01</span>
              <h3>Kimberly Vásquez</h3>
            </div>
            <div class="credit-person">
              <span class="avatar">02</span>
              <h3>Alexander Canon</h3>
            </div>
          </section>
        </div>
      </div>
    </section>`;
}

function glossary() {
  return /* HTML */ `<section class="page-head">
      <div class="container">
        <div class="return-actions">
          <a class="button secondary" href="#inicio">Volver al inicio</a>
        </div>
        <div class="eyebrow">Para entender el hardware</div>
        <h1>Glosario</h1>
      </div>
    </section>
    <section class="section">
      <div class="container glossary-grid">
        ${state.data.glossary
          .map(
            (g) =>
              /* HTML */ `<article>
                <h2>${e(g.term)}</h2>
                <p>${e(g.meaning)}</p>
              </article>`,
          )
          .join("")}
      </div>
    </section>`;
}

function route() {
  if (!state.data) return;
  const hash = location.hash.slice(1) || "inicio";
  const [path, query = ""] = hash.split("?");
  const page = path.split("/")[0];
  if (page === "album") {
    const cat = new URLSearchParams(query).get("categoria") || "todos";
    if (cat) {
      state.category = categoryFor(cat) ? cat : "todos";
      state.page = 1;
    }
  }
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active =
      a.dataset.nav ===
      (["comparacion", "componente", "categoria"].includes(page)
        ? "categorias"
        : page);
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.querySelector("header nav").classList.remove("open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  main.innerHTML =
    page === "categoria"
      ? categoryComponents(path.split("/")[1])
      : page === "componente"
        ? componentComparisons(
            path.split("/")[1],
            decodeURIComponent(path.split("/")[2] || ""),
            new URLSearchParams(query).get("id"),
          )
        : page === "categorias"
          ? categories()
          : page === "album"
            ? album()
            : page === "comparacion"
              ? detail(path.split("/")[1])
              : page === "glosario"
                ? glossary()
                : page === "fuentes"
                  ? sources()
                  : home();
  main.className = "fade";
  if (page === "album") {
    results();
    document.querySelector("#search").addEventListener("input", (ev) => {
      state.search = ev.target.value;
      state.page = 1;
      results();
    });
    document.querySelector("#sort").addEventListener("change", (ev) => {
      state.sort = ev.target.value;
      state.page = 1;
      results();
    });
  }
  document.title = `${page === "comparacion" ? state.data.comparisons.find((c) => c.id === path.split("/")[1])?.title || "Comparación" : { inicio: "Componentes y equipos de hardware", album: "El álbum", categorias: "Categorías", fuentes: "Fuentes y créditos", glosario: "Glosario" }[page] || "Inicio"} · Universo Hardware`;
  window.scrollTo(0, 0);
  if (window.requestAnimationFrame)
    window.requestAnimationFrame(alignProductRows);
}
main.addEventListener("click", (ev) => {
  const filter = ev.target.closest("[data-filter]");
  if (filter) {
    state.category = filter.dataset.filter;
    state.page = 1;
    history.replaceState(
      null,
      "",
      state.category === "todos"
        ? "#album"
        : "#album?categoria=" + state.category,
    );
    document.querySelector(".page-head h1").textContent =
      categoryFor(state.category)?.title || "El álbum.";
    document.querySelectorAll("[data-filter]").forEach((b) => {
      const active = b.dataset.filter === state.category;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active);
    });
    results();
  }
  const page = ev.target.closest("[data-page]");
  if (page && !page.disabled) {
    state.page = Number(page.dataset.page);
    results();
    document.querySelector(".toolbar").scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }
  if (ev.target.closest("[data-reset]")) {
    state.search = "";
    state.category = "todos";
    state.page = 1;
    history.replaceState(null, "", "#album");
    route();
  }
});
document.querySelector(".menu-toggle").addEventListener("click", () => {
  const nav = document.querySelector("header nav");
  const open = nav.classList.toggle("open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", open);
});
window.addEventListener("hashchange", route);
main.innerHTML = /* HTML */ `<div class="load">
  <p>Cargando el álbum…</p>
</div>`;
Promise.all([
  fetch("data.json").then((r) => {
    if (!r.ok) throw new Error("data");
    return r.json();
  }),
  fetch("assets/image-sources.json").then((r) => {
    if (!r.ok) throw new Error("images");
    return r.json();
  }),
])
  .then(([data, images]) => {
    state.data = data;
    state.images = images;
    document.querySelector("#nav-count").textContent =
      `${data.comparisons.length} fichas`;
    route();
  })
  .catch(() => {
    main.innerHTML = /* HTML */ `<div class="error">
      <h1>No pudimos cargar el álbum.</h1>
      <p>Actualiza la página para volver a intentarlo.</p>
      <button class="button" onclick="location.reload()">Reintentar</button>
    </div>`;
  });

function alignProductRows() {
  const tables = document.querySelectorAll(".product-specs");
  if (tables.length !== 2) return;
  const left = tables[0].querySelectorAll("tr");
  const right = tables[1].querySelectorAll("tr");
  [...left, ...right].forEach((row) => (row.style.height = ""));
  const models = document.querySelectorAll(".product-pair .product-model");
  models.forEach((model) => (model.style.height = ""));
  if (window.innerWidth <= 600) return;
  if (models.length === 2) {
    const modelHeight = Math.max(
      ...[...models].map((model) => model.getBoundingClientRect().height),
    );
    models.forEach((model) => (model.style.height = modelHeight + "px"));
  }
  left.forEach((row, index) => {
    if (!right[index]) return;
    const height = Math.max(
      row.getBoundingClientRect().height,
      right[index].getBoundingClientRect().height,
    );
    row.style.height = right[index].style.height = height + "px";
  });
}
window.addEventListener("resize", alignProductRows);
