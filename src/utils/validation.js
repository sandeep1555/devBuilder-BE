const validator = require("validator")

const validateSignUpFeild = (body) => {
    const { firstName, lastName, emailId, password, group } = body

    if (!firstName) {
        throw new Error("Enter your FirstName");
    }
    else if (!lastName) {
        throw new Error("Enter your LastName");
    }
    else if (!firstName > 3 || !firstName > 40) {
        throw new Error("FirstName characters should be in the range 3-40")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter Strong password")
    }
    else if (!group) {
        throw new Error("Please select  your user type")
    }
}

const validateLoginFeild = (body) => {
    const { emailId, password } = body;

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id")
    }
    else if (!password) {
        throw new Error("Please Enter Strong password")
    }

}

const validateEditProfileData = (req) => {
    const editableFeild = ["firstName", 'lastName', 'age', 'gender', 'about', 'skills', 'photoURL']
    const isEditableFeild = Object.keys(req.body).every(feild => editableFeild.includes(feild));
    return isEditableFeild

}

// constants.js

const ROLE_OWN_PERMISSIONS = [
    "add_organisation",
    "view_organisation",
    "change_organisation",
    "delete_organisation",
    "add_organisationemployee",
    "view_organisationemployee",
    "change_organisationemployee",
    "delete_organisationemployee",
    "add_project",
    "view_project",
    "change_project",
    "delete_project",
    "add_projectassignee",
    "view_projectassignee",
    "change_projectassignee",
    "delete_projectassignee",
    "add_attendance",
    "view_attendance",
    "change_attendance",
    "delete_attendance",
    "add_task",
    "view_task",
    "change_task",
    "delete_task",
    "add_category",
    "view_category",
    "change_category",
    "delete_category",
    "add_contractor",
    "view_contractor",
    "change_contractor",
    "delete_contractor",
    "add_tag",
    "view_tag",
    "change_tag",
    "delete_tag",
    "add_comment",
    "view_comment",
    "change_comment",
    "delete_comment"
];

const ROLE_PROJECT_MANAGER_PERMISSIONS = [
    "add_organisationemployee",
    "organisation",
    "organisationemployee",
    "view_organisationemployee",
    "change_organisationemployee",
    "delete_organisationemployee",
    "add_project",
    "project",
    "view_project",
    "change_project",
    "delete_project",
    "add_projectassignee",
    "projectassignee",
    "view_projectassignee",
    "change_projectassignee",
    "delete_projectassignee",
    "add_attendance",
    "contractor",
    "attendance",
    "view_attendance",
    "change_attendance",
    "delete_attendance",
    "add_task",
    "task",
    "view_task",
    "change_task",
    "delete_task",
    "add_category",
    "category",
    "view_category",
    "change_category",
    "delete_category",
    "add_contractor",
    "contractor",
    "view_contractor",
    "change_contractor",
    "delete_contractor",
    "add_tag",
    "tag",
    "view_tag",
    "change_tag",
    "delete_tag",
    "add_comment",
    "comment",
    "view_comment",
    "change_comment",
    "delete_comment"
]

const ROLE_PROJECT_SUPERVISOR_PERMISSIONS = [
    "view_project",
    "project",
    "view_task",
    "task",
    "change_task",
    "view_category",
    "category",
    "view_tag",
    "tag",
    "add_comment",
    "comment",
    "view_comment",
    "change_comment",
    "delete_comment",
    "add_attendance",
    "contractor",
    "view_attendance",
    "change_attendance",
    "delete_attendance"
]


const getRandomLightColor = () => {
    const colors = [
        "#e4e4e7", // zinc-200
        "#e5e5e5", // neutral-200
        "#e7e5e4", // stone-200
        "#bfdbfe", // blue-200
        "#c7d2fe", // indigo-200
        "#e9d5ff", // purple-200
        "#fbcfe8", // pink-200
        "#a5f3fc", // cyan-200
        "#bae6fd", // sky-200
        "#ddd6fe", // violet-200
        "#99f6e4", // teal-200
        "#fed7aa", // orange-200
        "#fde68a", // amber-200
        "#d9f99d", // lime-200
        "#a7f3d0"  // emerald-200
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};






module.exports = { validateSignUpFeild, validateEditProfileData, ROLE_OWN_PERMISSIONS, validateLoginFeild, ROLE_PROJECT_MANAGER_PERMISSIONS, ROLE_PROJECT_SUPERVISOR_PERMISSIONS, getRandomLightColor }