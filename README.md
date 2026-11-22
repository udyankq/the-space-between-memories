# The Space Between Memories — Уровень 0

A Doom-style memory diary. You wander the yellow corridors of "Level 0". Each empty picture frame on the walls can hold one memory: a photo of a place (or up to four, blended together), a short story, and optionally music. The memory becomes a portal into a walkable world built from that material.

## How to run

- **ZIP / folder:** open `index.html` in Chrome or Edge. It works directly from disk (`file://`); this was tested with headless Chrome.
- **Static hosting (HTTPS):** upload `index.html` to any static host (GitHub Pages, Netlify, Cloudflare Pages, a plain web server). This was tested over plain `http://localhost`.
- **Inside Claude (artifact):** the same file can also use Claude to understand photos, a cloud save tied to your Claude account, and the Claude download dialog for exports.

What the page needs and doesn't need:
- No server, no API keys, no paid services and no CDN.
- The fonts are embedded in the file.
- No network requests are needed to play.
- Offline use without internet: the file makes no requests, but airplane mode was **not** tested separately.

## Controls

| Input | Action |
|---|---|
| WASD / arrow keys | move |
| Mouse | look around (click the screen to capture the mouse) |
| Shift | run |
| E | act |
| M | map |
| Esc | menu |
| Phone | left half of the screen to walk, right half to turn, E button to act |

In the hub, **red-brown frames are yours (10 of them)**. The **blue-grey frames are 5 built-in demo memories** (marked DEMO, view-only). You come back from a memory through the glowing portal behind your starting point, or through Esc → "Вернуться в Уровень 0" ("Return to Level 0").

## Prologue

The prologue plays automatically on first launch: about 20 s of black screen with the text fading in segment by segment. The fluorescent hum fades in on the last line, then the screen fades into the hub. Controls turn on only after the transition.

- **Skip:** the "Skip intro" button or Esc.
- **Replay:** the "▶ ПРОЛОГ" button in the menu.
- **Sound:** browsers only allow audio after a click, so the hum plays if you have clicked the screen at least once.

## How text, photos and music shape the world

