# The Seed That Emptied an Island Chain (ep-001, round 2): annotated script

Fact base: `facts.md` and `facts2.md` (every claim traces there; see `notes.md`, fact-trace table). Owner direction:
`REVISION_BRIEF_R2.md`; every round-1 note is resolved in `notes.md`, note-resolution table. Round 1 is kept in `r1/`.

**Kit v2 grammar used in every cue** (`kit/KIT_API.md` §13):
- **DATE** = the top-left date label (`Kit.setDate`): plain, old-style, never tilted, never a stamp. Every scene names it.
- **REASON** = the top-right icon bar (`Kit.setReason`): 0 THE SEED (nutmeg), 1 THE ROUTE (dhow), 2 THE COMPANY (voc),
  3 THE ISLAND (fort), 4 THE TREATY (scroll); `-1` = all muted, no label. The logo stays bottom-right.
- **Figures** (`Kit.figure`): `englishman` (red coat: the owner's readability choice, visual only, never claimed in
  narration), `dutchman`, `bandanese` (male / female), `orangKaya`, `japaneseMercenary`, `sailor`. Pennants via
  `flagOnTop`. Deaths: the figure turns red and falls (`fig.fall`), is held briefly, then LIFTED off. No blood, no
  sound sting.
- **Flags** wave (`Kit.flag`, `Kit.waveFlags`): `england1616`, `union1606`, `voc` (orange-white-blue, 1599–1621),
  `dutchRepublic` (red-white-blue, 1660s), `franceRoyal` with `lis: true`, `grenada`.
- **Portraits** (`Kit.portrait`, black and white): Coen = `assets_r2/portraits/coen_waben_westfriesmuseum_1920px.jpg`;
  Poivre = `assets_r2/portraits/poivre_grognard_1783.jpg`; Courthope and the orang kaya = no `src` (mannequin,
  "NO KNOWN PORTRAIT"). Credit lines per `assets_r2/portraits/CREDITS.txt`.
