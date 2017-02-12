var GrammarProductions = {
    "Start": [
        { nonTerminals: ["Corridor", "Corridor"], probability: 1.0 }
    ],
    "Quest": [
        { nonTerminals: ["Key","Door"], probability: 1.0 },
        { nonTerminals: ["Room"], probability: 0.1 }
    ],
    "Key": [
        { nonTerminals: ["Corridor", "Key"], probability: 1.0 },
        { nonTerminals: ["key"], probability: 0.2 }
    ],
    "Door": [
        { nonTerminals: ["Corridor", "Door"], probability: 1.0 },
        { nonTerminals: ["door", "Corridor"], probability: 0.4 },
        { nonTerminals: ["door"], probability: 0.4 }
    ],
    "Corridor": [
        { nonTerminals: ["Quest"], probability: 0.4 },
        { nonTerminals: ["Corridor", "Corridor"], probability: 1.0 },
        { nonTerminals: ["Corridor", "Room"], probability: 0.6 },
        { nonTerminals: ["corridor"], probability: 0.4 }
    ],
    "Room": [
        { nonTerminals: ["Room", "Room"], probability: 0.8 },
        { nonTerminals: ["oneEnemyRoom"], probability: 1.0 },
        { nonTerminals: ["twoEnemyRoom"], probability: 0.7 },
        { nonTerminals: ["threeEnemyRoom"], probability: 0.5 }
    ]
}

module.exports = GrammarProductions;
