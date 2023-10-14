const { User } = require("../models/user.js"); 

// Fungsi untuk mengambil daftar pengguna dengan paginasi
const getUsersWithPagination = async (page, limit) => {
  const offset = (page - 1) * limit;
const users = await User.findAll({
    offset,
    limit,
});
return users;
};

module.exports = {
getUsersWithPagination,

};