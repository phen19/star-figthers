import joi from "joi";

export const schema ={
    fightSchema: joi.object().keys({
        firstUser: joi.string().required(),
        secondUser: joi.string().required()
    })
}