(() => {

  const loading = document.getElementById('loading');

  const homePage = document.getElementById('homePage');
  const divisionPage = document.getElementById('divisionPage');
  const livestockPage = document.getElementById('livestockPage');

  const divisionContent = document.getElementById('divisionContent');


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

    livestockPage.classList.remove('active');

  }


  /* =====================================================
     OPEN DIVISION
     ===================================================== */

  window.openDivision = function (division) {


    /* ================================================
       LIVESTOCK
       ================================================ */

    if (division === 'livestock') {

      homePage.classList.remove('active');

      divisionPage.classList.remove('active');

      livestockPage.classList.add('active');


      history.pushState(
        {
          page: 'livestock'
        },
        '',
        '#livestock'
      );

      return;
    }


    /* ================================================
       PETCARE / AQUA CULTURE
       ================================================ */

    homePage.classList.remove('active');

    livestockPage.classList.remove('active');

    divisionPage.classList.add('active');


    let title = '';
    let description = '';
    let theme = '';
    let icon = '';


    if (division === 'petcare') {

      title = 'PET CARE';

      description =
        'Produk kesehatan dan perawatan hewan kesayangan';

      theme = 'petcare';

      icon = '🐾';

    }


    if (division === 'aquaculture') {

      title = 'AQUA CULTURE';

      description =
        'Produk kesehatan dan perawatan ikan';

      theme = 'aquaculture';

      icon = '🐟';

    }


    divisionContent.innerHTML = `

      <header class="division-header ${theme}">

        <button
          class="home-button"
          onclick="goHome()">

          ← Home

        </button>


        <h1>${title}</h1>

        <p>${description}</p>

      </header>


      <div class="division-placeholder ${theme}">

        <div class="placeholder-icon">
          ${icon}
        </div>

        <h2>
          ${title}
        </h2>

        <p>
          Database produk ${title}
          sedang dipersiapkan.
        </p>

        <div class="placeholder-note">
          Struktur Sales Assistant sudah siap.
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

  };


  /* =====================================================
     GO HOME
     ===================================================== */

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


  /* =====================================================
     ANDROID / BROWSER BACK
     ===================================================== */

  window.addEventListener('popstate', () => {

    showHome();

  });


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

    window.addEventListener('load', () => {

      navigator.serviceWorker
        .register('./service-worker.js', {
          scope: './'
        })

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

    });

  }


  /* =====================================================
     HIDE LOADING
     ===================================================== */

  hideLoading();


})();
