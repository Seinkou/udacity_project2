import express from 'express';
import { Response, Request } from 'express';
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
  app.get("/filteredimage", async (req: Request, res:Response) => {
    let image_url = req.query.image_url.toString();

    if(!image_url){
      res.status(400).send('URL is required');
    }

    //Process Image
    const filteredImage:string =await filterImageFromURL(image_url);
    console.log(filteredImage);
    if(filteredImage===undefined||filteredImage===null)
      return res.status(401).send(`Unable to filter image`);
    else{
      try {
      res.status(200).sendFile(filteredImage, () => {
        deleteLocalFiles([filteredImage])
      });}
      catch(err){
        res.status(422).send("Error to filter Image")
      }

    }

  })

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();