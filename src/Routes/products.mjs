import{Router} from 'express';
import { mockProducts } from '../Utils/constants.mjs';


const router = Router();

router.get('/api/products', (request, response) => {
  response.send(mockProducts);
});

export default router;