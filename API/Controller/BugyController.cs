using Microsoft.AspNetCore.Mvc;

namespace API.Controller{
    public class BuggyController : BaseApiController{

        [HttpGet("not-found")]
        public ActionResult GetNotFound(){
            return NotFound();
        }
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest(){
            return BadRequest(new ProblemDetails{Title="This is a bad request"});
        }    
        
        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorized(){
            return Unauthorized();
        }   
        
         [HttpGet("validation-error")]
        public ActionResult GetValidationError(){
            ModelState.AddModelError("Problem 1 " , "This is first problem");
            ModelState.AddModelError("Problem2" , "This is second problem");
            return ValidationProblem();
        }    
        
        [HttpGet("server-error")]
        public ActionResult GetServerError(){
            throw new Exception("This is a server error");
        } 

    }
}