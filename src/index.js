document.addEventListener('DOMContentLoaded', init)





function init() {
  const languageList = document.querySelector('#language-list')
  Adapter.get('languages').then(json => renderLanguages(json.data))



  function makeLanguageTemplate(language){
    let attributes = language.attributes
    return  `<li data-language_id="${language.id}" data-icon="${attributes.icon}">${attributes.name}(${attributes.projectcount}) </li>`
  }

  function makeLanguageTemplates(languages){
    return languages.map(language => makeLanguageTemplate(language)).join('')
  }

  function renderLanguages(languages){
    let template = makeLanguageTemplates(languages)
    languageList.innerHTML += template
  }
}
