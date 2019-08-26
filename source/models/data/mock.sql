-- BEGIN TRANSACTION;

INSERT INTO
    authors(firstname, lastname, url)
VALUES
    ('Victor', 'Hugo', 'https://images-na.ssl-images-amazon.com/images/I/A1XeN78LvlL._UX250_.jpg');

INSERT INTO
    authors(firstname, lastname, url)
VALUES
    ('Jules', 'Verne', 'https://images-na.ssl-images-amazon.com/images/I/51kDXbS1pnL._UX250_.jpg');

INSERT INTO
    authors(firstname, lastname, url)
VALUES
    ('Boris', 'Vian', 'https://images-na.ssl-images-amazon.com/images/I/41HfF-o4UjL._UX250_.jpg');

INSERT INTO
    authors(firstname, lastname, url)
VALUES
    ('Herbert Georges', 'Wells', 'https://images-na.ssl-images-amazon.com/images/I/51QyjS15ExL._UX250_.jpg');

INSERT INTO
    categories(name)
VALUES
    ('fantastique');

INSERT INTO
    categories(name)
VALUES
    ('poésie');

INSERT INTO
    categories(name)
VALUES
    ('drame');

INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'Vingt mille lieues sous les mers',
        '1797933477',
        'https://images-na.ssl-images-amazon.com/images/I/613j7X1o8CL._SX331_BO1,204,203,200_.jpg',
        1,
        'Vingt mille lieues sous les mers est un roman d''aventures de Jules Verne, paru en 1869–1870.C''est le cinquième livre le plus traduit au monde (cent soixante-quatorze langues). Il a fait l''objet de nombreuses adaptations au cinéma, à la télévision ainsi qu''en bande dessinée.Le professeur Aronnax, son domestique Conseil et le harponneur Ned Land, qui cherchaient à capturer un fantastique monstre marin, se retrouvent prisonniers du capitaine Némo, à bord de son sous-marin le Nautilus.Quel lourd secret cache Némo pour vouloir les retenir ainsi à jamais ? C’est alors que parallèlement au fabuleux périple maritime qu’ils entament, s’engage une lutte psychologique et culturelle entre Aronnax et Némo.A l’envoûtement créé par les aventures et les découvertes fabuleuses, s’ajoute le piment des joutes scientifiques et historiques auxquelles s’adonnent le professeur et le capitaine. '
    );

INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'Voyage au centre de la Terre',
        '1797933456',
        'https://images-na.ssl-images-amazon.com/images/I/51TIY0eeh5L._SX329_BO1,204,203,200_.jpg',
        1,
        'Le professeur Lidenbrock est persuadé d''avoir découvert le chemin qui mène au centre de la Terre. Accompagné de son neveu Axel, l''impétueux géologue part en Islande. Là, au fond d''un volcan, les deux explorateurs et leur guide s''enfoncent dans les entrailles mystérieuses du globe. Un voyage d''une folle audace, véritable défi lancé à la science.'
    );

INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'L''écume des jours',
        '5499842886',
        'https://images-na.ssl-images-amazon.com/images/I/41IcGSA0I8L._SX307_BO1,204,203,200_.jpg',
        2,
        'Un titre léger et lumineux qui annonce une histoire d’amour drôle ou grinçante, tendre ou grave, fascinante et inoubliable, composée par un écrivain de vingt-six ans. C’est un conte de l’époque du jazz et de la science-fiction, à la fois comique et poignant, heureux et tragique, féerique et déchirant. Dans cette œuvre d’une modernité insolente, livre culte depuis plus de cinquante ans, Duke Ellington croise le dessin animé, Sartre devient une marionnette burlesque, la mort prend la forme d’un nénuphar, le cauchemar va jusqu’au bout du désespoir.
Mais seules deux choses demeurent éternelles et triomphantes : le bonheur ineffable de l’amour absolu et la musique des Noirs américains…'
    );

INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'J''irai cracher sur vos tombes',
        '5499842886',
        'https://images-na.ssl-images-amazon.com/images/I/411uFhy0f0L._SX307_BO1,204,203,200_.jpg',
        3,
        'Si vous le lisez avec l’espoir de trouver dans J’irai cracher sur vos tombes quelque chose capable de mettre vos sens en feu, vous allez drôlement être déçu.
