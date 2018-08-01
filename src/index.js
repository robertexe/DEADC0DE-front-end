document.addEventListener('DOMContentLoaded', init)



function init() {
  const navBar = document.querySelector('.navigation-bar')
  const languageList = document.querySelector('#language-list')
  const languageCardContainer = document.querySelector('#language-card-container')
  const projectCardContainer = document.querySelector('#project-card-container')

  window.addEventListener('scroll', handleNavBarScroll)
  document.addEventListener('click', handleLanguageCardClick)

  Adapter.get('languages')
    .then(json => {
      // renderLanguages(json.data)
      renderLanguageCards(json.data)
    })


  function handleNavBarScroll(e) {
    if (window.pageYOffset >= 170) {
      navBar.style.position = "fixed"
    } else {
      navBar.style.position = "sticky"
    }
  }

  function handleLanguageCardClick(e) {
    if(e.target.classList.contains("language-card")) {
      Adapter.getNested("languages", e.target.dataset.languageId, "projects")
        .then()
    }
  }
  //
  // function makeLanguageTemplate(language) {
  //   let attributes = language.attributes
  //   return  `<li data-language_id="${language.id}" data-icon="${attributes.icon}">${attributes.name}(${attributes.projectcount}) </li>`
  // }
  //
  // function makeLanguageTemplates(languages) {
  //   return languages.map(language => makeLanguageTemplate(language)).join('')
  // }
  //
  // function renderLanguages(languages) {
  //   let template = makeLanguageTemplates(languages)
  //   languageList.innerHTML += template
  // }

  function makeLanguageCard(language) {
    let attributes = language.attributes
    return `<div class="parent">
              <div class="child bg-1 language-card" data-language-id=${language.id}>
                <img src="${attributes.icon}">
                <p class="language-card" data-language-id=${language.id}>${attributes.name}</p>
              </div>
            </div>`
  }

  function makeLanguageCards(languages) {
    return languages.map(language => makeLanguageCard(language)).join('')
  }

  function renderLanguageCards(languages) {
    let template = makeLanguageCards(languages)
    languageCardContainer.innerHTML += template
  }
}
