const express = require("express");
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware"); // Import the auth middleware
const router = express.Router();

router.route('/list')
    .get(auth, userController.list);
router.route('/signup')
    .post(userController.registerUser);
router.route('/login')
    .post(userController.loginUser);

router.route('/admin')
    .post(userController.loginAdmin);

router.route('/contact')
    .post(auth, userController.createcontact);
router.route('/listcontact')
    .get(auth, userController.listContact);

// Quiz routes
router.route('/quiz/create')
    .post(auth, userController.createQuizQuestion);

router.route('/quiz/questions')
    .get(auth, userController.getQuizQuestions);

router.route('/quiz/update/:id')
    .put(auth, userController.updateQuizQuestion);
router.route('/quiz/delete/:id')
    .delete(auth, userController.deleteQuizQuestion);

module.exports = router;
