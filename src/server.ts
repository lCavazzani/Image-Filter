import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get('/filteredimage',  function(req: Request, res: Response) {

    // Access the provided 'page' and 'limt' query parameters
    let { image_url } = req.query;

    const filteredImage = filterImageFromURL(image_url)
    .then((filteredpath:string) => {

      const filteredImages:Array<string> = [filteredpath]
      
      res.status(201).send(filteredpath);
      deleteLocalFiles(filteredImages)
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