import express from "express";

const app = express();

app.get("/games", (req, res) => {

    return res.json([]);

});

app.post("/ads", (req, res) => {

    return res.status(201).json([]);

});

app.get("/games/:id/ads", (req, res) => {

    const idGame = req.params.id;

    return res.json([
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
    ]);

});

app.get("/ads/:id/discord", (req, res) => {

    const idAds = req.params.id;

    return res.json([
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
        { id: 1, name: "Kevin" },
    ]);

});

app.listen(3333);