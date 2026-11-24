const cinemaRepository = require('../repositories/cinemaRepository');

class ConcessionService {
  getMenu(category) {
    let items = cinemaRepository.findAllConcessions();
    if (category && category !== 'All') {
      items = items.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    return items;
  }
}

module.exports = new ConcessionService();
