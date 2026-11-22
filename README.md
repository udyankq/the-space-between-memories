# The Space Between Memories - Уровень 0

An AI-powered interactive memory diary. Explore the yellow corridors of Level 0, where picture frames become portals into personal memories. Upload up to four photos, describe a moment, and optionally add music. AI interprets the materials and reconstructs an explorable world shaped by the place, people, objects, atmosphere and emotion.

## How to run

- **Online (recommended):** Play at https://space-between-memories.erkin-rauan.workers.dev. Gemini AI (Google AI Studio) is connected through a secure Cloudflare Worker.
- **Offline fallback:** When cloud AI is unavailable, the game uses its built-in photo analysis, music analysis, neural models where supported, and rule-based generation.
- **Local HTML:** The bundled HTML can be opened locally for the supported offline experience. Cloud AI requires the configured server and an internet connection.
- **Security:** The Gemini API key is stored in Cloudflare secrets, never in the public HTML.

## Controls

| Input | Action |
|---|---|
| WASD / arrow keys | Move |
| Mouse | Look around (click to capture the mouse) |
| Shift | Run |
| E | Interact |
| M | Map |
| Esc | Menu |
| Phone | Left side to move, right side to look, E to interact |

In the hub, **red-brown frames** hold personal memories and **blue-grey frames** hold five built-in demo memories. The archive is designed to expand: new memories can add corridors and frames instead of being restricted to ten. Return through the glowing portal or via Esc → «Вернуться в Уровень 0».

## Prologue

The prologue **does not start automatically**. It can be opened from the main menu using **«▶ ПРОЛОГ»**. It presents the game's concept through cinematic text, visual transitions and atmospheric sound. Use the available skip control or Esc to exit. Browser audio may require an initial click.

## How text, photos and music shape the world

**Story text.** The description helps determine the place (beach, lake, forest, park, countryside, field, mountains, city, snow, campsite, room, kitchen or desk), time of day, season, weather, people, events, emotion, focal object and mentioned objects. In offline mode, rules interpret Russian and English descriptions. Each scene attribute can retain its source: text, photo colours, music, manual settings or assumptions.

**Photos.**
- **Online AI:** Gemini interprets the photograph and description to infer spatial structure, relevant objects, people and atmosphere.
- **Offline:** Colour analysis provides clues about greenery, water, sand, sky, brightness and indoor/outdoor conditions. It does not provide the same object recognition as cloud AI.
- The original photo is preserved and can be displayed within the memory instead of being stretched across the sky or scene boundaries.

**Music.** Music belongs to its own memory and fades when leaving. One shared player avoids duplicate playback.
- **Local file (mp3/m4a/wav/ogg, up to 8 MB):** Web Audio analyses tempo, key, energy, brightness, bass and dynamics. Lighting and particles respond gently without strobing.
- **Music links:** YouTube, Spotify and Yandex Music links open in their respective services rather than being downloaded.
- **Manual mood and energy:** Used when no local music file is provided; a generative melody can provide atmosphere.
- Music affects atmosphere rather than introducing unrelated physical objects. Explicit emotions from the user's story take priority over musical inference.

## People, dialogue and text: what comes from your input

- **Evidence-based characters:** People are reconstructed or represented according to available photo and story evidence. Offline fallback can use photo cut-outs or neutral silhouettes when visual details are unknown.
- **Dialogue:** Explicit quotations from the user's description can be associated with their attributed characters. The system should not invent personal conversations.
- **Diary fragments:** The user's own sentences are used instead of fabricated first-person memories.
- **Titles:** Generated from information supplied by the user, with editing available in the frame menu. Ambiguous or assumed details are identified where supported.

## Voice narration

The game includes **prerecorded human voice narration** with universal phrases.

The voice library organises phrases by:
- **Category:** greeting, question, reaction, memory, remark and closing.
- **Emotion:** happy, sad, calm and angry.
- **Voice variation:** available voices and age-related settings.

Suitable recordings are selected to complement the atmosphere and context of a memory. Narration is occasional rather than continuous, and it does not replace the user's own story or invent specific personal events. The audio system coordinates voice and music, and missing clips should not interrupt gameplay. This feature uses prerecorded voice assets rather than live text-to-speech generation.

