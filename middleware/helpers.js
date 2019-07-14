const bcrypt = require('bcrypt');

exports.comparePassword = (password, hPassword) => bcrypt.compareSync(password, hPassword);


exports.hashPassword = (password) => bcrypt.hashSync(password, 5);

