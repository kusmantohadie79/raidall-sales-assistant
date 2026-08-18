(() => {

const API_URL =
‘https://script.google.com/macros/s/AKfycbyjekI9Vt7x4aqiyIekVPnvGMgRn9bJKJmifey0h0bBps-F3FqTAnKJfCqXOnD-Ak-cFw/exec’;

const loading = document.getElementById(‘loading’);

const homePage = document.getElementById(‘homePage’);

const divisionPage = document.getElementById(‘divisionPage’);

const livestockPage = document.getElementById(‘livestockPage’);

const divisionContent = document.getElementById(‘divisionContent’);

let currentProductImageFile = null;

/* ===================================================== LOADING
===================================================== */

function hideLoading() {

    if (!loading) return;

    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
    }, 300);

}

/* ===================================================== SHOW HOME
===================================================== */

function showHome() {

    if (homePage) {
      homePage.classList.add('active');
    }

    if (divisionPage) {
      divisionPage.classList.remove('active');
    }

    if (livestockPage) {
      livestockPage.classList.remove('active');
    }

}

/* ===================================================== API REQUEST
===================================================== */

async function fetchProducts(division) {

    const url =
      API_URL +
      '?api=1&action=products&division=' +
      encodeURIComponent(division);

    console.log(
      '[RAIDALL] Fetch Products:',
      division
    );

    const response =
      await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

    if (!response.ok) {
      throw new Error(
        'API HTTP Error: ' + response.status
      );
    }

    const result =
      await response.json();

    console.log(
      '[RAIDALL] API Result:',
      result
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'API gagal mengambil data.'
      );
    }

    return result.data || [];

}

/* ===================================================== OPEN DIVISION
===================================================== */

window.openDivision = async function (division) {

      console.log(
        '[RAIDALL] Open Division:',
        division
      );

      const divisionMap = {

        livestock: {
          code: 'LIVESTOCK',
          title: 'LIVESTOCK',
          description:
            'Produk kesehatan dan nutrisi hewan ternak',
          theme: 'livestock',
          icon: '🐔'
        },

        petcare: {
          code: 'PETCARE',
          title: 'PET CARE',
          description:
            'Produk kesehatan dan perawatan hewan kesayangan',
          theme: 'petcare',
          icon: '🐾'
        },

        aquaculture: {
          code: 'AQUACULTURE',
          title: 'AQUA CULTURE',
          description:
            'Produk kesehatan dan perawatan ikan',
          theme: 'aquaculture',
          icon: '🐟'
        }

      };

      const config =
        divisionMap[division];

      if (!config) {

        console.error(
          '[RAIDALL] Unknown division:',
          division
        );

        return;

      }

      if (homePage) {
        homePage.classList.remove('active');
      }

      if (livestockPage) {
        livestockPage.classList.remove('active');
      }

      if (divisionPage) {
        divisionPage.classList.add('active');
      }

      divisionContent.innerHTML = `

        <header class="division-header ${config.theme}">

          <button
            class="home-button"
            onclick="goHome()">

            ← Home

          </button>

          <div class="division-header-title">

            <div class="division-header-icon">
              ${config.icon}
            </div>

            <div>

              <h1>
                ${config.title}
              </h1>

              <p>
                ${config.description}
              </p>

            </div>

          </div>

        </header>

        <div class="product-loading">

          <div class="spinner"></div>

          <div>
            Memuat produk ${config.title}...
          </div>

        </div>

      `;

      history.pushState(
        {
          page: 'division',
          division: division
        },
        '',
        '#' + division
      );

      try {

        const products =
          await fetchProducts(
            config.code
          );

        console.log(
          '[RAIDALL] Products loaded:',
          products.length
        );

        renderDivisionProducts(
          config,
          products
        );

      } catch (error) {

        console.error(
          '[RAIDALL] Product API Error:',
          error
        );

        divisionContent.innerHTML = `

          <header class="division-header ${config.theme}">

            <button
              class="home-button"
              onclick="goHome()">

              ← Home

            </button>

            <div class="division-header-title">

              <div class="division-header-icon">
                ${config.icon}
              </div>

              <div>

                <h1>
                  ${config.title}
                </h1>

                <p>
                  ${config.description}
                </p>

              </div>

            </div>

          </header>

          <div class="api-error-card">

            <div class="api-error-icon">
              ⚠️
            </div>

            <h2>
              Data produk belum dapat dimuat
            </h2>

            <p>
              Terjadi masalah saat menghubungkan
              Sales Assistant dengan database.
            </p>

            <button
              class="retry-button"
              onclick="openDivision('${escapeHTML(division)}')">

              Coba Lagi

            </button>

          </div>

        `;

      }

    };

