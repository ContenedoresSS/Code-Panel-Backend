import type { Request, Response } from "express";
import type { RegisterUserRequest } from "../types/requests/register-user-request.model.js";
import authService from "../services/auth.service.js";
import { Prisma } from "@prisma/client"; // Importante para capturar los tipos de error
import type { LoginRequest } from "../types/requests/login-request.model.js";
import type { RefreshSessionRequest } from "../types/requests/refresh-session-request.model.js";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const registerData: RegisterUserRequest = req.body;
      const user = await authService.register(registerData);

      return res.status(201).json({ user });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const target = (error.meta?.target as string[]) || [];
          return res.status(409).json({
            error: `El campo ${target.join(", ")} ya está en uso.`,
            code: "UNIQUE_CONSTRAINT_VIOLATION",
          });
        }
      }

      return res.status(400).json({
        error: error.message || "Error inesperado al registrar usuario",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginRequest = req.body;
      const result = await authService.login(loginData);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        error: error.message || "Login failed",
      });
    }
  }

  async refreshSession(req: Request, res: Response) {
    try {
      const data: RefreshSessionRequest = req.body;
      const result = await authService.refreshAccessToken(data.refreshToken);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || "Refresh token failed",
      });
    }
  }
}

export default new AuthController();
