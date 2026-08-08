(() => {

  const loading = document.getElementById('loading');

  const homePage = document.getElementById('homePage');
  const divisionPage = document.getElementById('divisionPage');
  const divisionContent = document.getElementById('divisionContent');

  const livestockPage = document.getElementById('livestockPage');

  const appFrame = document.getElementById('appFrame');


  /* =========================================================
     LOADING
  ========================================================= */

  function hideLoading() {

    if (!loading) return;

    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
    }, 300);

  }


  /* =========================================================
     SHOW / HIDE PAGE
  ========================================================= */

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


  function showDivisionPage() {

    if (homePage) {
      homePage.classList.remove('active');
    }

    if (livestockPage) {
      livestockPage.classList.remove('active');
    }

    if (divisionPage) {
      divisionPage.classList.add('active');
    }

  }


  function showLivestock() {

    if (homePage) {
      homePage.classList.remove('active');
    }

    if (divisionPage) {
      divisionPage.classList.remove('active');
    }

    if (livestockPage) {
      livestockPage.classList.add('active');
    }

  }


  /* =========================================================
     OPEN DIVISION
  ========================================================= */

  window.openDivision = function(division) {

    /* -----------------------------------------
       LIVESTOCK
    ----------------------------------------- */

    if (division === 'livestock') {

      showLivestock();

      history.pushState(
        {
          page: 'livestock'
        },
        '',
        '#livestock'
      );

      return;
    }


    /* -----------------------------------------
       PETCARE / AQUA CULTURE
    ----------------------------------------- */

    showDivisionPage();

    let title = '';
    let description = '';
    let icon = '';

    if (division === 'petcare') {

      title = 'PETCARE';
      description = 'Pet Health & Care';
      icon = '🐾';

    }

    else if (division === 'aquaculture') {

      title = 'AQUA CULTURE';
      description = 'Fish Medicine';
      icon = '🐟';

    }


    if (divisionContent) {

      divisionContent.innerHTML = `

        <div class="division-header ${division}">

          <button
            class="home-button"
            onclick="goHome()">
            ← Kembali
          </button>

          <h1>${title}</h1>

          <p>${description}</p>

        </div>


        <div class="coming-soon">

          <div class="placeholder-icon">
            ${icon}
          </div>

          <div class="coming-title">
            ${title}
          </div>

          <div class="coming-text">
            Konten ${title} akan terhubung
            ke database RAID ALL.
          </div>

        </div>

      `;

    }


    history.pushState(
      {
        page: 'division',
        division: division
      },
      '',
      '#' + division
    );

  };


  /* =========================================================
     GO HOME
  ========================================================= */

  window.goHome = function() {

    showHome();

    history.pushState(
      {
        page: 'home'
      },
      '',
      window.location.pathname
    );

  };


  /* =========================================================
     BROWSER / ANDROID BACK BUTTON
  ========================================================= */

  window.addEventListener('popstate', function(event) {

    const state = event.state;


    /* -----------------------------------------
       Kalau sedang Livestock
    ----------------------------------------- */

    if (
      livestockPage &&
      livestockPage.classList.contains('active')
    ) {

      showHome();

      return;
    }


    /* -----------------------------------------
       Kalau sedang Petcare / Aqua
    ----------------------------------------- */

    if (
      divisionPage &&
      divisionPage.classList.contains('active')
    ) {

      showHome();

      return;
    }


    /* -----------------------------------------
       Default
    ----------------------------------------- */

    showHome();

  });


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  history.replaceState(
    {
      page: 'home'
    },
    '',
    window.location.pathname
  );


  /* =========================================================
     INITIAL PAGE
  ========================================================= */

  showHome();


  /* =========================================================
     GOOGLE APPS SCRIPT FRAME
  ========================================================= */

  if (appFrame) {

    appFrame.addEventListener(
      'load',
      hideLoading
    );

  }


  /* =========================================================
     FALLBACK LOADING
  ========================================================= */

  setTimeout(
    hideLoading,
    3000
  );


})();
