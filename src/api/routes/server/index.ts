import {Request, Response, Router} from "express";

const serverRouter = Router()

serverRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json({status: 'All systems operational 🚀'})
})

serverRouter.get('/details', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'All systems operational 🚀',
        details: {
            platform: process.platform,
            architecture: process.arch,
            nodeVersion: process.version,
            v8Version: process.versions.v8,
            memoryUsage: {
                rss: process.memoryUsage().rss,
                heapTotal: process.memoryUsage().heapTotal,
                heapUsed: process.memoryUsage().heapUsed,
                external: process.memoryUsage().external,
            },
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage(),
            environment: process.env.NODE_ENV || 'not specified',
            features: process.features,
            release: {
                name: process.release.name,
                sourceUrl: process.release.sourceUrl,
                headersUrl: process.release.headersUrl
            },
            pid: process.pid,
            title: process.title,
        }
    })
})


export default serverRouter
