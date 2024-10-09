import { injectLambdaContext, Logger } from "@aws-lambda-powertools/logger";
import serverlessExpress from "@codegenie/serverless-express";
import middy from "@middy/core";
import cors from "cors";
import express, { Request, Response } from "express";


const app = express();
app.use(cors());
app.use(express.json());
const logger = new Logger();

app.get(
  "/animals/cat",
  async (req: Request, res: Response): Promise<void> => {
    logger.info(req.path);
    const response = {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animal: "cat" }),
    }

    res.header(response.headers);
    res.status(response.statusCode).send(response.body);
  },
);

export const handler = middy(serverlessExpress({ app })).use(
  injectLambdaContext(logger),
);