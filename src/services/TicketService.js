import TicketRepository from '../repositories/TicketRepository.js';

class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
    }
    async createTicket(ticketData) {
        try {
            if (!ticketData || !ticketData.user || !ticketData.totalPrice) {
                throw new Error("Datos del ticket incompletos");
            }
            return await this.ticketRepository.createTicket(ticketData);
        } catch (error) {
            console.error('Error en TicketService al crear el ticket:', error);
            throw error;
        }
    }

}

export default TicketService;
