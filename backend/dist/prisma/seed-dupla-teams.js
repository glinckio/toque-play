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
const SEED_EMAIL_DOMAIN = '@seed.toqueplay.com';
const PASSWORD = '123456';
const TEAMS = [
    {
        teamName: '[Seed] Dupla Areia 01',
        captain: { name: 'Rafael Costa', email: 'dupla01.captain' },
        partner: { name: 'Bruno Mendes', email: 'dupla01.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 02',
        captain: { name: 'Lucas Alves', email: 'dupla02.captain' },
        partner: { name: 'Thiago Ribeiro', email: 'dupla02.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 03',
        captain: { name: 'Felipe Santos', email: 'dupla03.captain' },
        partner: { name: 'Gustavo Lima', email: 'dupla03.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 04',
        captain: { name: 'Diego Ferreira', email: 'dupla04.captain' },
        partner: { name: 'Henrique Dias', email: 'dupla04.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 05',
        captain: { name: 'Marcos Oliveira', email: 'dupla05.captain' },
        partner: { name: 'André Souza', email: 'dupla05.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 06',
        captain: { name: 'Pedro Martins', email: 'dupla06.captain' },
        partner: { name: 'João Pereira', email: 'dupla06.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 07',
        captain: { name: 'Carlos Nunes', email: 'dupla07.captain' },
        partner: { name: 'Eduardo Campos', email: 'dupla07.parceiro' },
    },
    {
        teamName: '[Seed] Dupla Areia 08',
        captain: { name: 'Vinícius Rocha', email: 'dupla08.captain' },
        partner: { name: 'Matheus Barros', email: 'dupla08.parceiro' },
    },
];
function fullEmail(local) {
    return `${local}${SEED_EMAIL_DOMAIN}`;
}
async function cleanupPreviousSeed() {
    const seedUsers = await prisma.user.findMany({
        where: { email: { endsWith: SEED_EMAIL_DOMAIN } },
        select: { id: true },
    });
    if (seedUsers.length === 0)
        return;
    const seedUserIds = seedUsers.map((u) => u.id);
    await prisma.team.deleteMany({
        where: {
            OR: [
                { name: { startsWith: '[Seed] Dupla' } },
                { ownerId: { in: seedUserIds } },
            ],
        },
    });
    await prisma.user.deleteMany({
        where: { id: { in: seedUserIds } },
    });
}
async function upsertAthlete(name, emailLocal, passwordHash) {
    return prisma.user.upsert({
        where: { email: fullEmail(emailLocal) },
        update: {
            name,
            password: passwordHash,
            role: client_1.Role.ATLETA,
            isEmailVerified: true,
            isFirstAccess: false,
            status: 'ACTIVE',
        },
        create: {
            email: fullEmail(emailLocal),
            name,
            password: passwordHash,
            role: client_1.Role.ATLETA,
            isEmailVerified: true,
            isFirstAccess: false,
        },
    });
}
async function main() {
    console.log('Seeding 8 dupla teams (2 athletes each)...');
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    await cleanupPreviousSeed();
    const summary = [];
    for (const entry of TEAMS) {
        const captain = await upsertAthlete(entry.captain.name, entry.captain.email, passwordHash);
        const partner = await upsertAthlete(entry.partner.name, entry.partner.email, passwordHash);
        const team = await prisma.team.create({
            data: {
                name: entry.teamName,
                description: 'Time de dupla gerado pelo seed para testes de inscrição',
                sport: 'VOLEI',
                ownerId: captain.id,
                members: {
                    create: [
                        { userId: captain.id, isCaptain: true, isGuest: false },
                        { userId: partner.id, isCaptain: false, isGuest: false },
                    ],
                },
            },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        });
        await prisma.chat.create({
            data: {
                type: client_1.ChatType.INTRA_TEAM,
                teamId: team.id,
            },
        });
        summary.push({
            team: team.name,
            teamId: team.id,
            captainName: captain.name,
            captainEmail: captain.email,
            captainUserId: captain.id,
            partnerName: partner.name,
            partnerEmail: partner.email,
        });
    }
    console.log('\n✅ Seed concluído!\n');
    console.log(`Senha de todos os atletas: ${PASSWORD}\n`);
    console.log('── Use o CAPITÃO (dono) para inscrever o time no torneio ──\n');
    summary.forEach((row, index) => {
        console.log(`${index + 1}. ${row.team}`);
        console.log(`   Dono (capitão): ${row.captainName}`);
        console.log(`   Email login:    ${row.captainEmail}`);
        console.log(`   User ID:        ${row.captainUserId}`);
        console.log(`   Team ID:        ${row.teamId}`);
        console.log(`   Parceiro:       ${row.partnerName} (${row.partnerEmail})`);
        console.log('');
    });
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-dupla-teams.js.map