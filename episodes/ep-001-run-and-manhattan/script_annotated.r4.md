# The Seed That Emptied an Island Chain (ep-001, round 4): annotated script

Fact base: `facts.md` and `facts2.md` (every claim traces there; see `notes.md`, fact-trace table). Owner direction:
`REVISION_BRIEF_R2.md`; every round-1 note is resolved in `notes.md`, note-resolution table. Round 1 is kept in `r1/`.

**Kit v2 grammar used in every cue** (`kit/KIT_API.md` §13):
- **DATE** = the top-left date label (`Kit.setDate`): plain, old-style, never tilted, never a stamp. Every scene names it.
- **REASON** = the top-right CHAPTER icon bar (narration now says "chapter", never "reason") (`Kit.setReason`): 0 THE SEED (nutmeg), 1 THE ROUTE (dhow), 2 THE COMPANY (voc),
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

[VISUAL: Kitchen-table theme, warm cream. DATE: TODAY. REASON: -1 (all muted). UNCHANGED FROM v3 (owner loves it). A paper pie slice and a mug of eggnog sit centre; a small grater and a brown nutmeg seed slide in from the right; paper flakes drift onto the pie and the foam. At "as medicine", a small apothecary jar slides in beside them.]

Nutmeg is a warm, sweet spice. We grate it onto pies and eggnog, and for centuries people took it as medicine.

[VISUAL @ "Four hundred years ago,": The pie, mug, jar, grater AND the seed LIFT off. NO seed animation in this shot (owner note r3: "remove the animation of the seed, just show the sword"). Navy night. DATE: 1600s. The flat paper map of eastern Indonesia slides in, BANDA ISLANDS labelled. At "wars were fought", the crossed-sword icon from v3 stamps down big over Banda: that is the war. Nothing else.]

Four hundred years ago, wars were fought over this seed.

[VISUAL @ "An indigenous people": The swords LIFT off. The camera pushes in to the Banda shore. A row of 15 bandanese figures stands along it, male and female variants. From "massacred" on, fourteen turn red and fall, one after another, slowly; each fallen figure LIFTS off. By "one remained", only ONE figure stands. NO numbers or labels on screen: only the people falling.]

An indigenous people was massacred. Of every fifteen islanders, one remained.

[PAUSE 2s]

[VISUAL @ "And later,": The last figure LIFTS off. DATE: 1974. A Grenada flag rises right of centre and waves; the camera finds the small nutmeg in its green hoist triangle.]

And later, it somehow ended up on a country's flag, on the other side of the world.

[VISUAL @ "And in the deal": The flag LIFTS off. Navy paper world map. DATE: 1667. A small nutmeg seed sits on the Banda Islands (a plain cutout, no opening animation). At "the Dutch", a Manhattan cutout slides in at the mouth of the Hudson, label MANHATTAN. At "signed away", a treaty seal stamps across Manhattan: "SIGNED AWAY", and Manhattan slides off west while the seed on Banda glows amber.]

And in the deal that kept this seed theirs, the Dutch signed away their claim to Manhattan.

[PAUSE 2s]

## 1b Why kill for a seed

[VISUAL: Cream. DATE: TODAY. REASON: -1. Serif headline card, one italic red word: "Why *kill* for a seed?". Below it two small cutouts pop in as they are named: a flag, then Manhattan.]

So why would anyone kill for a seed? How did it end up on a flag, and tangled up with Manhattan?

[VISUAL @ "The story has":  The headline LIFTS off. Five large icons appear along a dotted line as each is named while the matching icon in the top-right reason bar lights with its label: THE SEED, THE ROUTE, THE COMPANY, THE ISLAND, THE TREATY. Then the big icons shrink up into the bar; REASON returns to -1.]

The story has five chapters. The seed. The route. The company. The island. And the treaty.

## 2a The seed

[VISUAL: Cream. DATE: c. 1500. REASON: 0, THE SEED. A paper map of eastern Indonesia. The island groups draw on, each with its own outline and label: a bracket over all of them, THE MOLUCCAS; in the north, TERNATE and TIDORE with a clove icon; in the south, THE BANDA ISLANDS with a nutmeg icon.]

Chapter one, the seed. Look at these island groups in eastern Indonesia, the Moluccas. Up north, Ternate and Tidore grew cloves.

