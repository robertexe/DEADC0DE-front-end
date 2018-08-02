document.addEventListener('DOMContentLoaded', init)


function init() {

  // header elements //
  const banner = document.querySelector('.banner')

  // navbar elements //
  const navBar = document.querySelector('.navigation-bar')
  const signInBtn = document.querySelector('#sign-in-btn')
  const currentUser = document.querySelector('#current-user')
  const queueBtn = document.querySelector('#project-queue-btn')

  // main elements
  const signIn = document.querySelector('#sign-in')
  const explore = document.querySelector('#explore')
  const userForm = document.querySelector('#user-form')
  const languageList = document.querySelector('#language-list')
  const languageCards = document.querySelector('#language-cards')
  const languageCardContainer = document.querySelector('#language-card-container')
  const projectCardContainer = document.querySelector('#project-card-container')
  const queueCardContainer = document.querySelector('#queue-card-container')


  // Event Listeners //
  window.addEventListener('scroll', handleNavBarScroll)
  document.addEventListener('click', handleLanguageCardClick)
  document.addEventListener('click', handleAddToQueue)
  document.addEventListener('click', handleRemoveFromQueue)
  banner.addEventListener('click', handleDeadcodeGifClick)
  signInBtn.addEventListener('click', handleSignInBtnClick)
  userForm.addEventListener('submit', handleUserFormSubmit)
  queueBtn.addEventListener('click', handleQueueBtnClick)



  Adapter.get('languages')
    .then(json => renderLanguageCards(json.data))


  // Helper Functions //

  function createUserProject(e) {
    let userId = currentUser.dataset.userId
    let projectId = e.target.parentElement.dataset.projectId
    let userProject = {
      user_id: userId,
      project_id: projectId
    }

    Adapter.create("user_projects", userProject)
      .then(resp => e.target.innerText = "Added")
  }


  // Event Handlers //

  function handleAddToQueue(e) {
    if(e.target.classList.contains("add-to-queue")) {
      if(currentUser.innerText === ""){
        alert("Sign in to start a queue")
      } else {
        createUserProject(e)
      }
    }
  }

  function handleDeadcodeGifClick(e) {
    if(e.clientX > 500 && e.clientX < 940 && e.clientY < 120) {
      projectCardContainer.innerHTML = ""
      queueCardContainer.innerHTML = ""
      languageCardContainer.classList.remove("slide-away")
    }
  }

  function handleLanguageCardClick(e) {
    if(e.target.classList.contains("language-card")) {
      languageCardContainer.classList.toggle("slide-away")
      queueCardContainer.innerHtml = ""
      queueCardContainer.classList.add("hidden")
      projectCardContainer.classList.remove('hidden')

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

  function handleQueueBtnClick(e) {
    if(currentUser.innerText === "") {
      alert("Sign in to see your queue")
    } else {

      if(!languageCardContainer.classList.contains("slide-away")){
        languageCardContainer.classList.toggle("slide-away")
      }

      if(queueCardContainer.classList.contains("hidden")){
        queueCardContainer.classList.toggle("hidden")
      }

      if(!projectCardContainer.classList.contains("hidden")) {
        projectCardContainer.classList.add("hidden")
        projectCardContainer.innerHTML = ""
      }

      Adapter.getNested('users', currentUser.dataset.userId, 'user_projects')
        .then(json => {
          if(json.data.length === 0) {
            queueCardContainer.innerHTML = "<h4>Explore open source projects to start a queue</h4>"
          } else {
            renderQueue(json.data)
          }
        })
    }
  }

  function handleRemoveFromQueue(e) {
    if(e.target.classList.contains("remove-from-queue")) {
      let id = e.target.parentElement.dataset.userProjectId

      Adapter.destroy("user_projects", id)
      e.target.closest("div.col").classList.add("fade-away")
      setTimeout(() => {e.target.closest("div.col").remove()}, 1100)
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
                    <h5 class="card-title" data-project-id="${project.id}">${attributes.name} <button class="add-to-queue btn">+</button></h5>
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

  function makeQueueCard(userProject) {
    let attributes = userProject.attributes
    let project = attributes.project
    return `
            <div class="col s6">
              <div class="card">
                <div class="card-body" style="min-height: 13rem;">
                  <h5 class="card-title" data-user-project-id="${userProject.id}">${project.name} <button class="remove-from-queue btn">-</button></h5>
                  <p class="card-text">${project.description}</p>
                  <a href="${project.url}" class="btn btn-primary github-button" target="_blank" rel="noopener noreferrer">Go to repo</a>
                </div>
              </div>
            </div>
            `
  }

  function makeQueueCards(queue) {
    return queue.map(userProject => makeQueueCard(userProject)).join("")
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


  function renderSignIn() {
    let template = makeSignInForm()
    signIn.innerHTML += template
  }

  function renderUser(user) {
    let id = user.id
    let name = user.attributes.name
    currentUser.innerText = name
    currentUser.dataset.userId = id
    signInBtn.parentElement.remove()
  }

  function renderQueue(queue) {
    let template = makeQueueCards(queue)
    queueCardContainer.innerHTML = `<h4>Get to work</h4>` + template
  }

}
