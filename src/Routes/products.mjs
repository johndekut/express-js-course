import { Router } from 'express';
import { mockProducts } from '../Utils/constants.mjs';
import { signedCookies } from 'cookie-parser';


const router = Router();

router.get('/api/products', (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies)
  console.log(signedCookies);
  if (request.signedCookies.hello && request.signedCookies.hello === "world")
    return response.send(mockProducts);
    return response
    .status(403)
    .send({msg: "sorry, you need the correct cookie"})
    
});

export default router;