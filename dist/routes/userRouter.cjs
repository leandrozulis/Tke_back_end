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

// dist/routes/userRouter.js
var userRouter_exports = {};
__export(userRouter_exports, {
  default: () => userRouter_default
});
module.exports = __toCommonJS(userRouter_exports);
var import_express = __toESM(require("express"), 1);

// dist/controller/Users/service/authenticate.service.js
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

// dist/utils/jwt.js
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = String(process.env.JWT_SECRET);
var EXPIRES_IN = "7d";
function generateToken(payload) {
  return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}
function verifyToken(token) {
  return import_jsonwebtoken.default.verify(token, JWT_SECRET);
}

// dist/controller/Users/users.controller.js
var UserController = class {
  async login(req, res) {
    try {
      const { user, password } = req.body;
      if (!user || !password) {
        return res.status(400).json({ error: "Missing credentials." });
      }
      const auth = await authenticateUser(user, password);
      const token = generateToken({
        id: auth.id,
        role: auth.role,
        username: auth.username
      });
      res.status(200).json({
        message: "User authenticated successfully.",
        role: auth.role,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// dist/middleware/auth.js
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token missing." });
    return;
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
    return;
  }
}

// dist/routes/userRouter.js
var router = import_express.default.Router();
var userController = new UserController();
router.post("/api/login", (req, res) => {
  userController.login(req, res);
});
router.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});
var userRouter_default = router;
