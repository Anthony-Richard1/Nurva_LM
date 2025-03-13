// Banco de dados de músicas local - gerado automaticamente
// Última atualização: 11/03/2024 22:14:53

// Função para atualizar os caminhos para os novos locais
function updatePaths(songItem) {
  if (songItem.thumbnail && songItem.thumbnail.startsWith('assets/thumbnails/')) {
    songItem.thumbnail = songItem.thumbnail.replace('assets/thumbnails/', 'public/assets/thumbnails/');
  }
  
  if (songItem.audioPath && songItem.audioPath.startsWith('assets/music/')) {
    songItem.audioPath = songItem.audioPath.replace('assets/music/', 'public/assets/music/');
  }
  
  return songItem;
}

// Banco de dados original
const originalMusicDatabase = [
  {
    "id": 1,
    "title": "9 AM",
    "artist": "333etman",
    "album": "9 AM",
    "year": "2024",
    "duration": "4:05",
    "genre": "",
    "thumbnail": "assets/thumbnails/333etman - 9 AM.jpg",
    "audioPath": "assets/music/333etman - 9 AM.mp3",
    "fileName": "333etman - 9 AM.mp3"
  },
  {
    "id": 2,
    "title": "Aaron Smith - Dancin (KRONO Remix)",
    "artist": "TheSoundYouNeed",
    "album": "Álbum Desconhecido",
    "year": "2013",
    "duration": "4:16",
    "genre": "",
    "thumbnail": "assets/thumbnails/TheSoundYouNeed - Aaron Smith - Dancin.jpg",
    "audioPath": "assets/music/TheSoundYouNeed - Aaron Smith - Dancin (KRONO Remix).mp3",
    "fileName": "TheSoundYouNeed - Aaron Smith - Dancin (KRONO Remix).mp3"
  },
  {
    "id": 3,
    "title": "Abbot ft.Somynem.grin -\"HYLANDER\"- 🐀",
    "artist": "Abbot",
    "album": "Álbum Desconhecido",
    "year": "2020",
    "duration": "1:42",
    "genre": "",
    "thumbnail": "assets/thumbnails/Abbot - Abbot ft.Somynem.grin -_HYLANDER_- 🐀.jpg",
    "audioPath": "assets/music/Abbot - Abbot ft.Somynem.grin -_HYLANDER_- 🐀.mp3",
    "fileName": "Abbot - Abbot ft.Somynem.grin -_HYLANDER_- 🐀.mp3"
  },
  {
    "id": 4,
    "title": "AEAO",
    "artist": "Dynamicduo, DJ Premier",
    "album": "A Giant Step",
    "year": "2018",
    "duration": "5:17",
    "genre": "",
    "thumbnail": "assets/thumbnails/Dynamicduo, DJ Premier - AEAO.jpg",
    "audioPath": "assets/music/Dynamicduo, DJ Premier - AEAO.mp3",
    "fileName": "Dynamicduo, DJ Premier - AEAO.mp3"
  },
  {
    "id": 5,
    "title": "After Hours",
    "artist": "The Weeknd",
    "album": "After Hours",
    "year": "2020",
    "duration": "6:01",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - After Hours.jpg",
    "audioPath": "assets/music/The Weeknd - After Hours.mp3",
    "fileName": "The Weeknd - After Hours.mp3"
  },
  {
    "id": 6,
    "title": "ASAP",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "2:14",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - ASAP.jpg",
    "audioPath": "assets/music/NewJeans - ASAP.mp3",
    "fileName": "NewJeans - ASAP.mp3"
  },
  {
    "id": 7,
    "title": "Attention",
    "artist": "NewJeans",
    "album": "NewJeans 1st EP 'New Jeans'",
    "year": "2022",
    "duration": "3:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Attention.jpg",
    "audioPath": "assets/music/NewJeans - Attention.mp3",
    "fileName": "NewJeans - Attention.mp3"
  },
  {
    "id": 8,
    "title": "Cure For Me",
    "artist": "AURORA",
    "album": "The Gods We Can Touch",
    "year": "2021",
    "duration": "3:19",
    "genre": "",
    "thumbnail": "assets/thumbnails/AURORA - AURORA - Cure For Me (Audio).jpg",
    "audioPath": "assets/music/AURORA - AURORA - Cure For Me (Audio).mp3",
    "fileName": "AURORA - AURORA - Cure For Me (Audio).mp3"
  },
  {
    "id": 9,
    "title": "Fantasy",
    "artist": "Bazzi",
    "album": "COSMIC",
    "year": "2018",
    "duration": "2:28",
    "genre": "",
    "thumbnail": "assets/thumbnails/Bazzi - Bazzi - Fantasy [Official Audio].jpg",
    "audioPath": "assets/music/Bazzi - Bazzi - Fantasy [Official Audio].mp3",
    "fileName": "Bazzi - Bazzi - Fantasy [Official Audio].mp3"
  },
  {
    "id": 10,
    "title": "Billie Eilish, Khalid - lovely",
    "artist": "Billie Eilish",
    "album": "Álbum Desconhecido",
    "year": "2018",
    "duration": "3:21",
    "genre": "",
    "thumbnail": "assets/thumbnails/Billie Eilish - Billie Eilish, Khalid - lovely.jpg",
    "audioPath": "assets/music/Billie Eilish - Billie Eilish, Khalid - lovely.mp3",
    "fileName": "Billie Eilish - Billie Eilish, Khalid - lovely.mp3"
  },
  {
    "id": 11,
    "title": "Black Beatles",
    "artist": "Rae Sremmurd, Gucci Mane",
    "album": "SremmLife 2",
    "year": "2018",
    "duration": "4:52",
    "genre": "",
    "thumbnail": "assets/thumbnails/Rae Sremmurd, Gucci Mane - Black Beatles.jpg",
    "audioPath": "assets/music/Rae Sremmurd, Gucci Mane - Black Beatles.mp3",
    "fileName": "Rae Sremmurd, Gucci Mane - Black Beatles.mp3"
  },
  {
    "id": 12,
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "album": "Blinding Lights",
    "year": "2019",
    "duration": "3:22",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - Blinding Lights.jpg",
    "audioPath": "assets/music/The Weeknd - Blinding Lights.mp3",
    "fileName": "The Weeknd - Blinding Lights.mp3"
  },
  {
    "id": 13,
    "title": "Borderline",
    "artist": "Tame Impala",
    "album": "The Slow Rush",
    "year": "2020",
    "duration": "3:58",
    "genre": "",
    "thumbnail": "assets/thumbnails/Tame Impala - Borderline.jpg",
    "audioPath": "assets/music/Tame Impala - Borderline.mp3",
    "fileName": "Tame Impala - Borderline.mp3"
  },
  {
    "id": 14,
    "title": "Bubble Gum",
    "artist": "NewJeans",
    "album": "How Sweet",
    "year": "2024",
    "duration": "3:20",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Bubble Gum.jpg",
    "audioPath": "assets/music/NewJeans - Bubble Gum.mp3",
    "fileName": "NewJeans - Bubble Gum.mp3"
  },
  {
    "id": 15,
    "title": "Call Out My Name",
    "artist": "The Weeknd",
    "album": "My Dear Melancholy,",
    "year": "2018",
    "duration": "3:48",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - Call Out My Name.jpg",
    "audioPath": "assets/music/The Weeknd - Call Out My Name.mp3",
    "fileName": "The Weeknd - Call Out My Name.mp3"
  },
  {
    "id": 16,
    "title": "Centimeter",
    "artist": "the peggies",
    "album": "Centimeter",
    "year": "2021",
    "duration": "3:47",
    "genre": "",
    "thumbnail": "assets/thumbnails/the peggies - Centimeter.jpg",
    "audioPath": "assets/music/the peggies - Centimeter.mp3",
    "fileName": "the peggies - Centimeter.mp3"
  },
  {
    "id": 17,
    "title": "Chamber Of Reflection",
    "artist": "Mac DeMarco",
    "album": "Salad Days",
    "year": "2014",
    "duration": "3:52",
    "genre": "",
    "thumbnail": "assets/thumbnails/Mac DeMarco - Chamber Of Reflection.jpg",
    "audioPath": "assets/music/Mac DeMarco - Chamber Of Reflection.mp3",
    "fileName": "Mac DeMarco - Chamber Of Reflection.mp3"
  },
  {
    "id": 18,
    "title": "changes",
    "artist": "XXXTENTACION",
    "album": "?",
    "year": "2018",
    "duration": "2:02",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - changes.jpg",
    "audioPath": "assets/music/XXXTENTACION - changes.mp3",
    "fileName": "XXXTENTACION - changes.mp3"
  },
  {
    "id": 19,
    "title": "Cherish (My Love)",
    "artist": "ILLIT",
    "album": "I'LL LIKE YOU",
    "year": "2024",
    "duration": "2:57",
    "genre": "",
    "thumbnail": "assets/thumbnails/ILLIT - Cherish (My Love).jpg",
    "audioPath": "assets/music/ILLIT - Cherish (My Love).mp3",
    "fileName": "ILLIT - Cherish (My Love).mp3"
  },
  {
    "id": 20,
    "title": "Pocket Rocket",
    "artist": "COCHISE",
    "album": "Pocket Rocket",
    "year": "2021",
    "duration": "2:13",
    "genre": "",
    "thumbnail": "assets/thumbnails/Cochise - POCKET ROCKET.jpg",
    "audioPath": "assets/music/COCHISE - Cochise - Pocket Rocket (Official Video).mp3",
    "fileName": "COCHISE - Cochise - Pocket Rocket (Official Video).mp3"
  },
  {
    "id": 21,
    "title": "Tell Em",
    "artist": "COCHISE, $NOT",
    "album": "Benbow Crescent",
    "year": "2021",
    "duration": "3:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/COCHISE - Cochise - Tell Em (feat. $NOT) (Official Visualizer).jpg",
    "audioPath": "assets/music/COCHISE - Cochise - Tell Em (feat. $NOT) (Official Visualizer).mp3",
    "fileName": "COCHISE - Cochise - Tell Em (feat. $NOT) (Official Visualizer).mp3"
  },
  {
    "id": 22,
    "title": "Come & Go",
    "artist": "Juice WRLD, Marshmello",
    "album": "Legends Never Die",
    "year": "2020",
    "duration": "3:25",
    "genre": "",
    "thumbnail": "assets/thumbnails/Juice WRLD, Marshmello - Come & Go.jpg",
    "audioPath": "assets/music/Juice WRLD, Marshmello - Come & Go.mp3",
    "fileName": "Juice WRLD, Marshmello - Come & Go.mp3"
  },
  {
    "id": 23,
    "title": "Cookie",
    "artist": "NewJeans",
    "album": "NewJeans 1st EP 'New Jeans'",
    "year": "2022",
    "duration": "3:56",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Cookie.jpg",
    "audioPath": "assets/music/NewJeans - Cookie.mp3",
    "fileName": "NewJeans - Cookie.mp3"
  },
  {
    "id": 24,
    "title": "Cool With You",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "2:28",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Cool With You.jpg",
    "audioPath": "assets/music/NewJeans - Cool With You.mp3",
    "fileName": "NewJeans - Cool With You.mp3"
  },
  {
    "id": 25,
    "title": "Creepin'",
    "artist": "Metro Boomin, The Weeknd, 21 Savage",
    "album": "HEROES & VILLAINS",
    "year": "2022",
    "duration": "3:42",
    "genre": "",
    "thumbnail": "assets/thumbnails/Metro Boomin, The Weeknd, 21 Savage - Creepin'.jpg",
    "audioPath": "assets/music/Metro Boomin, The Weeknd, 21 Savage - Creepin'.mp3",
    "fileName": "Metro Boomin, The Weeknd, 21 Savage - Creepin'.mp3"
  },
  {
    "id": 26,
    "title": "Cupid (Twin Version)",
    "artist": "FIFTY FIFTY",
    "album": "The Beginning: Cupid",
    "year": "2024",
    "duration": "2:54",
    "genre": "",
    "thumbnail": "assets/thumbnails/FIFTY FIFTY - Cupid (Twin Version).jpg",
    "audioPath": "assets/music/FIFTY FIFTY - Cupid (Twin Version).mp3",
    "fileName": "FIFTY FIFTY - Cupid (Twin Version).mp3"
  },
  {
    "id": 27,
    "title": "Dead Man Walking",
    "artist": "Brent Faiyaz",
    "album": "Dead Man Walking",
    "year": "2023",
    "duration": "4:07",
    "genre": "",
    "thumbnail": "assets/thumbnails/Brent Faiyaz - Dead Man Walking.jpg",
    "audioPath": "assets/music/Brent Faiyaz - Dead Man Walking.mp3",
    "fileName": "Brent Faiyaz - Dead Man Walking.mp3"
  },
  {
    "id": 28,
    "title": "Die For You",
    "artist": "The Weeknd",
    "album": "Starboy",
    "year": "2018",
    "duration": "4:20",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - Die For You.jpg",
    "audioPath": "assets/music/The Weeknd - Die For You.mp3",
    "fileName": "The Weeknd - Die For You.mp3"
  },
  {
    "id": 29,
    "title": "Ditto",
    "artist": "NewJeans",
    "album": "NewJeans 'OMG'",
    "year": "2023",
    "duration": "3:06",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Ditto.jpg",
    "audioPath": "assets/music/NewJeans - Ditto.mp3",
    "fileName": "NewJeans - Ditto.mp3"
  },
  {
    "id": 30,
    "title": "No Idea",
    "artist": "Don Toliver",
    "album": "Heaven Or Hell",
    "year": "2019",
    "duration": "2:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Don Toliver - No Idea.jpg",
    "audioPath": "assets/music/Don Toliver - Don Toliver - No Idea [Official Music Video].mp3",
    "fileName": "Don Toliver - Don Toliver - No Idea [Official Music Video].mp3"
  },
  {
    "id": 31,
    "title": "double take",
    "artist": "Dhruv",
    "album": "double take",
    "year": "2021",
    "duration": "2:52",
    "genre": "",
    "thumbnail": "assets/thumbnails/Dhruv - double take.jpg",
    "audioPath": "assets/music/Dhruv - double take.mp3",
    "fileName": "Dhruv - double take.mp3"
  },
  {
    "id": 32,
    "title": "Espresso",
    "artist": "Sabrina Carpenter",
    "album": "Short n' Sweet",
    "year": "2024",
    "duration": "2:55",
    "genre": "",
    "thumbnail": "assets/thumbnails/Sabrina Carpenter - Espresso.jpg",
    "audioPath": "assets/music/Sabrina Carpenter - Espresso.mp3",
    "fileName": "Sabrina Carpenter - Espresso.mp3"
  },
  {
    "id": 33,
    "title": "ETA",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "2:31",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - ETA.jpg",
    "audioPath": "assets/music/NewJeans - ETA.mp3",
    "fileName": "NewJeans - ETA.mp3"
  },
  {
    "id": 34,
    "title": "Falling Down",
    "artist": "Lil Peep, XXXTENTACION",
    "album": "Come Over When You're Sober, Pt. 2",
    "year": "2018",
    "duration": "3:16",
    "genre": "",
    "thumbnail": "assets/thumbnails/Lil Peep, XXXTENTACION - Falling Down (Bonus Track).jpg",
    "audioPath": "assets/music/Lil Peep, XXXTENTACION - Falling Down (Bonus Track).mp3",
    "fileName": "Lil Peep, XXXTENTACION - Falling Down (Bonus Track).mp3"
  },
  {
    "id": 35,
    "title": "Ylang Ylang",
    "artist": "FKJ",
    "album": "Ylang Ylang EP",
    "year": "2019",
    "duration": "3:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Fkj - FKJ - Ylang Ylang.jpg",
    "audioPath": "assets/music/Fkj - FKJ - Ylang Ylang.mp3",
    "fileName": "Fkj - FKJ - Ylang Ylang.mp3"
  },
  {
    "id": 36,
    "title": "Flashing Lights",
    "artist": "Kanye West, Dwele",
    "album": "Graduation",
    "year": "2019",
    "duration": "3:58",
    "genre": "",
    "thumbnail": "assets/thumbnails/Kanye West, Dwele - Flashing Lights.jpg",
    "audioPath": "assets/music/Kanye West, Dwele - Flashing Lights.mp3",
    "fileName": "Kanye West, Dwele - Flashing Lights.mp3"
  },
  {
    "id": 37,
    "title": "Get Up",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "0:36",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Get Up.jpg",
    "audioPath": "assets/music/NewJeans - Get Up.mp3",
    "fileName": "NewJeans - Get Up.mp3"
  },
  {
    "id": 38,
    "title": "goosebumps",
    "artist": "Travis Scott",
    "album": "Birds In The Trap Sing McKnight",
    "year": "2016",
    "duration": "4:04",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott - goosebumps.jpg",
    "audioPath": "assets/music/Travis Scott - goosebumps.mp3",
    "fileName": "Travis Scott - goosebumps.mp3"
  },
  {
    "id": 39,
    "title": "GROUPIES",
    "artist": "Doode, Teto, Matuê",
    "album": "GROUPIES",
    "year": "2021",
    "duration": "3:43",
    "genre": "",
    "thumbnail": "assets/thumbnails/30PRAUM - GROUPIES - Doode & Teto & Matuê 🦇.jpg",
    "audioPath": "assets/music/30PRAUM - GROUPIES - Doode & Teto & Matuê 🦇.mp3",
    "fileName": "30PRAUM - GROUPIES - Doode & Teto & Matuê 🦇.mp3"
  },
  {
    "id": 40,
    "title": "Headlock",
    "artist": "Imogen Heap",
    "album": "Speak for Yourself",
    "year": "2024",
    "duration": "3:35",
    "genre": "",
    "thumbnail": "assets/thumbnails/Imogen Heap - Headlock.jpg",
    "audioPath": "assets/music/Imogen Heap - Headlock.mp3",
    "fileName": "Imogen Heap - Headlock.mp3"
  },
  {
    "id": 41,
    "title": "Hope",
    "artist": "XXXTENTACION",
    "album": "?",
    "year": "2018",
    "duration": "1:51",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - Hope.jpg",
    "audioPath": "assets/music/XXXTENTACION - Hope.mp3",
    "fileName": "XXXTENTACION - Hope.mp3"
  },
  {
    "id": 42,
    "title": "How Sweet",
    "artist": "NewJeans",
    "album": "How Sweet",
    "year": "2024",
    "duration": "3:39",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - How Sweet.jpg",
    "audioPath": "assets/music/NewJeans - How Sweet.mp3",
    "fileName": "NewJeans - How Sweet.mp3"
  },
  {
    "id": 43,
    "title": "Hurt",
    "artist": "NewJeans",
    "album": "NewJeans 1st EP 'New Jeans'",
    "year": "2022",
    "duration": "2:58",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Hurt.jpg",
    "audioPath": "assets/music/NewJeans - Hurt.mp3",
    "fileName": "NewJeans - Hurt.mp3"
  },
  {
    "id": 44,
    "title": "Hype Boy",
    "artist": "NewJeans",
    "album": "NewJeans 1st EP 'New Jeans'",
    "year": "2022",
    "duration": "2:59",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Hype Boy.jpg",
    "audioPath": "assets/music/NewJeans - Hype Boy.mp3",
    "fileName": "NewJeans - Hype Boy.mp3"
  },
  {
    "id": 45,
    "title": "I Don't Like",
    "artist": "Chief Keef",
    "album": "Still Rich",
    "year": "2015",
    "duration": "4:55",
    "genre": "",
    "thumbnail": "assets/thumbnails/Chief Keef - I Don't Like.jpg",
    "audioPath": "assets/music/Chief Keef - I Don't Like.mp3",
    "fileName": "Chief Keef - I Don't Like.mp3"
  },
  {
    "id": 46,
    "title": "ILoveUIHateU",
    "artist": "Playboi Carti",
    "album": "Whole Lotta Red",
    "year": "2020",
    "duration": "2:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/Playboi Carti - ILoveUIHateU.jpg",
    "audioPath": "assets/music/Playboi Carti - ILoveUIHateU.mp3",
    "fileName": "Playboi Carti - ILoveUIHateU.mp3"
  },
  {
    "id": 47,
    "title": "WHAT TO DO",
    "artist": "JACKBOYS, Travis Scott, Don Toliver",
    "album": "JACKBOYS",
    "year": "2019",
    "duration": "4:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott - JACKBOYS, Travis Scott - WHAT TO DO_ (Audio) ft. Don Toliver.jpg",
    "audioPath": "assets/music/Travis Scott - JACKBOYS, Travis Scott - WHAT TO DO_ (Audio) ft. Don Toliver.mp3",
    "fileName": "Travis Scott - JACKBOYS, Travis Scott - WHAT TO DO_ (Audio) ft. Don Toliver.mp3"
  },
  {
    "id": 48,
    "title": "oui",
    "artist": "Jeremih",
    "album": "Late Nights: The Album",
    "year": "2015",
    "duration": "3:59",
    "genre": "",
    "thumbnail": "assets/thumbnails/Def Jam - Jeremih - oui (Official Audio).jpg",
    "audioPath": "assets/music/Def Jam - Jeremih - oui (Official Audio).mp3",
    "fileName": "Def Jam - Jeremih - oui (Official Audio).mp3"
  },
  {
    "id": 49,
    "title": "jersey luv",
    "artist": "GROOVY, B Jack$",
    "album": "jersey luv",
    "year": "2023",
    "duration": "3:51",
    "genre": "",
    "thumbnail": "assets/thumbnails/GROOVY, B Jack$ - jersey luv.jpg",
    "audioPath": "assets/music/GROOVY, B Jack$ - jersey luv.mp3",
    "fileName": "GROOVY, B Jack$ - jersey luv.mp3"
  },
  {
    "id": 50,
    "title": "Bandit",
    "artist": "Juice WRLD, NBA Youngboy",
    "album": "Bandit",
    "year": "2019",
    "duration": "3:11",
    "genre": "",
    "thumbnail": "assets/thumbnails/Lyrical Lemonade - Juice WRLD - Bandit ft. NBA Youngboy (Official Music Video).jpg",
    "audioPath": "assets/music/Lyrical Lemonade - Juice WRLD - Bandit ft. NBA Youngboy (Official Music Video).mp3",
    "fileName": "Lyrical Lemonade - Juice WRLD - Bandit ft. NBA Youngboy (Official Music Video).mp3"
  },
  {
    "id": 51,
    "title": "Lucid Dreams",
    "artist": "Juice WRLD",
    "album": "Goodbye & Good Riddance",
    "year": "2018",
    "duration": "3:50",
    "genre": "",
    "thumbnail": "assets/thumbnails/Juice WRLD - Lucid Dreams.jpg",
    "audioPath": "assets/music/Lyrical Lemonade - Juice WRLD - Lucid Dreams (Official Music Video).mp3",
    "fileName": "Lyrical Lemonade - Juice WRLD - Lucid Dreams (Official Music Video).mp3"
  },
  {
    "id": 52,
    "title": "telepatía",
    "artist": "Kali Uchis",
    "album": "Sin Miedo (del Amor y Otros Demonios)",
    "year": "2020",
    "duration": "2:40",
    "genre": "",
    "thumbnail": "assets/thumbnails/KALI UCHIS - Kali Uchis – telepatía [Official Audio].jpg",
    "audioPath": "assets/music/KALI UCHIS - Kali Uchis – telepatía [Official Audio].mp3",
    "fileName": "KALI UCHIS - Kali Uchis – telepatía [Official Audio].mp3"
  },
  {
    "id": 53,
    "title": "Kiss",
    "artist": "1nonly",
    "album": "Kiss",
    "year": "2021",
    "duration": "2:20",
    "genre": "",
    "thumbnail": "assets/thumbnails/1nonly - Kiss.jpg",
    "audioPath": "assets/music/1nonly - Kiss.mp3",
    "fileName": "1nonly - Kiss.mp3"
  },
  {
    "id": 54,
    "title": "Honey (Medasin Remix)",
    "artist": "Kučka",
    "album": "Honey",
    "year": "2016",
    "duration": "3:51",
    "genre": "",
    "thumbnail": "assets/thumbnails/Majestic Casual - Kučka - Honey (Medasin Remix).jpg",
    "audioPath": "assets/music/Majestic Casual - Kučka - Honey (Medasin Remix).mp3",
    "fileName": "Majestic Casual - Kučka - Honey (Medasin Remix).mp3"
  },
  {
    "id": 55,
    "title": "Like That",
    "artist": "Future, Metro Boomin, Kendrick Lamar",
    "album": "WE DON'T TRUST YOU",
    "year": "2024",
    "duration": "4:28",
    "genre": "",
    "thumbnail": "assets/thumbnails/Future, Metro Boomin, Kendrick Lamar - Like That.jpg",
    "audioPath": "assets/music/Future, Metro Boomin, Kendrick Lamar - Like That.mp3",
    "fileName": "Future, Metro Boomin, Kendrick Lamar - Like That.mp3"
  },
  {
    "id": 56,
    "title": "Blueberry Faygo",
    "artist": "Lil Mosey",
    "album": "Certified Hitmaker",
    "year": "2020",
    "duration": "3:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/Lyrical Lemonade - Lil Mosey - Blueberry Faygo (Official Music Video).jpg",
    "audioPath": "assets/music/Lyrical Lemonade - Lil Mosey - Blueberry Faygo (Official Music Video).mp3",
    "fileName": "Lyrical Lemonade - Lil Mosey - Blueberry Faygo (Official Music Video).mp3"
  },
  {
    "id": 57,
    "title": "Falling Down",
    "artist": "Lil Peep, XXXTENTACION",
    "album": "Come Over When You're Sober, Pt. 2",
    "year": "2018",
    "duration": "3:18",
    "genre": "",
    "thumbnail": "assets/thumbnails/Lil Peep - Lil Peep & XXXTENTACION - Falling Down.jpg",
    "audioPath": "assets/music/Lil Peep - Lil Peep & XXXTENTACION - Falling Down.mp3",
    "fileName": "Lil Peep - Lil Peep & XXXTENTACION - Falling Down.mp3"
  },
  {
    "id": 58,
    "title": "Ransom",
    "artist": "Lil Tecca",
    "album": "We Love You Tecca",
    "year": "2019",
    "duration": "2:28",
    "genre": "",
    "thumbnail": "assets/thumbnails/Lyrical Lemonade - Lil Tecca - Ransom (Official Music Video).jpg",
    "audioPath": "assets/music/Lyrical Lemonade - Lil Tecca - Ransom (Official Music Video).mp3",
    "fileName": "Lyrical Lemonade - Lil Tecca - Ransom (Official Music Video).mp3"
  },
  {
    "id": 59,
    "title": "Look At Me!",
    "artist": "XXXTENTACION",
    "album": "Look At Me!",
    "year": "2017",
    "duration": "2:06",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - Look At Me!.jpg",
    "audioPath": "assets/music/XXXTENTACION - Look At Me!.mp3",
    "fileName": "XXXTENTACION - Look At Me!.mp3"
  },
  {
    "id": 60,
    "title": "Lucid Dreams",
    "artist": "Juice WRLD",
    "album": "Goodbye & Good Riddance",
    "year": "2018",
    "duration": "4:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/Juice WRLD - Lucid Dreams.jpg",
    "audioPath": "assets/music/Juice WRLD - Lucid Dreams.mp3",
    "fileName": "Juice WRLD - Lucid Dreams.mp3"
  },
  {
    "id": 61,
    "title": "Lucky Girl Syndrome",
    "artist": "ILLIT",
    "album": "SUPER REAL ME",
    "year": "2024",
    "duration": "2:20",
    "genre": "",
    "thumbnail": "assets/thumbnails/ILLIT - Lucky Girl Syndrome.jpg",
    "audioPath": "assets/music/ILLIT - Lucky Girl Syndrome.mp3",
    "fileName": "ILLIT - Lucky Girl Syndrome.mp3"
  },
  {
    "id": 62,
    "title": "luther",
    "artist": "Kendrick Lamar, SZA",
    "album": "GNX",
    "year": "2024",
    "duration": "2:58",
    "genre": "",
    "thumbnail": "assets/thumbnails/Kendrick Lamar, SZA - luther.jpg",
    "audioPath": "assets/music/Kendrick Lamar, SZA - luther.mp3",
    "fileName": "Kendrick Lamar, SZA - luther.mp3"
  },
  {
    "id": 63,
    "title": "HUNNIDDOLLA",
    "artist": "MadeinTYO",
    "album": "Never Forgotten",
    "year": "2021",
    "duration": "2:16",
    "genre": "",
    "thumbnail": "assets/thumbnails/MadeinTYO - MadeinTYO - HUNNIDDOLLA.jpg",
    "audioPath": "assets/music/MadeinTYO - MadeinTYO - HUNNIDDOLLA.mp3",
    "fileName": "MadeinTYO - MadeinTYO - HUNNIDDOLLA.mp3"
  },
  {
    "id": 64,
    "title": "I Miss the Rage",
    "artist": "Mario Judah",
    "album": "I Miss the Rage",
    "year": "2021",
    "duration": "2:55",
    "genre": "",
    "thumbnail": "assets/thumbnails/732zachary - Mario Judah - I Miss the Rage.jpg",
    "audioPath": "assets/music/732zachary - Mario Judah - I Miss the Rage.mp3",
    "fileName": "732zachary - Mario Judah - I Miss the Rage.mp3"
  },
  {
    "id": 65,
    "title": "Bih Yah",
    "artist": "Mario Judah",
    "album": "Bih Yah",
    "year": "2020",
    "duration": "2:25",
    "genre": "",
    "thumbnail": "assets/thumbnails/Mario Judah - Bih Yah.jpg",
    "audioPath": "assets/music/Mario Judah - Mario Judah - Bih Yah (Official Audio).mp3",
    "fileName": "Mario Judah - Mario Judah - Bih Yah (Official Audio).mp3"
  },
  {
    "id": 66,
    "title": "Show Me How",
    "artist": "Men I Trust",
    "album": "Oncle Jazz",
    "year": "2018",
    "duration": "3:43",
    "genre": "",
    "thumbnail": "assets/thumbnails/Men I Trust - Men I Trust - Show Me How.jpg",
    "audioPath": "assets/music/Men I Trust - Men I Trust - Show Me How.mp3",
    "fileName": "Men I Trust - Men I Trust - Show Me How.mp3"
  },
  {
    "id": 67,
    "title": "Space Cadet",
    "artist": "Metro Boomin, Gunna",
    "album": "NOT ALL HEROES WEAR CAPES",
    "year": "2019",
    "duration": "3:34",
    "genre": "",
    "thumbnail": "assets/thumbnails/Metro Boomin, Gunna - Space Cadet.jpg",
    "audioPath": "assets/music/Metro Boomin - Metro Boomin - Space Cadet (Official Music Video) ft. Gunna.mp3",
    "fileName": "Metro Boomin - Metro Boomin - Space Cadet (Official Music Video) ft. Gunna.mp3"
  },
  {
    "id": 68,
    "title": "Moonlight",
    "artist": "XXXTENTACION",
    "album": "?",
    "year": "2018",
    "duration": "2:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - Moonlight.jpg",
    "audioPath": "assets/music/XXXTENTACION - Moonlight.mp3",
    "fileName": "XXXTENTACION - Moonlight.mp3"
  },
  {
    "id": 69,
    "title": "After Dark",
    "artist": "Mr.Kitty",
    "album": "TIME",
    "year": "2015",
    "duration": "4:17",
    "genre": "",
    "thumbnail": "assets/thumbnails/Mr.Kitty Official - Mr.Kitty - After Dark.jpg",
    "audioPath": "assets/music/Mr.Kitty Official - Mr.Kitty - After Dark.mp3",
    "fileName": "Mr.Kitty Official - Mr.Kitty - After Dark.mp3"
  },
  {
    "id": 70,
    "title": "Ballin'",
    "artist": "Mustard, Roddy Ricch",
    "album": "Perfect Ten",
    "year": "2019",
    "duration": "3:13",
    "genre": "",
    "thumbnail": "assets/thumbnails/Mustard - Mustard - Ballin' ft. Roddy Ricch.jpg",
    "audioPath": "assets/music/Mustard - Mustard - Ballin' ft. Roddy Ricch.mp3",
    "fileName": "Mustard - Mustard - Ballin' ft. Roddy Ricch.mp3"
  },
  {
    "id": 71,
    "title": "MY EYES",
    "artist": "Travis Scott",
    "album": "UTOPIA",
    "year": "2023",
    "duration": "4:11",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott - MY EYES.jpg",
    "audioPath": "assets/music/Travis Scott - MY EYES.mp3",
    "fileName": "Travis Scott - MY EYES.mp3"
  },
  {
    "id": 72,
    "title": "NEW DROP",
    "artist": "Don Toliver",
    "album": "HARDSTONE PSYCHO",
    "year": "2024",
    "duration": "3:37",
    "genre": "",
    "thumbnail": "assets/thumbnails/Don Toliver - NEW DROP.jpg",
    "audioPath": "assets/music/Don Toliver - NEW DROP.mp3",
    "fileName": "Don Toliver - NEW DROP.mp3"
  },
  {
    "id": 73,
    "title": "New Jeans",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "1:49",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - New Jeans.jpg",
    "audioPath": "assets/music/NewJeans - New Jeans.mp3",
    "fileName": "NewJeans - New Jeans.mp3"
  },
  {
    "id": 74,
    "title": "NEW MAGIC WAND",
    "artist": "Tyler, The Creator",
    "album": "IGOR",
    "year": "2019",
    "duration": "3:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/Tyler, The Creator - NEW MAGIC WAND.jpg",
    "audioPath": "assets/music/Tyler, The Creator - NEW MAGIC WAND.mp3",
    "fileName": "Tyler, The Creator - NEW MAGIC WAND.mp3"
  },
  {
    "id": 75,
    "title": "No Idea",
    "artist": "Don Toliver",
    "album": "Heaven Or Hell",
    "year": "2019",
    "duration": "2:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Don Toliver - No Idea.jpg",
    "audioPath": "assets/music/Don Toliver - Don Toliver - No Idea [Official Music Video].mp3",
    "fileName": "Don Toliver - Don Toliver - No Idea [Official Music Video].mp3"
  },
  {
    "id": 76,
    "title": "No Pole",
    "artist": "Don Toliver",
    "album": "Love Sick",
    "year": "2023",
    "duration": "3:08",
    "genre": "",
    "thumbnail": "assets/thumbnails/Don Toliver - No Pole.jpg",
    "audioPath": "assets/music/Don Toliver - No Pole.mp3",
    "fileName": "Don Toliver - No Pole.mp3"
  },
  {
    "id": 77,
    "title": "Not Around",
    "artist": "Nova",
    "album": "Not Around",
    "year": "2019",
    "duration": "3:04",
    "genre": "",
    "thumbnail": "assets/thumbnails/Nova - Not Around.jpg",
    "audioPath": "assets/music/Nova - Not Around.mp3",
    "fileName": "Nova - Not Around.mp3"
  },
  {
    "id": 78,
    "title": "OMG",
    "artist": "NewJeans",
    "album": "NewJeans 'OMG'",
    "year": "2023",
    "duration": "3:32",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - OMG.jpg",
    "audioPath": "assets/music/NewJeans - OMG.mp3",
    "fileName": "NewJeans - OMG.mp3"
  },
  {
    "id": 79,
    "title": "One Of The Girls",
    "artist": "The Weeknd, JENNIE, Lily Rose Depp",
    "album": "The Idol Episode 4",
    "year": "2023",
    "duration": "4:05",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd, JENNIE, Lily Rose Depp - One Of The Girls.jpg",
    "audioPath": "assets/music/The Weeknd, JENNIE, Lily Rose Depp - One Of The Girls.mp3",
    "fileName": "The Weeknd, JENNIE, Lily Rose Depp - One Of The Girls.mp3"
  },
  {
    "id": 80,
    "title": "Our Night is more beautiful than your Day (우리의 밤은 당신의 낮보다 아름답다)",
    "artist": "NewJeans, 250, Bae Young Joon, Bae Young Joon",
    "album": "NewJeans X MY DEMON",
    "year": "2023",
    "duration": "3:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans, 250, Bae Young Joon, Bae Young Joon - Our Night is more beautiful than your Day (우리의 밤은 당신의 낮보다 아름답다).jpg",
    "audioPath": "assets/music/NewJeans, 250, Bae Young Joon, Bae Young Joon - Our Night is more beautiful than your Day (우리의 밤은 당신의 낮보다 아름답다).mp3",
    "fileName": "NewJeans, 250, Bae Young Joon, Bae Young Joon - Our Night is more beautiful than your Day (우리의 밤은 당신의 낮보다 아름답다).mp3"
  },
  {
    "id": 81,
    "title": "Perfect Night",
    "artist": "LE SSERAFIM",
    "album": "Perfect Night",
    "year": "2023",
    "duration": "2:39",
    "genre": "",
    "thumbnail": "assets/thumbnails/LE SSERAFIM - Perfect Night.jpg",
    "audioPath": "assets/music/LE SSERAFIM - Perfect Night.mp3",
    "fileName": "LE SSERAFIM - Perfect Night.mp3"
  },
  {
    "id": 82,
    "title": "Magnolia",
    "artist": "Playboi Carti",
    "album": "Playboi Carti",
    "year": "2017",
    "duration": "3:24",
    "genre": "",
    "thumbnail": "assets/thumbnails/Playboi Carti - Playboi Carti - Magnolia (Official Video).jpg",
    "audioPath": "assets/music/Playboi Carti - Playboi Carti - Magnolia (Official Video).mp3",
    "fileName": "Playboi Carti - Playboi Carti - Magnolia (Official Video).mp3"
  },
  {
    "id": 83,
    "title": "Sky",
    "artist": "Playboi Carti",
    "album": "Whole Lotta Red",
    "year": "2021",
    "duration": "3:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/Playboi Carti - Playboi Carti - Sky [Official Video].jpg",
    "audioPath": "assets/music/Playboi Carti - Playboi Carti - Sky [Official Video].mp3",
    "fileName": "Playboi Carti - Playboi Carti - Sky [Official Video].mp3"
  },
  {
    "id": 84,
    "title": "POCKET ROCKET",
    "artist": "Cochise",
    "album": "POCKET ROCKET",
    "year": "2021",
    "duration": "2:11",
    "genre": "",
    "thumbnail": "assets/thumbnails/Cochise - POCKET ROCKET.jpg",
    "audioPath": "assets/music/Cochise - POCKET ROCKET.mp3",
    "fileName": "Cochise - POCKET ROCKET.mp3"
  },
  {
    "id": 85,
    "title": "Popular (From The Idol Vol. 1 (Music from the HBO Original Series))",
    "artist": "The Weeknd, Playboi Carti, Madonna",
    "album": "Popular",
    "year": "2023",
    "duration": "3:35",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd, Playboi Carti, Madonna - Popular.jpg",
    "audioPath": "assets/music/The Weeknd, Playboi Carti, Madonna - Popular (From The Idol Vol. 1 (Music from the HBO Original Series)).mp3",
    "fileName": "The Weeknd, Playboi Carti, Madonna - Popular (From The Idol Vol. 1 (Music from the HBO Original Series)).mp3"
  },
  {
    "id": 86,
    "title": "Pretty Girl",
    "artist": "Clairo",
    "album": "diary 001",
    "year": "2018",
    "duration": "3:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/Clairo - Pretty Girl.jpg",
    "audioPath": "assets/music/Clairo - Pretty Girl.mp3",
    "fileName": "Clairo - Pretty Girl.mp3"
  },
  {
    "id": 87,
    "title": "PRIDE.",
    "artist": "Kendrick Lamar",
    "album": "DAMN. COLLECTORS EDITION.",
    "year": "2018",
    "duration": "4:35",
    "genre": "",
    "thumbnail": "assets/thumbnails/Kendrick Lamar - PRIDE.jpg",
    "audioPath": "assets/music/Kendrick Lamar - PRIDE..mp3",
    "fileName": "Kendrick Lamar - PRIDE..mp3"
  },
  {
    "id": 88,
    "title": "Black Beatles",
    "artist": "Rae Sremmurd, Gucci Mane",
    "album": "SremmLife 2",
    "year": "2016",
    "duration": "4:53",
    "genre": "",
    "thumbnail": "assets/thumbnails/Rae Sremmurd - Rae Sremmurd - Black Beatles ft. Gucci Mane (Official Video).jpg",
    "audioPath": "assets/music/Rae Sremmurd - Rae Sremmurd - Black Beatles ft. Gucci Mane (Official Video).mp3",
    "fileName": "Rae Sremmurd - Rae Sremmurd - Black Beatles ft. Gucci Mane (Official Video).mp3"
  },
  {
    "id": 89,
    "title": "Renai Circulation",
    "artist": "MONOGATARI Series",
    "album": "Utamonogatari Special Edition",
    "year": "2019",
    "duration": "4:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/MONOGATARI Series - Renai Circulation.jpg",
    "audioPath": "assets/music/MONOGATARI Series - Renai Circulation.mp3",
    "fileName": "MONOGATARI Series - Renai Circulation.mp3"
  },
  {
    "id": 90,
    "title": "Ric Flair Drip",
    "artist": "Offset, Metro Boomin",
    "album": "Without Warning",
    "year": "2017",
    "duration": "2:53",
    "genre": "",
    "thumbnail": "assets/thumbnails/Offset, Metro Boomin - Ric Flair Drip.jpg",
    "audioPath": "assets/music/Offset, Metro Boomin - Ric Flair Drip.mp3",
    "fileName": "Offset, Metro Boomin - Ric Flair Drip.mp3"
  },
  {
    "id": 91,
    "title": "Rich Nigga Shit",
    "artist": "21 Savage, Metro Boomin, Young Thug",
    "album": "SAVAGE MODE II (CHOPPED NOT SLOPPED)",
    "year": "2020",
    "duration": "3:10",
    "genre": "",
    "thumbnail": "assets/thumbnails/21 Savage, Metro Boomin, Young Thug - Rich Nigga Shit.jpg",
    "audioPath": "assets/music/21 Savage, Metro Boomin, Young Thug - Rich Nigga Shit.mp3",
    "fileName": "21 Savage, Metro Boomin, Young Thug - Rich Nigga Shit.mp3"
  },
  {
    "id": 92,
    "title": "Right Now",
    "artist": "NewJeans",
    "album": "Supernatural",
    "year": "2024",
    "duration": "2:40",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Right Now.jpg",
    "audioPath": "assets/music/NewJeans - Right Now.mp3",
    "fileName": "NewJeans - Right Now.mp3"
  },
  {
    "id": 93,
    "title": "The Box",
    "artist": "Roddy Ricch",
    "album": "Please Excuse Me For Being Antisocial",
    "year": "2020",
    "duration": "3:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Roddy Ricch - Roddy Ricch - The Box [Official Music Video].jpg",
    "audioPath": "assets/music/Roddy Ricch - Roddy Ricch - The Box [Official Music Video].mp3",
    "fileName": "Roddy Ricch - Roddy Ricch - The Box [Official Music Video].mp3"
  },
  {
    "id": 94,
    "title": "CALA-BOCA, TRABALHO",
    "artist": "Rudies Flacko, AKA RASTA",
    "album": "CALA-BOCA, TRABALHO",
    "year": "2023",
    "duration": "1:47",
    "genre": "",
    "thumbnail": "assets/thumbnails/Rudies Flacko - RUDIES FLACKO - CALA-BOCA, TRABALHO ft. AKA RASTA.jpg",
    "audioPath": "assets/music/Rudies Flacko - RUDIES FLACKO - CALA-BOCA, TRABALHO ft. AKA RASTA.mp3",
    "fileName": "Rudies Flacko - RUDIES FLACKO - CALA-BOCA, TRABALHO ft. AKA RASTA.mp3"
  },
  {
    "id": 95,
    "title": "SAD!",
    "artist": "XXXTENTACION",
    "album": "?",
    "year": "2018",
    "duration": "2:47",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - SAD!.jpg",
    "audioPath": "assets/music/XXXTENTACION - SAD!.mp3",
    "fileName": "XXXTENTACION - SAD!.mp3"
  },
  {
    "id": 96,
    "title": "sdp interlude",
    "artist": "Travis Scott",
    "album": "Birds In The Trap Sing McKnight",
    "year": "2016",
    "duration": "3:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott - sdp interlude.jpg",
    "audioPath": "assets/music/Travis Scott - sdp interlude.mp3",
    "fileName": "Travis Scott - sdp interlude.mp3"
  },
  {
    "id": 97,
    "title": "See You Again",
    "artist": "Tyler, The Creator, Kali Uchis",
    "album": "Flower Boy",
    "year": "2017",
    "duration": "3:00",
    "genre": "",
    "thumbnail": "assets/thumbnails/Tyler, The Creator, Kali Uchis - See You Again.jpg",
    "audioPath": "assets/music/Tyler, The Creator, Kali Uchis - See You Again.mp3",
    "fileName": "Tyler, The Creator, Kali Uchis - See You Again.mp3"
  },
  {
    "id": 98,
    "title": "See You Again (Alternative Version)- Tyler the Creator",
    "artist": "Asian Vagabond",
    "album": "Álbum Desconhecido",
    "year": "2019",
    "duration": "6:18",
    "genre": "",
    "thumbnail": "assets/thumbnails/Asian Vagabond - See You Again (Alternative Version)- Tyler the Creator.jpg",
    "audioPath": "assets/music/Asian Vagabond - See You Again (Alternative Version)- Tyler the Creator.mp3",
    "fileName": "Asian Vagabond - See You Again (Alternative Version)- Tyler the Creator.mp3"
  },
  {
    "id": 99,
    "title": "Shut up My Moms Calling",
    "artist": "Hotel Ugly",
    "album": "Shut up My Moms Calling",
    "year": "2022",
    "duration": "2:45",
    "genre": "",
    "thumbnail": "assets/thumbnails/Hotel Ugly - Shut up My Moms Calling.jpg",
    "audioPath": "assets/music/Hotel Ugly - Shut up My Moms Calling.mp3",
    "fileName": "Hotel Ugly - Shut up My Moms Calling.mp3"
  },
  {
    "id": 100,
    "title": "Space Cadet",
    "artist": "Metro Boomin, Gunna",
    "album": "NOT ALL HEROES WEAR CAPES",
    "year": "2018",
    "duration": "3:23",
    "genre": "",
    "thumbnail": "assets/thumbnails/Metro Boomin, Gunna - Space Cadet.jpg",
    "audioPath": "assets/music/Metro Boomin, Gunna - Space Cadet.mp3",
    "fileName": "Metro Boomin, Gunna - Space Cadet.mp3"
  },
  {
    "id": 101,
    "title": "Starboy",
    "artist": "The Weeknd, Daft Punk",
    "album": "Starboy",
    "year": "2018",
    "duration": "3:50",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd, Daft Punk - Starboy.jpg",
    "audioPath": "assets/music/The Weeknd, Daft Punk - Starboy.mp3",
    "fileName": "The Weeknd, Daft Punk - Starboy.mp3"
  },
  {
    "id": 102,
    "title": "Stop Breathing",
    "artist": "Playboi Carti",
    "album": "Whole Lotta Red",
    "year": "2020",
    "duration": "3:39",
    "genre": "",
    "thumbnail": "assets/thumbnails/Playboi Carti - Stop Breathing.jpg",
    "audioPath": "assets/music/Playboi Carti - Stop Breathing.mp3",
    "fileName": "Playboi Carti - Stop Breathing.mp3"
  },
  {
    "id": 103,
    "title": "Sunflower (Spider-Man: Into the Spider-Verse)",
    "artist": "Post Malone, Swae Lee",
    "album": "Hollywood's Bleeding",
    "year": "2019",
    "duration": "2:38",
    "genre": "",
    "thumbnail": "assets/thumbnails/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).jpg",
    "audioPath": "assets/music/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3",
    "fileName": "Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3"
  },
  {
    "id": 104,
    "title": "Super Shy",
    "artist": "NewJeans",
    "album": "NewJeans 2nd EP 'Get Up'",
    "year": "2023",
    "duration": "2:35",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Super Shy.jpg",
    "audioPath": "assets/music/NewJeans - Super Shy.mp3",
    "fileName": "NewJeans - Super Shy.mp3"
  },
  {
    "id": 105,
    "title": "Youngest Daughter",
    "artist": "Superheaven",
    "album": "Ours Is Chrome",
    "year": "2017",
    "duration": "5:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Superheaven - Superheaven - \"Youngest Daughter\" (Official Visualizer).jpg",
    "audioPath": "assets/music/Superheaven - Superheaven - Youngest Daughter (Official Visualizer).mp3",
    "fileName": "Superheaven - Superheaven - Youngest Daughter (Official Visualizer).mp3"
  },
  {
    "id": 106,
    "title": "Supernatural",
    "artist": "NewJeans",
    "album": "Supernatural",
    "year": "2024",
    "duration": "3:11",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Supernatural.jpg",
    "audioPath": "assets/music/NewJeans - Supernatural.mp3",
    "fileName": "NewJeans - Supernatural.mp3"
  },
  {
    "id": 107,
    "title": "Sure Thing",
    "artist": "Miguel",
    "album": "All I Want Is You",
    "year": "2015",
    "duration": "3:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/Miguel - Sure Thing.jpg",
    "audioPath": "assets/music/Miguel - Sure Thing.mp3",
    "fileName": "Miguel - Sure Thing.mp3"
  },
  {
    "id": 108,
    "title": "TELEKINESIS",
    "artist": "Travis Scott, SZA, Future",
    "album": "UTOPIA",
    "year": "2023",
    "duration": "5:54",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott, SZA, Future - TELEKINESIS.jpg",
    "audioPath": "assets/music/Travis Scott, SZA, Future - TELEKINESIS.mp3",
    "fileName": "Travis Scott, SZA, Future - TELEKINESIS.mp3"
  },
  {
    "id": 109,
    "title": "Tell Me",
    "artist": "Wonder Girls (원더걸스)",
    "album": "The Wonder Years",
    "year": "2014",
    "duration": "3:36",
    "genre": "",
    "thumbnail": "assets/thumbnails/Wonder Girls (원더걸스) - Tell Me.jpg",
    "audioPath": "assets/music/Wonder Girls (원더걸스) - Tell Me.mp3",
    "fileName": "Wonder Girls (원더걸스) - Tell Me.mp3"
  },
  {
    "id": 110,
    "title": "Dia Azul",
    "artist": "Teto",
    "album": "Dia Azul",
    "year": "2021",
    "duration": "2:18",
    "genre": "",
    "thumbnail": "assets/thumbnails/30PRAUM - Teto - Dia Azul.jpg",
    "audioPath": "assets/music/30PRAUM - Teto - Dia Azul.mp3",
    "fileName": "30PRAUM - Teto - Dia Azul.mp3"
  },
  {
    "id": 111,
    "title": "M4",
    "artist": "Teto, Matuê",
    "album": "M4",
    "year": "2021",
    "duration": "2:50",
    "genre": "",
    "thumbnail": "assets/thumbnails/30PRAUM - Teto - M4 feat. Matuê.jpg",
    "audioPath": "assets/music/30PRAUM - Teto - M4 feat. Matuê.mp3",
    "fileName": "30PRAUM - Teto - M4 feat. Matuê.mp3"
  },
  {
    "id": 112,
    "title": "Paypal",
    "artist": "Teto",
    "album": "Paypal",
    "year": "2021",
    "duration": "2:46",
    "genre": "",
    "thumbnail": "assets/thumbnails/30PRAUM - Teto - Paypal.jpg",
    "audioPath": "assets/music/30PRAUM - Teto - Paypal.mp3",
    "fileName": "30PRAUM - Teto - Paypal.mp3"
  },
  {
    "id": 113,
    "title": "Sweater Weather",
    "artist": "The Neighbourhood",
    "album": "I Love You.",
    "year": "2013",
    "duration": "4:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Neighbourhood - The Neighbourhood - Sweater Weather (Official Video).jpg",
    "audioPath": "assets/music/The Neighbourhood - The Neighbourhood - Sweater Weather (Official Video).mp3",
    "fileName": "The Neighbourhood - The Neighbourhood - Sweater Weather (Official Video).mp3"
  },
  {
    "id": 114,
    "title": "Notion",
    "artist": "The Rare Occasions",
    "album": "Futureproof",
    "year": "2018",
    "duration": "3:15",
    "genre": "",
    "thumbnail": "assets/thumbnails/Dol drums - The Rare Occasions - Notion.jpg",
    "audioPath": "assets/music/Dol drums - The Rare Occasions - Notion.mp3",
    "fileName": "Dol drums - The Rare Occasions - Notion.mp3"
  },
  {
    "id": 115,
    "title": "the remedy for a broken heart (why am I so in love)",
    "artist": "XXXTENTACION",
    "album": "?",
    "year": "2018",
    "duration": "2:40",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - the remedy for a broken heart (why am I so in love).jpg",
    "audioPath": "assets/music/XXXTENTACION - the remedy for a broken heart (why am I so in love).mp3",
    "fileName": "XXXTENTACION - the remedy for a broken heart (why am I so in love).mp3"
  },
  {
    "id": 116,
    "title": "Save Your Tears",
    "artist": "The Weeknd",
    "album": "After Hours",
    "year": "2021",
    "duration": "4:09",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - The Weeknd - Save Your Tears (Official Music Video).jpg",
    "audioPath": "assets/music/The Weeknd - The Weeknd - Save Your Tears (Official Music Video).mp3",
    "fileName": "The Weeknd - The Weeknd - Save Your Tears (Official Music Video).mp3"
  },
  {
    "id": 117,
    "title": "The Hills",
    "artist": "The Weeknd",
    "album": "Beauty Behind the Madness",
    "year": "2015",
    "duration": "3:54",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd - The Weeknd - The Hills.jpg",
    "audioPath": "assets/music/The Weeknd - The Weeknd - The Hills.mp3",
    "fileName": "The Weeknd - The Weeknd - The Hills.mp3"
  },
  {
    "id": 118,
    "title": "Tick-Tack",
    "artist": "ILLIT",
    "album": "I'LL LIKE YOU",
    "year": "2024",
    "duration": "2:09",
    "genre": "",
    "thumbnail": "assets/thumbnails/ILLIT - Tick-Tack.jpg",
    "audioPath": "assets/music/ILLIT - Tick-Tack.mp3",
    "fileName": "ILLIT - Tick-Tack.mp3"
  },
  {
    "id": 119,
    "title": "Timeless",
    "artist": "The Weeknd, Playboi Carti",
    "album": "Hurry Up Tomorrow",
    "year": "2025",
    "duration": "4:16",
    "genre": "",
    "thumbnail": "assets/thumbnails/The Weeknd, Playboi Carti - Timeless.jpg",
    "audioPath": "assets/music/The Weeknd, Playboi Carti - Timeless.mp3",
    "fileName": "The Weeknd, Playboi Carti - Timeless.mp3"
  },
  {
    "id": 120,
    "title": "Too Many Nights",
    "artist": "Metro Boomin, Don Toliver, Future",
    "album": "HEROES & VILLAINS",
    "year": "2022",
    "duration": "3:20",
    "genre": "",
    "thumbnail": "assets/thumbnails/Metro Boomin, Don Toliver, Future - Too Many Nights.jpg",
    "audioPath": "assets/music/Metro Boomin, Don Toliver, Future - Too Many Nights.mp3",
    "fileName": "Metro Boomin, Don Toliver, Future - Too Many Nights.mp3"
  },
  {
    "id": 121,
    "title": "Trap Queen",
    "artist": "Fetty Wap",
    "album": "Fetty Wap",
    "year": "2022",
    "duration": "3:42",
    "genre": "",
    "thumbnail": "assets/thumbnails/Fetty Wap - Trap Queen.jpg",
    "audioPath": "assets/music/Fetty Wap - Trap Queen.mp3",
    "fileName": "Fetty Wap - Trap Queen.mp3"
  },
  {
    "id": 122,
    "title": "SICKO MODE",
    "artist": "Travis Scott",
    "album": "ASTROWORLD",
    "year": "2018",
    "duration": "5:14",
    "genre": "",
    "thumbnail": "assets/thumbnails/Travis Scott - Travis Scott - SICKO MODE (Audio).jpg",
    "audioPath": "assets/music/Travis Scott - Travis Scott - SICKO MODE (Audio).mp3",
    "fileName": "Travis Scott - Travis Scott - SICKO MODE (Audio).mp3"
  },
  {
    "id": 123,
    "title": "Miss The Rage",
    "artist": "Trippie Redd, Playboi Carti",
    "album": "Trip At Knight",
    "year": "2021",
    "duration": "3:58",
    "genre": "",
    "thumbnail": "assets/thumbnails/Trippie Redd - Trippie Redd – Miss The Rage ft. Playboi Carti (Official Visualizer).jpg",
    "audioPath": "assets/music/Trippie Redd - Trippie Redd – Miss The Rage ft. Playboi Carti (Official Visualizer).mp3",
    "fileName": "Trippie Redd - Trippie Redd – Miss The Rage ft. Playboi Carti (Official Visualizer).mp3"
  },
  {
    "id": 124,
    "title": "Chlorine",
    "artist": "Twenty One Pilots",
    "album": "Trench",
    "year": "2019",
    "duration": "5:23",
    "genre": "",
    "thumbnail": "assets/thumbnails/twenty one pilots - twenty one pilots - Chlorine (Official Video).jpg",
    "audioPath": "assets/music/twenty one pilots - twenty one pilots - Chlorine (Official Video).mp3",
    "fileName": "twenty one pilots - twenty one pilots - Chlorine (Official Video).mp3"
  },
  {
    "id": 125,
    "title": "Level of Concern",
    "artist": "Twenty One Pilots",
    "album": "Level of Concern",
    "year": "2020",
    "duration": "3:52",
    "genre": "",
    "thumbnail": "assets/thumbnails/twenty one pilots - twenty one pilots - Level of Concern (Official Video).jpg",
    "audioPath": "assets/music/twenty one pilots - twenty one pilots - Level of Concern (Official Video).mp3",
    "fileName": "twenty one pilots - twenty one pilots - Level of Concern (Official Video).mp3"
  },
  {
    "id": 126,
    "title": "Ride",
    "artist": "Twenty One Pilots",
    "album": "Blurryface",
    "year": "2015",
    "duration": "3:45",
    "genre": "",
    "thumbnail": "assets/thumbnails/twenty one pilots - twenty one pilots - Ride (Official Video).jpg",
    "audioPath": "assets/music/twenty one pilots - twenty one pilots - Ride (Official Video).mp3",
    "fileName": "twenty one pilots - twenty one pilots - Ride (Official Video).mp3"
  },
  {
    "id": 127,
    "title": "Heathens",
    "artist": "Twenty One Pilots",
    "album": "Suicide Squad: The Album",
    "year": "2016",
    "duration": "3:38",
    "genre": "",
    "thumbnail": "assets/thumbnails/Fueled By Ramen - twenty one pilots_ Heathens (from Suicide Squad_ The Album) [OFFICIAL VIDEO].jpg",
    "audioPath": "assets/music/Fueled By Ramen - twenty one pilots_ Heathens (from Suicide Squad_ The Album) [OFFICIAL VIDEO].mp3",
    "fileName": "Fueled By Ramen - twenty one pilots_ Heathens (from Suicide Squad_ The Album) [OFFICIAL VIDEO].mp3"
  },
  {
    "id": 128,
    "title": "Vampiro",
    "artist": "Matuê, WIU, Teto",
    "album": "Vampiro",
    "year": "2022",
    "duration": "4:10",
    "genre": "",
    "thumbnail": "assets/thumbnails/Matuê, WIU, Teto - Vampiro.jpg",
    "audioPath": "assets/music/Matuê, WIU, Teto - Vampiro.mp3",
    "fileName": "Matuê, WIU, Teto - Vampiro.mp3"
  },
  {
    "id": 129,
    "title": "Visão de Futuro",
    "artist": "Abbot",
    "album": "Visão de Futuro",
    "year": "2020",
    "duration": "2:12",
    "genre": "",
    "thumbnail": "assets/thumbnails/Abbot, Abbot - Visão de Futuro.jpg",
    "audioPath": "assets/music/Abbot, Abbot - Visão de Futuro.mp3",
    "fileName": "Abbot, Abbot - Visão de Futuro.mp3"
  },
  {
    "id": 130,
    "title": "Everybody Dies In Their Nightmares",
    "artist": "XXXTENTACION",
    "album": "17",
    "year": "2017",
    "duration": "1:36",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - XXXTENTACION - Everybody Dies In Their Nightmares (Audio).jpg",
    "audioPath": "assets/music/XXXTENTACION - XXXTENTACION - Everybody Dies In Their Nightmares (Audio).mp3",
    "fileName": "XXXTENTACION - XXXTENTACION - Everybody Dies In Their Nightmares (Audio).mp3"
  },
  {
    "id": 131,
    "title": "Revenge",
    "artist": "XXXTENTACION",
    "album": "Revenge",
    "year": "2017",
    "duration": "2:01",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - XXXTENTACION - Revenge (Audio).jpg",
    "audioPath": "assets/music/XXXTENTACION - XXXTENTACION - Revenge (Audio).mp3",
    "fileName": "XXXTENTACION - XXXTENTACION - Revenge (Audio).mp3"
  },
  {
    "id": 132,
    "title": "YuNg BrAtZ",
    "artist": "XXXTENTACION",
    "album": "YuNg BrAtZ",
    "year": "2017",
    "duration": "1:43",
    "genre": "",
    "thumbnail": "assets/thumbnails/XXXTENTACION - XXXTENTACION - YuNg BrAtZ (Audio).jpg",
    "audioPath": "assets/music/XXXTENTACION - XXXTENTACION - YuNg BrAtZ (Audio).mp3",
    "fileName": "XXXTENTACION - XXXTENTACION - YuNg BrAtZ (Audio).mp3"
  },
  {
    "id": 133,
    "title": "YKWIM?",
    "artist": "Yot Club",
    "album": "Bipolar",
    "year": "2021",
    "duration": "3:33",
    "genre": "",
    "thumbnail": "assets/thumbnails/Yot Club - YKWIM_.jpg",
    "audioPath": "assets/music/Yot Club - YKWIM_.mp3",
    "fileName": "Yot Club - YKWIM_.mp3"
  },
  {
    "id": 134,
    "title": "You Know How We Do It",
    "artist": "Ice Cube",
    "album": "Greatest Hits",
    "year": "2017",
    "duration": "3:53",
    "genre": "",
    "thumbnail": "assets/thumbnails/Ice Cube - You Know How We Do It.jpg",
    "audioPath": "assets/music/Ice Cube - You Know How We Do It.mp3",
    "fileName": "Ice Cube - You Know How We Do It.mp3"
  },
  {
    "id": 135,
    "title": "Hot",
    "artist": "Young Thug, Gunna, Travis Scott",
    "album": "So Much Fun",
    "year": "2019",
    "duration": "5:09",
    "genre": "",
    "thumbnail": "assets/thumbnails/Young Thug - Young Thug - Hot ft. Gunna & Travis Scott [Official Music Video].jpg",
    "audioPath": "assets/music/Young Thug - Young Thug - Hot ft. Gunna & Travis Scott [Official Music Video].mp3",
    "fileName": "Young Thug - Young Thug - Hot ft. Gunna & Travis Scott [Official Music Video].mp3"
  },
  {
    "id": 136,
    "title": "Zero",
    "artist": "NewJeans",
    "album": "Zero",
    "year": "2023",
    "duration": "2:34",
    "genre": "",
    "thumbnail": "assets/thumbnails/NewJeans - Zero.jpg",
    "audioPath": "assets/music/NewJeans - Zero.mp3",
    "fileName": "NewJeans - Zero.mp3"
  }
];