/* ===================================================== RENDER PRODUCTS
===================================================== */

function renderDivisionProducts( config, products ) {

    const grouped = {};

    products.forEach(product => {

      const code =
        String(
          product.ProductCode || ''
        ).trim();

      const name =
        String(
          product.ProductName || ''
        ).trim();

      const key =
        code + '|' + name;

      if (!grouped[key]) {

        grouped[key] = {

          ProductCode: code,

          ProductName: name,

          Category:
            product.Category || '',

          Species:
            product.Species || '',

          variants: []

        };

      }

      grouped[key].variants.push(
        product
      );

    });

    const productFamilies =
      Object.values(grouped);

    let html = `

      <header class="division-header ${config.theme}">

        <button
          class="home-button"
          onclick="goHome()">

          ← Home

        </button>

        <div class="division-header-title">

          <div class="division-header-icon">
            ${config.icon}
          </div>

          <div>

            <h1>
              ${config.title}
            </h1>

            <p>
              ${config.description}
            </p>

          </div>

        </div>

      </header>

      <section class="product-section">

        <div class="product-toolbar">

          <input
            type="search"
            id="productSearch"
            class="product-search"
            placeholder="Cari produk..."
            autocomplete="off">

          <div class="product-count">

            Total Product :
            <strong id="productCount">
              ${products.length}
            </strong>

          </div>

        </div>

        <div
          id="productList"
          class="product-list">

    `;

    productFamilies.forEach(
      (family, index) => {

        html +=
          renderProductCard(
            family,
            config,
            index
          );

      }
    );

    html += `

        </div>

      </section>

    `;

    divisionContent.innerHTML =
      html;

    const searchInput =
      document.getElementById(
        'productSearch'
      );

    if (searchInput) {

      searchInput.addEventListener(
        'input',
        function () {

          filterProducts(
            this.value
          );

        }
      );

    }

}

/* ===================================================== PRODUCT CARD
===================================================== */

function renderProductCard( family, config, index ) {

    const variants =
      family.variants || [];

    const first =
      variants[0] || {};

    const variantCount =
      variants.length;

    const image =
      first.Image || '';

    let imageHTML = '';

    if (image) {

      imageHTML = `

        <div class="product-image">

          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(
              family.ProductName
            )}"
            loading="lazy">

        </div>

      `;

    }

    let variantHTML = '';

    if (variantCount > 1) {

      variantHTML = `

        <div class="product-variant-count">

          ${variantCount} Variant

        </div>

      `;

    } else {

      variantHTML = `

        <div class="product-variant">

          ${escapeHTML(
            String(
              first.Variant || '-'
            )
          )}

        </div>

      `;

    }

    return `

      <article
        class="product-card ${config.theme}"
        data-product-index="${index}">

        ${imageHTML}

        <div class="product-card-content">

          <div class="product-category">

            ${escapeHTML(
              String(
                family.Category || ''
              )
            )}

          </div>

          <h2 class="product-name">

            ${escapeHTML(
              family.ProductName
            )}

          </h2>

          <div class="product-species">

            ${escapeHTML(
              String(
                family.Species || ''
              )
            )}

          </div>

          ${variantHTML}

          <button
            class="product-detail-button"
            onclick="showProductDetail('${escapeHTML(
              family.ProductCode
            )}')">

            Detail Produk →

          </button>

        </div>

      </article>

    `;

}

/* ===================================================== SEARCH FILTER
===================================================== */

