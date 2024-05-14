import cluster from 'cluster';
import express, { Request, Response } from 'express';
import { MathMLToLaTeX } from './main'; // Adjust the import path based on your project structure

// const app = express();
// const port = process.env.PORT || 3000;

const numCPUs = 2;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  app.post('/convert', async (req: Request, res: Response) => {
    try {
      const mathml: string = req.body.mathml;
      // console.log(mathml);
      if (!mathml) {
        res.status(400).json({ error: 'No MathML content provided.' });
        return;
      }
      const latex = MathMLToLaTeX.convert(mathml);
      // console.log(latex);
      res.json({ latex });
    } catch (error) {
      // Using a type guard to check if error is an Error
      console.log(error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error', details: 'An unknown error occurred' });
      }
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