Si vous le lisez pour y retrouver la petite musique de Vian, vous l’y trouverez. Il n’y a pas beaucoup d’écrits de Vian dont il ne suffise de lire trois lignes anonymes pour dire tout de suite : «Tiens, c’est du Vian !» Ils ne sont pas nombreux, les écrivains dont on puisse en dire autant. Ce sont généralement ces écrivains-là qui ont les lecteurs les plus fidèles, les plus passionnés, parce que, en les lisant, on les entend parler. Lire Vian, lire Léautaud, lire la correspondance de Flaubert, c’est vraiment être avec eux. Ils ne truquent pas, ils ne se déguisent pas. Ils sont tout entiers dans ce qu’ils écrivent. Ça ne se pardonne pas, ça. Vian a été condamné. Flaubert a été condamné… Delfeil de Ton.'
    );

INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'Les misérables',
        '5499842886',
        'https://images-na.ssl-images-amazon.com/images/I/51W2mjLTYCL._SX349_BO1,204,203,200_.jpg',
        3,
        'Le destin de Jean Valjean, forçat échappé du bagne, est bouleversé par sa rencontre avec Fantine. Mourante et sans le sou, celle-ci lui demande de prendre soin de Cosette, sa fille confiée aux Thénardier. Ce couple d’aubergistes, malhonnête et sans scrupules, exploitent la fillette jusqu’à ce que Jean Valjean tienne sa promesse et l’adopte. Cosette devient alors sa raison de vivre. Mais son passé le rattrape et l’inspecteur Javert le traque…'
    );


INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'L''Homme invisible',
        '2253004855',
        'https://images-na.ssl-images-amazon.com/images/I/413eTKRrZFL._SX307_BO1,204,203,200_.jpg',
        1,
        'L''hiver est morte saison à Iping. Aussi, quand l''étranger arrive à l''auberge, madame Hall décide-t-elle de choyer cet hôte providentiel. Il est pourtant bien étrange ! Brusque, coléreux, impatient, toujours emmitouflé de la tête aux pieds, retranché derrière d''épaisses lunettes. Vous qui avez rêvé un jour d''être invisible, cette histoire effroyable est pour vous...'
    );


INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'La machine à explorer le temps',
        '2210756707',
        'https://images-na.ssl-images-amazon.com/images/I/51JvZn2B9cL._SX359_BO1,204,203,200_.jpg',
        1,
        'Londres, fin du XIXe siècle. Un scientifique prétend avoir inventé une étrange machine à voyager dans le temps. Il raconte à ses amis son aventure en l''an 802701. Bloqué dans le futur, il y a découvert un monde décadent, où l''humanité, représentée par le peuple des Elois, mène une vie douce et insouciante. Cependant, il va s''apercevoir de l''existence d''une espèce souterraine des plus inquiétantes : les Morlocks...\r\n\r\nPublié en 1895, La Machine à explorer le temps est le premier roman d''H.G. Wells, l''un des pères de la science-fiction contemporaine. Critique sociale virulente, interrogation sur le sens de l''histoire et du progrès, description crédible d''un monde pourtant imaginaire, cette contre-utopie reste un classique indémodable, ayant inspiré jusqu''à nos jours des dizaines de variantes littéraires et cinématographiques.'
    );


INSERT INTO
    books(title, isbn, url, categories_id, summary)
VALUES
    (
        'Le Tour du monde en 80 jours',
        '2756047783',
        'https://images-na.ssl-images-amazon.com/images/I/61-m8CFpfsL._SX381_BO1,204,203,200_.jpg',
        1,
        'Londres, 1872. Le valet Passepartout entre au service du sévère et pointilleux Phileas Fogg. Ce dernier ayant parié quil ferait le tour du monde en quatre-vingts jours, ils embarquent tous les deux dès le lendemain pour un voyage semé dembûches. Mais ils ignorent quils sont suivis par un détective opiniâtre. Gageons que ce dernier ne parviendra pas à stopper leur formidable course contre la montre.'
    );

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (5,1);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (1,2);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (2,2);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (3,3);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (4,3);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (6,4);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (7,4);

INSERT INTO
    authors_books(books_id, authors_id)
VALUES
    (8,2);


-- COMMIT;
