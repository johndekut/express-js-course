 const createUserValidationSchemas= {
  username: {
    isLength:{
      options:{
        min:5,
        max:32
      },
      errorMessage:"user name must be atleast 5 characters and a max of 32 characters"
    },
    notEmpty: {
      errorMessage:"user name can not be empty"
    },
    isString:{
      errorMessage:"user name must be a string!"
    }
  }, 
  displayName:{
    notEmpty:{
      errorMessage: "display name can not be empty!"
    }
  }
}

export default createUserValidationSchemas