## Cloud AI — primary generation mode

**Cloud AI is the primary generation system.** The game uses the **Gemini API from Google AI Studio** through a **Cloudflare Worker** backend.

When users upload photographs, write a description and optionally add music, AI analyses the available materials and generates a structured specification for the memory world. This includes:
- Location and spatial structure.
- Objects and people supported by the source materials.
- Time of day, season, weather and lighting.
- Emotional atmosphere and relationships between scene elements.
- A coherent arrangement suitable for exploration.

The game then renders an interactive environment from this specification. Validation helps avoid unsupported dialogue, inconsistent layouts and inappropriate object placement.

**Offline mode is the fallback, not the primary mode.** If the internet, API or cloud service is unavailable, local generation uses rule-based interpretation, photo-colour analysis, music features and built-in neural models where supported. This keeps the core experience accessible with less semantic detail than Gemini.

The API key stays in Cloudflare Worker secrets. Deployment details are in `README-DEPLOY.md`.

## Built-in neural network (offline)

The original HTML includes Human 3.3 / TensorFlow.js and bundled models such as BlazeFace, MoveNet, Selfie-segmentation and GEAR, approximately 8 MB in total, for supported local person analysis. It can use WebGL or fall back to CPU.

**Capabilities:**
- Detect face, body pose and silhouette.
- Estimate age and sample colours from visible body regions.
- Build a pixel-style character representation from detected features.

**Limitations:**
- Cannot reliably infer unseen details, glasses, prints or accessories.
- Unknown parts should remain neutral and be identified as not visible.
- When detection fails, the photo itself can be displayed as a cut-out rather than inventing a character.

Previously recorded performance: a few seconds on a GPU-equipped laptop and around 15 seconds in a software-only browser. Actual performance depends on hardware.

## Rooms and windows

- **Human scale:** hotel room 5×7 cells, room 6×7, kitchen and desk 5×6.
- **Windows:** Openings in exterior walls show an outside view with sky, clouds and horizon.
- **View from the window:** When described, the player begins indoors facing the window; outdoor scenery belongs outside rather than inside the room.
- **Sky colour:** Uses the photo when it represents the outside view, otherwise follows the time of day.
- **Scene validation:** Checks indoor/outdoor consistency, scale, character evidence and story details before rendering.

## Composition and vast outdoor worlds

**Outdoors.**
- Playable areas use an irregular shape approximately 22–32 cells across inside a 66–76-cell grid.
- Distant scenery sprites, extended terrain and sky panoramas create the impression of an expansive environment.
- Natural obstacles such as trees, hedges, dunes, rocks, reeds, water and buildings mark playable boundaries.

**Composition.**
- **Focal point:** Usually ahead of the player, approximately 6–8 cells away.
- **Mentioned objects:** Placed in the visible middle ground.
- **Trees, bushes and rocks:** Grouped into natural clusters.
- **Benches and lamps:** Positioned along paths.
- **Houses and tents:** Generally placed farther away.

**Indoors.** Rooms retain architectural walls and coherent furniture placement. Rain can be visible through windows without appearing inside the room.

**Validation checks:** Walkable spawn, reachable focal point, grounded objects, appropriate water placement and closed playable boundaries.

**Determinism:** Stored generation seeds support consistent reconstruction of the same memory.

## The art system

Five artistic influences can be blended with weights from 0 to 1:

| Influence | Post-processing | Generation |
|---|---|---|
| **Monet · impressionism** | Soft brush-like texture, pastel colours | — |
| **Kandinsky · expression** | Strong saturation, light posterisation, music-reactive colour | Slightly more objects |
| **Super 8 · film** | Warm cast, vignette, grain, light leaks and subtle film movement | — |
| **Romantic landscape** | Stronger contrast, golden horizon light, atmospheric haze | More clouds and haze |
| **Ma · Japanese minimalism** | Desaturation, paper tone, softer contrast | Fewer objects and more empty space |

- **Auto:** Selects influences based on mood and environment, such as Monet + Ma for calm or Super 8 for nostalgia.
- **Manual:** Users can adjust artistic styles while creating or managing a memory.
- The art system affects visual presentation without inventing unrelated physical objects.

## Titles

