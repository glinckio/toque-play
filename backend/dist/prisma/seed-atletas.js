"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const ATLETAS = [
    { name: 'João Silva', email: 'joao@toqueplay.com' },
    { name: 'Maria Santos', email: 'maria@toqueplay.com' },
    { name: 'Pedro Lima', email: 'pedro@toqueplay.com' },
    { name: 'Ana Costa', email: 'ana@toqueplay.com' },
    { name: 'Lucas Oliveira', email: 'lucas@toqueplay.com' },
    { name: 'Julia Ferreira', email: 'julia@toqueplay.com' },
    { name: 'Rafael Souza', email: 'rafael@toqueplay.com' },
    { name: 'Camila Alves', email: 'camila@toqueplay.com' },
    { name: 'Bruno Pereira', email: 'bruno@toqueplay.com' },
    { name: 'Larissa Martins', email: 'larissa@toqueplay.com' },
    { name: 'Gabriel Rocha', email: 'gabriel@toqueplay.com' },
    { name: 'Fernanda Dias', email: 'fernanda@toqueplay.com' },
];
const TIMES = [
    { name: 'Trovão VC', captain: 0, members: [0, 1, 2, 3, 4, 5] },
    { name: 'Fúria Vôlei', captain: 6, members: [6, 7, 8, 9, 10, 11] },
];
async function main() {
    console.log('Seeding atletas + times...');
    const passwordHash = await bcrypt.hash('123456', 10);
    const userIds = [];
    for (const a of ATLETAS) {
        const user = await prisma.user.upsert({
            where: { email: a.email },
            update: {},
            create: {
                email: a.email,
                name: a.name,
                password: passwordHash,
                role: client_1.Role.ATLETA,
                isEmailVerified: true,
                isFirstAccess: false,
            },
        });
        userIds.push(user.id);
    }
    console.log(`${ATLETAS.length} atletas created.`);
    for (const t of TIMES) {
        const captainId = userIds[t.captain];
        const existing = await prisma.team.findFirst({ where: { name: t.name, ownerId: captainId } });
        if (existing) {
            console.log(`  Time "${t.name}" already exists, skipping.`);
            continue;
        }
        const team = await prisma.team.create({
            data: {
                name: t.name,
                ownerId: captainId,
                members: {
                    create: t.members.map((idx) => ({
                        userId: userIds[idx],
                        isCaptain: idx === t.captain,
                    })),
                },
            },
        });
        console.log(`  Time "${t.name}" created (${team.id})`);
    }
    console.log('\nSeed completed!');
    console.log('Senha para todos: 123456');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-atletas.js.map