// Aplicar atualização de caminhos
const musicDatabase = originalMusicDatabase.map(updatePaths);

// Criar um mapa de verificação para thumbnails existentes
function createThumbnailMap() {
  // Esta função é chamada apenas no navegador, não durante a carga inicial
  if (typeof window !== 'undefined') {
    window.thumbnailMap = new Map();
    
    // Verificamos cada thumbnail e registramos seu status
    musicDatabase.forEach(song => {
      if (song.thumbnail) {
        const img = new Image();
        img.onload = () => window.thumbnailMap.set(song.thumbnail, true);
        img.onerror = () => window.thumbnailMap.set(song.thumbnail, false);
        img.src = song.thumbnail;
      }
    });
    
    console.log("Mapa de verificação de thumbnails criado");
  }
}

// Executar após carregar o documento
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', createThumbnailMap);
}

// Você pode organizar as músicas por gênero, playlists, etc.
const playlists = {
  "favorites": [],
  "recentlyPlayed": []
};

// Função simples para buscar todas as músicas
function getAllSongs() {
  return musicDatabase;
}

// Função para buscar músicas por gênero
function getSongsByGenre(genre) {
  return musicDatabase.filter(song => song.genre && song.genre.toLowerCase() === genre.toLowerCase());
}

// Função para buscar uma playlist específica
function getPlaylist(playlistName) {
  const playlistIds = playlists[playlistName] || [];
  return playlistIds.map(id => musicDatabase.find(song => song.id === id)).filter(Boolean);
}

// Função para buscar uma música por ID
function getSongById(id) {
  return musicDatabase.find(song => song.id === id);
}