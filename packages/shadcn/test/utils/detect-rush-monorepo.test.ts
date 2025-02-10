import path from "path"
import { expect, test } from "vitest"
import {detectRushMonoRepo} from '../../src/utils/detect-rush-monorepo';


test("detect rush mono repo", async () => {

  expect(
    await detectRushMonoRepo({cwd: path.resolve(__dirname, "../fixtures/project-rush")})
  ).toBeTruthy();

  expect(
    await detectRushMonoRepo({cwd: path.resolve(__dirname, "../fixtures/project-rush/packages/package-1")})
  ).toBeTruthy();

  expect(
    await detectRushMonoRepo({cwd: path.resolve(__dirname, "../fixtures/project-rush/apps/private-apps/private-app-1")})
  ).toBeTruthy();

});
