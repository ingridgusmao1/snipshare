
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    créé_le TIMESTAMPTZ DEFAULT NOW(),
    visibilité VARCHAR(20) DEFAULT 'public' CHECK (visibilité IN ('public', 'privé'))
);

CREATE TABLE snippet (
    id SERIAL PRIMARY KEY,
    id_utilisateur INT NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    langage VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    créé_le TIMESTAMPTZ DEFAULT NOW(),
    visibilité VARCHAR(20) DEFAULT 'public' CHECK (visibilité IN ('public', 'privé', 'non-répertorié'))
);

CREATE TABLE étiquette (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    usage INT DEFAULT 0
);


CREATE TABLE commenté (
    id SERIAL PRIMARY KEY,
    id_utilisateur INT NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    id_snippet INT NOT NULL REFERENCES snippet(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    créé_le TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE aimé (
    id_utilisateur INT NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    id_snippet INT NOT NULL REFERENCES snippet(id) ON DELETE CASCADE,
    créé_le TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id_utilisateur, id_snippet)
);

CREATE TABLE possède (
    id_snippet INT NOT NULL REFERENCES snippet(id) ON DELETE CASCADE,
    id_étiquette INT NOT NULL REFERENCES étiquette(id) ON DELETE CASCADE,
    PRIMARY KEY (id_snippet, id_étiquette)
);


CREATE VIEW snippet_avec_likes AS
SELECT 
    s.*,
    COALESCE(COUNT(a.id_snippet), 0) AS nb_likes
FROM snippet s
LEFT JOIN aimé a ON s.id = a.id_snippet
GROUP BY s.id;


CREATE INDEX idx_commenté_snippet ON commenté(id_snippet);
CREATE INDEX idx_commenté_utilisateur ON commenté(id_utilisateur);
CREATE INDEX idx_aimé_snippet ON aimé(id_snippet);
CREATE INDEX idx_possède_étiquette ON possède(id_étiquette);
CREATE INDEX idx_snippet_utilisateur ON snippet(id_utilisateur);
CREATE INDEX idx_snippet_visibilité ON snippet(visibilité);
CREATE INDEX idx_snippet_langage ON snippet(langage);


INSERT INTO utilisateur (nom_utilisateur, email, mot_de_passe) VALUES
('marie.dubois', 'marie.dubois@collectivite.fr', '$argon2id$v=19$m=65536,t=3,p=4$randomsalt$hashedpassword'),
('jean.martin', 'jean.martin@collectivite.fr', '$argon2id$v=19$m=65536,t=3,p=4$randomsalt$hashedpassword'),
('sophie.laurent', 'sophie.laurent@collectivite.fr', '$argon2id$v=19$m=65536,t=3,p=4$randomsalt$hashedpassword');

INSERT INTO étiquette (nom, usage) VALUES
('javascript', 15),
('validation', 12),
('email', 8),
('regex', 7),
('react', 18),
('hooks', 14),
('sql', 10),
('postgresql', 9),
('python', 11);

INSERT INTO snippet (id_utilisateur, titre, langage, code, description, visibilité) VALUES
(1, 'Fonction de validation email', 'JavaScript', 
'function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}', 
'Valide une adresse email avec une regex simple', 'public'),

(2, 'Requête SQL optimisée', 'SQL',
'SELECT u.nom_utilisateur, COUNT(s.id) as total
FROM utilisateur u
LEFT JOIN snippet s ON u.id = s.id_utilisateur
GROUP BY u.id
ORDER BY total DESC;',
'Compte le nombre de snippets par utilisateur', 'public'),

(3, 'Hook React personnalisé', 'TypeScript',
'function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || '''';
  });
  
  return [value, setValue];
}',
'Hook pour gérer le localStorage en React', 'public');

INSERT INTO possède (id_snippet, id_étiquette) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 7), (2, 8),
(3, 5), (3, 6), (3, 1);

INSERT INTO aimé (id_utilisateur, id_snippet) VALUES
(2, 1), (3, 1), (1, 2), (3, 2), (1, 3), (2, 3);

INSERT INTO commenté (id_utilisateur, id_snippet, contenu) VALUES
(2, 1, 'Très utile, merci !'),
(3, 1, 'Je l''utilise dans mon projet'),
(1, 2, 'Excellente requête SQL'),
(2, 3, 'Ce hook est génial !');