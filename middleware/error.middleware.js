   
const errorMiddleware = async (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;

        //Mongoose bad ObjectId 
        if(err.name === 'CastError') {
           const error = new Error('Resource not found');
           error.statusCode = 400;
        }

        //Mongoose Duplicate Key 
        if(err.code === 11000) {
           const error = new Error('Duplicate key found');
           error.statusCode = 404;
        }

        //Mongoose Validation 
        if(err.name === 'ValidationError') {
           const error = new Error(Object.values(err.errors).map(val => val.message).join(', '));
           error.statusCode = 404;
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server error'});
         } catch (error) {
          next(error);        
         }
        };
        
      export default errorMiddleware;
 