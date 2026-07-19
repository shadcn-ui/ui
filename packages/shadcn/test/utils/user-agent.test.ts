import { getUserAgent } from "../../src/utils/user-agent"; import { expect, test } from "vitest"; test("userAgent", () => { expect(typeof getUserAgent()).toBe("string"); });
