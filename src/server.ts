import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8000;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get('/filteredimage',  function(req: Request, res: Response) {

    let { image_url } = req.query;

    if (!image_url) {
      res.status(400).send("Invalid URl");
    }

    const filteredImage = filterImageFromURL(image_url)
    .then((filteredpath:string) => {

      const filteredImages:Array<string> = [filteredpath]
      
      res.status(200).sendFile(filteredpath, (e) => {
        if (e) return res.status(422).send("Unable to filter image");
      deleteLocalFiles([filteredpath]);
      });
    })
    .catch((e) => {
      res.send(422).send("Error filtering image");
    });
    // Return the articles to the rendering engine
  });
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();