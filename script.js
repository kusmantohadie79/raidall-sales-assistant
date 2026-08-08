(() => {

  const loading = document.getElementById('loading');
  const frame = document.getElementById('appFrame');

  const pages = {
    home: document.getElementById('homePage'),
    petcare: document.getElementById('petcarePage'),
    livestock: document.getElementById('livestockPage'),
    aquaculture: document.getElementById('aquaculturePage')
  };


  /* =========================================
     LOADING
  ========================================= */

  function hideLoading() {

    if (!loading) return;

    loading.style.opacity = '0';

    window.setTimeout(() => {

      loading.style.display = 'none';

    }, 300);
  }


  /*
   * Home tidak membutuhkan Apps Script.
   * Loading cukup ditampilkan singkat.
   */

  window.setTimeout(hideLoading, 700);


  /* =========================================
     PAGE CONTROL
  ========================================= */

  function hideAllPages() {

    Object.values(pages).forEach(page => {

      if (page) {
        page.classList.remove('active');
      }

    });
  }


  function showPage(name) {

    hideAllPages();

    if (pages[name]) {
      pages[name].classList.add('active');
    }
  }


  /* =========================================
     OPEN DIVISION
  ========================================= */

  window.openDivision = function (division) {

    if (division === 'petcare') {

      showPage('petcare');

      history.pushState(
        { page: 'petcare' },
        '',
        '#petcare'
      );

      return;
    }


    if (division === 'livestock') {

      showPage('livestock');

      history.pushState(
        { page: 'livestock' },
        '',
        '#livestock'
      );

      return;
    }


    if (division === 'aquaculture') {

      showPage('aquaculture');

      history.pushState(
        { page: 'aquaculture' },
        '',
        '#aquaculture'
      );

      return;
    }

  };


  /* =========================================
     GO HOME
  ========================================= */

  window.goHome = function () {

    showPage('home');

    history.pushState(
      { page: 'home' },
      '',
      window.location.pathname
    );

  };


  /* =========================================
     BROWSER BACK
  ========================================= */

  window.addEventListener('popstate', () => {

    const hash = window.location.hash;

    if (hash === '#petcare') {

      showPage('petcare');
      return;

    }

    if (hash === '#livestock') {

      showPage('livestock');
      return;

    }

    if (hash === '#aquaculture') {

      showPage('aquaculture');
      return;

    }

    showPage('home');

  });


  /* =========================================
     SERVICE WORKER
  ========================================= */

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


  /* =========================================
     INITIAL PAGE
  ========================================= */

  const initialHash = window.location.hash;

  if (initialHash === '#petcare') {

    showPage('petcare');

  } else if (initialHash === '#livestock') {

    showPage('livestock');

  } else if (initialHash === '#aquaculture') {

    showPage('aquaculture');

  } else {

    showPage('home');

  }


})();
