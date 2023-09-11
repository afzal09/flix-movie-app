const state = {
  currentpage: window.location.pathname,
};

// Init app

function router() {
  switch (state.currentpage) {
    case "/":
    case "/index.html":
        displayPopularMovies();
      break;
    case "/movie-details.html":
      console.log("Movie Details");
      break;
    case "/search.html":
      console.log("Search");
      break;
    case "/shows.html":
      console.log("Shows");
      break;
    case "/tv-details.html":
      console.log("TV Details");
      break;
  }
  highlightactivelink();
}
document.addEventListener("DOMContentLoaded", router);

function highlightactivelink() {
  const link = document.querySelectorAll(".nav-link");
  link.forEach((link) => {
    if (link.getAttribute("href") === state.currentpage)
      link.classList.add("active");
  });
}

// fetch Api Data 
async function FetchApiData (endpoint) {
    API_url = "https://api.themoviedb.org/3/"
    API_key = "76e353fa85bd1df2f7b5793d2b5dfeaa"
    const response = await fetch(`${API_url}${endpoint}?api_key=${API_key}&Language=en-US`);
    const result = await response.json();
    return result;
}

// diplay popular movies 
async function displayPopularMovies (){
    const {results} = await FetchApiData('movie/popular');
    results.forEach( movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            <img
          src="https://image.tmdb.org/t/p/w200${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`
        document.querySelector('#popular-movies').appendChild(div)
    })
}

