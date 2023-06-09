/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as express from "express";
import { wrapRequestHandler } from "@pagopa/io-functions-commons/dist/src/utils/request_middleware";
import {
  IResponseErrorInternal,
  IResponseSuccessJson,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";

import * as packageJson from "../../package.json";

import { ApplicationInfo } from "../../generated/definitions/ApplicationInfo";
import { FakeResource } from "../../utils/fake-resource";

type HelloWorldThreeHandler = () => Promise<
  IResponseSuccessJson<ApplicationInfo> | IResponseErrorInternal
>;

export const HelloWorldThreeHandler = (
  fakeResource: FakeResource
): HelloWorldThreeHandler => async (): Promise<
  IResponseSuccessJson<ApplicationInfo> | IResponseErrorInternal
> =>
  ResponseSuccessJson({
    name: packageJson.name,
    name_from_builder: fakeResource.getName(),
    version: packageJson.version
  });

export const HelloWorldThree = (
  fakeResource: FakeResource
): express.RequestHandler => {
  const handler = HelloWorldThreeHandler(fakeResource);

  return wrapRequestHandler(handler);
};
