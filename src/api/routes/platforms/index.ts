import {Router} from "express";
import {Request,Response} from "express";
import PlatformServices from "@core/services/platform.services";


const platformsRouter = Router()

platformsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
    const platformData = req.body
    const platform = await PlatformServices.createPlatform(platformData)
    res.status(201).json({
        status: 'success',
        message: 'Platform created',
        data: platform,
        meta: {
            timestamp: new Date().toISOString()
        }
    })
})

export default platformsRouter
