const express = require("express");
const router = express.Router();

const profileRoutes = require("./profileRoutes");
const productRoutes = require("./productRoutes");
const basketRoutes = require("./basketRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");

router.use("/profiles", profileRoutes);
router.use("/products", productRoutes);
router.use("/baskets", basketRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
