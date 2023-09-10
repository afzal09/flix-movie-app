const state = {
  currentpage: window.location.pathname,
};

// Init app

function router() {
  switch (state.currentpage) {
    case "/":
    case "/index.html":
      console.log("Home");
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
