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
      displayMovieDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
    case "/shows.html":
      displayPopular_TvShows();
      break;
    case "/tv-details.html":
      ;
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
    ShowSpinner();
    const response = await fetch(`${API_url}${endpoint}?api_key=${API_key}&Language=en-US`);
    const result = await response.json();
    HideSpinner();
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

// display movie details

async function displayMovieDetails () {
  const movieId = window.location.search.split("=")[1];
  const movie = await FetchApiData(`movie/${movieId}`);
  console.log(movie)
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
    ${
      movie.poster_path ?`
    <a href="movie-details.html?id=${movie.id}">
            <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`
    :`<img
      src="../images/no-image.jpg"
      class="card-img-top"
      alt="Movie Title"
    />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">${movie.genres.map((movie) => `<li>${movie.name}</li>`).join(" ")}
    </ul>
    <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
    <li><span class="text-secondary">Runtime:</span> ${addCommasToNumber(movie.runtime)} minutes</li>
    <li><span class="text-secondary">Status:</span> ${addCommasToNumber(movie.status)}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies.map((company) => company.name).join(" , ")}</div>
</div>` 
document.querySelector("#movie-details").appendChild(div);
}
// Regex for adding commas to numbers

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// display popular tv shows

async function displayPopular_TvShows (){
  const {results} = await FetchApiData('tv/popular');
  results.forEach( tv => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
      <a href="movie-details.html?id=${tv.id}">
          <img
        src="https://image.tmdb.org/t/p/w200${tv.poster_path}"
        class="card-img-top"
        alt="${tv.name}"
      />
      </a>
      <div class="card-body">
        <h5 class="card-title">${tv.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${tv.first_air_date}</small>
        </p>
      </div>`
      document.querySelector('#popular-shows').appendChild(div)
  })
}

// spinner animation
function ShowSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function HideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}