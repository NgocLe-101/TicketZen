$(document).ready(function () {
  // Loading indicator template
  const loadingHtml = `
        <div
      id="spinner"
      class="show w-100 h-100 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-white" role="status"></div>
    </div>
    `;
  function initPagination() {
    $(".pagination .page-link").click(function (e) {
      e.preventDefault();
      const url = $(this).attr("href");
      const page = url.split("page=")[1];

      // Update URL without reload
      history.pushState({ page }, "", url);

      const baseUrl = window.location.href.split("?")[0];
      loadProducts(`${baseUrl}/api?page=${page}&limit=4`);
    });
  }
  initPagination();
  // Handle pagination clicks

  // Handle browser back/forward
  window.onpopstate = function (e) {
    if (e.state) {
      loadProducts(window.location.href);
    }
  };

  function loadProducts(url) {
    const $productContainer = $("#movies-container");
    const $pagination = $("#pagination-container");
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    // Show loading indicator
    $productContainer.html(loadingHtml);

    // Scroll to top of products
    $("html, body").animate(
      {
        scrollTop: $productContainer.offset().top - 100,
      },
      200
    );

    // Load new content
    $.get(url)
      .done(function (response) {
        setTimeout(() => {
          // Clear the container
          $productContainer.empty();

          // Update products
          response.products.forEach((movie, index) => {
            const movieHtml = `
                        <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="${
                          0.1 + index * 0.2
                        }s">
                            <div class="product-item">
                                <div class="position-relative bg-light overflow-hidden">
                                    <img class="img-fluid w-100 fixed-size" src="${
                                      movie.image_url
                                    }" alt="" />
                                    <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                </div>
                                <div class="text-center p-4">
                                    <a class="h5 text-clamp-1 mb-2" href="/movies/${
                                      movie.id
                                    }">${movie.title}</a>
                                    <p class="text-clamp">${
                                      movie.description
                                    }</p>
                                </div>
                                <div class="d-flex border-top">
                                    <small class="w-50 text-center border-end py-2">
                                        <a class="text-body" href="/movies/${
                                          movie.id
                                        }"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                                    </small>
                                    <small class="w-50 text-center py-2">
                                        <a class="text-body add-cart-item" href="javascript:void(0)" data-id="${
                                          movie.id
                                        }"><i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart</a>
                                    </small>
                                </div>
                            </div>
                        </div>
                    `;
            $productContainer.append(movieHtml);
          });
          const totalPages = Math.ceil(response.total / response.limit);
          // Update pagination
          $pagination.empty();
          $pagination.append(createPaginationHtml(page, totalPages));
          initPagination();

          // Reinitialize WOW animations if using them
          if (typeof WOW !== "undefined") {
            new WOW().init();
          }
        }, 1);
      })
      .fail(function () {
        $productContainer.html("Failed to load data");
      });
  }

  function createPaginationHtml(page, totalPages) {
    let paginationHtml = '<ul class="pagination justify-content-center">';
    if (page > 1) {
      paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="?page=${
                      page - 1
                    }" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;
    }
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
                <li class="page-item ${page === i ? "active" : ""}">
                    <a class="page-link" href="?page=${i}">${i}</a>
                </li>`;
    }
    if (page < totalPages) {
      paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="?page=${
                      page + 1
                    }" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`;
    }
    paginationHtml += "</ul>";
    return paginationHtml;
  }
});
