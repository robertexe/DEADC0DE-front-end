document.addEventListener('DOMContentLoaded', init)


function init() {

  // header elements //
  const banner = document.querySelector('.banner')

  // navbar elements //
  const navBar = document.querySelector('.navigation-bar')
  const signInBtn = document.querySelector('#sign-in-btn')
  const currentUser = document.querySelector('#current-user')
  const queueBtn = document.querySelector('#project-queue-btn')
  const forumBtn = document.querySelector('#forum-btn')
  const helpBtn = document.querySelector('#help-btn')

  // main elements
  const signIn = document.querySelector('#sign-in')
  const explore = document.querySelector('#explore')
  const userForm = document.querySelector('#user-form')
  const languageList = document.querySelector('#language-list')
  const languageCards = document.querySelector('#language-cards')
  const languageCardContainer = document.querySelector('#language-card-container')
  const projectCardContainer = document.querySelector('#project-card-container')
  const queueCardContainer = document.querySelector('#queue-card-container')
  const forumContainer = document.querySelector('#forum-container')
  const helpFormContainer = document.querySelector('#help-form-container')
  const helpForm = document.querySelector("#help-form")
  const helpFormMessage = document.querySelector('#help-form-message')


  // Event Listeners //
  window.addEventListener('scroll', handleNavBarScroll)
  document.addEventListener('click', handleLanguageCardClick)
  document.addEventListener('click', handleAddToQueue)
  document.addEventListener('click', handleRemoveFromQueue)
  document.addEventListener('click', handleViewComments)
  document.addEventListener('submit', handleNewCommentFormSubmit)
  banner.addEventListener('click', handleDeadcodeGifClick)
  signInBtn.addEventListener('click', handleSignInBtnClick)
  userForm.addEventListener('submit', handleUserFormSubmit)
  queueBtn.addEventListener('click', handleQueueBtnClick)
  forumBtn.addEventListener('click', handleForumBtnClick)
  helpBtn.addEventListener('click', handleHelpBtnClick)
  helpForm.addEventListener('submit', handleHelpFormSubmit)



  Adapter.get('languages')
    .then(json => renderLanguageCards(json.languages))


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
      forumContainer.innerHTML = ""
      forumContainer.classList.add("hidden")
      languageCardContainer.classList.remove("slide-away")

      if(!helpFormContainer.classList.contains("hidden")){
        helpFormContainer.classList.toggle("hidden")
      }
    }
  }

  function handleForumBtnClick(e) {
    if(!languageCardContainer.classList.contains("slide-away")){
      languageCardContainer.classList.toggle("slide-away")
    }

    if(!queueCardContainer.classList.contains("hidden")){
      queueCardContainer.innerHTML = ""
      queueCardContainer.classList.toggle("hidden")
    }

    if(!projectCardContainer.classList.contains("hidden")) {
      projectCardContainer.classList.toggle("hidden")
      projectCardContainer.innerHTML = ""
    }

    if(!helpFormContainer.classList.contains("hidden")){
      helpFormContainer.classList.toggle("hidden")
    }

    if(forumContainer.classList.contains("hidden")) {
      forumContainer.classList.toggle("hidden")

      Adapter.get('posts').then(json => renderPosts(json.posts))
    }
  }

  function handleHelpBtnClick(e) {
    e.preventDefault()

    if(!languageCardContainer.classList.contains("slide-away")){
      languageCardContainer.classList.toggle("slide-away")
    }

    if(!queueCardContainer.classList.contains("hidden")){
      queueCardContainer.innerHTML = ""
      queueCardContainer.classList.toggle("hidden")
    }

    if(!projectCardContainer.classList.contains("hidden")) {
      projectCardContainer.classList.toggle("hidden")
      projectCardContainer.innerHTML = ""
    }

    if(!forumContainer.classList.contains("hidden")){
      forumContainer.classList.toggle('hidden')
      forumContainer.innerHTML = ""
    }

    if(helpFormContainer.classList.contains('hidden')){
      setTimeout(() =>{
        helpFormContainer.classList.remove('hidden')
      }, 500)
    }
  }

  function handleHelpFormSubmit(e) {
    e.preventDefault()
    if (currentUser.innerText === "") {
      alert("Sign in to post a question to the forum")
    } else {
      let title = e.target.querySelector("#new-post-title").value
      let content = e.target.querySelector("#new-post-content").value
      let repoLink = e.target.querySelector("#new-post-repo-link").value
      let userId = currentUser.dataset.userId

      Adapter.create("posts", { title: title, content: content, repo_link: repoLink, user_id: userId })
        .then(resp => {
          helpForm.reset()
          helpFormMessage.classList.toggle("hidden")
          setTimeout(() => { helpFormMessage.classList.toggle("hidden") }, 2000)
        })
    }
  }

  function handleLanguageCardClick(e) {
    if(e.target.classList.contains("language-card")) {
      languageCardContainer.classList.toggle("slide-away")
      projectCardContainer.classList.remove('hidden')


      let header = makeProjectsHeader(e)
      projectCardContainer.innerHTML += header

      Adapter.getNested("languages", e.target.dataset.languageId, "projects")
        .then(json => renderProjectCards(json.projects))
    }
  }

  function handleNavBarScroll(e) {
    if (window.pageYOffset >= 170) {
      navBar.style.position = "fixed"
    } else {
      navBar.style.position = "sticky"
    }
  }

  function handleNewCommentFormSubmit(e) {
    if(e.target.classList.contains("new-comment-form")) {
      e.preventDefault()
      if (currentUser.innerText === "") {
        alert("Sign in to add a comment")
      } else {
        let userId = currentUser.dataset.userId
        let postId = e.target.closest('.card').dataset.postId
        let content = e.target.firstElementChild.value
        e.target.firstElementChild.value = ""

        Adapter.create('comments', { user_id: userId, content: content, post_id: postId })
          .then(json => {
            let comment = json.comment
            let postCard = document.querySelector(`[data-post-id="${comment.post_id}"]`)
            let template = makeCommentTemplate(comment)
            let commentList = postCard.querySelector('.comments')
            let lastComment = commentList.lastElementChild.previousElementSibling

            lastComment.outerHTML += template
          })
      }
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

      if(!forumContainer.classList.contains("hidden")) {
        forumContainer.classList.toggle("hidden")
        forumContainer.innerHTML = ""
      }

      if(!helpFormContainer.classList.contains("hidden")){
        helpFormContainer.classList.toggle("hidden")
      }

      Adapter.getNested('users', currentUser.dataset.userId, 'user_projects')
        .then(json => {
          if(json.user_projects.length === 0) {
            queueCardContainer.innerHTML = "<h4>Explore open source projects to start a queue</h4>"
          } else {
            renderQueue(json.user_projects)
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
    explore.classList.toggle("moved")
    signIn.classList.toggle("clicked")
  }

  function handleUserFormSubmit(e){
    e.preventDefault()
    let userName = e.target.querySelector('#prefix').value
    signIn.classList.add("submitted")
    explore.classList.toggle("moved")

    setTimeout(() => { signIn.classList.remove("submitted", "clicked") }, 100)

    Adapter.create('users', {name: userName})
      .then(json => {
        if(json.name) {
          alert(`Uh oh! Name ${json.name[0]}`)
        } else {
          renderUser(json.user)
        }
      })
  }

  function handleViewComments(e) {
    if(e.target.classList.contains('view-comments-link')) {
      e.preventDefault()
      let commentList = e.target.closest(".card-body").querySelector('.comments')

      e.target.innerText === "hide comments" ? e.target.innerText = "view comments" : e.target.innerText = "hide comments"

      commentList.classList.toggle('hidden-comments')
      commentList.classList.toggle('show-comments')
    }
  }

  // Template Makers //

  function makeCommentTemplate(comment) {
    return `<li><h6>${comment.user_name}</h6><p>${comment.content}</p></li>`
  }

  function makeCommentsTemplate(comments) {
    return comments.map(comment => makeCommentTemplate(comment)).join("")
  }

  function makeLanguageCard(language) {
    return `<div class='col m4'>
              <div class="parent">
                <div class="child bg-1 language-card" data-language-id=${language.id}>
                  <img src="${language.icon}">
                  <p class="language-card" data-language-id=${language.id}>${language.name}</p>
                </div>
              </div>
            </div>`
  }

  function makeLanguageCards(languages) {
    return languages.map(makeLanguageCard).join('')
  }

  function makePostTemplate(post) {
    let commentsTemplate = makeCommentsTemplate(post.comments)

    return `<div class="card" data-post-id="${post.id}">
              <div class="card-body" style="min-height: 13rem;">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.content}</p>

                <div>
                  <a href="#comments"><p class="view-comments-link">view comments</p></a>
                </div>

                <ul class="hidden-comments comments">
                  <h6><strong>Comments:</strong></h6>
                  ${commentsTemplate}
                  <li class="borderless">
                    <form class="new-comment-form" autocomplete="off">
                      <input type="text" name="new-comment-content">
                      <button type="submit" class="btn">submit comment</button>
                    </form>
                  </li>
                </ul>

                <a href="${post.repo_link}" class="btn btn-primary github-button post-go-to-repo" target="_blank" rel="noopener noreferrer">Go to repo</a>

              </div>
            </div>`
  }

  function makePostsTemplate(posts) {
    return posts.map(post => makePostTemplate(post)).join('')
  }

  function makeProjectCard(project) {
    return `
              <div class="col s6">
                <div class="card">
                  <div class="card-body" style="min-height: 13rem;">
                    <h5 class="card-title" data-project-id="${project.id}">${project.name} <button class="add-to-queue btn">+</button></h5>
                    <p class="card-text">${project.description}</p>
                    <a href="${project.url}" class="btn btn-primary github-button" target="_blank" rel="noopener noreferrer">Go to repo</a>
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
    let project = userProject.project
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

  function renderPosts(posts) {
    let template = makePostsTemplate(posts)
    forumContainer.innerHTML += template
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
    currentUser.innerText = user.name
    currentUser.dataset.userId = user.id
    signInBtn.parentElement.remove()
  }

  function renderQueue(queue) {
    let template = makeQueueCards(queue)
    queueCardContainer.innerHTML = `<h4 class="queue-head">Get started...</h4>` + template
  }

}