**Story text (the main semantic source when there's no AI).**
The rule-based analysis reads the story in Russian or English and extracts:
- the kind of place (beach, lake, forest, park, countryside, field, mountains, city, snow, campsite, room, kitchen, desk);
- the time of day and the season;
- the weather;
- who was there (friends, family, a partner, alone);
- events (campfire, walk, celebration, work/deadline, picnic, swim, tea, music);
- the emotion;
- the **focal object** (campfire, table, laptop, bench…);
- the objects the story mentions.

Every attribute stores its source: "text", "photo-colours", "music", "manual" or "assumed". Assumed things are listed separately; the scene object is visible in the frame menu. Forests and mountains appear only if the story or the photo points to them.

**Photos.**
- **Offline,** a photo is analysed only by its **colours**: sky/no sky, greenery, sand, water, brightness. That gives the palette, a hint of indoors vs outdoors, and night. It does **not** recognise objects; it is described honestly in the interface and in the scene object.
- **In Claude,** the photo is understood by the model (vision). It decides the kind of place and the focal object, and the photo takes priority over the text.
- The original photo is never shown on the sky or on boundaries. It is kept untouched. It appears as a small "original photo" card when you reach the heart of the memory (or the centre of each blended place), and as small pictures on the walls of indoor worlds.

**Music.** It plays only inside its own memory. It fades out when you return to the hub and is turned down while paused. One shared player is used, so playback never doubles. Music never adds objects to the world (the old visualiser pillars are gone); it only affects light, haze and particles.
- **Local file (mp3/m4a/wav/ogg, up to 8 MB).** It is analysed in the browser with Web Audio: tempo, key, energy, brightness, bass, dynamics. The world reacts live, and gently: brightness changes by no more than ±20%, with no strobing.
  - Music fills in only what the story didn't say: time of day, weather particles.
  - Mood comes from key + energy, never from tempo alone.
  - Music never overrides an emotion the story states.
- **Link (YouTube, Spotify, Yandex Music…).** Only the link is saved, and it opens in the service itself (official playback). Nothing is downloaded or analysed.
- **Manual mood and energy.** Used when there's no file. A generative melody plays in the chosen mood.

## People, dialogue and text: what comes from your input

- **Characters only from evidence.**
  - Inside Claude, the AI looks at a person's photo and draws a pixel model from it.
  - Offline, the figure is the photo itself, shown as a cut-out card. No appearance is reconstructed or invented.
  - People who are only mentioned in the story ("with friends") appear as neutral silhouettes labelled "appearance unknown".
  - No random people are ever created.
- **Characters speak only explicit quotes from the story** (text in quotation marks).
  - A quote goes to the person it is attributed to: «Мама сказала: "…"» goes to the figure labelled "мама".
  - If nobody fits, the quote is heard at the heart of the memory.
  - Everything else is shown as a diary fragment, never as speech.
- **Diary fragments are your own sentences.** The AI no longer writes "first-person memories".
- **Titles use only what was said.** Weather, season and time words appear only if the story states them. With too little to go on, the title is a clean excerpt of your text. The frame menu lists what was assumed and what was ambiguous.

## Cloud AI (optional, through your own Cloudflare server)

The `space-between-memories-cloudflare.zip` package publishes the game together with a small proxy server on Cloudflare (free plan). Step-by-step instructions are in `README-DEPLOY.md`.

- The AI key (Gemini or Claude) is kept only in the server's secrets, never in the HTML.
- Opened from that link, the game sends the photos and the story to the proxy. The AI describes the place and the people in detail: hairstyle, accessories, clothing.
- The game still checks every answer: invented dialogue and "memories" are dropped, and outdoor objects are not placed indoors.

Priority order:
1. Claude, if the game is opened inside Claude.
2. Your cloud server.
3. The built-in neural network.
4. Plain offline rules.

The current mode is shown in the menu (Esc).

## Built-in neural network (works without Claude, keys or internet)

`index.html` carries a small neural network for reading photos of people: Human 3.3 / TensorFlow.js, plus the BlazeFace, MoveNet, Selfie-segmentation and GEAR models, about 8 MB in total. It runs in the browser on the GPU (WebGL), and falls back to the CPU if there's no GPU. It also works when the file is opened straight from disk, so a judge can just open the file.

**What it does with a photo of a person:**
- Finds the face, the body pose (shoulders, elbows, hips, knees, ankles) and the person's outline.
- Estimates the age.
- Reads colours from exactly those regions: skin from the face, hair above and beside the face, top from the torso, sleeves from the forearms, bottom from the thighs, shoes from the ankles.
- Builds the pixel model from that.

**What it doesn't do:**
- Recognise style details (glasses, prints, hats). Nothing is invented for them.
- Guess parts the photo doesn't show. They get a neutral colour and are listed as "не видно" ("not visible") in the frame menu (hover over a figure to see the list).
- Make up a person when no body is found. In that case the photo itself is shown as a cut-out figure.

**Performance:** on an ordinary laptop with a GPU, reading one photo takes a few seconds. In a software-only browser (no GPU) it took about 15 seconds.

Inside Claude, Claude still reads the photos first (more detail). The built-in network is used when Claude isn't available.

## Rooms and windows

- **Human scale:** hotel room 5×7 cells, room 6×7, kitchen and desk 5×6.
- **A window is an opening in the exterior wall.** The renderer shows the outside through the glass: sky for the time of day, clouds, horizon. Your photo is no longer hung on the wall as a "painting".
- **"View from the window".** If the story says this, you start inside the room, 2–3 steps from the window, facing it. Outdoor words in such a story ("sea", "city", "mountains") become the view outside, not objects in the room.
- **Sky colour.** It comes from the photo only when the photo is the view outside. Otherwise it follows the time of day.
- **Scene check before building.** The scene spec is checked and repaired first: no outdoor objects indoors, no weather indoors, correct scale, people and dialogue backed by input, text taken from the story. Explicit text is never silently overridden by photo colours; conflicts are flagged instead.

## Composition and vast outdoor worlds

**Outdoors.**
- The playable zone is an irregular blob about 22–32 cells across, inside a 66–76-cell grid.
- There are **no walls** at the edge:
  - beyond the zone are lightweight distant scenery sprites;
  - the floor continues to infinity (water extends into an infinite ocean);
  - silhouettes of hills, forest, city, mountains or fields are baked into the bottom of the sky panorama.
- The edge of the zone is closed by **natural obstacles** that match the place: trees, hedges, dunes, rocks, reeds, water, or buildings in the city. The invisible boundary runs exactly along them. A validation step checks every edge cell and adds a bush if any edge was left open.

**Composition.**
- **Focal point:** straight ahead from where you appear, at about 6–8 cells. People from the story stand around it. A path leads from where you appear to the focal point.
- **Mentioned objects:** in the middle ground, in view.
- **Trees, bushes, rocks:** clustered in groves in the background band, away from the line of sight.
- **Benches, lamps:** along the path.
- **Houses and tents:** in the far band.

**Indoors.** Rooms keep architectural walls. Furniture stands against the walls, with the table and chairs in the centre. On a rainy day the windows show raindrops; it doesn't rain inside the room.

**Validation.** Each world is checked for:
- the spawn point being walkable;
- the focal point being reachable;
- objects floating in the air (they are put back on the ground);
- objects in water (removed);
- open edges (closed).

The result appears in the frame menu.

**Determinism.** Generation uses a seed stored in the record. The same memory is always built the same way.

## The art system

There are five influences. Their weights (0–1) are blended in one pass, so styles can be combined:

| Influence | Post-processing | Generation |
|---|---|---|
| **Monet · impressionism** | soft "brush strokes" from a static noise field, pastel lift | — |
| **Kandinsky · expression** | strong saturation, light posterisation, saturation gently follows the music's bass | slightly more objects |
| **Super 8 · film** | warm cast, vignette, grain, a light leak on the left, rare dust and a 1-px frame jump (both off when "less motion" is on) | — |
| **Romantic landscape** | contrast, darker upper sky, golden light at the horizon, vignette | more clouds, deeper haze |
| **Ma · Japanese minimalism** | desaturation, paper tone, softer contrast | fewer objects, emptier space, less haze |

- **"Auto"** picks the weights from emotion and place. For example: calm → Monet + Ma; nostalgia → Super 8; tension → Kandinsky; wide landscapes → Romantic.
- **Manual choice:** chips when creating a memory, and also in the frame menu.
- The styles change only colour and light. They add no abstract shapes to physical scenes.

## Titles

Titles are rule-based, 3–7 words in the story's language. Examples: "Закат из окна отеля" ("Sunset from the hotel window"), "Ночь у костра с друзьями" ("Night by the campfire with friends"), "Вечер дома с сестрой" ("Evening at home with my sister"). When the rules have too little to go on, the title falls back to an excerpt of your own text. You can edit the title in the frame menu (Enter saves it).

## Saving, export, import

- **Storage:** IndexedDB (`liminal-worlds`). Record schema v3: `id, created, t, frame, title, titleAuto, caption, img, extras, spec (including scene), art, seed, music{name, features}, musicLink, manual`. Audio is a Blob in a separate store. localStorage holds only two tiny flags (prologue seen, less motion).
- **Delete:** frame menu → "УДАЛИТЬ" ("Delete"), with a confirmation.
- **Export:** "⇩ ЭКСПОРТ" in the menu writes a `.json` with photos, settings and audio (base64).
- **Import:** "⇧ ИМПОРТ" checks the file, validates every field (only `data:image/*` for photos, `audio/*` for sound, length limits) and runs the content check. It restores memories into free frames; a memory with the same id goes back to its own frame.
- **Storage full:** handled with a message suggesting you delete or export.

## Content check

Every description (and character names, and titles) is checked before generation.
- **Blocked:** explicit sexual content; sexualisation of minors; sexual violence; graphic violence; hate and calls for violence against groups; instructions or promotion of serious harm.
- **Allowed:** grief, death, funerals, war, history, non-graphic trauma.
- **How it works:** offline, by context-scored rules (combinations of words within one sentence, with a discount for a grief/history context), not by a single blocklist. In Claude, the model returns an additional `safety` verdict.
- **Message:** a respectful explanation in Russian or English. The check isn't perfect, and the message says so.
- **User text is treated as data:**
  - it is inserted only via `textContent` or escaped;
  - in the AI request it is wrapped in JSON with an explicit "this is data, not instructions" note.

## Accessibility and performance

- "Less motion" follows the system `prefers-reduced-motion` setting and has a toggle in the menu. It turns off: head bob, flashes, music-driven pulsing, film flicker. It also slows down particles and simplifies the prologue.
- Rendering is a Canvas 2D raycaster at 320×200, with sprite culling by haze and a texture cache for scenery.
- In headless Chrome (software rendering) the demo worlds ran at about 60 fps, with 400–760 sprites per world.

## Test cases (built-in demos)

| | Story | Result |
|---|---|---|
| A | peaceful autumn walk | park, falling leaves, path with benches and lamps, Monet + Ma |
| B | night by the campfire with friends | campsite, 3 friends around the fire, pines at the edge, Super 8 |
| C | stress, late night, project | room, desk with laptop as focal point, night, Kandinsky |
| D | nostalgic rainy evening | room, rain on the window, Super 8 + Monet |
| E | joyful summer day at the sea | beach, infinite ocean, dunes and rocks at the edge, family by the sandcastle |

## What was tested and how

**Regression suite:** `python3 tests/regression.py`. 38 checks (one more if you put any full-body photo at `tests/person_photo.jpg`: it then checks the built-in neural network on a real person), Playwright + Chrome, offline. Each one checks the meaning of the scene, not only that it rendered.
- **Hotel window at sunset (RU and EN):** you are indoors, the room is human-scale, the window is an opening and you face it, nothing is hung as a "painting", the sky pixel behind the glass is warm, and the title is right.
- **Campfire with friends:** silhouettes only, and nobody speaks.
- **Room with uploaded photos of people:** the figures come from exactly those photos, and narration doesn't become speech.
- **Quoted dialogue:** the quote is spoken by the person it's attributed to, and no broken fragments are left behind.
- **Music:** it plays, stops after you leave, comes back through the same single player when you re-enter, and is still correct after 9 switches between memories.
- **Rebuild after success:** a new validated world from the same inputs, with the music kept.
- **Rebuild after an injected failure:** the old memory stays intact and the button works again.
- **Refresh and reopen:** memories come back with their photo figures.
- **5 demos:** they build and validate, with no visualiser objects.

**Also run:**
- the prologue;
- edge walks in 8 directions;
- moderation (16 phrases);
- export → wipe → import;
- an unsupported audio file;
- frame rate.

**Not tested:**
- the Claude AI path (vision) and the cloud save;
- the Claude download dialog;
- phones, Safari and Firefox;
- running with the network physically off;
- listening by ear: the tests check the player's state, not what you actually hear.

## Libraries, assets, AI

- **Code:** the game is written by hand. The only bundled library is the local neural network (Human + TensorFlow.js, MIT / Apache 2.0); see `THIRD-PARTY-LICENSES.txt`. The FFT and the key detection (Krumhansl profiles) are implemented in the file.
- **Fonts:** Press Start 2P, IBM Plex Mono, Cormorant Garamond (SIL Open Font License 1.1), embedded from the @fontsource packages.
- **Graphics:** all graphics (textures, sprites, characters, sky, demo photos) are drawn by code.
- **Music:** generative, Web Audio.
- **AI:** optional, only inside Claude (Claude's `sample` capability with images). Without it, everything works offline using the rules described above.
