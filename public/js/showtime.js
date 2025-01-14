// JavaScript để thực hiện AJAX và thay đổi nội dung trang theo ngày
document.addEventListener('DOMContentLoaded', () => {
    const showtimesContainer = document.getElementById('showtimes-container');

    // Hàm gọi API để lấy dữ liệu showtimes theo ngày
    function loadShowtimes(date) {
        fetch(`/showtimes/${movie_id}?date=${date}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.showtimes) {
                    showtimesContainer.innerHTML = ''; // Clear current showtimes
                    data.showtimes.forEach(showtime => {
                        const div = document.createElement('div');
                        div.className = 'showtime-item';
                        div.innerHTML = `
                            <h4>${showtime.movie_title}</h4>
                            <p>Cinema: ${showtime.cinema.name}</p>
                            <p>Screen: ${showtime.screen.name}</p>
                            <p>Time: ${showtime.start_time} - ${showtime.end_time}</p>
                            <button class="btn btn-primary">Proceed to Checkout</button>
                        `;
                        showtimesContainer.appendChild(div);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching showtimes:', err);
            });
    }

    // Chạy khi người dùng chọn ngày từ giao diện
    document.querySelectorAll('.date-picker').forEach(datePicker => {
        datePicker.addEventListener('click', () => {
            const selectedDate = datePicker.dataset.date; // Lấy ngày đã chọn
            loadShowtimes(selectedDate);
        });
    });
});
