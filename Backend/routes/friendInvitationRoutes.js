const express = require("express");
const Joi = require("joi");

const router = express.Router();

const validator = require("express-joi-validation").createValidator({});

const auth = require("../middleware/auth");

const friendInvitationControllers = require("../controllers/friendInvitation/friendInvitationControllers");

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

const invitationDecisionSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const removeFriendSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

router.post(
  "/invite",
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.postInvite
);

router.post(
  "/accept",
  auth,
  validator.body(invitationDecisionSchema),
  friendInvitationControllers.postAccept
);

router.post(
  "/reject",
  auth,
  validator.body(invitationDecisionSchema),
  friendInvitationControllers.postReject
);

router.delete(
  "/remove/:id",
  auth,
  validator.params(removeFriendSchema),
  friendInvitationControllers.removeFriend
);

module.exports = router;