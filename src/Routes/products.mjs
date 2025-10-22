import { request, response, Router } from 'express';
import { mockProducts } from '../Utils/constants.mjs';
import { signedCookies } from 'cookie-parser';
import { product } from '../mongoose/schemas/productsSchema.mjs';
import { checkSchema, validationResult , matchedData} from 'express-validator';
import { createProductsValidationSchema } from '../Utils/validation-schemas.mjs';


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

router.post('/api/products', 
checkSchema(createProductsValidationSchema),
async (request, response) =>{
const result = validationResult(request);
if(!result.isEmpty) return response.send(result.array());

const data = matchedData(request);
console.log(data);

//if no error
const newProduct = new product(data)
try{
const savedProduct = await newProduct.save()
return response.status(201)
.send(savedProduct)
}catch(err) {
  console.log(err)
  return response.sendStatus(400)
}
})

export default router;