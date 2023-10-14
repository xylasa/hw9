const { Movie } = require("../models/movie.js"); 

// Fungsi untuk mengambil daftar film dengan paginasi
const getMoviesWithPagination = async (page, limit) => {
  const offset = (page - 1) * limit;
const movies = await Movie.findAll({
    offset,
    limit,
});
return movies;
};

module.exports = {
getMoviesWithPagination,

};
