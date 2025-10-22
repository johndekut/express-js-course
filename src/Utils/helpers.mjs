import bcrypt from  'bcrypt';

//saltRounds control how much randomness is added when hashing passwords: the more the ~ te stronger the password
const saltRounds = 10;
export const hashPassword = (password) =>{
  //generate the salt
  const salt =bcrypt.genSaltSync(saltRounds)
  console.log(salt)
  return bcrypt.hashSync(password, salt);
  
}

export const comparePassword = (plain, hashed) =>{
  bcrypt.compareSync(plain, hashed)
}