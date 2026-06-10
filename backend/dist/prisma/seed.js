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
const PASSWORD = '123456';
async function main() {
    console.log('Seeding database...\n');
    const hash = await bcrypt.hash(PASSWORD, 10);
    await prisma.user.upsert({
        where: { email: 'admin@toqueplay.com' },
        update: { name: 'Super Admin', password: hash, role: client_1.Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false, status: 'ACTIVE' },
        create: { email: 'admin@toqueplay.com', name: 'Super Admin', password: hash, role: client_1.Role.SUPER_ADMIN, isEmailVerified: true, isFirstAccess: false },
    });
    for (let i = 1; i <= 24; i++) {
        const padded = String(i).padStart(2, '0');
        await prisma.user.upsert({
            where: { email: `atleta${padded}@seed.toqueplay.com` },
            update: { name: `Atleta ${padded}`, password: hash, role: client_1.Role.ATLETA, isEmailVerified: true, isFirstAccess: false, status: 'ACTIVE' },
            create: { email: `atleta${padded}@seed.toqueplay.com`, name: `Atleta ${padded}`, password: hash, role: client_1.Role.ATLETA, isEmailVerified: true, isFirstAccess: false },
        });
    }
    const teamNames = [
        'Trovao', 'Furacao', 'Tsunami', 'Relampago', 'Avalanche', 'Tempestade',
        'Vulcao', 'Ciclone', 'Tornado', 'Maremoto', 'Glaciador', 'Fenix',
    ];
    for (let i = 0; i < 12; i++) {
        const a1email = `atleta${String(i * 2 + 1).padStart(2, '0')}@seed.toqueplay.com`;
        const a2email = `atleta${String(i * 2 + 2).padStart(2, '0')}@seed.toqueplay.com`;
        const a1 = await prisma.user.findUnique({ where: { email: a1email } });
        const a2 = await prisma.user.findUnique({ where: { email: a2email } });
        if (!a1 || !a2)
            continue;
        await prisma.team.create({
            data: {
                name: teamNames[i],
                description: 'Time gerado pelo seed',
                sport: 'VOLEI',
                ownerId: a1.id,
                members: {
                    create: [
                        { userId: a1.id, isCaptain: true, isGuest: false },
                        { userId: a2.id, isCaptain: false, isGuest: false },
                    ],
                },
            },
        });
        console.log(`  ${teamNames[i]} criado`);
    }
    console.log('');
    console.log('Seed completo!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Senha para todos: ${PASSWORD}`);
    console.log('Admin:     admin@toqueplay.com');
    console.log('Atletas:   atleta01@seed.toqueplay.com ate atleta24@seed.toqueplay.com');
    console.log('Times:     12 duplas (capitao = atleta impar)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map