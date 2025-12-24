"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/services/User.service.js
var User_service_exports = {};
__export(User_service_exports, {
  default: () => UserService
});
module.exports = __toCommonJS(User_service_exports);

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
