import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { FakeResourceBuilder } from "../utils/fake-resource";
import { HelloWorldCompact } from "./handler";

// Setup Express
const app = express();
secureExpressApp(app);

const fakeResouce = FakeResourceBuilder("My Name");

// Add express route
app.get("/api/v1/hello", HelloWorldCompact(fakeResouce));

const azureFunctionHandler = createAzureFunctionHandler(app);

const httpStart: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
};

export default httpStart;
