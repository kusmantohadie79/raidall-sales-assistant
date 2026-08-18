(() => {

  /* =====================================================
     RAID ALL SALES ASSISTANT
     FRONTEND API INTEGRATION
     ===================================================== */

  const API_URL =
    'https://script.google.com/macros/s/AKfycbyjekI9Vt7x4aqiyIekVPnvGMgRn9bJKJmifey0h0bBps-F3FqTAnKJfCqXOnD-Ak-cFw/exec';


  /* =====================================================
     DOM
     ===================================================== */

  const loading =
    document.getElementById('loading');

  const homePage =
    document.getElementById('homePage');

  const divisionPage =
    document.getElementById('divisionPage');

  const livestockPage =
    document.getElementById('livestockPage');

  const divisionContent =
    document.getElementById('divisionContent');


  /* =====================================================
     LOADING
     ===================================================== */

  function hideLoading() {

    if (!loading) return;

    loading.style.opacity = '0';

    setTimeout(() => {

      loading.style.display = 'none';

    }, 300);

  }


  /* =====================================================
     SHOW HOME
     ===================================================== */

  function showHome() {

    homePage.classList.add('active');

    divisionPage.classList.remove('active');

    /*
     * Legacy Livestock iframe
     * tidak digunakan lagi.
     */

    if (livestockPage) {
      livestockPage.classList.remove('active');
    }

  }


  /* =====================================================
     API REQUEST
     ===================================================== */

  async function fetchProducts(division) {

    const url =
      API_URL +
      '?api=1' +
      '&action=products' +
      '&division=' +
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
        'API HTTP Error: ' +
        response.status
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


  /* =====================================================
     OPEN DIVISION
     ===================================================== */

  window.openDivision =
    async function (division) {

      console.log(
        '[RAIDALL] Open Division:',
        division
      );


      /*
       * ================================================
       * NORMALIZE DIVISION
       * ================================================
       */

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


      /*
       * ================================================
       * SWITCH PAGE
       * ================================================
       */

      homePage.classList.remove('active');

      if (livestockPage) {
        livestockPage.classList.remove('active');
      }

      divisionPage.classList.add('active');


      /*
       * ================================================
       * SHOW LOADING STATE
       * ================================================
       */

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


      /*
       * ================================================
       * URL / HISTORY
       * ================================================
       */

      history.pushState(
        {
          page: 'division',
          division: division
        },
        '',
        '#' + division
      );


      /*
       * ================================================
       * LOAD PRODUCTS
       * ================================================
       */

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
              onclick="openDivision('${division}')">

              Coba Lagi

            </button>

          </div>

        `;

      }

    };


  /* =====================================================
     RENDER PRODUCTS
     ===================================================== */

  function renderDivisionProducts(
    config,
    products
  ) {


    /*
     * ================================================
     * GROUP PRODUCT BY PRODUCT CODE + PRODUCT NAME
     * ================================================
     *
     * Contoh:
     *
     * LV0001
     * 10 g
     * 100 g
     * 250 g
     *
     * menjadi satu product family.
     */

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


    /*
     * ================================================
     * HEADER
     * ================================================
     */

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


    /*
     * ================================================
     * PRODUCT CARDS
     * ================================================
     */

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


    /*
     * ================================================
     * SEARCH
     * ================================================
     */

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


  /* =====================================================
     PRODUCT CARD
     ===================================================== */

  function renderProductCard(
    family,
    config,
    index
  ) {

    const variants =
      family.variants || [];


    const first =
      variants[0] || {};


    const variantCount =
      variants.length;


    /*
     * IMAGE
     *
     * Untuk sementara mengambil Image
     * dari PRODUCT_MASTER.
     */

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


    /*
     * VARIANT LABEL
     */

    let variantHTML = '';


    if (variantCount > 1) {

      variantHTML = `

        <div class="product-variant-count">

          ${variantCount} Variant

        </div>

      `;

    } else {

      const variant =
        first.Variant || '-';


      variantHTML = `

        <div class="product-variant">

          ${escapeHTML(
            String(variant)
          )}

        </div>

      `;

    }


    /*
     * PRODUCT CARD
     */

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


  /* =====================================================
     SEARCH FILTER
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
        card.innerText
          .toLowerCase();


      const match =
        !search ||
        text.includes(search);


      card.style.display =
        match
          ? ''
          : 'flex';


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


  /* =====================================================
     PRODUCT DETAIL
     ===================================================== */

  /* =====================================================
   PRODUCT DETAIL
   ===================================================== */

window.showProductDetail =
  async function (productCode) {

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


      /* =================================================
         DETAIL MODAL
         ================================================= */

      let oldModal =
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
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.65);
        z-index:99999;
        overflow:auto;
        padding:20px;
        box-sizing:border-box;
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


      /* =================================================
         COPY BUTTON
         ================================================= */

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


    }
    catch (error) {

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


      } catch (error) {

        console.error(
          '[RAIDALL] Detail Error:',
          error
        );


        alert(
          'Data produk tidak dapat dimuat.'
        );

      }

    };

  /* =====================================================
   COPY WHATSAPP + IMAGE ATTACHMENT
   ===================================================== */

async function copyWA(product) {

  if (!product) {

    alert('Produk tidak ditemukan.');

    return;

  }


  console.log(
    '[RAIDALL] Copy WhatsApp:',
    product.ProductCode
  );


  /* ===================================================
     BUILD WHATSAPP TEXT
     =================================================== */

  const text =

`*${product.ProductName || ''}*

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
     GET IMAGE BASE64 FROM APPS SCRIPT
     =================================================== */

  let imageFile = null;


  try {

    const url =
      API_URL +
      '?api=1' +
      '&action=imageBase64' +
      '&code=' +
      encodeURIComponent(
        product.ProductCode
      );


    console.log(
      '[RAIDALL] Image Base64 URL:',
      url
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
        'HTTP ' + response.status
      );

    }


    const result =
      await response.json();


    console.log(
      '[RAIDALL] Image Base64 Result:',
      result
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


    /* =================================================
       BASE64 → BLOB
       ================================================= */

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


    /* =================================================
       BLOB → FILE
       ================================================= */

    imageFile =
      new File(
        [
          blob
        ],
        result.fileName ||
        `${product.ProductCode}.png`,
        {
          type: mime
        }
      );


    console.log(
      '[RAIDALL] Image File:',
      imageFile.name,
      imageFile.type,
      imageFile.size
    );


  }
  catch (error) {

    console.error(
      '[RAIDALL] Image Base64 Error:',
      error
    );

    imageFile = null;

  }


  /* ===================================================
     SHARE TEXT + IMAGE
     =================================================== */

  if (
    imageFile &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({
      files: [
        imageFile
      ]
    })
  ) {

    try {

      await navigator.share({

        title:
          product.ProductName ||
          'RAID ALL Product',

        text:
          text,

        files: [
          imageFile
        ]

      });


      console.log(
        '[RAIDALL] WhatsApp share berhasil.'
      );


      return;

    }
    catch (error) {

      console.warn(
        '[RAIDALL] Share dibatalkan/gagal:',
        error
      );

    }

  }


  /* ===================================================
     FALLBACK TEXT ONLY
     =================================================== */

  try {

    await navigator.clipboard.writeText(
      text
    );


    alert(
      'Informasi produk berhasil dicopy.\n\n' +
      'Browser/perangkat tidak mendukung ' +
      'attachment image otomatis.'
    );

  }
  catch (error) {

    console.error(
      '[RAIDALL] Clipboard error:',
      error
    );

  }

}

  /* =====================================================
     GO HOME
     ===================================================== */

  window.goHome =
    function () {

      showHome();


      history.pushState(
        {
          page: 'home'
        },
        '',
        window.location.pathname
      );

    };


  /* =====================================================
     BROWSER BACK
     ===================================================== */

  window.addEventListener(
    'popstate',
    function (event) {

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


  /* =====================================================
     INITIAL STATE
     ===================================================== */

  history.replaceState(
    {
      page: 'home'
    },
    '',
    window.location.pathname
  );


  /* =====================================================
     SERVICE WORKER
     ===================================================== */

  if (
    'serviceWorker' in navigator &&
    location.protocol === 'https:'
  ) {

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


  /* =====================================================
     HTML ESCAPE
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


  /* =====================================================
     START
     ===================================================== */

  hideLoading();

})();
