import express from "express";
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { ConvertHourStringMinutes } from "./utils/ConvertHourStringMinutes";
import { ConvertMinutesToHourString } from "./utils/ConvertMinutesToHourString";

const app = express();

app.use(express.json());

app.use(cors());

const prisma = new PrismaClient({
    log: ["query"]
});

app.get("/games", async (req, res) => {

    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });
    return res.json(games);

});

app.post('/games/:id/ads', async (request, response) => {
    const idGame = request.params.id

    const body: any = request.body

    const ad = await prisma.ad.create({
        data: {
            idGame,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: ConvertHourStringMinutes(body.hourStart),
            hourEnd: ConvertHourStringMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(ad)
})

app.get("/games/:id/ads", async (req, res) => {

    const idGame = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            idGame,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(","),
            hourStart: ConvertMinutesToHourString(ad.hourStart),
            hourEnd: ConvertMinutesToHourString(ad.hourEnd)
        }
    }));

});

app.get("/ads/:id/discord", async (req, res) => {

    const idAd = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: idAd
        }
    });

    return res.json({
        discord: ad.discord
    });

});

app.listen(3333);