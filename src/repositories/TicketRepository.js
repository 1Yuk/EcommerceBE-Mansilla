import Ticket from "../models/Ticket.js";

class TicketRepository {
    constructor() {
    }
    async createTicket(ticketData) {
        try {
            const newTicket = new Ticket(ticketData);
            return await newTicket.save();
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            throw error;
        }
    }
}

export default TicketRepository;
