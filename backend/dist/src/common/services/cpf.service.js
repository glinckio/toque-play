"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpfService = void 0;
const common_1 = require("@nestjs/common");
const app_error_1 = require("../errors/app-error");
let CpfService = class CpfService {
    validate(cpf) {
        if (!this.isValid(cpf)) {
            throw app_error_1.AppError.invalidCpf();
        }
    }
    isValid(cpf) {
        if (!/^\d{11}$/.test(cpf))
            return false;
        if (/^(\d)\1{10}$/.test(cpf))
            return false;
        const digits = cpf.split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += digits[i] * (10 - i);
        }
        let check = (sum * 10) % 11;
        if (check === 10)
            check = 0;
        if (check !== digits[9])
            return false;
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += digits[i] * (11 - i);
        }
        check = (sum * 10) % 11;
        if (check === 10)
            check = 0;
        if (check !== digits[10])
            return false;
        return true;
    }
};
exports.CpfService = CpfService;
exports.CpfService = CpfService = __decorate([
    (0, common_1.Injectable)()
], CpfService);
//# sourceMappingURL=cpf.service.js.map