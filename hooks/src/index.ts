import express from "express";
const app = express()
import {PrismaClient } from "@prisma/client";

const client = new PrismaClient();

app.post("/hooks/catch/:userId/:zapdId", async (req,res)=>{
//store in db a new trigger
const userId = req.params.userId;
const zapId = req.params.zapdId;
const body = req.body;
await client.$transaction(async tx => {
    const run = await tx.zapRun.create({
        data: {
            zapId: zapId,
            metadata: body
        }
    });;

    await tx.zapRunOutbox.create({
        data: {
            zapRunId: run.id
        }
    })
})
res.json({
    message: "Webhook received"
})
//push it to kafka ques or reddis quese

})

app.listen(3002);