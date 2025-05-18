const { body, validationResult, param } = require("express-validator");

exports.validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");
  if (errors.isEmpty()) return next();
  else throw new Error(errorMessages);
};

exports.registerValidator = () => [
  body("name").notEmpty().withMessage("Please enter name"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Please enter password"),
  body("skills").notEmpty().withMessage("Please enter skills"),
];

exports.loginValidator = () => [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Please enter password"),
];

exports.changePasswordValidator = () => [
  body("oldPassword").notEmpty().withMessage("Please enter your old password"),
  body("newPassword").notEmpty().withMessage("Please enter a new password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password"),
];

exports.updateProfileValidator = () => [
  body("name")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please enter your new name"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please enter a valid new email"),
  body("username")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Username cannot be empty"),
  body("nickname")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Nickname cannot be empty"),
  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage("Please enter a valid date of birth"),
  body("nationality")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Nationality cannot be empty"),
  body("bio")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Bio cannot be empty"),
  body("phone")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Phone number cannot be empty"),
  body("address")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Address cannot be empty"),
  // File validation for avatar and resume should be handled separately if needed,
  // as it's not typically part of body/field validation with express-validator
];

exports.deleteAccountValidator = () => [
  body("password")
    .notEmpty()
    .withMessage("Please enter your password to delete your account"),
];

exports.jobValidator = () => [
  body("title").notEmpty().withMessage("Please enter title"),
  body("description").notEmpty().withMessage("Please enter description"),
  body("companyName").notEmpty().withMessage("Please enter company name"),
  body("location").notEmpty().withMessage("Please enter location"),
  body("logo").notEmpty().withMessage("Please enter logo URL"),
  body("skillsRequired").notEmpty().withMessage("Please enter skills required"),
  body("experience").notEmpty().withMessage("Please enter experience"),
  body("salary").notEmpty().withMessage("Please enter salary"),
  body("category").notEmpty().withMessage("Please enter category"),
  body("employmentType").notEmpty().withMessage("Please enter employment type"),
];

exports.JobIdValidator = () => [
  param("id", "Please provide Job Id").notEmpty(),
];

exports.applicationIdValidator = () => [
  param("id", "Please provide corect Application Id").notEmpty(),
];

exports.userIdValidator = () => [
  param("id", "Please provide corect Application Id").notEmpty(),
];
