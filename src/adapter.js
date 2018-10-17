BASE_URL = `http://localhost:3000/`
//BASE_URL = `https://deadc0de.herokuapp.com/`

const headers = {
  "Content-Type": "application/json",
  "Accepts": "application/json"
}

const Adapter = {

  create: function(pluralModel, object) {
    return fetch(`${BASE_URL}${pluralModel}`, {
    	method: 'POST',
    	headers: headers,
    	body: JSON.stringify(object)
    }).then(resp => resp.json())
  },

  getNested: function(filter, id, pluralModel) {
    return fetch(`${BASE_URL}${filter}/${id}/${pluralModel}`)
      .then(resp => resp.json())
  },

  get: function(pluralModel) {
    return fetch(`${BASE_URL}${pluralModel}`)
      .then(resp => resp.json())
  },

  getLanguageProjects: function(languageId){
    return fetch(`${BASE_URL}languages/${languageId}`)
    .then(resp => resp.json())
  },

  update: function(pluralModel, id, object) {
    return fetch(`${BASE_URL}${pluralModel}/${id}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(object)
    }).then(resp => resp.json())
  },

  destroy: function(pluralModel, id) {
    return fetch(`${BASE_URL}${pluralModel}/${id}`, {
    	method: 'DELETE',
    	headers: headers
    })
  }
}
