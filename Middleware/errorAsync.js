module.exports =  function (handler){//here the async function that we pass from route handler stored as an argument called handler
    return async (req, res, next) => {//then return an async function with calling handler (the async function that we passed) inside a try catch block, so we can pass the req and res
        try{
            await handler(req, res)
        } catch(ex){
            next(ex);
        }
    };
}