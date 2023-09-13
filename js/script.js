const global = {
  currentpage: window.location.pathname,
  search: {
    type: " ",
    term: " ",
    page: 1,
    total_pages: 1,
  },
  api:{
    key:"76e353fa85bd1df2f7b5793d2b5dfeaa",
    url:"https://api.themoviedb.org/3/"
  }
};

// Init app

function router() {
  switch (global.currentpage) {
    case "/":
    case "/index.html":
        displayPopularMovies();
        displaySlider();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      search();
      break;
    case "/shows.html":
      displayPopular_TvShows();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
  }
  highlightactivelink();
}
document.addEventListener("DOMContentLoaded", router);

// search Api data

async function SearchApiData () {
  API_url = global.api.url;
  API_key = global.api.key;
  ShowSpinner();
  const response = await fetch(`${API_url}search/${global.search.type}?api_key=${API_key}&Language=en-US&query=${global.search.term}`);
  const result = await response.json();
  HideSpinner();
  return result;
}

// fetch Api Data 

async function FetchApiData (endpoint) {
    API_url = global.api.url;
    API_key = global.api.key;
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
  backgroundImage('movie', movie.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
    ${
      movie.poster_path ?`
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

// display show details

async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await FetchApiData(`tv/${showId}`);

  // Overlay for background image
  backgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
/>`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#show-details').appendChild(div);
}

//search movies & tv 

async function search() {
  const query = window.location.search;
  const urlparams = new URLSearchParams(query);
  global.search.type = urlparams.get('type');
  global.search.term = urlparams.get('search-term');
    
  // alert 
  
  if (global.search.term !== " " && global.search.term !== null) {
    const { results , total_pages, page} = await SearchApiData();
    if (results.length === 0) {
      showalert('no movie found');
      return;
    }
    displaySearchResults(results);
  }else{
    showalert("enter search term");
  }
}

// SearchResults

function displaySearchResults(results){
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
             alt="${
               global.search.type === 'movie' ? result.title : result.name
             }"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `;

    document.querySelector('#search-results').appendChild(div);
  });
}

// alert 

function showalert(message,classname = 'error') {
const alert = document.createElement("div");
alert.classList.add('alert',classname);
alert.appendChild(document.createTextNode(message))
document.querySelector('#alert').appendChild(alert)
setTimeout(() => alert.remove(), 3000);
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
      <a href="tv-details.html?id=${tv.id}">
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

// background overlay image

function backgroundImage(type,path){
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// swipper slider 

async function displaySlider() {
  const { results } = await FetchApiData("movie/now_playing")
  results.forEach((movie) => {
  const div = document.createElement("div");
  div.classList.add("swiper-slide")
  div.innerHTML = `
  <a href="movie-details.html?id=${movie.id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
  </h4>`
  document.querySelector(".swiper-wrapper").appendChild(div);
  initSwiper();
  });  
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// highlight active links 

function highlightactivelink() {
  const link = document.querySelectorAll(".nav-link");
  link.forEach((link) => {
    if (link.getAttribute("href") === state.currentpage)
      link.classList.add("active");
  });
}
