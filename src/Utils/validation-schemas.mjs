 export const createUserValidationSchema= {
  userName: {
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
  },
  password:{
    notEmpty:{
      errorMessage:"password can not be empty"
    }
  }
}

export const userQuerySchema= {
  filter: {
    isString:{
      errorMessage:"filter must be a string"
    },
    notEmpty:{
      errorMessage:"filter must not be empty"
    },
    isLength:{
      options:{
        min:4,
        max: 20
      },
      errorMessage:"filter must be atleast 4 characters and a max of 20"
    }
  }

}