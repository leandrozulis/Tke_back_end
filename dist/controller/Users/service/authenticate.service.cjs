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

// dist/controller/Users/service/authenticate.service.js
var authenticate_service_exports = {};
__export(authenticate_service_exports, {
  authenticateUser: () => authenticateUser
});
module.exports = __toCommonJS(authenticate_service_exports);
var import_bcrypt = __toESM(require("bcrypt"), 1);

// dist/database/prisma.js
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// dist/services/User.service.js
var UserService = class {
  async findByUsername(username) {
    return await prisma.user.findUnique({
      where: {
        username
      }
    });
  }
};

// dist/controller/Users/service/authenticate.service.js
var userAuthService = new UserService();
async function authenticateUser(user, password) {
  const findUser = await userAuthService.findByUsername(user);
  const doesPasswordMatch = await import_bcrypt.default.compare(password, findUser.password);
  if (!doesPasswordMatch) {
    throw new Error("Usu\xE1rio incorreto.");
  }
  return {
    id: findUser.id,
    username: findUser.username,
    role: findUser.role
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateUser
});
