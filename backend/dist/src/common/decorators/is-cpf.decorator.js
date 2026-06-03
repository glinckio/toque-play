"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCpf = IsCpf;
const class_validator_1 = require("class-validator");
const cpf_service_1 = require("../services/cpf.service");
const cpfService = new cpf_service_1.CpfService();
function IsCpf(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isCpf',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    return typeof value === 'string' && cpfService.isValid(value);
                },
                defaultMessage() {
                    return 'Invalid CPF';
                },
            },
        });
    };
}
//# sourceMappingURL=is-cpf.decorator.js.map