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
const SDT_ATHLETES = [
    { name: 'Paixão', email: 'paixao@toqueplay.com' },
    { name: 'Linck', email: 'linck@toqueplay.com' },
    { name: 'Vargas', email: 'vargas@toqueplay.com' },
    { name: 'Pietro', email: 'pietro@toqueplay.com' },
    { name: 'Vini', email: 'vini@toqueplay.com' },
    { name: 'Deiv', email: 'deiv@toqueplay.com' },
    { name: 'Prass', email: 'prass@toqueplay.com' },
    { name: 'Eduardo', email: 'eduardo@toqueplay.com' },
    { name: 'Nicolas', email: 'nicolas@toqueplay.com' },
];
function makeGenericAthletes(teamPrefix, count) {
    return Array.from({ length: count }, (_, i) => ({
        name: `Atleta ${i + 1} ${teamPrefix}`,
        email: `atleta${i + 1}.${teamPrefix.toLowerCase().replace(/\s/g, '')}@toqueplay.com`,
    }));
}
const VR_ATHLETES = makeGenericAthletes('VR', 8);
const US_ATHLETES = makeGenericAthletes('US', 8);
const SM_ATHLETES = makeGenericAthletes('SM', 8);
const ALL_ATHLETES = [...SDT_ATHLETES, ...VR_ATHLETES, ...US_ATHLETES, ...SM_ATHLETES];
const TEAMS = [
    { name: 'Só Dois Toques', athletes: SDT_ATHLETES, captainIdx: 0 },
    { name: 'Vôlei Raiz', athletes: VR_ATHLETES, captainIdx: 0 },
    { name: 'Ultra Seven', athletes: US_ATHLETES, captainIdx: 0 },
    { name: 'Sierra Madre', athletes: SM_ATHLETES, captainIdx: 0 },
];
async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);
    const organizador = await prisma.user.upsert({
        where: { email: 'organizador@toqueplay.com' },
        update: {},
        create: {
            email: 'organizador@toqueplay.com',
            name: 'Organizador Teste',
            password: passwordHash,
            role: client_1.Role.ORGANIZADOR,
            isEmailVerified: true,
            isFirstAccess: false,
        },
    });
    console.log('Organizador OK');
    const userIds = {};
    for (const a of ALL_ATHLETES) {
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
        userIds[a.email] = user.id;
    }
    console.log(`${ALL_ATHLETES.length} atletas OK`);
    const teamIds = [];
    for (const t of TEAMS) {
        const captainEmail = t.athletes[t.captainIdx].email;
        const captainId = userIds[captainEmail];
        const existing = await prisma.team.findFirst({ where: { name: t.name, ownerId: captainId } });
        if (existing) {
            teamIds.push(existing.id);
            console.log(`  Time "${t.name}" já existe`);
            continue;
        }
        const team = await prisma.team.create({
            data: {
                name: t.name,
                ownerId: captainId,
                members: {
                    create: t.athletes.map((a, idx) => ({
                        userId: userIds[a.email],
                        isCaptain: idx === t.captainIdx,
                    })),
                },
            },
        });
        teamIds.push(team.id);
        console.log(`  Time "${t.name}" criado`);
    }
    const stageDate = new Date();
    stageDate.setDate(stageDate.getDate() + 10);
    stageDate.setHours(8, 0, 0, 0);
    const tournament = await prisma.tournament.create({
        data: {
            name: 'Copa ToquePlay Teste',
            description: 'Torneio de teste para validação do app',
            eventType: 'SINGLE',
            status: client_1.TournamentStatus.BRACKET_GENERATED,
            isPublished: true,
            ownerId: organizador.id,
            stages: {
                create: {
                    date: stageDate,
                    startTime: new Date(stageDate.getTime()),
                    maxTeams: 4,
                    city: 'Sapucaia do Sul',
                    state: 'RS',
                    street: 'R. Maj. de Souza Lima',
                    number: '467',
                    neighborhood: 'São José',
                    cep: '93218-240',
                    latitude: -29.813966,
                    longitude: -51.1433373,
                },
            },
            categories: {
                create: {
                    type: 'MALE',
                    format: 'SEXTET',
                    modality: 'COURT',
                    minMembers: 6,
                    maxMembers: 9,
                },
            },
        },
        include: { stages: true, categories: true },
    });
    const stage = tournament.stages[0];
    const category = tournament.categories[0];
    console.log(`Torneio "${tournament.name}" criado (${tournament.id})`);
    for (let i = 0; i < TEAMS.length; i++) {
        const captainEmail = TEAMS[i].athletes[TEAMS[i].captainIdx].email;
        const captainUserId = userIds[captainEmail];
        const teamMembers = await prisma.teamMember.findMany({
            where: { teamId: teamIds[i] },
        });
        await prisma.registration.create({
            data: {
                tournamentId: tournament.id,
                categoryId: category.id,
                teamId: teamIds[i],
                userId: captainUserId,
                status: client_1.RegistrationStatus.CONFIRMED,
                members: {
                    create: teamMembers.map((tm) => ({
                        teamMemberId: tm.id,
                        isCaptain: tm.isCaptain,
                    })),
                },
            },
        });
    }
    console.log('4 inscrições confirmadas');
    const bracket = await prisma.bracket.create({
        data: {
            tournamentId: tournament.id,
            categoryId: category.id,
            type: client_1.BracketType.ROUND_ROBIN,
        },
    });
    console.log(`Bracket criado (${bracket.id})`);
    const SDT = teamIds[0];
    const VR = teamIds[1];
    const US = teamIds[2];
    const SM = teamIds[3];
    const roundRobinMatches = [
        { round: 1, position: 0, teamA: SDT, teamB: SM },
        { round: 1, position: 1, teamA: VR, teamB: US },
        { round: 2, position: 0, teamA: SDT, teamB: US },
        { round: 2, position: 1, teamA: VR, teamB: SM },
        { round: 3, position: 0, teamA: SDT, teamB: VR },
        { round: 3, position: 1, teamA: US, teamB: SM },
    ];
    const matchIds = [];
    for (const m of roundRobinMatches) {
        const match = await prisma.match.create({
            data: {
                bracketId: bracket.id,
                round: m.round,
                position: m.position,
                status: client_1.MatchStatus.SCHEDULED,
                teamAId: m.teamA,
                teamBId: m.teamB,
            },
        });
        matchIds.push(match.id);
    }
    const thirdPlace = await prisma.match.create({
        data: {
            bracketId: bracket.id,
            round: 4,
            position: 0,
            status: client_1.MatchStatus.SCHEDULED,
        },
    });
    const finalMatch = await prisma.match.create({
        data: {
            bracketId: bracket.id,
            round: 4,
            position: 1,
            status: client_1.MatchStatus.SCHEDULED,
        },
    });
    console.log(`8 partidas criadas (6 round robin + 3º lugar + final)`);
    const linckId = userIds['linck@toqueplay.com'];
    const paixaoId = userIds['paixao@toqueplay.com'];
    for (const refId of [linckId, paixaoId]) {
        await prisma.tournamentReferee.create({
            data: {
                tournamentId: tournament.id,
                userId: refId,
            },
        });
    }
    console.log('Árbitros (Linck, Paixão) adicionados');
    console.log('\n✅ Seed completo!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Torneio: ${tournament.name}`);
    console.log(`Tournament ID: ${tournament.id}`);
    console.log(`Status: BRACKET_GENERATED`);
    console.log('Senha para todos: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Rodadas:');
    console.log('  1ª: Só Dois Toques x Sierra Madre | Vôlei Raiz x Ultra Seven');
    console.log('  2ª: Só Dois Toques x Ultra Seven  | Vôlei Raiz x Sierra Madre');
    console.log('  3ª: Só Dois Toques x Vôlei Raiz   | Ultra Seven x Sierra Madre');
    console.log('  + Disputa 3º lugar e Final');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Árbitros: linck@toqueplay.com, paixao@toqueplay.com');
    console.log('Organizador: organizador@toqueplay.com');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-torneio-teste.js.map