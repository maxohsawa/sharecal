const router = require("express").Router();
const userRoutes = require("./User");

// /api/user routes
router.use("/user", userRoutes);

module.exports = router;
