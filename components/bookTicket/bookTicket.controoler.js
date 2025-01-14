
class bookTicketControoler {
    async getSeat(req, res){
        res.render('seat_selection')
    }
}

export default new bookTicketControoler();