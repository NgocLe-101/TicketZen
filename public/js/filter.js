// Elements
const genresMenu = document.getElementById('genres-menu');
const filters = document.getElementById('filters');
const tabContent = document.querySelector('.tab-content');

// Function to fetch and render movies
async function fetchMovies(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  try {
    const response = await fetch(`/api/filter?${query}`);
    const data = await response.json();
    if (data.success) {
      renderMovies(data.data);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Function to render movies into the DOM
function renderMovies(movies) {
  tabContent.innerHTML = `
    <div id="tab-1" class="tab-pane fade show p-0 active">
      <div class="row g-4">
        ${movies.map((movie) => `
          <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp">
            <div class="product-item">
              <div class="position-relative bg-light overflow-hidden">
                <img class="img-fluid w-100 fixed-size" src="${movie.image_url}" alt="${movie.title}" />
                <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                  New
                </div>
              </div>
              <div class="text-center p-4">
                <a class="d-block h5 mb-2" href="/detail/${movie.id}">${movie.title}</a>
                <p class="text-clamp">${movie.description}</p>
              </div>
              <div class="d-flex border-top">
                <small class="w-50 text-center border-end py-2">
                  <a class="text-body" href="/detail/${movie.id}"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                </small>
                <small class="w-50 text-center py-2">
                  <a class="text-body" href="/cart/add/${movie.id}"><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
                </small>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Event Listener for Genres Dropdown
genresMenu.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    const genre = event.target.getAttribute('data-genre');
    fetchMovies({ genres: genre });
  }
});

// Event Listener for Tabs
filters.addEventListener('click', (event) => {
  if (event.target.classList.contains('filter-tab')) {
    event.preventDefault();
    const filter = event.target.getAttribute('data-filter');
    fetchMovies({ genres: filter });
  }
});

// Initial fetch (load all movies)
fetchMovies();
