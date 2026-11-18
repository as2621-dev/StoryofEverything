# How Manicule Writes a Script

Source: YouTube auto-captions for 8 videos, deduplicated into clean prose (`scripts/<id>.txt`). Numbers come from
`work/metrics.py`, beat timings from `work/beats.py`, both in the `manicule` folder. Quotes are copied from the
transcripts. The caption files garble some symbols, so these were restored: `°`, `£`, `García-Castellanos`, `Sörgel`.
Square brackets inside a quote mark a word the captions dropped.

Caveat: there are only 8 videos, and views also depend on upload age and luck with the algorithm, which we cannot
see. Read the "why the top 3 won" section as strong hypotheses, not proof.

---

## 0. The numbers

| Video | Views | Sec | Words | WPM | Avg sentence (words) | Sentences ≤5 words | Sentences ≥20 words | Questions/min | Numbers/min | "you"/min |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Antarctica shortcut | 1.2M | 495 | 1,269 | 154 | 10.7 | 16% | 5% | 0.24 | 6.9 | 0.48 |
| Sydney to London | 1.1M | 586 | 1,365 | 140 | **8.5** | **33%** | 4% | 0.41 | 7.5 | 0.72 |
| Atlantic at night | 492K | 501 | 1,268 | 152 | 10.1 | 24% | 11% | **0.48** | **9.5** | **2.04** |
| Tibet shortcut | 74K | 521 | 1,378 | 159 | 12.2 | 14% | 14% | 0.35 | 5.5 | 0.58 |
| Floodgate | 11K | 560 | 1,485 | 159 | 10.2 | 11% | 4% | 0.21 | 7.7 | 0.21 |
| MH370 | 10K | 561 | 1,345 | 144 | 13.6 | 6% | 15% | 0.11 | 7.1 | 0.43 |
| Mediterranean | 10K | 567 | 1,347 | 143 | 12.4 | 13% | 18% | 0.32 | 5.6 | 0.32 |
| Airports in the sea | 8.8K | 520 | 1,257 | 145 | **14.1** | 10% | **24%** | 0.12 | 7.5 | 0.12 |
| **Top 3 mean** | | | 1,300 | 149 | **9.8** | **24%** | **7%** | **0.38** | **8.0** | **1.08** |
| **Other 5 mean** | | | 1,362 | 150 | **12.5** | **11%** | **15%** | **0.22** | **6.7** | **0.33** |
| **All 8** | | | 10,714 | 149 | 11.2 | | | 0.28 | 7.1 | 0.60 |

"Numbers" counts digits plus number words (one, five, million, half...).

What this shows:

- **Length is fixed:** about 1,250–1,500 words at about 150 WPM, for 8–10 minutes. A calm, measured read. Speed does
  not separate the hits from the rest.
- **Shorter sentences, more fragments.** The top 3 average 9.8 words a sentence against 12.5 for the rest, and
  have twice as many sentences of five words or fewer (24% against 11%). Sydney to London, at 8.5 words a sentence
  with one sentence in three a fragment, is the most clipped of all.
- **More questions and more "you".** The top 3 ask about 70% more questions a minute and say "you" three times as
  often (Atlantic: 17 times, "Reason number one is sitting on your wrist").
- **Numbers come at a steady 6–10 a minute,** about one every 7–10 seconds, and slightly more often in the hits.
- **"So" is the main connective,** 3–12 per video, and 9–10 sentences start with "So" in each hit. "Which means" is
  rare (twice in 8 videos); the chain is carried by **"So... But... And..."**.

---

## 1. The formula

Every video is **a five-item list dressed as a story**: five reasons, walls or clues. A cold-open puzzle opens it, and
a callback to the opening image closes it. The beats below are averaged from all 8 videos.

