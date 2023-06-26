const router = require("express").Router();
const userGetRoutes = require("./UserGet");
const userPostRoutes = require("./UserPost");
const userPutRoutes = require("./UserPut");
const userDeleteRoutes = require("./UserDelete");

router.use("/get", userGetRoutes);
router.use("/post", userPostRoutes);
router.use("/put", userPutRoutes);
router.use("/delete", userDeleteRoutes);

module.exports = router;
