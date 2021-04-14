
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.vgssq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connexion à MongoDB réussie"))
.catch(() => console.log("Connexion à MongoDB échouée"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Definir le nombre de requêtes par IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: "Un nombre important de requête a été effectué depuis cette adresse IP, veuillez réessayer dans 1 heure"
});

//Définit des en-tête HTTP sécurisés
app.use(helmet());

//Limite le nombre de requêtes API pour une même adresse IP
app.use("/api", limiter);

app.use(express.json());

//Protection contre les injections NoSQL
app.use(mongoSanitize());

//Protection contre les attaques XSS
app.use(xssClean());

app.use("/images", express.static(path.join(__dirname, "images")));

//User
app.use("/api/auth", userRoutes);

//Sauce
app.use("/api/sauces", sauceRoutes);

module.exports = app;