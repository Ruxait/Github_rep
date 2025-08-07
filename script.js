const inputContainer = document.querySelector('.input-container')
const input = document.querySelector('.input')
const menu = document.querySelector('.menu')
const selectedRepos = document.querySelector('.selected-repos')

async function searchRep() {
  if (input.value.trim() === '') {
    menu.innerHTML = ''
    return
  }

  menu.innerHTML = ''

  const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
  const data = await response.json()
  console.log(data)
  data.items.slice(0, 5).forEach(rep => {
    createMenuElem(rep)
  })
}

const createMenuElem = rep => {
  const nameRep = document.createElement('li')
  nameRep.classList.add('menu__elem')
  nameRep.textContent = `${rep.name}`
  nameRep.dataset.name = rep.name
  nameRep.dataset.owner = rep.owner.login
  nameRep.dataset.stars = rep.stargazers_count
  menu.append(nameRep)
}

const createRepElem = (name, owner, stars) => {
  const repos = document.createElement('li')
  repos.classList.add('selected-repos__elem')
  repos.innerHTML = `Name: ${name}<br> 
  Owner: ${owner}<br> 
  Stars: ${stars}`

  const removeBtn = document.createElement('button')
  removeBtn.classList.add('button-remove')
  const img = document.createElement('img')
  img.classList.add('cross')
  img.src = 'red.png'
  img.alt = 'Удалить'
  removeBtn.append(img)
  removeBtn.addEventListener('click', () => {
    repos.remove()
    removeBtn.remove()
  })

  selectedRepos.append(repos)
  repos.append(removeBtn)
}

function debounce(cl, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cl.apply(this, args)
    }, delay)
  }
}

const debouncedSearch = debounce(searchRep, 500)

input.addEventListener('keyup', debouncedSearch)
document.addEventListener('click', event => {
  if (event.target.classList.contains('menu__elem')) {
    const name = event.target.dataset.name
    const owner = event.target.dataset.owner
    const stars = event.target.dataset.stars

    createRepElem(name, owner, stars)

    input.value = ''
    menu.innerHTML = ''
  }
})
