// Sự kiện cho nút Search
document.getElementById('search-btn').addEventListener('click', function() {
    let searchQuery = document.getElementById('search-box').value;
    let genre = document.getElementById('genre').value;
    let language = document.getElementById('language').value;
    let age = document.getElementById('age').value;
    let rate = document.getElementById('rate').value;
    let maxPrice = document.getElementById('price-max').value;

    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?search=${encodeURIComponent(searchQuery)}&genre=${genre}&language=${language}&age=${age}&rate=${rate}&maxPrice=${maxPrice}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/search/result' + queryString;
});

// Sự kiện cho nút Price Filter
document.getElementById('price-filter-btn').addEventListener('click', function() {
    let genre = document.getElementById('genre').value;
    let language = document.getElementById('language').value;
    let age = document.getElementById('age').value;
    let rate = document.getElementById('rate').value;
    let maxPrice = document.getElementById('price-max').value;

    // Tạo URL với các tham số lọc dưới dạng query string
    let queryString = `?genre=${genre}&language=${language}&age=${age}&rate=${rate}&maxPrice=${maxPrice}`;

    // Chuyển hướng đến trang với các tham số lọc
    window.location.href = '/search/result' + queryString;
});