| # | Beat | Where (% of runtime) | What happens | Stock phrasing |
|---|---|---|---|---|
| 1 | **Hook / cold open** | 0–8% (0:00–0:45) | A concrete scene, contrast or dated event that is strange on its face. No channel intro, no "in this video". | "Every evening, something strange happens over…" / "On the 27th of July, 2026…" |
| 2 | **The question** | 2–13% | The title asked word for word as a "So, why…?" question. | "So, why do planes avoid Antarctica?" |
| 3 | **The obvious answer, knocked down** | 5–12% | The answer the viewer is already guessing (it's banned, it's closed, it's too far) is ruled out with one hard fact. | "And no, it's not forbidden." / "And it isn't closed." |
| 4 | **Roadmap plus open loop** | 8–13% | "There are five reasons." Tease the first and/or last item, or promise something "at the end". | "The first one has nothing to do with ice, and the last one cost 257 lives." |
| 5 | **Items 1–2: mechanism** | 10–45% | Each item opens with a plain claim as its header, explains the physics or economics with an everyday comparison, gives a number tied to something familiar, then tells a short dated story with a named person. | "Reason two, there's nowhere to land." |
| 6 | **Mid-video subscribe line** | 43–60% (6 of 8 videos) | The same two sentences every time, placed between items. | "If you like seeing the world through maps like this, subscribe. There's a new deep dive every week." |
| 7 | **Items 3–4: complication** | 45–75% | Harder and less intuitive reasons. A bridge line hands each item to the next. | "And that's the next problem. Because passengers are weight too." |
| 8 | **Item 5: stakes / reveal** | 65–90% | Pays off the open loop: the disaster, the deaths, the exception, or the reason that "isn't what you think". | "So far, every reason is about what might happen. The last one actually did." |
| 9 | **Twist / exception** | 82–90% | "And yet…": the case that breaks the rule (DHL over Tibet, Qantas near Antarctica, the shipwrecks). | "And yet, sometimes a plane does go there." |
| 10 | **Recap** | 90–95% | The question asked again, then the five item headers squeezed into one list of fragments. | "Almost nobody to fly to, nowhere to land, nowhere to go down…" |
| 11 | **Close** | 95–100% | A return to the opening image, then a quiet, wry last line. No sign-off and no end-screen pitch. | "Over Tibet, the hard part is coming down." |

Each item gets about 14–18% of the runtime (75–95 seconds, roughly 200–250 words). Each one follows a fixed inner order:
**claim header → mechanism → a number made familiar → a dated, named story → a bridge to the next item.**

### 1a. Filled in: "The Shortcut Over Antarctica No Airline Takes" (1.2M, 8:15)

| Beat | Time | Content |
|---|---|---|
| Hook | 0:00 | The Arctic is busy with flights; "Now look at the bottom of the world. Almost nothing." |
| Question | 0:11 | "So, why do planes avoid Antarctica?" |
| Escalation | 0:13 | "Here's the strangest part." A string on a globe from Perth to Buenos Aires "dives south over the ice". |
| Obvious answer knocked down | 0:38 | "And no, it's not forbidden. The Antarctic Treaty doesn't ban flights." |
| Roadmap plus loop | 0:54 | "There are five reasons why. The first one has nothing to do with ice, and the last one cost 257 lives." |
| Mechanism 1 | 1:03 | Nobody lives down there: "like chairs around a table" (the north), SAS snowsuits in 1954, Polar 1–4. |
| Mechanism 2 | 2:19 | Nowhere to land: ETOPS 60 → 330/370 minutes; "draw a circle like that around every airport". |
| Mechanism 3 | 3:49 | Nowhere to descend to: a 3 km oxygen target against ice more than 4,000 m high. |
| Subscribe line | 4:33 | The stock two sentences. |
| Complication 4 | 4:37 | Cold: Jet A-1 starts waxing at −47°; air outside a Qantas jet at −75; Vostok −89.2°. |
| Bridge | 5:25 | "So far, every reason is about what might happen. The last one actually did." |
| Stakes / reveal 5 | 5:30 | Whiteout and Flight 901 into Mount Erebus, 257 dead (pays off the loop from 0:54). |
| Twist | 6:48 | "And yet, sometimes a plane does go there." Qantas 2021 and 2023, sightseeing charters. |
| Recap | 7:36 | "So, why do planes avoid Antarctica? Almost nobody to fly to, nowhere to land…" |
| Close | 7:50 | "that straight line from Perth to Buenos Aires is still waiting. It isn't banned…" |

### 1b. Filled in: "Why Sydney to London Is the Hardest Flight on Earth" (1.1M, 9:46)

| Beat | Time | Content |
|---|---|---|
| Hook | 0:00 | A dated event with one odd detail: a new Airbus flies Melbourne to Toulouse "Except for the direction." It goes east, 24h 24m. |
| First question, answered at once | 0:47 | "So why fly the wrong way on purpose? Because next year, this plane has one job. Sydney to London. Nonstop." |
| Title question | 1:11 | "So what makes Sydney to London the hardest flight on Earth?" after "no airline has ever sold you a ticket… Not once." |
| Roadmap plus loop | 1:15 | "There are five walls in the way. The first one is on the globe. And the last one has nothing to do with planes at all." |
| Mechanism 1 | 1:22 | The globe: the Antipodes Islands, 17,000 km, "more than 40 percent of the way around the planet". |
| History run | 2:20 | Three months by ship, Smith brothers 1919, 1947 Kangaroo Route, 1989 747 stunt, 2018 Perth nonstop ("But look where Perth is."). |
| Bridge | 4:21 | "From Sydney, the wall is still there. So what exactly is it made of?" |
| Mechanism 2 | 4:28 | Fuel is weight: "That's the trap. Every extra hour costs more than the hour before it." |
| Complication 3 | 5:23 | "Wall number three is you." 238 seats. |
| Complication 4 | 6:25 | The human body: the 2019 research flights, melatonin. |
| Bridge | 7:31 | "So the plane can make it. The people can make it. Which leaves the last wall." |
| Stakes / reveal 5 | 7:42 | "The world itself": closed airspace adds 45 minutes, so the Perth nonstop now stops in Singapore (pays off "nothing to do with planes"). |
| Recap | 8:53 | "Five walls. The globe. The fuel. The seats. The body. And the world." Then "Three months by ship. 28 days by bomber…" |
| Close | 9:16 | A callback to the test flight: "It wasn't a detour. It was a promise… Whether the sky stays open long enough to use them is another question." |

There is no mid-video subscribe line in this one.

### 1c. Filled in: "Why Planes Cross the Atlantic at Night" (492K, 8:21)

| Beat | Time | Content |
|---|---|---|
| Hook | 0:03 | A daily phenomenon told as a scene: "By midnight, they've stretched into a glowing river." |
| Proof | 0:45 | "1,805 flights in 24 hours. A record." |
| Question | 0:58 | "So, why? Why do airlines cram one of the busiest ocean crossings on Earth into the middle of the night?" |
| Roadmap plus loop | 1:07 | "There are five reasons. And the last one isn't on the ground at all. It's in the sky." |
| Mechanism 1 (the obvious answer) | 1:13 | Time zones, "sitting on your wrist"; the dropped Delta daytime flight to Paris. |
| Turn | 2:08 | "So, time zones explain why passengers like the night. But, they don't explain why airlines love it. For that, you have to follow the plane." |
| Mechanism 2 | 2:15 | Use of each plane: "One plane, one round trip, 24 hours. Nothing wasted." Callback: "A very expensive bedroom." |
| Complication 3–4 | 3:25 | The hub's morning wave; curfews at Frankfurt and Heathrow, "That leaves a window." |
| Stakes / reveal 5 | 4:54 | "the one in the sky": the North Atlantic tracks, the jet stream, the 4h 56m BA record (pays off the loop). |
| Twist | 6:40 | No radar, one guess every 14 minutes, satellite ADS-B in 2019, so "the river can carry more planes than ever." |
| Recap | 7:30 | "So, that's the river. Passengers want to sleep… Five reasons. One river of lights." |
| Close | 7:57 | It speaks to the viewer: "look out the window. You're not alone up there… Every evening, over the Atlantic." |

There is no mid-video subscribe line in this one either.

---

## 2. Hook anatomy (the first ~40 seconds of each video)

**Antarctica (1.2M): visual contrast, then "the strangest part", then myth-bust**
> "Everyday airliners fly over the top of the world. Between North America and Asia, they cut straight across the
> Arctic. Now look at the bottom of the world. Almost nothing. So, why do planes avoid Antarctica? Here's the strangest
> part. Take a globe and stretch a string from Perth in Australia to Buenos Aires in Argentina. Pull it tight. The
> shortest path doesn't cross the ocean the way a flat map suggests. It dives south over the ice, past the South Pole
> with less than 500 km to spare. No airline flies that line, not one. And no, it's not forbidden."

Pattern: two map images side by side (busy north against empty south), then a hands-on demonstration (the globe and
string) that proves the gap is real, then the obvious explanation knocked down. The question comes early (0:11),
and the hook keeps escalating after it.

**Sydney to London (1.1M): dated event with one wrong detail**
> "On the 27th of July, 2026, a brand-new Airbus took off from Melbourne, in Australia, headed for Toulouse, in
> France. Nothing strange about that. Except for the direction. Instead of turning west, over Asia, it turned east.
> Out over the Pacific. Across North America. Over the Atlantic. The long way around the planet. It stayed in the air
> for 24 hours and 24 minutes. 23,000 kilometres, without touching the ground."

Pattern: "Nothing strange about that. Except…" sets up a normal event and then flips it. The route is read out as a
run of fragments that track a moving line on the map. A small mystery (why fly the wrong way?) is solved at 0:47 and
opens the big one.

**Atlantic at night (492K): a daily phenomenon painted as a scene**
> "Every evening, something strange happens over the Atlantic Ocean. Around sunset in New York, planes start leaving.
> Boston, Toronto, Chicago, Washington, one after another, all pointing the same way. East. By midnight, they've
> stretched into a glowing river. Hundreds of aircraft flying across an ocean where it's completely dark. And then, by
> breakfast, they're gone."

Pattern: present tense and a time-lapse told in words (sunset, midnight, breakfast), with a single metaphor that runs
through the whole video (the river). It is something the viewer can picture or has flown through. The question waits
until 0:58.

**Tibet (74K): two numbers that don't add up**
> "Airliners cruise about 11 km up. Mount Everest is less than nine. So, in theory, a jet can fly over anything on
> Earth. And yet, across Asia, most long-haul flights go around one place. So, why do planes avoid flying over Tibet?
> This is the Tibetan Plateau. A plateau is a huge block of high ground, and this one is bigger than Greenland… And it
> isn't closed."

Pattern: two numbers, a logical conclusion from them, then "And yet" breaks it. Tight and clever, but it is a logic
puzzle rather than a picture, and the question arrives at 0:15.

**Airports in the sea (8.8K): a vivid historical image, then a list of cities**
> "For decades, many pilots landing in Hong Kong aimed at a hill painted with a giant checkerboard, then turned hard,
> low over the rooftops. In 1998, Hong Kong moved its airport into the sea. Osaka, Nagoya and Kobe built theirs in
> the sea too. So why build an airport in the sea? Making new land in the sea is slow and expensive, and these cities
> did it anyway, for five reasons. At the end, we'll see what a typhoon did to one of these islands in 2018."

Pattern: the image is strong but the hook drops it within a sentence. "Slow and expensive… did it anyway" is the
knocked-down obvious answer. The list starts at 0:38, the earliest of all 8, so the hook gets almost no time.

**MH370 (10K): a news anchor, then a reframe**
> "In March 2014, a Malaysia Airlines jet with 239 people on board disappeared. Satellite data pointed searchers to a
> remote stretch of the southern Indian Ocean. More than 12 years later, the main wreckage still hasn't been found. So
> why is it so hard to find a plane on the sea floor? Part of the answer is that nobody knows exactly where it went
> down. But before the searchers could even look for the plane, they had to map the sea floor itself. Almost all of
> Mars has been photographed from orbit in pixels just 5 m across."

Pattern: a famous tragedy is the bait, and the video swerves to mapping the sea floor at 0:25. The Mars comparison
is excellent, but the topic people clicked for (the plane, the shipwrecks) is not what they get.

**Mediterranean (10K): a counter-intuitive fact, then "how do we know"**
> "Every year, the Mediterranean Sea loses more water to the sky than all its rivers and rain put back. It stays full
> because the Atlantic Ocean pours in, at Gibraltar. Around 6 million years ago, the Atlantic was almost cut off, and
> the Mediterranean began to dry up. So how do we know?… Nobody was there to see it happen. But it left clues: salt,
> signs of open air, buried canyons, closed gates, and a flood that makes the Amazon look like a trickle."

Pattern: it gives away the answer (it dried up) and asks about evidence instead. That suits a detective format, but
the puzzle is academic. The roadmap itself is a strong line: "a flood that makes the Amazon look like a trickle".

**Floodgate (11K): a natural experiment with a twist of vindication**
> "On the 11th of March, 2011, one tsunami hit two small fishing towns on the same stretch of Japanese coast. Both
> towns had built walls against the sea. The wave went over both. In one town, 181 people died or went missing. In
> the other, behind the wall, not a single home was swept away. That was the wall people had called a waste of money.
> So what does it actually take to hold back the sea?"

Pattern: two towns, one wave, opposite outcomes. It is the strongest story hook of the 8, but it then pivots to a
survey of five walls around the world. The title promises one man's story, and that story is finished by 2:15.

**Hook rules that emerge:**

1. Open on **a picture, not an argument**: a map contrast, a moving line, a glowing river.
2. Plant **something that is wrong** in it: "Except for the direction." / "Almost nothing." / "something strange".
3. Ask the title as a "So, why…?" question.
4. **Escalate once more** after the question ("Here's the strangest part." / "Not once.").
5. **Rule out the lazy answer** ("And no, it's not forbidden.").
6. "There are five…" plus a tease about the first or last item.

---

## 3. Sentence-level style

### Rhythm
A long sentence that sets the scene, then two or three hard fragments. Facts come one per sentence.
> "Open cockpit. Paper maps. 28 days later, they landed in Darwin."
> "It was a stunt. Not a service."
> "The same day. Barely past lunch."
> "Australia's first nonstop flight to Europe. Now with a stop."

The clipped fragment usually lands an irony or a verdict. The lists in the recap are fragments too.

### How a number is set up
1. **The number gets its own sentence or fragment**, often with an aside: "20 hours and 9 minutes. A record." /
   "1,805 flights in 24 hours. A record."
2. **Then it is made familiar with "That's…"**: "That's more than 6 hours on a single engine." / "That's about a mile
   of salt." / "That's about the height of a four-storey building." / "That's about the price of one or two Mars
   rovers." / "The weight of a few passengers and their bags."
3. **Two numbers set against each other make a paradox**: "Airliners cruise about 11 km up. Mount Everest is less
   than nine." / "Mars… pixels just 5 m across. For most of the floor of our own ocean… several kilometers wide."
4. **Units are doubled for a world audience**: "about 3 km, roughly 10,000 ft"; "about 1,000 nautical miles of range.
   Almost 2,000 kilometres."
5. **Exact figures for people, round figures for physics**: 257, 239, 1,836, 181 against "roughly nine out of every
   10", "about a third thinner".
6. **Dates are written the British way and spoken in full** for key events: "On the 20th of November, 1979" / "On
   the 11th of March, 2011".

### Section transitions
Every item opens with a header that is **a whole, plain claim**, and the five headers later become the recap:
"Reason two, there's nowhere to land." / "Wall number three is you." / "Reason number one is sitting on your wrist."
/ "Clue three. Rivers once cut far below the sea."

Between items, a **bridge line** turns the end of one reason into the reason for the next:
> "But, even if a million people wanted that flight tomorrow, an airline would hit the second problem."
> "And that's the next problem. Because passengers are weight too."
> "But even if the plane can make it, there's one more machine on board that wasn't designed for 22 hours in the air."
> "So, time zones explain why passengers like the night. But, they don't explain why airlines love it. For that, you
> have to follow the plane."
> "So far, every reason is about what might happen. The last one actually did."

### "So / But / And" chains (the logic engine)
The narrator thinks aloud in steps of cause, then consequence, then catch:
> "A plane burns fuel to carry weight. And fuel is weight. So the fuel you'll burn in hour 20 doesn't just sit there.
> It has to be lifted off the runway and carried for 19 hours first. And carrying it burns more fuel. Which also has
> to be carried. That's the trap."

> "Pump the water out of soft clay, and it squeezes down, like a sponge being wrung out… If the pumping goes on, the
> city keeps going down. Then the wall has to keep going up."

Each "So" brings the conclusion down to earth: "So, the sky is open. Airlines just stay out of it." The rare
"Which means" carries a payoff: "Which means the river can carry more planes than ever."

### Objections answered before the viewer raises them
"And no, it's not forbidden." / "And yes, Antarctica has runways. … But, an airliner in trouble needs more than a
strip of ice." / "Further, yes. But not wildly further." / "A tsunami isn't a surfing wave." / "Jet fuel doesn't
freeze like water. It turns cloudy."

### Open loops and where each one pays off

| Video | Loop planted | Time | Paid off | Time |
|---|---|---|---|---|
| Antarctica | "the last one cost 257 lives" | 0:58 | Air New Zealand 901 into Erebus | 5:30–6:30 |
| Antarctica | "The first one has nothing to do with ice" | 0:58 | "There's almost nobody down there to fly to" | 1:03 |
| Antarctica | Perth to Buenos Aires string line | 0:13 | "that straight line… is still waiting" | 7:50 |
| Sydney | "why fly the wrong way on purpose?" | 0:47 | answered at once ("one job"), then the closing callback "It wasn't a detour. It was a promise" | 0:50 / 9:16 |
| Sydney | "the last one has nothing to do with planes at all" | 1:15 | "Wall number five is the world itself" | 7:42 |
| Sydney | Perth nonstop (2018) | 4:00 | "Remember the Perth to London flight?… Now with a stop." | 7:45 |
| Atlantic | "the last one isn't on the ground at all. It's in the sky" | 1:07 | the jet stream and the North Atlantic tracks | 4:54 |
| Atlantic | Delta daytime flight to Paris | 1:40 | "Remember Delta's daytime flight… A very expensive bedroom." | 3:11 |
| Atlantic | 1,805-flight record | 0:45 | "On that record Sunday… it carried 1,805." | 7:25 |
| Tibet | "we'll meet the cargo airline that crosses anyway" | 0:55 | DHL on L888 / Y1 | 7:20 |
| Airports | "what a typhoon did to one of these islands in 2018" | 0:32 | Typhoon Jebi at Kansai | 7:28 |
| MH370 | "what the search did find by accident" | 0:50 | two 1800s coal ships | 7:41 |
| Mediterranean | "the man who wanted to lower the sea again, on purpose" | 1:00 | Sörgel's Atlantropa | 8:04 |
| Floodgate | "at the last one, the real problem isn't the sea at all" | 0:50 | Jakarta sinking | 7:03 |

The rule: plant one loop in the hook for the last item (paid off at 65–85%), and plant one or two specific details
early that come back by name ("Remember…") later. Every loop is paid off. None are left hanging.

### How jargon is explained
Describe it in plain words first, then name it, then move on. Or name it and gloss it in the same breath. A term is
never left unexplained.
> "If one engine fails, the plane has to be able to reach an airport on the other one." (after "It's called ETOPS.")
> "The plane slowly sinks until it reaches a height that one engine can hold. Pilots call this a drift down."
> "The wind piled the sea up against the coast. That's called a storm surge."
> "Venetians call it acqua alta, high water."
> "melatonin: the hormone that tells your body it's night."
> "A plateau is a huge block of high ground, and this one is bigger than Greenland."
> "cores: long tubes of rock from deep beneath the sea floor."

The formulas are "X call it Y", "That's called Y", and "Y: [plain gloss]". The analogies are domestic:
"like chairs around a table", "like water out of a sponge", "like the light from a flashlight", "like a thick blanket
thrown [over] furniture. You can make out the sofa, but not the cups on the table."

### How the narration cues the visuals
The script is written to sit on top of an animated map or globe. Imperatives tell the editor what to draw:
> "Now look at the bottom of the world." / "Take a globe and stretch a string from Perth… Pull it tight." /
> "Now, spin the globe over." / "Now, draw a circle like that around every airport near Antarctica." /
> "Take a globe and turn it so London faces you. Now spin it halfway round" / "But look where Perth is." /
> "Now, watch what the night does for one plane." / "Back at Kai Tak, watch the way many planes came in." /
> "This is the Tibetan Plateau." / "Now, look at where the official backup airports… are." /
> "To see why the gates matter, look at Gibraltar today."

"The shortest path doesn't cross the ocean the way a flat map suggests" contrasts the flat map with the globe; that
is the channel's signature move. Routes are read out as fragments that plot a moving line on the map ("Out over the
Pacific. Across North America. Over the Atlantic."), and lists of place names are read at the pace of pins dropping
("Hobart, Christchurch, Ushuaia").

### Voice
Calm, exact and unshowy. No hype words ("insane", "crazy"). Feeling comes from bare fact: "Nobody survived."
"He never saw his gate work." Endings are dry and wry: "A very expensive bedroom." / "Over Tibet, the hard part is
coming down." There is no first person "I"; "we" appears only in "At the end, we'll see…".

---

## 4. Titles, packaging, and why the top 3 won

| Title | Views | Shape |
|---|---:|---|
| The Shortcut Over Antarctica No Airline Takes | 1.2M | Curiosity gap plus an absolute ("No Airline") plus a place everyone knows |
| Why Sydney to London Is the Hardest Flight on Earth | 1.1M | "Why" plus a superlative plus two famous cities |
| Why Planes Cross the Atlantic at Night | 492K | "Why" plus an everyday pattern many viewers have flown through |
| The Shortcut Over Tibet Most Airlines Skip | 74K | A copy of the Antarctica template, softened to "Most" |
| They Called His Floodgate a Waste. Then the Tsunami Came. | 11K | A story / vindication title |
| The MH370 Search Found Two Shipwrecks. But Not the Plane. | 10K | A news hook plus irony |
| How We Know the Mediterranean Sea Dried Up | 10K | An evidence title ("How we know") |
| Why So Many Airports Are Built in the Sea | 8.8K | "Why" plus a pattern, but the stakes are low |

**Why the top 3 beat the rest:**

1. **Topic: routes on a globe.** All three are about airline routes with a visual puzzle you can see on a map: the
   empty south, the antipode, the "river" of night flights. Aviation-route curiosity is a broad audience (frequent
   flyers, avgeeks, map people). Geology, sea-floor mapping and coastal engineering are narrower. Tibet is an aviation
   route too, but it reads as a sequel to Antarctica and its title is weaker.
2. **Title wording.** The winners make **an absolute or superlative claim that a viewer can test against their own
   map sense**: "No Airline Takes", "Hardest Flight on Earth", and a plain observable fact ("at Night"). The
   weaker titles hedge ("Most Airlines Skip", "So Many"), sound like a lecture ("How We Know"), or promise a story
   the video doesn't deliver.
3. **Title and content match.** The Floodgate title promises one man's vindication, but the floodgate is done by
   2:15 and the rest is a survey of five walls. The MH370 title promises shipwrecks and the plane, but the shipwrecks
   come at 7:41 (82%) and the body is about mapping the sea floor. The winners answer exactly the question in the
   title, in every one of the five items.
4. **The hook is a picture with a flaw in it, and it is given room.** Antarctica and Atlantic open on a contrast
   you can see. Sydney opens on a moving line on a globe. The Atlantic hook holds its scene for 58 seconds before
   the question. Airports, by contrast, starts its list at 0:38 and drops its best image (Checkerboard Hill) after
   one sentence.
5. **They speak to the viewer.** Sydney: "no airline has ever sold you a ticket for that flight. Not once." / "Wall
   number three is you." Atlantic: "Reason number one is sitting on your wrist." / "look out the window. You're not
   alone up there." They use "you" at three times the rate of the rest and ask more questions.
6. **Tighter rhythm.** 9.8 words a sentence against 12.5. The weakest performer (Airports) has the longest
   sentences (14.1) and the most long ones (24% at 20 words or more).

**Packaging rules:** the title states the paradox or superlative in under 60 characters and names one famous place
or route. The thumbnail (not visible in this data) is presumably a map or globe with a single line. The first spoken
question is the title word for word.

---

## 5. Write like Manicule: the rule sheet

**Topic**
- Pick something you can see on a globe that looks wrong: an empty region, a detour, a timing pattern, a line that
  "should" exist. Aviation and route topics first.
- The title question must have exactly five clean answers, each its own mechanism.

**Structure (8–9 min, 1,250–1,400 words)**
1. Cold open, 30–60 s: a scene or contrast with one wrong detail. Present tense, or a dated event.
2. Ask the title word for word: "So, why…?"
3. Escalate once ("Here's the strangest part."), then knock down the obvious answer ("And no, it's not…").
4. "There are five [reasons/walls/clues]." Tease the first or last: "the last one cost 257 lives."
5. Five items of about 80 s each. Header (a plain claim), then mechanism, then a number made familiar, then a dated
   story with a named person, then a bridge.
6. Order the items from intuitive to surprising; item 5 is the human cost or the twist that pays off the loop.
7. Subscribe line between items 3 and 4 (about 50%), always the same: "If you like seeing the world through maps like
   this, subscribe. There's a new deep dive every week." (Optional: two of the top 3 left it out.)
8. "And yet…": one exception that proves the rule.
9. Recap: the question again, then the five headers as fragments.
10. Callback to the opening image, then one dry closing line. No sign-off.

**Sentences**
- Average about 10 words; a quarter of sentences five words or fewer. One fact per sentence.
- Chain with "So / But / And". Start sentences with them freely.
- About 7–9 numbers a minute. Every big number gets a "That's about…" comparison. Give metric and imperial.
- Name the jargon after explaining it: "Pilots call this a drift down."
- Script the camera: "Now look at…", "Take a globe…", "Draw a circle…", "Watch what…".
- Say "you" about once a minute: put the viewer on the plane, at the gate, wearing the watch.
- Plant one detail early and bring it back by name: "Remember the Perth to London flight?"

### Do / Don't

| Do | Don't |
|---|---|
| Open on a map image with something wrong in it | Open with "In this video…" or a channel intro |
| Ask the title as a spoken question within the first minute | Hide the premise until 2 minutes in |
| Kill the obvious answer with one hard fact | Let the viewer keep a lazy theory unchallenged |
| Number the five items with header claims you can recap | Wander through themes without signposts |
| Put a dated, named mini-story in every item | Stay abstract for more than about 40 s |
| Give every big number a household comparison | Stack bare numbers back to back |
| Explain the term, then name it | Drop acronyms (ETOPS, ADS-B) without a one-line gloss |
| Bridge items with "But even if… there's one more…" | Jump cut between items with no logic link |
| Pay off every tease and bring back early details | Plant "at the end, we'll see…" and forget it |
| Make the title match what the whole video covers | Title one story and deliver a survey (Floodgate, MH370) |
| Say "absolutely no" in the title when it is true ("No Airline") | Hedge in the title ("Most", "So Many") |
| End on a quiet callback and a wry line | End with "thanks for watching, like and subscribe" |
| Use calm, exact language and let facts carry emotion | Use hype words, exclamation marks or "insane" |

---

## 6. Sample 60-second cold open: "Why Ships Avoid the Shortest Route Across the Pacific"

About 150 words, so about 60 s at 149 WPM. Facts marked **[VERIFY]** must be checked before use.

> [VISUAL: Flat Mercator map of the Pacific. A straight line draws itself from Shanghai to Los Angeles, right across
> the middle of the ocean.]
>
> On a flat map, the quickest way from Shanghai to Los Angeles looks obvious. A straight line. Right across the middle
> of the Pacific.
>
> It isn't.
>
> [VISUAL: The map peels up and wraps onto a globe. A string is pinned at both ports and pulled tight; it swings far
> to the north.]
>
> Take a globe and stretch a string between the two ports. Pull it tight. The shortest path swings north. Up past
> Japan. Along the edge of Russia. Almost to Alaska.
>
> [VISUAL: The arc brushes the Aleutian Islands. Label: "Shortest route". A distance counter ticks: about 10,400 km
> [VERIFY].]
>
> For a big container ship, that line can save a day at sea, and a lot of fuel. [VERIFY]
>
> [VISUAL: Time-lapse of real ship tracks in December. Most of them bend well south of the arc.]
>
> And yet, every winter, many of the biggest ships on the ocean stay well away from it.
>
> So, why do ships avoid the shortest route across the Pacific?
>
> [VISUAL: Empty ocean, no lane markings.]
>
> And no, it's not closed. Nobody draws lanes out here.
>
> [VISUAL: Five numbered markers appear along the arc. The last one pulses red over a photo of collapsed container
> stacks.]
>
> There are five reasons why. The first one starts in the sky. And the last one cost a single ship more than 1,800
> containers in one night. [VERIFY: ONE Apus, North Pacific, 30 Nov 2020, about 1,816 boxes lost]

Possible five items, in the formula's order: (1) winter storms born under the jet stream (the Aleutian Low);
(2) waves big enough to roll a ship (parametric rolling); (3) cold, fog and ice near the Aleutians; (4) currents
and weather routing make the "long" way faster; (5) stakes: ONE Apus / APL China 1998 [VERIFY]. Twist: in summer,
many ships do sail the great circle.
