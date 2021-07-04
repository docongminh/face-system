const errors = {
    SERVER_ERR: { code: 5000, message: 'server.error' },
    PARAM_REQUIRED: { code: 1000, message: 'param.missing' },
    IMAGE_WRONG: { code: 1001, message: 'image.wrong' },
    PARAM_INVALID: { code: 1000, message: 'param.invalid' },
    FORBIDDEN_ACCESS: { code: 1003, message: 'resource.not_access' },
    NOT_FIND_OBJECT: { code: 1004, message: 'object.not_found' },
    FACE_EXISTED: { code: 1005, message: 'face.existed' },
    EXTRACT_FEAUTRE_ERROR: { code: 1006, message: 'image.extract_feauture_error' },
    SIMILAR_USER_EXIST: { code: 1007, message: 'face.existed' },
    MULTI_FACE: { code: 1008, message: 'image.multi_face' },
    NO_FACE: { code: 1009, message: 'image.no_face' },
    AUTHENTICATE_ERROR: { code: 1010, message: 'authenticate.fail' },
    PARAM_EMPTY: { code: 1011, message: 'param.empty' },
    NOT_MATCH: { code: 1012, message: 'param.not_match' },
    OBJECT_EXIST: { code: 1013, message: 'object.existed' },
    NOT_FIND_FILE: { code: 1014, message: 'file.not_found' },
    NOT_FIND_FOLDER: { code: 1015, message: 'folder.not_found' },
    FORMAT_NOT_ALLOW: { code: 1016, message: 'file.not_allow' },
    DECOMPRESS_ERROR: { code: 1017, message: 'decompress.error' },
    READ_FILE_ERROR: { code: 1018, message: 'file.error' },
    DATA_EMPTY: { code: 1019, message: 'file.empty' },
    CREATE_ERROR: { code: 1020, message: 'create.false'},
    USER_NOT_ACTIVE: { code: 1021, message: 'user.not_active' },
    COMPANY_NOT_ACTIVE: { code: 1022, message: 'company.not_active' },
    DENY_CHANGE: { code: 1023, message: 'field.deny' },
    PARAM_EXISTED: { code: 1024, message: 'param.existed' },
    ACCESS_DENY: { code: 1025, message: 'access.deny' },
    OBJECT_EXPIRED: { code: 1026, message: 'object.expired' },
    SERVICE_EXPIRED: { code: 1027, message: 'service.expired' },
    SERVICE_FALSE: { code: 1028, message: 'service.false' },
    OBJECT_MAX_LENGTH: { code: 1029, message: 'object.maxlength'},
    OBJECT_MAX_NUMBER: { code: 1030, message: 'number.maxNumber'},

    // device
    DEVICE_NOT_FIND_OBJECT: { code: 1104, message: 'object.not_found' },
    DEVICE_NOT_ACTIVATE: { code: 1103, message: 'device.not_activate' },
}

const authenErrors = {
    SERVER_ERR: { code: 5000, message: 'server.error' },
    PARAM_REQUIRED: { code: 3000, message: 'param.missing' },
    PARAM_INVALID: { code: 3001, message: 'param.invalid' },
    FORBIDDEN_ACCESS: { code: 3003, message: 'resource.not_access' },
    NOT_FIND_OBJECT: { code: 3004, message: 'object.not_found' },
    AUTHENTICATE_ERROR: { code: 3005, message: 'authenticate.fail' },
    USER_NOT_IN_COMPANY: { code: 3006, message: 'user.not_in_company' },
    USER_PAUSE_COMPANY: { code: 3008, message: 'user.pauseCompany' },
    USER_CANCEL_COMPANY: { code: 3009, message: 'user.cancelCompany' },
    SERVICE_EXPIRED : { code: 3010, message: 'service.expired' }
}


const code = {
    SUCESS_CODE: 200
}

const messageResponse = {
    LOGIN_SUCCESS: "login.success",
    REGISTER_SUCCESS: "register.success",
    LOGOUT_SUCCESS: "logout.success",
    CREATE_SUCESS: "create.success",
    GET_ALL_SUCESS: "getAll.success",
    GET_SUCCESS: "get.success",
    UPDATE_SUCESS: "update.success",
    DELETE_SUCESS: "delete.success",
    CHANGE_PASSWORD_SUCCESS: "changePassword.success",
    SEND_MAIL_SUCCESS: "sendMail.success",
    IMPORT_SUCCESS_AND_PROCESSING: "import.processing",
    EXPORT_SUCCESS: "export.success",
    RESET_PASSWORD_DEVICE_SUCCESS: "device.reset_password_success",
    SYNCHONIZE_DEVICE_SUCCESS: "device.synchonize_success",
};

const descs = {
    create_other_company: {
        ja: '',
        en: `You cannot create data for other company`,
    },
    create_other_group: {
        ja: '',
        en: `You cannot create data for other group`,
    },
    update_other_company: {
        ja: '',
        en: `You cannot update data for other company`,
    },
    update_group: {
        ja: '',
        en: `You cannot update this group`,
    },
    update_other_group: {
        ja: '',
        en: `You cannot update data for other scopes`,
    },
    delete_other_group: {
        ja: '',
        en: `You cannot delete data for other scopes`,
    },
}

module.exports = {
    errors,
    descs,
    messageResponse,
    code,
    authenErrors,
}
