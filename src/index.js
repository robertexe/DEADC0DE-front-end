document.addEventListener('DOMContentLoaded', init)


function init() {

  const navBar = document.querySelector('.navigation-bar')
  const languageList = document.querySelector('#language-list')
  const languageCards = document.querySelector('#language-cards')
  const languageCardContainer = document.querySelector('#language-card-container')
  const projectCardContainer = document.querySelector('#project-card-container')
  const banner = document.querySelector('.banner')
  const signIn = document.querySelector('#sign-in')
  const signInBtn = document.querySelector('#sign-in-btn')
  const currentUser = document.querySelector('#current-user')
  const explore = document.querySelector('#explore')
  const userForm = document.querySelector('#user-form')

  window.addEventListener('scroll', handleNavBarScroll)
  document.addEventListener('click', handleLanguageCardClick)
  banner.addEventListener('click', handleDeadcodeGifClick)
  signInBtn.addEventListener('click', handleSignInBtnClick)
  userForm.addEventListener('submit', handleUserFormSubmit)



  Adapter.get('languages')
    .then(json => renderLanguageCards(json.data))



  // Event Handlers //

  function handleDeadcodeGifClick(e) {
    if(e.clientX > 500 && e.clientX < 940 && e.clientY < 120) {
      projectCardContainer.innerHTML = ""
      languageCardContainer.classList.remove("slide-away")
    }
  }

  function handleLanguageCardClick(e) {
    if(e.target.classList.contains("language-card")) {
      languageCardContainer.classList.add("slide-away")

      let header = makeProjectsHeader(e)
      projectCardContainer.innerHTML += header

      Adapter.getNested("languages", e.target.dataset.languageId, "projects")
        .then(json => renderProjectCards(json.data))
    }
  }

  function handleNavBarScroll(e) {
    if (window.pageYOffset >= 170) {
      navBar.style.position = "fixed"
    } else {
      navBar.style.position = "sticky"
    }
  }

  function handleSignInBtnClick(e) {
    e.preventDefault()
    explore.classList.toggle("moved")
    signIn.classList.toggle("clicked")
  }

  function handleUserFormSubmit(e){
    e.preventDefault()
    let userName = e.target.querySelector('#prefix').value
    signIn.classList.add("submitted")
    explore.classList.toggle("moved")

    setTimeout(() => { signIn.classList.remove("submitted", "clicked") }, 1200)

    Adapter.create('users', {name: userName})
      .then(json => {
        if(json.name) {
          alert(`Uh oh! Name ${json.name[0]}`)
        } else {
          renderUser(json.data)
        }
      })
  }

  // Template Makers //

  function makeLanguageCard(language) {
    let attributes = language.attributes
    return `<div class='col m4'>
              <div class="parent">
                <div class="child bg-1 language-card" data-language-id=${language.id}>
                  <img src="${attributes.icon}">
                  <p class="language-card" data-language-id=${language.id}>${attributes.name}</p>
                </div>
              </div>
            </div>`
  }

  function makeLanguageCards(languages) {
    return languages.map(makeLanguageCard).join('')
  }

  function makeProjectCard(project) {
    let attributes = project.attributes
    let icon = attributes.language.icon
    return `
              <div class="col s6">
                <div class="card">
                  <div class="card-body" style="min-height: 13rem;">
                    <h5 class="card-title">${attributes.name}</h5>
                    <p class="card-text">${attributes.description}</p>
                    <a href="${attributes.url}" class="btn btn-primary github-button" target="_blank" rel="noopener noreferrer">Go to repo</a>
                  </div>
                </div>
              </div>
            `
  }

  function makeProjectCards(projects) {
    return projects.map(makeProjectCard).join('')
  }

  function makeProjectsHeader(e) {
    return `<div class="projects-header"><h1>${e.target.innerText}</h1></div>`
  }

  // Template Rendering //

  function renderLanguageCards(languages) {
    let template = makeLanguageCards(languages)
    languageCards.innerHTML += template
  }

  function renderProjectCards(projects) {
    let template = makeProjectCards(projects)
    projectCardContainer.innerHTML += template
  }


  function renderSignIn(){
    let template = makeSignInForm()
    signIn.innerHTML += template
  }

  function renderUser(user){
    let id = user.id
    let name = user.attributes.name
    currentUser.innerText = name
    currentUser.dataset.userId = id
    signInBtn.parentElement.remove()

  }


}
