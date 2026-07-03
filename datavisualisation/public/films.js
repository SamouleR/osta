const csvFilmsRaw = `Rank,Title,Director,Year,Country,Diffusions,LastDiffusion
1,Le Capitan,Hunebelle André,1960,FR / IT,25,2013
2,Ne nous fâchons pas,Lautner Georges,1965,FR,24,2013
3,La Tulipe Noire,Christian-Jaque,1963,FR / IT / ES,24,2012
4,Le Pacha,Lautner Georges,1967,FR / IT,23,2013
5,Le Grand Restaurant,Besnard Jacques,1966,FR,23,2013
6,Deux heures moins le quart avant Jésus-Christ,Yanne Jean,1982,FR,22,2013
7,Le Bossu,Hunebelle André,1959,FR / IT,22,2011
8,La Vache et le Prisonnier,Verneuil Henri,1959,FR / IT,22,2013
9,La Traversée de Paris,Autant-Lara Claude,1956,FR / IT,22,2012
10,Le Passe-Muraille,Jean Boyer,1951,FR / IT,21,2012
11,Le Gendarme de Saint-Tropez,Girault Jean,1964,FR / IT,21,2013
12,Oscar,Molinaro Edouard,1967,FR,21,2013
13,Hibernatus,Molinaro Edouard,1969,FR / IT,21,2013
14,Pouic-Pouic,Girault Jean,1963,FR,21,2011
15,La Cuisine au beurre,Grangier Gilles,1963,FR / IT,21,2013
16,La Grande Vadrouille,Oury Gérard,1966,FR / GB,21,2012
17,Le Corniaud,Oury Gérard,1965,FR / IT,21,2011
18,Les Tontons Flingueurs,Lautner Georges,1963,FR / DE / IT,21,2012
19,Le Comte de Monte-Cristo (1),Autant-Lara Claude,1961,FR / IT,21,2010
20,Les Grandes Vacances,Girault Jean,1967,FR / IT,20,2013
21,Les Misérables (1),Le Chanois Jean-Paul,1958,FR / IT / DE,20,2010
22,Le Gendarme se marie,Girault Jean,1968,FR / IT,20,2013
23,Le Gendarme en balade,Girault Jean,1970,FR / IT,20,2013
24,Le Mur de l'Atlantique,Camus Marcel,1970,FR / IT,20,2013
25,Flic ou voyou,Lautner Georges,1979,FR,20,2013
26,Papy fait de la résistance,Poiré Jean-Marie,1983,FR,20,2011
27,La Ligne de démarcation,Chabrol Claude,1966,FR / IT,20,2010
28,Le Tatoué,De la Patellière Denys,1968,FR / IT,19,2012
29,Le Grand Blond avec une chaussure noire,Robert Yves,1972,FR,19,2010
30,Les Bidasses en folie,Zidi Claude,1971,FR,19,2012
31,Mais où est donc passée la 7ème compagnie ?,Lamoureux Robert,1973,FR / IT,19,2013
32,On a retrouvé la 7ème compagnie,Lamoureux Robert,1975,FR,19,2013
33,L'Aile ou la Cuisse,Zidi Claude,1976,FR,19,2012
34,Les Sous-doués,Zidi Claude,1980,FR,19,2013
35,Les Spécialistes,Leconte Patrice,1985,FR,19,2013
36,Trois hommes et un couffin,Serreau Coline,1985,FR,19,2010
37,Line de Demarcation,Chabrol Claude,1966,FR,19,2010
38,Taxi,Pirès Gérard,1998,FR,19,2013
39,Les Barbouzes,Lautner Georges,1964,FR / IT,19,2012
40,L'Animal,Zidi Claude,1977,FR,18,2011
41,Le Magnifique,De Broca Philippe,1973,FR / IT,18,2013
42,Les Ripoux,Zidi Claude,1984,FR,18,2010
43,Les Fugitifs,Veber Francis,1986,FR,18,2011
44,Pour la peau d'un flic,Delon Alain,1981,FR,18,2012
45,Marche à l'ombre,Michel Blanc,1984,FR,18,2011
46,Peur sur la ville,Verneuil Henri,1975,FR / IT,18,2011
47,Les Compères,Veber Francis,1983,FR,18,2013
48,Le Professionnel,Lautner Georges,1981,FR,18,2012
49,Le Marginal,Deray Jacques,1983,FR,18,2013
50,La Zizanie,Zidi Claude,1978,FR,18,2012`;
