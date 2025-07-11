const {createToken} = require("./jwt");

exports.userResponse = ({ id, first_name, last_name, email }) => ({
  first_name,
  last_name,
  email,
  token: createToken({ id, email }),
});