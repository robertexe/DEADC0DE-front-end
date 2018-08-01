document.addEventListener('DOMContentLoaded', init)



function init() {
  const navBar = document.querySelector('.navigation-bar')
  const languageList = document.querySelector('#language-list')
  const languageCardContainer = document.querySelector('#language-card-container')

  window.addEventListener('scroll', handleNavBarScroll)

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

  function makeLanguageTemplate(language) {
    let attributes = language.attributes
    return  `<li data-language_id="${language.id}" data-icon="${attributes.icon}">${attributes.name}(${attributes.projectcount}) </li>`
  }

  function makeLanguageTemplates(languages) {
    return languages.map(language => makeLanguageTemplate(language)).join('')
  }

  function renderLanguages(languages) {
    let template = makeLanguageTemplates(languages)
    languageList.innerHTML += template
  }

  function makeLanguageCard(language) {
    let attributes = language.attributes
    return `<div class="parent">
              <div class="child bg-1">
                <img src="${attributes.icon}">
                <a href="#" data-language_id=${language.id}>${attributes.name}</a>
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