[VISUAL @ "Down south": The northern labels LIFT off. The camera pushes into the Banda group. Labels west to east: RUN, AI, GUNUNG API, BANDA NEIRA, and the long arc of LONTHOR. Scale bar: "ABOUT 20 KM".]

Down south lie the Banda Islands, a handful of small volcanic islands, with Run at the western end.

[VISUAL @ "Split a fruit": A `nutmegTree` cutout grows on Banda. One fruit swings forward and splits open LIKE A FLOWER (owner note r3): the two shell halves turn outward, each rotating 90° about its own vertical hinge so they open away from the centre like petals (the reverse of v3's direction), revealing a brown seed in a red lacy net. Labels draw on: NUTMEG (the seed), MACE (the red net).]

Split a fruit from this tree, and inside is a brown seed in a red, lacy net. The seed is nutmeg. The net is mace.

[VISUAL @ "For centuries,": The tree LIFTS off. World map, cream. Every coastline greys out except the Banda group, which glows amber. Card: "THE WORLD'S ONLY SOURCE".]

For centuries, every nutmeg in the world came from these few islands.

[VISUAL @ "A nutmeg tree takes": The card LIFTS off. A nutmeg tree stands large in the centre and grows from sapling to full tree as a horizontal timeline draws left to right beneath it: YEAR 0 · YEAR 3 · YEAR 7–9 "FIRST FRUIT" (fruit pops onto the branches here) · YEAR 20 "FULL CROP". A marker slides along the line in step with the tree's growth.]

A nutmeg tree takes seven to nine years to bear fruit.

## 2b The route

[VISUAL: Cream. The map zooms out to the Indian Ocean. DATE: 1400s. REASON: 1, THE ROUTE. `Kit.priceClimb` starts: a red route draws west from BANDA and a nutmeg-seed token rides it to MALACCA, with small dhow cutouts on the leg. Counter: "> 3,000 KM". First price tag at Banda: "×1".]

Chapter two, the route. Bandanese, Javanese and Malay boats carried nutmeg more than three thousand kilometers west, to Malacca.

[VISUAL @ "From there,": The token travels on, pins popping in rhythm: CALICUT, ADEN, ALEXANDRIA, VENICE. A distance counter ticks to "≈ 14,400 KM"; mono label "STRAIGHT LINE · REAL ROUTES WERE LONGER".]

From there, to India, Arabia, Egypt and Venice. About fourteen thousand kilometers in a straight line.

[VISUAL @ "At every port": OWNER'S PICK: the price LADDER from the kit demo on Drive (`kit/compositions/demo-route.html`, `Kit.priceLadder`, eyebrow "PRICE OF NUTMEG", small "EACH HAND TAKES ITS CUT"). Bars rise one per port, each taller than the last, BANDA → MALACCA → CALICUT → ADEN → ALEXANDRIA → VENICE, the route drawn above them. No numbers at the middle ports (none are sourced): only BANDA "×1".]

At every port it changed hands, and every buyer added his own price.

[VISUAL @ "By one historian's": The last ladder bar (VENICE / EUROPE) shoots up past the others and its tag counts to "×100+", source line "AMY JORDAN, 2016". Beside it a paper coffee cup: "$2" swells to "$200+".]

By one historian's estimate, it sold in Europe for more than a hundred times its price in Banda. A two-dollar coffee, selling for two hundred.

[VISUAL @ "So whoever": The whole price climb LIFTS off. A single dotted line draws straight from Banda around Africa to Europe, with a question mark on it.]

So whoever sailed straight to Banda would get rich.

## 3a The company

[VISUAL: Cream. DATE: 1512. REASON: 2, THE COMPANY. A Portuguese ship cutout sails from MALACCA to BANDA, takes on sacks, and sails away again.]

Chapter three, the company. The Portuguese came first, in fifteen twelve.

[VISUAL @ "But when they tried": DATE: 1529. A Portuguese fort outline starts to draw itself on Banda; bandanese figures run at it from both sides; the outline tears and LIFTS away.]

[VISUAL @ "There was no king": A ring of orangKaya figures (long indigo jackets, tall ochre head wraps) stands around a council mat; village pins dot the islands. At "known as the orang kaya", the card stamps on large: "ORANG KAYA · 'RICH MEN' · VILLAGE COUNCILS".]

But when they tried to build a fort, the Bandanese attacked the builders. There was no king to capture or win over, only village councils of rich men, known as the orang kaya.

[VISUAL @ "So Portugal": The council LIFTS off. An arrow runs from Banda to MALACCA, labelled "BOUGHT SECOND-HAND".]

So Portugal settled for buying Banda's nutmeg second-hand, in Malacca.

[VISUAL @ "Then came the Dutch.": DATE: 1599, then 1602. Dutch East Indiaman cutouts arrive under `voc` flags. Centre, `Kit.vocLogo` (chamber A, ink) with `Kit.vocReveal`: the V, O and C draw on like ink, the parchment seal stamps behind them, and two VOC flags rise behind the seal, PERFECTLY SYMMETRIC about the vertical centre line: the right flag is the exact mirror image of the left (mirrored pole, cloth and wave phase), both waving in mirror. Caption: "DUTCH EAST INDIA COMPANY · 20 MARCH 1602".]

[VISUAL @ "It could wage war,": The logo holds, flags still waving. Four power icons stamp down around it as each is named: crossed swords, a treaty seal, a coin, a fort.]

Then came the Dutch. In sixteen-oh-two, they founded the Dutch East India Company, the VOC. It could wage war, sign treaties, mint coins and build forts. A business with its own army.

[VISUAL @ "Its plan": The icons LIFT off. The relay route from 2b redraws; its middle pins LIFT off one by one until a single orange line runs unbroken from Banda to Amsterdam. The VOC logo shrinks to sit at the Banda end.]

Its plan was not to join the relay. It was to own it.

## 3b The next island

[VISUAL: Navy. DATE: 1609. REASON: 2, THE COMPANY. The orange line LIFTS off. The Banda map. Dutch ships with `voc` flags anchor off Banda Neira; a row of dutchman figures on the shore; bandanese figures close in from the trees. Several dutchman figures turn red and fall, then LIFT off; counter "46 DUTCH KILLED". At "the Dutch held on", the VOC flag plants on Banda Neira.]

In sixteen-oh-nine, the Bandanese and the Dutch went to war. Forty-six Dutchmen died in an ambush. But the Dutch held on, and built a fort.

[VISUAL @ "On another island,": The fort cutout "FORT NASSAU · 1609" stands on Banda Neira with a waving `voc` flag. The camera pans west to Ai, where a small trading post flies an `england1616` flag; an englishman figure hands coins to a bandanese figure, who hands back a nutmeg sack.]

On another island, Ai, English traders were still buying nutmeg from the Bandanese. And the Dutch wanted it all for themselves.

[VISUAL @ "In sixteen sixteen,": DATE: 1616. Dutch boats land on Ai; Ai's flag swaps from England to VOC. Bandanese figures in the swim pose cross the strait toward Run, heading west, stroke by stroke through moving paper water. MANY more swimmers than before (about 30 on screen): wave after wave of them turn red mid-strait and sink below the waterline, then LIFT away. Counter: "≈ 400 DROWNED". The survivors reach Run's beach.]

In sixteen sixteen, the Dutch took Ai. About four hundred islanders drowned fleeing across the water to Run.

[PAUSE 2s]

[VISUAL @ "Run was the farthest": The camera settles on Run, the outermost island; a pin and label RUN. NO checklist card. At "the English got there first", an English ship cutout under a waving `england1616` flag appears on the western horizon.]

Run was the farthest out, and next on the Dutch list. But the English got there first.

## 4a Two ships

[VISUAL: Cream. DATE: 1616. REASON: 3, THE ISLAND. A map from London to Asia. English trading-post pins pop, each with a small waving `england1616` flag: SURAT (INDIA), BANTAM (JAVA), MACASSAR, HIRADO (JAPAN). Card: "A STRING OF TRADING POSTS". At "a single ship", one lone ship icon sails from a LONDON pin; opposite it, the VOC logo with its two flags waving above a crowd of ship icons; the two flags are mirror images about the logo's vertical centre line, exactly as in 3a.]

Chapter four, the island. At the time, England's East India Company was not nearly as big as the VOC. It was a string of trading posts from India to Japan, and some years it sent a single ship.

[VISUAL @ "So when Run's": The London map LIFTS off. Close on Banda: Ai under a VOC flag; on Run, orangKaya figures look east toward it. A dotted line runs west to BANTAM; two ship cutouts, labelled SWAN and DEFENCE, sail from it.]

So when Run's leaders, having watched Ai fall, asked England for protection, the English base on Java sent what it had nearby: two ships, the Swan and the Defence.

[VISUAL @ "In command": A dark SHADOW SILHOUETTE of an Englishman (capotain hat, flat collar, doublet), solid ink-black, in an oval paper frame. NO "no known portrait" text anywhere. Name plate: "NATHANIEL COURTHOPE · ENGLISH EAST INDIA COMPANY".]

In command was Nathaniel Courthope.

[VISUAL @ "In December": The portrait LIFTS off. DATE: DECEMBER 1616. The two ships anchor off Run, `england1616` flags waving. OrangKaya figures step onto the deck and lay down, one by one as named: a nutmeg sapling, a clod of earth, a goat cutout.]

[VISUAL @ "The English raised": An `england1616` flag runs up a pole on Run's shore and waves. Thirty small smoke puffs ripple along the ships' sides; counter "30 GUNS".]

In December sixteen sixteen, Run's chiefs came aboard and handed him a nutmeg tree, a clod of earth and a live goat. The English raised their flag on the island and fired thirty guns.

[VISUAL @ "In an English letter": A parchment scroll unrolls (`Kit.scrollPaper`) and types: "…surrender their island … to our sovereign the king of England"; the text scrolls up so the line sits centre. No "Puloroon" anywhere.]

In an English letter, they agreed to surrender their island to the king of England.

[VISUAL @ "To hold it,": The scroll LIFTS off. Split frame. Left: Run with a waving `england1616` flag over a small fort and a waffle of 39 englishman figures. At "The Dutch had an army", right: the VOC logo with its two mirrored flags waving, rows of dutchman soldier figures and ship icons stacking up beneath it, many times larger.]

To hold it, Courthope had thirty-nine men. The Dutch had an army.

## 4b The siege

[VISUAL: Navy. DATE: DECEMBER 1616. REASON: 3, THE ISLAND. Run, close. Cannon cutouts roll off the ships; englishman and bandanese figures haul them uphill (walk). Two small fort cutouts draw on, three gun icons each. At "three Dutch ships", DATE: JANUARY 1617, and three Dutch ships under waving `voc` flags anchor offshore, between Run and the open sea.]

In January sixteen seventeen, three Dutch ships arrived to cut Run off.

[VISUAL @ "The Swan was taken": DATE: 1617. The Swan, labelled, sails out; a Dutch ship closes; a clock card "90 MINUTES"; five englishman figures on deck turn red and fall, then LIFT off; her flag swaps to VOC. At "Then nine", DATE: MARCH 1617, and nine sailor figures on the Defence; her cable snaps and she sails east to the Dutch. Card: "9 MEN · MUTINY". The sea off Run is empty; card "BOTH SHIPS LOST". At "he didn't give up", the English flag on Run's shore rises again and waves.]

The Swan was taken after a ninety-minute fight. Then nine of his own men cut the Defence's cables and sailed her to the Dutch. Courthope had lost both his ships. But he didn't give up.

[VISUAL @ "His plan:": A day counter starts lower left: DAY 1. A ring of VOC ship cutouts circles Run at a distance. Canoe cutouts slip in from SERAM carrying sacks marked SAGO. The counter climbs: DAY 365… DAY 730.]

His plan: hold on until help came. Small boats smuggled in sago, a palm flour, from the island of Seram.

[VISUAL @ "England did send": DATE: 1618. Three English relief-ship cutouts sail toward Banda; two are surrounded and their flags swap to VOC; the third LIFTS off the map with a small "?". Card: "2 CAPTURED · 1 VANISHED".]

[VISUAL @ "In sixteen nineteen,": The relief ships LIFT off. DATE: 1619. Cream, London. An englishman and a dutchman in the sign pose over a scroll. Card: "PEACE IN EUROPE · ONE-THIRD OF THE SPICES TO ENGLAND". At "But on Run", the camera swings back to Run: the English flag still waving, englishman and bandanese figures at the guns, the day counter still climbing.]

England did send three relief ships. The Dutch captured two, and the third vanished. In sixteen nineteen, London made peace with the Dutch in Europe, for a third of the spices. But on Run, Courthope held on.

[VISUAL @ "In October sixteen twenty,": ONE continuous shot, about 30 s, no cut. Navy night. DATE: OCTOBER 1620. Map: Run, and east of it the long arc of LONTHOR; an orangKaya figure waits on Lonthor's shore under a small `england1616` flag. Card: "READY TO DEFY THE DUTCH". At "He crossed", a small boat with a few englishman figures rows from Run to Lonthor under a paper moon. At "But a spy", a dutchman figure slips from the Run shore toward a Dutch ship (small tag "A SPY · ONE ACCOUNT"). At "On the way back", the boat rows back west; Dutch boat silhouettes close in from the dark; small musket flashes. At "shot in the chest", the englishman figure at the stern turns red and falls over the side; a single splash ring spreads and fades. Paraphrase card: "SHOT IN THE CHEST · OVER THE SIDE · NEVER SEEN AGAIN", source tag "SWORN STATEMENTS, 1622".]

In October sixteen twenty, Courthope learned that Lonthor, the big island to the east, was ready to defy the Dutch and surrender to England too. He crossed at night in a small boat, with a few men, to accept it. But a spy, one account says, had warned the Dutch. On the way back, their boats were waiting in the dark. Courthope was shot in the chest, went over the side, and was never seen again.

[PAUSE 2s]

[VISUAL @ "That same month": The day counter stops: "≈ 1,400 DAYS · NEARLY FOUR YEARS". The 39-figure waffle LIFTS off; the English flag on Run lowers and LIFTS off. DATE: 26 OCTOBER 1620. A letter cutout slides in, sealed with orange wax stamped with the VOC monogram.]

That same month, the head of the VOC in Asia wrote down his plan for Banda.

## 5a Sixteen twenty-one

[VISUAL: Navy. DATE: 1620. REASON: 3, THE ISLAND. `Kit.portrait` with `src: "assets_r2/portraits/coen_waben_westfriesmuseum_1920px.jpg"`, `fit: "xMidYMin slice"`, black and white; plate "JAN PIETERSZOON COEN · VOC GOVERNOR-GENERAL"; credit "Jacques Waben, c. 1625. Westfries Museum, Hoorn". The letter opens beside it; one line is drawn over in red: "to once again subjugate Banda, and populate it with other people".]

[VISUAL @ "His motto:": A second quote card slides under the first: "Despair not, spare not your enemies" · 1618.]

His name was Jan Pieterszoon Coen. It was necessary, he wrote, to subjugate Banda again, and to populate it with other people. His motto: "Despair not, spare not your enemies."

[VISUAL @ "He sailed": The portrait and cards LIFT off. DATE: 1621. A route draws from BATAVIA (JAVA) to Banda. Along it: 19 ship icons under waving `voc` flags; a crowd row of dutchman figures, "1,655 DUTCH SOLDIERS"; a row of japaneseMercenary figures, "286 JAPANESE MERCENARIES". At "His goal", a red stamp lands across the route: "TOTAL SUBJUGATION". DATE: 1621 and VOC flags run up across Lonthor.]

He sailed from Batavia, on Java, with nineteen ships, sixteen hundred and fifty-five Dutch soldiers and two hundred and eighty-six Japanese mercenaries. His goal: total subjugation.

[VISUAL @ "The Dutch landed": DATE: MARCH 1621. The fleet LIFTS off. Dutch soldier figures march ashore on Lonthor and Banda Neira under waving `voc` flags. A row of orangKaya figures stands on Banda Neira. NO portrait.]

[VISUAL @ "In May,": DATE: MAY 1621. Three japaneseMercenary figures stand behind the row (no weapons drawn). The orangKaya figures turn red and fall, one at a time, slowly; then all LIFT off together.]

The Dutch landed, and carried out the plan. In May, dozens of the orang kaya were killed, beheaded by Japanese mercenaries.

[PAUSE 2s]

[VISUAL @ "Before the conquest,": A waffle of 15 bandanese figures, male and female, label "EACH ≈ 1,000 PEOPLE"; big counter "≈ 15,000". At "about one thousand", the counter runs down to "≈ 1,000". At "Some fourteen thousand", fourteen figures go, as each fate is named: turn red and fall (killed), slump (starved), walk off west in a line (enslaved), row away east (driven away); a sum card writes "15,000 − 1,000 = 14,000 GONE". Each group LIFTS off when its word ends. At "Of every fifteen", one figure remains, alone, centre.]

Before the conquest, about fifteen thousand people lived on Banda. Afterward, about one thousand. Some fourteen thousand were killed, starved, enslaved or driven away. Of every fifteen, one remained.

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

Every year, Dutch officials sailed out to check that no one had come back to trade. The island was empty. The English claim was not.

## 6a The other island

[VISUAL: Cream. DATE: 1626. REASON: 4, THE TREATY. REUSE v3 shots 1a-6/1a-7, reversed: from the Banda Sea a dotted line runs across the globe west to the mouth of the Hudson, counter "≈ 15,000 KM"; an amber pin drops on the Hudson, label MANHATTAN. A small Dutch fort cutout appears on the island's southern tip, flying a plain orange-white-blue Dutch flag (no VOC monogram: New Netherland belonged to the West India Company, not the VOC).]

Chapter five, the treaty. On the other side of the world, in Manhattan, the Dutch had set up a colony by the mid-sixteen twenties.

[VISUAL @ "A letter": A parchment scroll unrolls and types: "Amsterdam, 5 November 1626… bought Manhattes Island from the Native People for 60 guilders worth of trade". Tag: "PIETER SCHAGHEN'S LETTER · THE ONLY RECORD · NO DEED SURVIVES".]

A letter from sixteen twenty-six says they bought the island from the Native people for sixty guilders' worth of trade goods.

[VISUAL @ "The same ship": The balance LIFTS off. A ship cutout; its hold fills with beaver-pelt icons as a counter runs to "7,246". At "One modern estimate", a card: "THE FURS ≈ 50,000–60,000 GUILDERS · MODERN ESTIMATE", and a scale bar "60" against "≈ 1,000×". At "almost for free", a red stamp on Manhattan: "ALMOST FREE".]

The same ship carried seven thousand two hundred and forty-six beaver skins. One modern estimate puts the furs at close to a thousand times the island's price. In other words, they got Manhattan almost for free.

[VISUAL @ "Then, in sixteen sixty-four,": The ship LIFTS off. DATE: 1664. English squadron cutouts under waving `union1606` flags sail into the harbor; englishman figures on deck. Tag: "PEACETIME". The label NEW AMSTERDAM flips to NEW YORK.]

Then, in sixteen sixty-four, an English squadron sailed in, and the Dutch governor surrendered, with no war declared. The town became New York.

## 6b Breda

[VISUAL: Navy. DATE: 1667. REASON: 4, THE TREATY. A cutout map of the Medway estuary in England. Dutch ships under waving `dutchRepublic` flags sail upriver; English ship silhouettes catch fire in red.]

Three years later, in a new war, Dutch ships sailed up the Medway, a river in England, and burned the English fleet.

[VISUAL @ "Weeks later,": DATE: 31 JULY 1667. The Medway LIFTS off. REUSE v3 shot 1a-5 (the Breda envoys): navy paper world map; two envoy figures in the "sign" pose over the North Sea, a treaty scroll between them. Left: an englishman with an `england1616` pennant on top. Right: a dutchman with a `dutchRepublic` pennant on top. Labels in their flag colours: ENGLAND (red), THE DUTCH REPUBLIC (blue). Both pennants wave. Title: "TREATY OF BREDA".]

[VISUAL @ "It ran on": REUSE v3 shot 1b-2: the envoys step back; a parchment scroll unrolls (`Kit.scrollPaper`) and types "UTI POSSIDETIS", then "WHAT YOU HAVE, YOU HOLD".]

[VISUAL @ "The Dutch, who were": The scroll types two columns. THE DUTCH KEEP: RUN, SURINAME. ENGLAND KEEPS: NEW NETHERLAND (NEW YORK). A Suriname pin drops on South America.]

Weeks later, in sixteen sixty-seven, English and Dutch envoys signed a peace in the Dutch town of Breda. It ran on an old Latin rule, uti possidetis. What you have, you hold. The Dutch, who were winning, claimed the prizes: Run and Suriname. They let England keep New Netherland, by then New York.

[VISUAL @ "In the end,": The scroll and envoys LIFT off. REUSE v3 shot 1a-8: Run fills the frame with a scale bar "3 KM × 1 KM". Manhattan slides in; Run lifts, travels on top of Manhattan and settles over the green outline of Central Park; the shapes nearly match. Card: "ABOUT THE SIZE OF CENTRAL PARK".]

[VISUAL @ "and let Manhattan go.": REUSE v3 shot 1a-9: Run slides back to the Banda Sea, Manhattan to the Hudson. A paper balance scale appears between them; Manhattan's pan rises, Run's sinks, and a single amber pin lands on Run.]

In the end, the Dutch kept Run, an island about the size of Central Park, and let Manhattan go.

[VISUAL @ "So what changed": The scale LIFTS off. The two-island map. A red arrow labelled "ENGLISH CLAIM, 1616" runs from England to Run; a blue arrow labelled "DUTCH CLAIM" runs from the Netherlands to Manhattan. At "England dropped", the red arrow LIFTS off; at "The Dutch dropped", the blue arrow LIFTS off.]

So what changed hands was not islands, but claims. England dropped its claim to Run. The Dutch dropped theirs to Manhattan.

[VISUAL @ "For the Dutch,": The orange VOC line from Banda to Amsterdam returns. A small red gap glows at Run, then closes. The VOC logo at Banda raises its two flags and they wave.]

For the Dutch, that closed the last gap. Every nutmeg on the market now came from land they held.

[PAUSE 2s]

[VISUAL @ "The monopoly lasted": The orange line holds, whole. Then a hairline crack appears at its western end.]

The monopoly lasted about a hundred years.

## 7a The escape

[VISUAL: Cream. DATE: 1760s. REASON: -1 (all muted). Map of the Indian Ocean, the orange VOC line unbroken, a pin on MAURITIUS. `Kit.portrait` with `src: "assets_r2/portraits/poivre_grognard_1783.jpg"`, black and white; plate "PIERRE POIVRE · FRENCH INTENDANT OF MAURITIUS"; credit "Engraving by Grognard, 1783. Bibliothèque nationale de France". Behind the portrait a `franceRoyal` flag with `lis: true` (white with gold lilies) rises and waves.]

France wanted into the nutmeg business. Pierre Poivre, who ran French Mauritius, had a bold idea.

[VISUAL @ "Smuggle the seeds": Small boat cutouts under French flags slip out of the Moluccas carrying potted seedlings; a dotted line runs to MAURITIUS. A small mono card pins to the portrait frame: "POIVRE = 'PEPPER'".]

Smuggle the seeds out of the Dutch spice islands.

[VISUAL @ "By the early": DATE: EARLY 1770s. A garden cutout at PAMPLEMOUSSES, near Port Louis, with a small nutmeg sapling. The crack in the orange line widens slightly. Then the portrait, French flag and garden LIFT off.]

By the early seventeen-seventies, his smuggled nutmeg was growing on Mauritius.

[VISUAL @ "Then the tables": DATE: c. 1800. A paper table card flips over. British warship cutouts under waving `union1606` flags anchor at Banda; card "THE WARS WITH FRANCE"; at dawn a line of sailor figures climbs to the pentagon of FORT BELGICA; the VOC flag lowers and the British flag rises. Shown ONCE (one taking).]

Then the tables turned again. Britain, by then the strongest power at sea, took the Banda Islands during its wars with France, around eighteen hundred.

[VISUAL @ "They did the real": Seedling pots packed with soil load onto a ship. Red arrows fan out from Banda: PENANG, CEYLON, SINGAPORE. Then one long arrow crosses to GRENADA in the Caribbean.]

They did the real damage. They dug up seedlings, packed them in soil, and shipped them to Penang, to Ceylon, to Singapore. From there, nutmeg reached Grenada, in the Caribbean.

[VISUAL @ "Grenada became": DATE: 1974. The arrows LIFT off. The Grenada flag from 1a rises large and waves; the camera pushes into the green hoist triangle, onto the nutmeg. The reason bar lights all five icons for a beat, then mutes.]

Grenada became one of the world's biggest nutmeg producers. At independence, in nineteen seventy-four, it put the seed on its flag.

[PAUSE 2s]

## 7b Back to the kitchen

[VISUAL: Kitchen-table theme. DATE: TODAY. REASON: -1. Two paper price cards. First, left: "1626 · ONE KILO ≈ 4 GUILDERS · ≈ A LABOURER'S WEEK OF PAY", beside a sailor figure standing in for the labourer. At "By one inflation estimate", it adds a line in red: "≈ $75 TODAY · INFLATION-ADJUSTED, ROUGH ESTIMATE". At "Today, the farmer", the right card lands: "TODAY · ≈ $6 A KILO TO THE FARMER". A paper bar pair: $75 vs $6.]

In sixteen twenty-six, a kilo of nutmeg cost about four guilders in Amsterdam, nearly a week's pay for a labourer. By one inflation estimate, that's roughly seventy-five dollars. Today, the farmer who grows a kilo gets about six.

[VISUAL @ "The fight for": The price cards LIFT off. Navy. Big and clear, side by side, filling most of the frame: at "Courthope", a LARGE englishman figure (Courthope's silhouette) turns red and falls, and stays visible lying full-length; at "Run every tree", a LARGE nutmeg-tree cutout tips over and lies full-length beside him; at "fifteen thousand", the 15-figure row from 5a with one left. Small labels: "COURTHOPE · 1620", "RUN · EVERY TREE", "≈ 15,000 → ≈ 1,000".]

[VISUAL @ "Some survivors": Everything LIFTS off. The Banda map; a small boat with a bandanese man and woman leaves Banda and sails east, a dotted line drawing behind it, to the KEI ISLANDS; two village pins on Kei Besar: BANDA ELI, BANDA ELAT. At "still speak", card: "BANDA LANGUAGE · ≈ 3,000 SPEAKERS (1987)". (No distance shown: unverified.)]

The fight for this seed cost Courthope his life, and Run every tree. The Bandanese went from about fifteen thousand people to about one thousand. Some survivors had to flee their islands, and took their culture and language with them. They sailed east, to the Kei Islands, where two villages still speak their language and keep their culture alive.

[VISUAL @ "Run's nutmeg": Back to the opening two-island map from 1a, cream. On Run, nutmeg-tree cutouts grow back one by one; small counter "POP. 1,572". On the left, Manhattan, labelled NEW YORK.]

Run's nutmeg trees have grown back.

[VISUAL @ "Today, Manhattan's": REUSE v3 shot 1b-1, cream: two paper counters side by side. Left, under a Manhattan cutout: "≈ $1 TRILLION A YEAR" (source tag "BEA, 2024"). Right, under a Run cutout and a nutmeg sack: "≈ 50 TONNES OF NUTMEG". At "ten seconds", a stopwatch ticks 0 to 10 while a coin stack under Manhattan grows to match Run's sack. Card: "RUN'S WHOLE HARVEST ≈ 10 SECONDS OF MANHATTAN". Then the counters LIFT off.]

Today, Manhattan's economy makes about a trillion dollars a year. Run's whole nutmeg harvest is worth about ten seconds of that.

[VISUAL @ "So, was it": The paper balance from chapter five returns between the islands: Run under a waving `dutchRepublic` flag, Manhattan under a waving `union1606` flag. The pans wobble and never settle. Question card: "WHO GOT THE BETTER DEAL?".]

So, was it worth it? Who got the better deal: the Dutch, with Run, or the English, with Manhattan? It's up for debate. Tell us in the comments.

[VISUAL @ "Next time": NO Run-over-Manhattan move (owner note r3: removed). The balance LIFTS off and a slow dissolve goes straight to the kitchen table: the mug of eggnog, a pinch of nutmeg falling onto the foam. Hold.]

Next time you grate a pinch onto your eggnog, remember what that seed once cost.

[VISUAL @ "This is Story": End card: the channel logo, wordmark "STORY OF EVERYTHING", moves from bottom-right to centre; like and subscribe button cutouts slide in beneath it.]

This is Story of Everything. We cover stories like this from around the world, three times a week. Like and subscribe for more.

[PAUSE 3s]
