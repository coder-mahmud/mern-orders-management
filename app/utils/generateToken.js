import jwt from 'jsonwebtoken'
const generateToken = async (res,userId, rememberMe=true) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    // expiresIn: '30d'
    // expiresIn: rememberMe ? '30d' :'1d'
    expiresIn:  '30d'
  });

  res.cookie('jwt', token,{
    httpOnly:true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite:'strict',
    maxAge: 30*24*3600*1000
  })
}

export default generateToken;