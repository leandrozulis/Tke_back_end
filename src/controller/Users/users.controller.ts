import { Request, Response } from "express";
import { authenticateUser } from "./service/authenticate.service";
import { generateToken } from "../../utils/jwt";

export class UserController {

  async login(req: Request, res: Response) {

    try {
      const { user, password } = req.body;

      if (!user || !password) {
        return res.status(400).json({ error: 'Missing credentials.' });
      }

      const auth = await authenticateUser(user, password);

      const token = generateToken({
        id: auth.id,
        role: auth.role,
        username: auth.username,
      });

      res.status(200).json({
        message: 'User authenticated successfully.',
        role: auth.role,
        token
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }

  }

}