function filterProducts(keyword) {

    const search =
      String(
        keyword || ''
      )
      .trim()
      .toLowerCase();

    const cards =
      document.querySelectorAll(
        '.product-card'
      );

    let visible =
      0;

    cards.forEach(card => {

      const text =
        card.innerText.toLowerCase();

      const match =
        !search ||
        text.includes(search);

      card.style.display =
        match
          ? ''
          : 'none';

      if (match) {
        visible++;
      }

    });

    const count =
      document.getElementById(
        'productCount'
      );

    if (count) {

      count.textContent =
        visible;

    }

}

/* ===================================================== LOAD PRODUCT
IMAGE → FILE ===================================================== */

async function loadProductImageFile( productCode ) {

    currentProductImageFile = null;

    if (!productCode) {
      return;
    }

    try {

      console.log(
        '[RAIDALL] Loading image:',
        productCode
      );

      const url =
        API_URL +
        '?api=1' +
        '&action=imageBase64' +
        '&code=' +
        encodeURIComponent(
          productCode
        );

      const response =
        await fetch(
          url,
          {
            method: 'GET',
            cache: 'no-store'
          }
        );

      if (!response.ok) {

        throw new Error(
          'Image API HTTP ' +
          response.status
        );

      }

      const result =
        await response.json();

      console.log(
        '[RAIDALL] Image API:',
        {
          success: result.success,
          productCode: result.productCode,
          fileName: result.fileName,
          mimeType: result.mimeType,
          base64Length:
            result.base64
              ? result.base64.length
              : 0
        }
      );

      if (
        !result.success ||
        !result.base64
      ) {

        throw new Error(
          result.error ||
          'Base64 image tidak tersedia.'
        );

      }

      const binary =
        atob(result.base64);

      const bytes =
        new Uint8Array(
          binary.length
        );

      for (
        let i = 0;
        i < binary.length;
        i++
      ) {

        bytes[i] =
          binary.charCodeAt(i);

      }

      const mime =
        result.mimeType ||
        'image/png';

      const blob =
        new Blob(
          [bytes],
          {
            type: mime
          }
        );

      currentProductImageFile =
        new File(
          [blob],
          result.fileName ||
          `${productCode}.png`,
          {
            type: mime
          }
        );

      console.log(
        '[RAIDALL] IMAGE FILE READY:',
        currentProductImageFile.name,
        currentProductImageFile.type,
        currentProductImageFile.size
      );

    } catch (error) {

      console.error(
        '[RAIDALL] Image loading failed:',
        error
      );

      currentProductImageFile = null;

    }

}

/* ===================================================== PRODUCT DETAIL
===================================================== */

