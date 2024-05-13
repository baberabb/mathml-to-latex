import express, { Request, Response } from 'express';
import { MathMLToLaTeX } from './main'; // Adjust the import path based on your project structure

const app = express();
const port = 3000;

app.use(express.json());

app.post('/convert', async (req: Request, res: Response) => {
  try {
    const mathml: string = req.body.mathml;
    console.log(mathml);
    if (!mathml) {
      res.status(400).json({ error: 'No MathML content provided.' });
      return;
    }
    const latex = MathMLToLaTeX.convert(mathml);
    console.log(latex);
    res.json({ latex });
  } catch (error) {
    // Using a type guard to check if error is an Error
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
