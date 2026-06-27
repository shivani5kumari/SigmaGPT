import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            userId: "000000000000000000000000", // sirf test ke liye
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save in DB" });
    }
});

// Get all threads of logged in user
router.get("/thread", authMiddleware, async (req, res) => {
    try {
        const threads = await Thread.find({
            userId: req.user.id
        }).sort({ updatedAt: -1 });

        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// Get one thread
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// Delete thread
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.id
        });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({
            success: "Thread deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Chat
router.post("/chat", authMiddleware, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    try {
        let thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {
            thread = new Thread({
                userId: req.user.id,
                threadId,
                title: message,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });
        } else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        res.json({
            reply: assistantReply
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

export default router;