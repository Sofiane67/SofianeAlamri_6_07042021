const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });

    sauce.save()
    .then(() => res.status(201).json({message: "Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: "Sauce modifiée"}))
    .catch(error => res.status(400).json({error}));
};

exports.likesManager = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {

        const review = {};
        switch (req.body.like) {
            case 1:
                review.$inc = {likes : 1};
                review.$addToSet = { usersLiked: req.body.userId };
                break;
            case -1:
                review.$inc = { dislikes: 1 };
                review.$addToSet = { usersDisliked: req.body.userId };
                break;
            case 0:
                if (sauce.usersLiked.includes(req.body.userId)){
                    review.$inc = { likes: -1 };
                    review.$pull = { usersLiked: req.body.userId };
                }else{
                    review.$inc = { dislikes: -1 };
                    review.$pull = { usersDisliked: req.body.userId };
                }
                break;
            default:
                break;
        }

        Sauce.updateOne({ _id: req.params.id }, { ...review, _id:req.params.id})
        .then(() => res.status(200).json({message: "Mise à jour du like réussi"}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({error}))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimée"}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};