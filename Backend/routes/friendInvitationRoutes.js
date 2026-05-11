const express = require("express");
const Joi = require("joi");

const router = express.Router();

const validator =
  require("express-joi-validation").createValidator({});

const auth = require("../middleware/auth");

const friendInvitationControllers =
  require("../controllers/friendInvitation/friendInvitationControllers");

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

// SEND INVITATION
const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string()
    .email()
    .required(),
});

// ACCEPT / REJECT INVITATION
const invitationDecisionSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required(),
});

// REMOVE FRIEND
const removeFriendSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required(),
});

// =====================================================
// SEND FRIEND INVITATION
// POST /api/friend-invitation/invite
// =====================================================
router.post(
  "/invite",
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.postInvite
);

// =====================================================
// ACCEPT INVITATION
// POST /api/friend-invitation/accept
// =====================================================
router.post(
  "/accept",
  auth,
  validator.body(invitationDecisionSchema),
  friendInvitationControllers.postAccept
);

// =====================================================
// REJECT INVITATION
// POST /api/friend-invitation/reject
// =====================================================
router.post(
  "/reject",
  auth,
  validator.body(invitationDecisionSchema),
  friendInvitationControllers.postReject
);

// =====================================================
// REMOVE FRIEND
// DELETE /api/friend-invitation/remove/:id
// =====================================================
router.delete(
  "/remove/:id",
  auth,
  validator.params(removeFriendSchema),
  friendInvitationControllers.removeFriend
);

module.exports = router;