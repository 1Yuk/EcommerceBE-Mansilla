import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class DAOFactory {
    static getCartDAO() {
        return new CartRepository();
    }

    static getProductDAO() {
        return new ProductRepository();
    }

    static getUserDAO() {
        return new UserRepository();
    }

    static getTicketDAO() {
        return new TicketRepository();
    }

}

export default DAOFactory;
