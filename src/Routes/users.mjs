import {Router} from 'express';
import {query, checkSchema, validationResult} from 'express-validator';

const router = Router(); 

router.get("/api/users", 
   checkSchema(userQuerySchema),
    (request, response) => {
      const result = validationResult(request); //collects all validation errors from above checks
      console.log(result);
      
      //if te result of the errors is not empty, present it as an array
      if(!result.isEmpty()); 
        return response.status(400).send({errors:result.array()});
      const { query: { filter, value } } = request;
  
      //when filters and values ar undefined
      if (!filter && !value) return response.send(mockUsers);
      if (filter && value) return response.send(
        mockUsers.filter((user) => user[filter]).includes(value)
      );
      return response.send(mockUsers);
    });

    export default router
  
