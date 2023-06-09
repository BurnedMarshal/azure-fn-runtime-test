/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as express from "express";
import {
  withRequestMiddlewares,
  wrapRequestHandler
} from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorInternal,
  IResponseSuccessJson,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";

import { Context } from "@azure/functions";
import { ContextMiddleware } from "@pagopa/io-functions-commons/dist/src/utils/middlewares/context_middleware";
import * as packageJson from "../../package.json";

import { ApplicationInfo } from "../../generated/definitions/ApplicationInfo";
import { FakeResource } from "../../utils/fake-resource";

// eslint-disable-next-line functional/no-let
let interval: NodeJS.Timer | undefined;
// eslint-disable-next-line functional/no-let
let sharedContext: Context | undefined;

type HelloWorldOneHandler = (
  context: Context
) => Promise<IResponseSuccessJson<ApplicationInfo> | IResponseErrorInternal>;

export const HelloWorldOneHandler = (
  fakeResource: FakeResource
): HelloWorldOneHandler => async (
  context: Context
): Promise<IResponseSuccessJson<ApplicationInfo> | IResponseErrorInternal> => {
  sharedContext = context;
  setTimeout(() => {
    clearInterval(interval);
    interval = undefined;
    sharedContext = undefined;
  }, 10);
  return ResponseSuccessJson({
    name: packageJson.name,
    name_from_builder: fakeResource.getName(),
    version: packageJson.version
  });
};

export const HelloWorldOne = (
  fakeResource: FakeResource
): express.RequestHandler => {
  interval = setInterval(() => {
    if (sharedContext) {
      sharedContext.log("This code was executed");
    }
  }, 10);
  const handler = HelloWorldOneHandler(fakeResource);
  const middlewareWrap = withRequestMiddlewares(ContextMiddleware());

  return wrapRequestHandler(middlewareWrap(handler));
};
