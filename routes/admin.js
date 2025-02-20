var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {

    res.render("admin/index")

});

router.get("/login", function (req, res, next) {
    console.log("Sessão ativa:");

    if (!req.session) {
        return next(new Error("A sessão não está configurada corretamente!"));
    }

    if (!req.session.views) req.session.views = 0;

    console.log(req.session.views++);
    console.log("Antes de renderizar login");

    res.render("admin/login");
});

router.get("/contacts", function (req, res, next) {

    res.render("admin/contacts")

});

router.get("/emails", function (req, res, next) {

    res.render("admin/emails")

});

router.get("/menus", function (req, res, next) {

    res.render("admin/menus")

});

router.get("/reservations", function (req, res, next) {

    res.render("admin/reservations", {
        date: {}
    });

});

router.get("/users", function (req, res, next) {

    res.render("admin/users")

});

module.exports = router;