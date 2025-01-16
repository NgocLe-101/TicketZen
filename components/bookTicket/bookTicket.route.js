import express from 'express';
const router  = express.Router();
import ShowtimeModel from "./showtime.model.js";
import SeatModel from "./seat.model.js";
import ProductModel from "../product/product.model.js";
import ScreenModel from "./screen.model.js";
import { format } from 'date-fns';

router.get('/showtimes/:movie_id', async (req, res) => {
    const { movie_id } = req.params;

    try {
        const showtimes = await ShowtimeModel.getShowTimeByMovieId(movie_id)
        if (!showtimes || showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for this movie.' });
        }

        // Định dạng thời gian
        const showtimesWithDetails = await Promise.all(
            showtimes.map(async (showtime) => {

                const screen = await ScreenModel.getScreenById(showtime.screen_id);
                const seats = await SeatModel.getSeatsByScreenId(screen?.id);

                const total_price = seats?.filter(seat => seat.status === 'available')
                    .reduce((acc, seat) => acc + seat.price, 0) || 0;

                // Định dạng lại thời gian bắt đầu và kết thúc
                const start_time = format(new Date(showtime.start_time), 'dd/MM/yyyy HH:mm');
                const end_time = format(new Date(showtime.end_time), 'dd/MM/yyyy HH:mm');

                return {
                    ...showtime,
                    screen: screen || { name: 'Unknown Screen' },
                    seats,
                    total_price,
                    start_time,
                    end_time
                };
            })
        );

        res.render('showtimes', { showtimes: showtimesWithDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
    }
});

router.get('/showtimes/:movie_id/seats', async (req, res) => {
    try {
        const movieId = req.params.movie_id;

        // Lấy thông tin phim theo movieId
        const movie_info = await ProductModel.getProductById(movieId);

        const screenId = req.query.screen_id;

        // Lấy danh sách ghế từ SeatModel theo screenId
        const seats = await SeatModel.getSeatsByScreenId(screenId);


        const seatsWithCalculatedPrices = seats.map(seat => {
            let seatPrice = movie_info.price;

            // Áp dụng tỷ lệ giá cho các loại ghế
            if (seat.seat_type === 2) {
                seatPrice *= 1.2; // Vàng *1.2
            } else if (seat.seat_type === 3) {
                seatPrice *= 1.5; // Bạch kim *1.5
            }

            return { ...seat, calculatedPrice: seatPrice };
        });
        // Trả về view seat_selection với danh sách ghế đã tính giá và thông tin phim
        return res.render('seat_selection', {
            seats: seatsWithCalculatedPrices,
            movie_info: movie_info,
        });
    } catch (error) {
        console.error('Error fetching seats:', error);
        return res.status(500).send('Internal server error');
    }
});



export default router;
