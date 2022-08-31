import { Router } from "express";
import { fight } from "../controllers/fightController";
import { schema } from "../schema/schema";

const fightRouter = Router();

fightRouter.post("/battle", schema, fight);