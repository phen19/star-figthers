import { Request, Response } from 'express';
import * as fightService from "../services/fightService.js"

export async function getRanking(req: Request, res: Response){
    const ranking = await fightService.getRanking();
    res.send(ranking)
}

export async function fight(req: Request, res: Response) {

    const {firstUser, secondUser} : {firstUser: string, secondUser: string} = req.body

    if(!firstUser || !secondUser){
        return res.sendStatus(422);
    }

    const result = await fightService.fight(firstUser, secondUser);
    res.send(result);
}