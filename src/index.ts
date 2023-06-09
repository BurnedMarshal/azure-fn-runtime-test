import { AzureFunction, Context } from "@azure/functions";
import * as express from "express";
import { secureExpressApp } from "@pagopa/io-functions-commons/dist/src/utils/express";
import { setAppContext } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import createAzureFunctionHandler from "@pagopa/express-azure-functions/dist/src/createAzureFunctionsHandler";
import { FakeResourceBuilder } from "../utils/fake-resource";
import { HelloWorldOne, HelloWorldTwo, HelloWorldThree } from "./handlers";

// Setup Express
const app = express();
secureExpressApp(app);
// Setup shared Azure function handler
const azureFunctionHandler = createAzureFunctionHandler(app);

// Setup Resources
const fakeResouce = FakeResourceBuilder("My Name");

// eslint-disable-next-line sonarjs/no-unused-collection, functional/prefer-readonly-type
const contextArray: Array<Context | undefined> = [
  undefined,
  undefined,
  undefined
];

contextArray
  .filter(context => context)
  .forEach(context =>
    context?.log("Function Execution: ", context.invocationId)
  );

// Mount API routes
app.get("/api/v1/hello/one", HelloWorldOne(fakeResouce));
app.get("/api/v1/hello/two", HelloWorldTwo(fakeResouce));
app.get("/api/v1/hello/three", HelloWorldThree(fakeResouce));

export const HelloWorldOneFn: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
  // Override previous context;
  // eslint-disable-next-line functional/immutable-data
  contextArray[0] = context;
};
export const HelloWorldTwoFn: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
  // Override previous context;
  // eslint-disable-next-line functional/immutable-data
  contextArray[1] = context;
};
export const HelloWorldThreeFn: AzureFunction = (context: Context): void => {
  setAppContext(app, context);
  azureFunctionHandler(context);
  // Override previous context;
  // eslint-disable-next-line functional/immutable-data
  contextArray[2] = context;
};