- **LIFT** = `Kit.exit(..., { style: "lift" })`. Finished elements are lifted off, never left dimmed.
- **Price climb** = `Kit.priceClimb`; every number on it comes from the fact sheets (none at the relay's middle ports).
- Themes: navy "night" for violence and the siege; cream "paper" for explanation; the kitchen table for 1a and 7b.

## 1a A pinch on the eggnog

[VISUAL: Kitchen-table theme, warm cream. DATE: TODAY. REASON: -1 (all muted). A paper mug of eggnog sits centre. A brown nutmeg seed cutout and a small grater slide in from the right; three paper flakes drift onto the foam.]

Grate a pinch of this onto your eggnog, and nothing happens. It's nutmeg.

[VISUAL @ "Four hundred years ago,": The mug and grater LIFT off; only the seed stays. Navy night. The seed grows to fill the centre while a flat paper map of eastern Indonesia slides in behind it. DATE: 1621.]

Four hundred years ago, men killed for this seed. On a handful of islands in Indonesia, it emptied an entire people.

[VISUAL @ "Of every fifteen": The seed shrinks to a pin on the Banda Islands. Along the shore stands a row of 15 bandanese figures, male and female variants. Fourteen turn red and fall, one after another, slowly; each fallen figure LIFTS off. One remains. Mono label: "≈ 15,000 → ≈ 1,000 · ESTIMATES".]

Of every fifteen islanders, one remained.

[PAUSE 2s]

[VISUAL @ "Later, it ended up": The last figure LIFTS off. DATE: 1974. A Grenada flag rises right of centre and waves; the camera finds the small nutmeg in its green hoist triangle.]

Later, it ended up on a national flag, and in a deal over Manhattan.

[VISUAL @ "In sixteen sixty-seven,": The flag LIFTS off. Navy paper world map. DATE: 31 JULY 1667. Two envoy figures in the "sign" pose over the North Sea, a treaty scroll between them. Left: an englishman with an `england1616` pennant on top (St George's red cross on white). Right: a dutchman (black doublet, big flat white collar, tall black capotain hat, wide breeches) with a `dutchRepublic` red-white-blue pennant on top. Labels in their flag colours: ENGLAND (red), THE DUTCH REPUBLIC (blue). Both pennants wave.]

In sixteen sixty-seven, at Breda, English and Dutch envoys signed a peace that settled two islands.

[VISUAL @ "One was Manhattan.": The envoys and the scroll LIFT off completely. An amber pin drops on the mouth of the Hudson; the Manhattan cutout lifts off the map. Label: MANHATTAN.]

[VISUAL @ "The other,": A dotted line runs across the globe to the Banda Sea, counter "≈ 15,000 KM". The camera zooms past the Banda group to the speck at its western edge. Label: THE ISLAND OF RUN.]

One was Manhattan. The other, fifteen thousand kilometers away, was the island of Run.

[VISUAL @ "Three kilometers long,": Run fills the frame with a scale bar "3 KM × 1 KM". Manhattan slides in; Run lifts, travels on top of Manhattan and settles over the green outline of Central Park; the shapes nearly match. Card: "ABOUT THE SIZE OF CENTRAL PARK". (The same move closes 7b.)]

Three kilometers long, about the size of Central Park.

[VISUAL @ "The story goes": Run slides back to the Banda Sea, Manhattan to the Hudson. A paper balance scale appears between them; Manhattan's pan rises, Run's sinks, and a single amber pin lands on Run.]

The story goes that the Dutch had to pick one. They chose Run.

[PAUSE 2s]

## 1b The truth is stranger

[VISUAL: Cream. DATE: TODAY. REASON: -1. Two paper counters side by side. Left, under a Manhattan cutout: "≈ $1 TRILLION A YEAR" (source tag "BEA, 2024"). Right, under a Run cutout and a nutmeg sack: "≈ 50 TONNES OF NUTMEG". At "ten seconds", a stopwatch ticks 0 to 10 while a coin stack under Manhattan grows to match Run's sack. Card: "RUN'S WHOLE HARVEST ≈ 10 SECONDS OF MANHATTAN".]

Today, Manhattan's economy makes about a trillion dollars a year. Run's whole nutmeg harvest is worth about ten seconds of that.

[VISUAL @ "The truth is": Counters, stopwatch and sack LIFT off. A parchment scroll unrolls (`Kit.scrollPaper`) and types "UTI POSSIDETIS", then "WHAT YOU HAVE, YOU HOLD". A pin tag sticks to it: "REMEMBER THIS".]

The truth is stranger. The treaty ran on an old Latin rule, uti possidetis. What you have, you hold. Remember that.

[VISUAL @ "So why would": The scroll rolls up and LIFTS off. Serif headline card, one italic red word: "Why *kill* for a seed?". Below it two small cutouts pop in as they are named: a flag, then Manhattan.]

So why would anyone kill for a seed? How did it end up on a flag, and tangled up with Manhattan?

[VISUAL @ "There are five reasons.": The headline LIFTS off. Five large icons appear along a dotted line as each is named while the matching icon in the top-right reason bar lights with its label: THE SEED, THE ROUTE, THE COMPANY, THE ISLAND, THE TREATY. Then the big icons shrink up into the bar; REASON returns to -1.]

There are five reasons. The seed. The route. The company. The island. And the treaty.

## 2a The seed

[VISUAL: Cream. DATE: c. 1500. REASON: 0, THE SEED. A paper map of eastern Indonesia. The island groups draw on, each with its own outline and label: a bracket over all of them, THE MOLUCCAS; in the north, TERNATE and TIDORE with a clove icon; in the south, THE BANDA ISLANDS with a nutmeg icon.]

Reason one, the seed. Look at these island groups in eastern Indonesia, the Moluccas. Up north, Ternate and Tidore grew cloves.

[VISUAL @ "Down south": The northern labels LIFT off. The camera pushes into the Banda group. Labels west to east: RUN, AI, GUNUNG API, BANDA NEIRA, and the long arc of LONTHOR. Scale bar: "ABOUT 20 KM".]

Down south lie the Banda Islands, a handful of small volcanic islands, with Run at the western end.

[VISUAL @ "Split a fruit": A `nutmegTree` cutout grows on Banda. One fruit swings forward and splits open. Inside: a brown seed in a red lacy net. Labels draw on: NUTMEG (the seed), MACE (the red net).]

Split a fruit from this tree, and inside is a brown seed in a red, lacy net. The seed is nutmeg. The net is mace.

[VISUAL @ "For centuries,": The tree LIFTS off. World map, cream. Every coastline greys out except the Banda group, which glows amber. Card: "THE WORLD'S ONLY SOURCE".]

For centuries, every nutmeg in the world came from these few islands.

[VISUAL @ "Remember one": The card LIFTS off. A sapling cutout grows beside a year counter: YEAR 1… YEAR 7–9 "FIRST FRUIT"… YEAR 20 "FULL CROP". Pin tag: "REMEMBER THIS".]

Remember one number. A nutmeg tree takes seven to nine years to bear fruit.

## 2b The route

[VISUAL: Cream. The map zooms out to the Indian Ocean. DATE: 1400s. REASON: 1, THE ROUTE. `Kit.priceClimb` starts: a red route draws west from BANDA and a nutmeg-seed token rides it to MALACCA, with small dhow cutouts on the leg. Counter: "> 3,000 KM". First price tag at Banda: "×1".]

Reason two, the route. Bandanese, Javanese and Malay boats carried nutmeg more than three thousand kilometers west, to Malacca.

[VISUAL @ "From there,": The token travels on, pins popping in rhythm: CALICUT, ADEN, ALEXANDRIA, VENICE. A distance counter ticks to "≈ 14,400 KM"; mono label "STRAIGHT LINE · REAL ROUTES WERE LONGER".]

From there, to India, Arabia, Egypt and Venice. About fourteen thousand kilometers in a straight line.

[VISUAL @ "At every port": The climb runs: at each pin a coin stack grows taller than the one before and a paper price tag ticks up with a "+" (no numbers at the middle ports: none are sourced). Mono tag: "CHANGED HANDS AGAIN AND AGAIN".]

At every port it changed hands, and every buyer added his own price.

[VISUAL @ "By one historian's": The price-climb end card lands: "MORE THAN ×100 · BANDA → EUROPE", source line "AMY JORDAN, 2016". Beside it a paper coffee cup: "$2" swells to "$200+".]

By one historian's estimate, it sold in Europe for more than a hundred times its price in Banda. A two-dollar coffee, selling for two hundred.

[VISUAL @ "So whoever": The whole price climb LIFTS off. A single dotted line draws straight from Banda around Africa to Europe, with a question mark on it.]

So whoever sailed straight to Banda would get rich.

## 3a The company

[VISUAL: Cream. DATE: 1512. REASON: 2, THE COMPANY. A Portuguese ship cutout sails from MALACCA to BANDA, takes on sacks, and sails away again.]

Reason three, the company. The Portuguese came first, in fifteen twelve.

[VISUAL @ "But when they tried": DATE: 1529. A Portuguese fort outline starts to draw itself on Banda; bandanese figures run at it from both sides; the outline tears and LIFTS away.]

[VISUAL @ "There was no king": A ring of orangKaya figures (long indigo jackets, tall ochre head wraps) stands around a council mat; village pins dot the islands. Card: "ORANG KAYA · 'RICH MEN' · VILLAGE COUNCILS".]

But when they tried to build a fort, the Bandanese attacked the builders. There was no king to capture or win over, only village councils of rich men, the orang kaya.

[VISUAL @ "So Portugal": The council LIFTS off. An arrow runs from Banda to MALACCA, labelled "BOUGHT SECOND-HAND".]

So Portugal settled for buying Banda's nutmeg second-hand, in Malacca.

[VISUAL @ "Then came the Dutch.": DATE: 1599, then 1602. Dutch East Indiaman cutouts arrive under `voc` flags. Centre, `Kit.vocLogo` (chamber A, ink) with `Kit.vocReveal`: the V, O and C draw on like ink, the parchment seal stamps behind them, and two VOC flags rise behind the seal and wave. Caption: "DUTCH EAST INDIA COMPANY · 20 MARCH 1602".]

[VISUAL @ "It could wage war,": The logo holds, flags still waving. Four power icons stamp down around it as each is named: crossed swords, a treaty seal, a coin, a fort.]

Then came the Dutch. In sixteen-oh-two, they founded the Dutch East India Company, the VOC. It could wage war, sign treaties, mint coins and build forts. A business with its own army.

[VISUAL @ "Its plan": The icons LIFT off. The relay route from 2b redraws; its middle pins LIFT off one by one until a single orange line runs unbroken from Banda to Amsterdam. The VOC logo shrinks to sit at the Banda end.]

Its plan was not to join the relay. It was to own it.

[VISUAL @ "In sixteen-oh-nine,": DATE: 1609. `Kit.priceClimb` along the orange line, two stops: BANDA "0.026 GUILDERS A POUND" → AMSTERDAM "1.27 GUILDERS A POUND"; end card "×49", source "VOC PRICES · PIM DE ZWART DATASET".]

In sixteen-oh-nine, a pound of nutmeg sold in Amsterdam for forty-nine times its price in Banda.

## 3b The next island

[VISUAL: Navy. DATE: 1609. REASON: 2, THE COMPANY. The price climb LIFTS off. The Banda map. Dutch ships with `voc` flags anchor off Banda Neira; a row of dutchman figures on the shore; bandanese figures close in from the trees. Several dutchman figures turn red and fall, then LIFT off. Counter: "46 DUTCH KILLED".]

That same year, Banda's chiefs lured a Dutch admiral into an ambush. Forty-six Dutchmen died.

[VISUAL @ "So the Dutch": Fort cutouts with waving `voc` flags draw on Banda Neira: "FORT NASSAU · 1609", "FORT BELGICA · 1611". Then the camera pans west to Ai, where a small trading post flies an `england1616` flag; an englishman figure hands coins to a bandanese figure, who hands back a nutmeg sack.]

So the Dutch built forts on the central islands, then turned west, to Ai, where English traders were paying more for nutmeg.

[VISUAL @ "In sixteen sixteen,": DATE: 1616. Dutch boats land on Ai; Ai's flag swaps from England to VOC. Bandanese figures in the swim pose cross the strait toward Run, heading west, stroke by stroke through moving paper water. Some turn red mid-strait and sink below the waterline, then LIFT away. Counter: "≈ 400 DROWNED". The survivors reach Run's beach.]

In sixteen sixteen, the Dutch took Ai. About four hundred islanders drowned fleeing across the water to Run.

[PAUSE 2s]

[VISUAL @ "Why hadn't": The camera settles on Run, the outermost island. A list card draws on: "NEIRA ✓ · LONTHOR ✓ · AI ✓ · RUN ?". At "The English got there first", an English ship cutout appears on the western horizon.]

Why hadn't the Dutch taken Run already? No record says. Run was the farthest out, and next on the list. The English got there first.

## 4a Two ships

[VISUAL: Cream. DATE: 1616. REASON: 3, THE ISLAND. A map from London to Asia. English trading-post pins pop, each with a small waving `england1616` flag: SURAT (INDIA), BANTAM (JAVA), MACASSAR, HIRADO (JAPAN). Card: "A STRING OF TRADING POSTS". At "a single ship", one lone ship icon sails from a LONDON pin; opposite it, the VOC logo with its two flags waving above a crowd of ship icons.]

Reason four, the island. England's East India Company was no VOC. It was a string of trading posts from India to Japan, and some years it sent a single ship.

[VISUAL @ "So when Run's": The London map LIFTS off. Close on Banda: Ai under a VOC flag; on Run, orangKaya figures look east toward it. A dotted line runs west to BANTAM; two ship cutouts, labelled SWAN and DEFENCE, sail from it.]

So when Run's leaders, having watched Ai fall, offered their island to England, the English base on Java sent what it had nearby: two ships, the Swan and the Defence.

[VISUAL @ "In command": `Kit.portrait` with no `src`: the mannequin bust in an oval paper frame, small mono "NO KNOWN PORTRAIT". Name plate: "NATHANIEL COURTHOPE · ENGLISH EAST INDIA COMPANY".]

In command was Nathaniel Courthope. No portrait of him survives.

[VISUAL @ "In December": The portrait LIFTS off. DATE: DECEMBER 1616. The two ships anchor off Run, `england1616` flags waving. OrangKaya figures step onto the deck and lay down, one by one as named: a nutmeg sapling, a clod of earth, a goat cutout.]

[VISUAL @ "The English raised": An `england1616` flag runs up a pole on Run's shore and waves. Thirty small smoke puffs ripple along the ships' sides; counter "30 GUNS".]

In December sixteen sixteen, Run's chiefs came aboard and handed him a nutmeg tree, a clod of earth and a live goat. The English raised their flag and fired thirty guns.

[VISUAL @ "An English letter": A parchment scroll unrolls (`Kit.scrollPaper`) and types: "…surrender their island of Puloroon to our sovereign the king of England"; the text scrolls up so the line sits centre. A red tag draws on under the word: "PULOROON = RUN".]

An English letter says they agreed to "surrender their island of Puloroon to our sovereign the king of England." Puloroon was how the English wrote Run.

[VISUAL @ "To hold it,": The scroll LIFTS off. Split frame. Left: Run with a waving `england1616` flag over a small fort and a waffle of 39 englishman figures. Right: the VOC logo with its two flags waving, ship icons stacking up beneath it, many times larger.]

To hold it, Courthope had thirty-nine men.

## 4b The siege

[VISUAL: Navy. DATE: DECEMBER 1616. REASON: 3, THE ISLAND. Run, close. Cannon cutouts roll off the ships; englishman and bandanese figures haul them uphill (walk). Two small fort cutouts draw on, three gun icons each. At "three Dutch ships", DATE: JANUARY 1617, and three Dutch ships under waving `voc` flags anchor offshore, between Run and the open sea.]

In January sixteen seventeen, three Dutch ships arrived to cut Run off.

[VISUAL @ "The Swan was taken": DATE: 1617. The Swan, labelled, sails out; a Dutch ship closes; a clock card "90 MINUTES"; five englishman figures on deck turn red and fall, then LIFT off; her flag swaps to VOC. At "Then nine", DATE: MARCH 1617, and nine sailor figures on the Defence; her cable snaps and she sails east to the Dutch. Card: "9 MEN · MUTINY". The sea off Run is empty.]

The Swan was taken after a ninety-minute fight. Then nine of his own men cut the Defence's cables and sailed her to the Dutch. Courthope had no ship at all.

[VISUAL @ "His plan:": A day counter starts lower left: DAY 1. A ring of VOC ship cutouts circles Run at a distance. Canoe cutouts slip in from SERAM carrying sacks marked SAGO. The counter climbs: DAY 365… DAY 730.]

His plan: hold on until help came. Small boats smuggled in sago, a palm flour, from the island of Seram.

[VISUAL @ "The Dutch captured": DATE: 1618. Three English relief-ship cutouts sail toward Banda; two are surrounded and their flags swap to VOC; the third LIFTS off the map with a small "?". Card: "2 CAPTURED · 1 VANISHED".]

[VISUAL @ "In sixteen nineteen,": The relief ships LIFT off. DATE: 1619. Cream, London. An englishman and a dutchman in the sign pose over a scroll. Card: "PEACE IN EUROPE · ONE-THIRD OF THE SPICES TO ENGLAND". At "No fleet came", the camera swings back to Run: an empty sea around it, the day counter still climbing.]

The Dutch captured two relief ships, and a third vanished. In sixteen nineteen, London made peace with the Dutch in Europe, for a third of the spices. No fleet came for Run.

[VISUAL @ "In January sixteen twenty,": DATE: JANUARY 1620. A ledger cutout: "£100 A YEAR · RECOMMENDED FOR PROMOTION". The day counter reads ≈ 1,100. The light warms for a moment.]

In January sixteen twenty, the directors voted Courthope a hundred pounds a year and recommended him for promotion. London sent him a pay rise, not a warship.

[VISUAL @ "But he never": The ledger LIFTS off. Navy. DATE: OCTOBER 1620. Map: Run, and east of it the long arc of LONTHOR. A small boat with a few englishman figures rows to Lonthor; an orangKaya figure waits on the shore. Card: "TO RECEIVE ITS SURRENDER".]

But he never heard about that promotion. In late October, he crossed by small boat to Lonthor to accept its surrender to England.

[VISUAL @ "On the way back,": Night. The boat rows back west. Dutch boat silhouettes close in from the dark; small musket flashes. The englishman figure at the stern turns red and falls over the side; a single splash ring spreads and fades. Paraphrase card: "SHOT IN THE CHEST · OVER THE SIDE · NEVER SEEN AGAIN", source tag "SWORN STATEMENTS, 1622 · DICTIONARY OF NATIONAL BIOGRAPHY, 1887".]

On the way back, the Dutch caught him. He was shot in the chest, went over the side, and was never seen again.

[PAUSE 2s]

[VISUAL @ "That same week,": The day counter stops: "≈ 1,400 DAYS · NEARLY FOUR YEARS". The 39-figure waffle LIFTS off; the English flag on Run lowers and LIFTS off. DATE: 26 OCTOBER 1620. A letter cutout slides in, sealed with orange wax stamped with the VOC monogram.]

That same week, the head of the VOC in Asia wrote down his plan for Banda.

## 5a Sixteen twenty-one

[VISUAL: Navy. DATE: 1620. REASON: 3, THE ISLAND. `Kit.portrait` with `src: "assets_r2/portraits/coen_waben_westfriesmuseum_1920px.jpg"`, `fit: "xMidYMin slice"`, black and white; plate "JAN PIETERSZOON COEN · VOC GOVERNOR-GENERAL"; credit "Jacques Waben, c. 1625. Westfries Museum, Hoorn". The letter opens beside it; one line is drawn over in red: "to once again subjugate Banda, and populate it with other people".]

[VISUAL @ "His motto:": A second quote card slides under the first: "Despair not, spare not your enemies" · 1618.]

His name was Jan Pieterszoon Coen. It was necessary, he wrote, "to once again subjugate Banda, and populate it with other people." His motto: "Despair not, spare not your enemies."

[VISUAL @ "He sailed": The portrait and cards LIFT off. DATE: 1621. A route draws from BATAVIA (JAVA) to Banda. Along it: 19 ship icons under waving `voc` flags; a crowd row of dutchman figures, "1,655 DUTCH SOLDIERS"; a row of japaneseMercenary figures, "286 JAPANESE MERCENARIES". Beside them, the 39-figure waffle from 4a, dwarfed: "≈ 50 : 1". At "By March", DATE: MARCH 1621 and VOC flags run up across Lonthor.]

He sailed from Batavia, on Java, with nineteen ships, sixteen hundred and fifty-five Dutch soldiers and two hundred and eighty-six Japanese mercenaries. By March sixteen twenty-one, Lonthor was his.

[VISUAL @ "In April,": DATE: APRIL 1621. The fleet LIFTS off. A row of orangKaya figures stands on Banda Neira. Upper right, `Kit.portrait` with no `src`: the mannequin, "NO KNOWN PORTRAIT", plate "THE ORANG KAYA · BANDA'S VILLAGE LEADERS".]

[VISUAL @ "In May,": DATE: MAY 1621. Three japaneseMercenary figures stand behind the row (no weapons drawn). The orangKaya figures turn red and fall, one at a time, slowly, without sound; then all LIFT off together, with the mannequin portrait.]

In April, confessions to a plot were forced out under torture. In May, dozens of the orang kaya were beheaded by Japanese mercenaries.

[PAUSE 2s]

[VISUAL @ "By Coen's own count,": A waffle of 15 bandanese figures, male and female, label "EACH ≈ 1,000 PEOPLE". As each fate is named: figures turn red and fall ("≈ 2,500 DEAD · COEN'S COUNT"); figures walk off-map west toward BATAVIA ("789+ SHIPPED TO BATAVIA"); figures row away east ("FLED"). Each group LIFTS off when its line ends.]

By Coen's own count, about two thousand five hundred died of hunger or by the sword. Hundreds more were shipped to Batavia, or fled east by boat.

[VISUAL @ "Before the conquest,": Fourteen spaces stand empty; one figure remains. Mono label: "≈ 15,000 → ≈ 1,000 · ESTIMATES".]

Before the conquest, an estimated fifteen thousand people lived here. Afterward, about one thousand. Of every fifteen, one remained.

[PAUSE 2s]

[VISUAL @ "Their land": The last figure LIFTS off. The Banda map is cut by thin lines into 68 plots; arrows bring small figures in from across Asia. Card: "68 PLANTATIONS".]

Their land was cut into sixty-eight plantations, worked by enslaved people from across Asia.

## 5b Every tree on Run

[VISUAL: Navy. DATE: 1621. REASON: 3, THE ISLAND. Run alone on the map, dotted with small nutmeg-tree cutouts; a VOC flag on the beach. At "Then they cut down", the trees tip over and LIFT off, one after another, until the island is bare.]

On Run, the Dutch killed or enslaved the men and sent the women and children away. Then they cut down every nutmeg tree on the island.

[PAUSE 2s]

[VISUAL @ "Why destroy": Card: "WHY NOT JUST HOLD IT?". On Run the VOC flag waves. At "But on paper", a red arrow points in from the west, labelled "ENGLISH CLAIM · 1616", and small English ship cutouts appear on the horizon with dates: 1622, 1638.]

Why destroy what they came for? Couldn't they just hold Run? They did. But on paper, Run belonged to the king of England, and English ships kept coming back.

[VISUAL @ "Remember,": The sapling counter from 2a returns: "7–9 YEARS TO FIRST FRUIT". Then cattle cutouts wander across the bare island.]

Remember, a nutmeg tree takes seven to nine years to bear fruit. With no trees, an English return would find nothing to sell for years.

[VISUAL @ "Every year,": DATE: 1622, then 1640s, then 1660s. A small Dutch boat circles Run once at each date; a dutchman figure walks the bare island holding a ledger. Card: "INSPECTED EVERY YEAR". At "The English claim", the red arrow from the west glows and points on across the map toward the Atlantic.]

Every year, Dutch officials sailed out to check that nobody had replanted. The island was empty. The English claim was not.

## 6a The other island

[VISUAL: Cream. DATE: 1626. REASON: 4, THE TREATY. The globe swings about 15,000 km west to Manhattan. A small Dutch fort cutout appears on the island's southern tip, its `voc` flag waving.]

Reason five, the treaty. It starts in Manhattan, a Dutch colony by the mid-sixteen twenties.

[VISUAL @ "A letter": A parchment scroll unrolls and types: "Amsterdam, 5 November 1626… bought Manhattes Island from the Native People for 60 guilders worth of trade". Tag: "PIETER SCHAGHEN'S LETTER · THE ONLY RECORD · NO DEED SURVIVES".]

[VISUAL @ "In Amsterdam that year,": The scroll LIFTS off. A paper balance: 60 guilder coins on one pan, a nutmeg sack on the other, level. Card: "≈ 14 KG OF NUTMEG · AMSTERDAM PRICE, 1626". A sailor figure swings the sack onto one shoulder.]

A letter from sixteen twenty-six says they bought the island from the Native people for sixty guilders' worth of trade goods. In Amsterdam that year, sixty guilders bought about fourteen kilos of nutmeg. One sack.

[VISUAL @ "The same ship": The balance LIFTS off. A ship cutout; its hold fills with beaver-pelt icons as a counter runs to "7,246". Card: "THE LETTER GIVES NO VALUE". At "one modern estimate", a second card: "BEAVER ALONE ≈ 50,000–60,000 GUILDERS · MODERN ESTIMATE", and a scale bar "60" against "≈ 1,000×".]

The same ship carried seven thousand two hundred and forty-six beaver skins. The letter gives no value, but one modern estimate puts the beaver alone at close to a thousand times the island's price.

[VISUAL @ "In sixteen sixty-four,": The ship LIFTS off. DATE: 1664. English squadron cutouts under waving `union1606` flags sail into the harbor; englishman figures on deck. Tag: "PEACETIME". The label NEW AMSTERDAM flips to NEW YORK.]

In sixteen sixty-four, an English squadron sailed in, and the Dutch governor surrendered, with no war declared. The town became New York.

## 6b Breda

[VISUAL: Navy. DATE: 1667. REASON: 4, THE TREATY. A cutout map of the Medway estuary in England. Dutch ships under waving `dutchRepublic` flags sail upriver; English ship silhouettes catch fire in red.]

In June sixteen sixty-seven, two years into a new war, Dutch ships sailed up the Medway, a river in England, and burned the English fleet.

[VISUAL @ "Weeks later came": DATE: 31 JULY 1667. The Medway LIFTS off. The two envoy figures from 1a return in the sign pose under their waving pennants (St George's cross; red-white-blue). A scroll unrolls between them: "TREATY OF BREDA", then the rule from 1b: "WHAT YOU HAVE, YOU HOLD".]

[VISUAL @ "The Dutch, who were": The scroll types two columns. THE DUTCH KEEP: RUN, SURINAME. ENGLAND KEEPS: NEW NETHERLAND (NEW YORK). A Suriname pin drops on South America.]

Weeks later came Breda, and the rule from the start: what you have, you hold. The Dutch, who were winning, claimed the prizes: Run and Suriname. They let England keep New Netherland, by then New York.

[VISUAL @ "So what changed": The scroll and envoys LIFT off. The two-island map. A red arrow labelled "ENGLISH CLAIM, 1616" runs from England to Run; a blue arrow labelled "DUTCH CLAIM" runs from the Netherlands to Manhattan. At "England dropped", the red arrow LIFTS off; at "The Dutch dropped", the blue arrow LIFTS off.]

So what changed hands was not islands, but claims. England dropped its claim to Run. The Dutch dropped theirs to Manhattan.

[VISUAL @ "For the Dutch,": The orange VOC line from Banda to Amsterdam returns. A small red gap glows at Run, then closes. The VOC logo at Banda raises its two flags and they wave.]

For the Dutch, that closed the last gap in the fence. Every nutmeg on the market now came from land they held.

[PAUSE 2s]

[VISUAL @ "The monopoly lasted": The orange line holds, whole. Then a hairline crack appears at its western end.]

The monopoly lasted about a hundred years.

## 7a The escape

[VISUAL: Cream. DATE: 1760s. REASON: -1 (all muted). Map of the Indian Ocean, the orange VOC line unbroken, a pin on MAURITIUS. `Kit.portrait` with `src: "assets_r2/portraits/poivre_grognard_1783.jpg"`, black and white; plate "PIERRE POIVRE · FRENCH INTENDANT OF MAURITIUS"; credit "Engraving by Grognard, 1783. Bibliothèque nationale de France". Behind the portrait a `franceRoyal` flag with `lis: true` (white with gold lilies) rises and waves.]

After losing a war to Britain in seventeen sixty-three, France wanted into the nutmeg business. Pierre Poivre, who ran French Mauritius, had a bold idea.

[VISUAL @ "Smuggle the seeds": Small boat cutouts under French flags slip out of the Moluccas carrying potted seedlings; a dotted line runs to MAURITIUS. A small mono card pins to the portrait frame: "POIVRE = 'PEPPER'".]

Smuggle the seeds out of the Dutch spice islands.

[VISUAL @ "By the early": DATE: EARLY 1770s. A garden cutout at PAMPLEMOUSSES, near Port Louis, with a small nutmeg sapling. The crack in the orange line widens slightly. Then the portrait, French flag and garden LIFT off.]

By the early seventeen-seventies, his smuggled nutmeg was growing on Mauritius. But the gap was small.

[VISUAL @ "Britain,": DATE: 1796. British warship cutouts under waving `union1606` flags anchor at Banda; card "FRENCH REVOLUTIONARY WARS"; the VOC flag lowers and the British flag rises. DATE: 1810. Card "NAPOLEONIC WARS": at dawn a line of sailor figures climbs to the pentagon of FORT BELGICA, and the British flag rises again.]

Britain, the rising power at sea, took the Banda Islands twice: in seventeen ninety-six, during the French Revolutionary Wars, and in eighteen ten, during the Napoleonic Wars.

[VISUAL @ "They did the real": Seedling pots packed with soil load onto a ship. Red arrows fan out from Banda: PENANG, CEYLON, SINGAPORE. Then one long arrow crosses to GRENADA in the Caribbean.]

They did the real damage. They dug up seedlings, packed them in soil, and shipped them to Penang, to Ceylon, to Singapore. From there, nutmeg reached Grenada, in the Caribbean.

[VISUAL @ "Grenada became": DATE: 1974. The arrows LIFT off. The Grenada flag from 1a rises large and waves; the camera pushes into the green hoist triangle, onto the nutmeg. The reason bar lights all five icons for a beat, then mutes.]

Grenada became one of the world's biggest nutmeg producers. At independence, in nineteen seventy-four, it put the seed on its flag.

[PAUSE 2s]

## 7b Back to the kitchen

[VISUAL: Kitchen-table theme. DATE: TODAY. REASON: -1. Two paper price cards. First, left: "1626 · ONE KILO ≈ A WEEK'S PAY · AMSTERDAM LABOURER", beside a sailor figure standing in for the labourer. At "Today,", the right card lands: "TODAY · $5–7 A KILO TO THE FARMER · < 1 HOUR AT US MINIMUM WAGE".]

In sixteen twenty-six, a kilo of nutmeg cost an Amsterdam labourer nearly a week's pay. Today, the farmer who grows a kilo gets about what an American earns in an hour.

[VISUAL @ "The fight for": The price cards LIFT off. Navy. A ledger card writes three lines as they are spoken: "COURTHOPE · 1620", "RUN · EVERY TREE", "THE BANDANESE · ≈ 15,000 → ≈ 1,000".]

[VISUAL @ "Their language": The ledger LIFTS off. The map moves east of Banda to the KEI ISLANDS; two village pins on Kei Besar: BANDA ELI, BANDA ELAT. Card: "BANDA LANGUAGE · ≈ 3,000 SPEAKERS (1987)". A bandanese man and woman stand by the pins. (No distance shown: unverified.)]

The fight for this seed cost Courthope his life, and Run every tree. The Bandanese went from about fifteen thousand people to about one thousand. Their language survives in two villages on the Kei Islands, farther east, founded by survivors.

[VISUAL @ "Run's nutmeg": Back to the opening two-island map from 1a, cream. On Run, nutmeg-tree cutouts grow back one by one; small counter "POP. 1,572". On the left, Manhattan, labelled NEW YORK.]

Run's nutmeg trees have grown back.

[VISUAL @ "So, was it": The paper balance from 1a returns between the islands: Run under a waving `dutchRepublic` flag, Manhattan under a waving `union1606` flag. The pans wobble and never settle. Question card: "WHO GOT THE BETTER DEAL?".]

So, was it worth it? Who got the better deal: the Dutch, with Run, or the English, with Manhattan? It's up for debate. Tell us in the comments.

[VISUAL @ "Next time": Run lifts off the map and travels on top of Manhattan, settling over Central Park, the same move as 1a. Then a slow dissolve to the kitchen table: the mug of eggnog, a pinch of nutmeg falling onto the foam. Hold.]

Next time you grate a pinch onto your eggnog, remember what that seed once cost.

[VISUAL @ "We cover": End card: the channel logo moves from bottom-right to centre; like and subscribe button cutouts slide in beneath it.]

We cover stories like this from around the world, three times a week. Like and subscribe for more.

[PAUSE 3s]
