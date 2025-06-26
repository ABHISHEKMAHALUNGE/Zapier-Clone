"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
app.post("/hooks/catch/:userId/:zapdId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //store in db a new trigger
    const userId = req.params.userId;
    const zapId = req.params.zapdId;
    const body = req.body;
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        ;
        yield tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        });
    }));
    res.json({
        message: "Webhook received"
    });
    //push it to kafka ques or reddis quese
}));
app.listen(3002);
