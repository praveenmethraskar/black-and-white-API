import { Request, Response, NextFunction } from "express"
import { route, POST, GET, before } from "awilix-express"
import { UserController } from "../controllers/user"
import { validateLoginRequest } from "../middleware/validators/loginValidator"
import { authenticate, authorize } from "../middleware/auth"
import { SupportRole } from "../model/enums/supportRole"

@route("/api/user")
export class UserRoutes {
  constructor(private userController: UserController) {}

  // POST /api/user/login
  @route("/login")
  @POST()
  @before([validateLoginRequest])
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.userController.login(req, res, next)
  }

  // GET /api/user/me
  @route("/me")
  @GET()
  @before([authenticate])
  async getProfile(req: Request, res: Response): Promise<void> {
    await this.userController.getProfile(req, res)
  }

  // GET /api/user/admin-only
  @route("/admin-only")
  @GET()
  @before([
    authenticate,
    authorize(SupportRole.SUPER_ADMIN, SupportRole.ADMIN),
  ])
  async adminOnly(req: Request, res: Response): Promise<void> {
    await this.userController.adminOnly(req, res)
  }
}