Titles are generated in the story's language, generally using 3–7 words supported by the description. Examples include «Закат из окна отеля», «Ночь у костра с друзьями» and «Вечер дома с сестрой». When insufficient information is available, the title falls back to an excerpt of the original text. Titles can be edited in the frame menu.

## Saving, export, import

- **Storage:** IndexedDB (`liminal-worlds`) stores memory records, scene specifications, photos and associated audio data. The original schema includes `id, created, t, frame, title, titleAuto, caption, img, extras, spec, art, seed, music, musicLink, manual`.
- **Delete:** Frame menu → «УДАЛИТЬ», with confirmation.
- **Export:** «⇩ ЭКСПОРТ» saves memory data as JSON, including supported images and audio.
- **Import:** «⇧ ИМПОРТ» validates the file and restores memories to available frames.
- **Storage full:** The interface can recommend deleting or exporting memories.

## Content check

Descriptions, character names and titles undergo content checks before generation.
- **Blocked:** Explicit sexual content, sexualisation of minors, sexual violence, graphic violence, hate or calls for violence against groups, and instructions promoting serious harm.
- **Allowed:** Grief, death, funerals, war, history and non-graphic trauma.
- **Offline checking:** Uses context-sensitive rules rather than only isolated keywords.
- **User text:** Treated as data and escaped or inserted through safe text APIs where supported.
- Automated checks are imperfect and should not be described as guaranteeing safety.

## Accessibility and performance

- **Less motion:** Follows `prefers-reduced-motion` and can be toggled in the menu. Reduces head bob, flashes, pulsing, film flicker and particle motion.
- **Rendering:** Canvas 2D raycaster at 320×200 with sprite culling and a texture cache.
- **Earlier benchmark:** Approximately 60 fps in headless Chrome software rendering for demo scenes with 400–760 sprites. This is a previous test result, not a guarantee for every device or updated build.

## Test cases (built-in demos)

| | Story | Result |
|---|---|---|
| A | Peaceful autumn walk | Park, falling leaves, path with benches and lamps, Monet + Ma |
| B | Night by the campfire with friends | Campsite, three friends around the fire, pines at the edge, Super 8 |
| C | Stress, late night, project | Room, desk with laptop as focal point, night, Kandinsky |
| D | Nostalgic rainy evening | Room, rain on the window, Super 8 + Monet |
| E | Joyful summer day at the sea | Beach, infinite ocean, dunes and rocks, family by the sandcastle |

## What was tested and how

**Earlier regression suite:** `python3 tests/regression.py`. The previous version documented 38 checks using Playwright and Chrome in offline mode. These results describe the earlier implementation and do not automatically validate the new cloud AI, narration or dynamic corridor features.

Earlier checks included:
- **Hotel window at sunset (RU and EN):** Indoor spawn, correct scale, visible outside view and title.
- **Campfire with friends:** Appropriate silhouettes without invented speech.
- **Photos of people:** Character representation derived from supplied photos.
- **Quoted dialogue:** Correct attribution.
- **Music:** Playback, stopping and returning across memory switches.
- **Rebuild:** Successful reconstruction and preservation after simulated failure.
- **Refresh and reopen:** Persistence of saved memories.
- **Five demos:** Scene construction and validation.

Additional earlier manual checks included prologue, edge movement, moderation examples, export/import, unsupported audio and frame rate.

**Not established by those earlier tests:** Current Gemini AI behaviour, prerecorded narration, dynamic corridor expansion, mobile compatibility, Safari/Firefox compatibility and physically disconnected network behaviour. These should be verified separately against the final hackathon build.

## Libraries, assets, AI

- **Code:** Custom game implementation. Bundled local neural-network components include Human and TensorFlow.js; see `THIRD-PARTY-LICENSES.txt`.
- **Fonts:** Press Start 2P, IBM Plex Mono and Cormorant Garamond (SIL Open Font License 1.1).
- **Graphics:** Procedural textures, sprites, characters and skies.
- **Music:** Generative audio and Web Audio analysis.
- **Voice narration:** Prerecorded human speech clips selected by category and emotional context.
- **AI:** Gemini API via Google AI Studio and Cloudflare Worker is the primary mode. Built-in models and offline rules provide fallback generation.
