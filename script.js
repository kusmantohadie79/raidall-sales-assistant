(() => {

  const loading = document.getElementById('loading');

  function hideLoading() {
    if (!loading) return;

    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
    }, 300);
  }


  window.openDivision = function(division) {

    const homePage = document.getElementById('homePage');
    const divisionPage = document.getElementById('divisionPage');
    const divisionContent = document.getElementById('divisionContent');

    homePage.classList.remove('active');
    divisionPage.classList.add('active');

    let title = '';
    let description = '';

    if (division === 'petcare') {

      title = 'PETCARE';
      description = 'Pet Health & Care';

    } else if (division === 'livestock') {

      title = 'LIVESTOCK';
      description = 'Animal Health';

    } else if (division === 'aquaculture') {

      title = 'AQUA CULTURE';
      description = 'Fish Medicine';

    }

    divisionContent.innerHTML = `
      <div class="division-header ${division}">
        <h1>${title}</h1>
        <p>${description}</p>
      </div>

      <div class="coming-soon">
        <div class="coming-title">
          ${title}
        </div>

        <div class="coming-text">
          Konten ${title} akan terhubung ke database RAID ALL.
        </div>
      </div>
    `;

    window.history.pushState(
      { page: 'division', division: division },
      '',
      '#' + division
    );

  };


  window.goHome = function() {

    const homePage = document.getElementById('homePage');
    const divisionPage = document.getElementById('divisionPage');

    divisionPage.classList.remove('active');
    homePage.classList.add('active');

    history.pushState(
      { page: 'home' },
      '',
      window.location.pathname
    );

  };


  // Android / browser BACK BUTTON
  window.addEventListener('popstate', () => {

    const divisionPage = document.getElementById('divisionPage');

    if (divisionPage.classList.contains('active')) {
      goHome();
    }

  });


  // Initial state
  history.replaceState(
    { page: 'home' },
    '',
    window.location.pathname
  );


  hideLoading();

})();
