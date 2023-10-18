const express = require("express");
const router = express.Router();
const { registerUser,
    loginUser,
    logoutUser,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUserDetailByAdmin,
    updateUserRole,
    deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authentication")


router.route("/user/register").post(registerUser);

router.route("/user/login").post(loginUser);

router.route("/user/logout").get(logoutUser);

router.route("/user/me").get(isAuthenticatedUser, getUserDetails);

router.route("/user/me/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/user/me/profile/update").put(isAuthenticatedUser, updateProfile);

router.route("/user/admin/allusers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router.route("/user/admin/control/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUserDetailByAdmin)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = router;