window.showProductDetail = async function (productCode) {

      console.log(
        '[RAIDALL] Product Detail:',
        productCode
      );

      try {

        const url =
          API_URL +
          '?api=1' +
          '&action=product' +
          '&code=' +
          encodeURIComponent(
            productCode
          );

        const response =
          await fetch(
            url,
            {
              method: 'GET',
              cache: 'no-store'
            }
          );

        if (!response.ok) {

          throw new Error(
            'HTTP ' +
            response.status
          );

        }

        const result =
          await response.json();

        if (!result.success) {

          throw new Error(
            result.error ||
            'Product tidak ditemukan.'
          );

        }

        const product =
          result.data;

        console.log(
          '[RAIDALL] Product:',
          product
        );

        currentProductImageFile = null;

        const oldModal =
          document.getElementById(
            'productDetailModal'
          );

        if (oldModal) {
          oldModal.remove();
        }

        const modal =
          document.createElement(
            'div'
          );

        modal.id =
          'productDetailModal';

        modal.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.65);
          z-index: 99999;
          overflow: auto;
          padding: 20px;
          box-sizing: border-box;
        `;

        modal.innerHTML = `

          <div
            style="
              max-width:600px;
              margin:20px auto;
              background:#fff;
              border-radius:18px;
              padding:22px;
              box-sizing:border-box;
            ">

            <button
              onclick="
                document
                  .getElementById('productDetailModal')
                  .remove()
              "
              style="
                float:right;
                border:none;
                background:none;
                font-size:24px;
                cursor:pointer;
              ">

              ✕

            </button>

            <h2>
              ${escapeHTML(
                product.ProductName
              )}
            </h2>

            <p>
              <b>Product Code:</b>
              ${escapeHTML(
                product.ProductCode || '-'
              )}
            </p>

            <p>
              <b>Category:</b>
              ${escapeHTML(
                product.Category || '-'
              )}
            </p>

            <p>
              <b>Species:</b>
              ${escapeHTML(
                product.Species || '-'
              )}
            </p>

            <p>
              <b>Variant:</b>
              ${escapeHTML(
                product.Variant || '-'
              )}
            </p>

            <p>
              <b>Price:</b>
              ${escapeHTML(
                String(
                  product.Price || '-'
                )
              )}
            </p>

            <p>
              <b>Composition:</b><br>
              ${escapeHTML(
                product.Composition || '-'
              )}
            </p>

            <p>
              <b>Function:</b><br>
              ${escapeHTML(
                product.Function || '-'
              )}
            </p>

            <p>
              <b>Description:</b><br>
              ${escapeHTML(
                product.Description || '-'
              )}
            </p>

            <p>
              <b>Cara Penggunaan:</b><br>
              ${escapeHTML(
                product.Usage || '-'
              )}
            </p>

            <button
              id="copyWAButton"
              style="
                width:100%;
                padding:14px;
                margin-top:20px;
                border:none;
                border-radius:10px;
                background:#0B7A3E;
                color:#fff;
                font-size:16px;
                font-weight:bold;
                cursor:pointer;
              ">

              📲 Copy WhatsApp + Image

            </button>

          </div>

        `;

        document.body.appendChild(
          modal
        );

        document
          .getElementById(
            'copyWAButton'
          )
          .addEventListener(
            'click',
            function () {

              copyWA(product);

            }
          );

      } catch (error) {

        console.error(
          '[RAIDALL] Detail Error:',
          error
        );

        alert(
          'Data produk tidak dapat dimuat.\n\n' +
          error.message
        );

      }

    };

/* ===================================================== COPY WHATSAPP +
IMAGE ATTACHMENT =====================================================
*/

async function copyWA(product) {

  if (!product) {
    alert('Produk tidak ditemukan.');
    return;
  }

  console.log(
    '[RAIDALL] Copy WhatsApp + Download Image:',
    product.ProductCode
  );

  const text =
`${product.ProductName || ''}

📦 Variant
${product.Variant || '-'}

💰 Harga
${product.Price || '-'}

🐔 Species
${product.Species || '-'}

🧪 Composition
${product.Composition || '-'}

⚙ Function
${product.Function || '-'}

📝 Description
${product.Description || '-'}

📖 Cara Penggunaan
${product.Usage || '-'}

PT. Rizki Piara Sejahtera`;

  /* ===================================================
     1. COPY TEXT
     =================================================== */

  let textCopied = false;

  try {

    await navigator.clipboard.writeText(text);

    textCopied = true;

  } catch (error) {

    console.warn(
      '[RAIDALL] Clipboard API failed:',
      error
    );

    try {

      const textarea =
        document.createElement('textarea');

      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      textCopied =
        document.execCommand('copy');

      textarea.remove();

    } catch (fallbackError) {

      console.error(
        '[RAIDALL] Clipboard fallback failed:',
        fallbackError
      );

    }

  }

  /* ===================================================
     2. GET IMAGE FROM APPS SCRIPT
     =================================================== */

  let imageFile = null;

  try {

    const url =
      API_URL +
      '?api=1&action=imageBase64&code=' +
      encodeURIComponent(product.ProductCode);

    const response =
      await fetch(
        url,
        {
          method: 'GET',
          cache: 'no-store'
        }
      );

    if (!response.ok) {
      throw new Error(
        'HTTP ' + response.status
      );
    }

    const result =
      await response.json();

    console.log(
      '[RAIDALL] Image Base64 Result:',
      {
        success: result.success,
        productCode: result.productCode,
        fileName: result.fileName,
        mimeType: result.mimeType,
        base64Length:
          result.base64
            ? result.base64.length
            : 0
      }
    );

    if (
      !result.success ||
      !result.base64
    ) {
      throw new Error(
        result.error ||
        'Image Base64 tidak tersedia.'
      );
    }

    const binary =
      atob(result.base64);

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    const mime =
      result.mimeType ||
      'image/png';

    const blob =
      new Blob(
        [bytes],
        {
          type: mime
        }
      );

    imageFile =
      new File(
        [blob],
        result.fileName ||
        `${product.ProductCode}.png`,
        {
          type: mime
        }
      );

    currentProductImageFile =
      imageFile;

    console.log(
      '[RAIDALL] IMAGE FILE READY:',
      imageFile.name,
      imageFile.type,
      imageFile.size
    );

  } catch (error) {

    console.error(
      '[RAIDALL] Image preparation failed:',
      error
    );

    imageFile = null;
    currentProductImageFile = null;

  }

  /* ===================================================
     3. DOWNLOAD IMAGE
     =================================================== */

  if (imageFile) {

    try {

      const imageURL =
        URL.createObjectURL(
          imageFile
        );

      const downloadLink =
        document.createElement('a');

      downloadLink.href =
        imageURL;

      downloadLink.download =
        imageFile.name;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      downloadLink.remove();

      setTimeout(
        () => {
          URL.revokeObjectURL(
            imageURL
          );
        },
        1000
      );

      console.log(
        '[RAIDALL] Product image downloaded:',
        imageFile.name
      );

    } catch (error) {

      console.error(
        '[RAIDALL] Image download failed:',
        error
      );

    }

  }

  /* ===================================================
     4. OPEN WHATSAPP WEB
     =================================================== */

  try {

    window.open(
      'https://web.whatsapp.com/',
      '_blank'
    );

  } catch (error) {

    console.warn(
      '[RAIDALL] WhatsApp Web open failed:',
      error
    );

  }

  /* ===================================================
     5. USER INSTRUCTION
     =================================================== */

  if (
    textCopied &&
    imageFile
  ) {

    alert(
      'SIAP.\n\n' +
      '① Text produk sudah dicopy.\n' +
      '② Image produk sudah didownload.\n' +
      '③ WhatsApp Web sudah dibuka.\n\n' +
      'Di WhatsApp:\n' +
      '• Buka chat tujuan.\n' +
      '• Paste text dengan Ctrl+V.\n' +
      '• Attach image produk yang baru didownload.'
    );

  } else if (textCopied) {

    alert(
      'Text produk sudah dicopy.\n\n' +
      'Image produk gagal didownload.'
    );

  } else {

    alert(
      'Proses Copy WhatsApp gagal.\n\n' +
      'Silakan coba lagi.'
    );

  }

}

window.goHome = function () {

      showHome();

      history.pushState(
        {
          page: 'home'
        },
        '',
        window.location.pathname
      );

    };

/* ===================================================== BROWSER BACK
===================================================== */

window.addEventListener( ‘popstate’, function (event) {

      const state =
        event.state;

      if (
        state &&
        state.page === 'division' &&
        state.division
      ) {

        openDivision(
          state.division
        );

        return;

      }

      showHome();

    }

);

/* ===================================================== INITIAL STATE
===================================================== */

history.replaceState( { page: ‘home’ }, ’’, window.location.pathname );

/* ===================================================== SERVICE WORKER
===================================================== */

if ( ‘serviceWorker’ in navigator && location.protocol === ‘https:’ ) {

    window.addEventListener(
      'load',
      () => {

        navigator.serviceWorker
          .register(
            './service-worker.js',
            {
              scope: './'
            }
          )

          .then(reg => {

            console.log(
              '[RAIDALL] Service worker registered:',
              reg.scope
            );

          })

          .catch(err => {

            console.error(
              '[RAIDALL] Service worker registration failed:',
              err
            );

          });

      }
    );

}

/* ===================================================== HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    return String(value || '')
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );

}

/* ===================================================== START
===================================================== */

hideLoading();

})();
