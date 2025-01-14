import express from 'express';
const router  = express.Router();
import ShowtimeModel from "./showtime.model.js";
import SeatModel from "./seat.model.js";
import ScreenModel from "./screen.model.js";
import CinemaModel from "./cinema.model.js";
import { format } from 'date-fns';

router.get('/showtimes/:movie_id', async (req, res) => {
    const { movie_id } = req.params;

    try {
        const showtimes = await ShowtimeModel.getShowTimeByMovieId(movie_id);
        if (!showtimes || showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for this movie.' });
        }

        // Định dạng thời gian
        const showtimesWithDetails = await Promise.all(
            showtimes.map(async (showtime) => {

                const screen = await ScreenModel.getScreenById(showtime.screen_id);
                const cinema = await CinemaModel.getCinemaById(screen?.cinema_id);
                const seats = await SeatModel.getSeatsByScreenId(screen?.id);

                const total_price = seats?.filter(seat => seat.status === 'available')
                    .reduce((acc, seat) => acc + seat.price, 0) || 0;

                // Định dạng lại thời gian bắt đầu và kết thúc
                const start_time = format(new Date(showtime.start_time), 'dd/MM/yyyy HH:mm');
                const end_time = format(new Date(showtime.end_time), 'dd/MM/yyyy HH:mm');

                return {
                    ...showtime,
                    cinema: cinema || { name: 'Unknown Cinema' },
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

export default router;
