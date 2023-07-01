"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/tool.ts
var import_utils = require("@usefoundry/utils");
var import_zod = require("zod");
var import_crypto = __toESM(require("crypto"), 1);
var RandomTool = class {
  constructor() {
  }
  randomInteger = (0, import_utils.makeFunction)(
    import_zod.z.object({
      type: import_zod.z.enum(["positive", "negative", "any"])
    }).describe("Generates a random integer number without specific boundaries"),
    async ({ type }) => {
      if (type === "positive") {
        return import_crypto.default.randomInt(0, Number.MAX_SAFE_INTEGER);
      }
      if (type === "negative") {
        return import_crypto.default.randomInt(Number.MIN_SAFE_INTEGER, 0);
      }
      return import_crypto.default.randomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
  );
};
var tool_default = RandomTool;

// src/index.ts
var src_default = tool_default;
