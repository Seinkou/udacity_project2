import express from 'express';
import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

   // GET /filteredimage?image_url={{URL}}
  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req, res) => {
    const image_url = req.query.image_url.toString();

    if(!image_url){
      res.status(400).send('URL is required');
    }

    // Function to checks the validity of a URL, We use Regex     
    function isValidURL(str: string) {
      if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
           return 'YES';
       } else {
           return 'NO';
       }
   }
   let valide = isValidURL(image_url);
    if(valide == 'NO')
      res.status(401).send('Inavlid url! please Check URL again');
    else{
    //Process Image
      const filteredImage:string =await filterImageFromURL(image_url);
      console.log(filteredImage);
      if(filteredImage===undefined||filteredImage===null)
        return res.status(401).send(`Unable to filter image`);
      else{
        res.status(200).sendFile(filteredImage, () => {
          deleteLocalFiles([filteredImage])
        });

      }
    }


   })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();

/*
  Reference : https://snyk.io/blog/secure-javascript-url-validation/#:~:text=Another%20way%20to%20validate%20a,)%20%7B%20var%20res%20%3D%20string.
            : https://github.com/mshivam76/image-filter-starter-code/blob/master/src/server.ts
*/