# The Space Between Memories - Уровень 0

An AI-powered interactive memory diary.

The Space Between Memories is an atmospheric first-person experience set in the endless yellow corridors of Level 0. Empty picture frames serve as portals into personal memories.

Users can upload photographs (up to four per memory), describe what happened, and optionally add music associated with that moment. Artificial intelligence interprets these materials and reconstructs an explorable world, taking into account the location, atmosphere, people, objects, emotions, lighting, and other details.

The goal is not simply to recreate a photograph, but to let users step inside their memories and experience how those moments felt.

## How to run

- **Online (recommended):** Open the deployed game at https://space-between-memories.erkin-rauan.workers.dev. The main experience uses Gemini AI through a Cloudflare Worker backend.
- **Local HTML:** Open `index.html` in Chrome or Edge. The built-in offline generation systems provide a local experience without cloud AI.
- **Offline mode:** If the internet connection or cloud AI service is unavailable, the game automatically falls back to its built-in generation systems.

**Online AI is the primary experience.** Gemini interprets photographs and descriptions to create detailed, explorable environments. Offline mode uses local photo analysis, music analysis, built-in neural models and rule-based generation.

The fonts and core game assets are bundled locally. The Gemini API key is securely stored in Cloudflare Worker secrets and is never exposed in the public HTML or GitHub repository.

## Controls

| Input | Action |
|---|---|
| WASD / arrow keys | Move |
| Mouse | Look around (click the screen to capture the mouse) |
| Shift | Run |
| E | Interact |
| M | Map |
| Esc | Menu |
| Phone | Left half of the screen to move, right half to look, E button to interact |

In the hub, **red-brown frames contain personal memories**, while **blue-grey frames contain five built-in demo memories** (marked DEMO, view-only).

**Dynamic memory archive:** As users create more memories, Level 0 expands by adding new corridors and picture frames. The archive grows together with the user's collection of memories rather than being limited to ten frames.

You return from a memory through the glowing portal behind your starting point, or through Esc → "Вернуться в Уровень 0" ("Return to Level 0").

## Prologue

The prologue is an optional cinematic introduction that explains the concept and atmosphere of The Space Between Memories.

It **does not play automatically** when the game is launched. Users can access it at any time by selecting **"▶ ПРОЛОГ"** from the main menu.

The prologue presents a sequence of text and visual transitions accompanied by atmospheric sound.

- **Start:** Select "▶ ПРОЛОГ" in the menu.
- **Skip or exit:** Use the available skip control or Esc.
- **Sound:** Browser audio restrictions may require an initial user interaction before playback begins.

## How text, photos and music shape the world

**Story text.**

The game interprets descriptions written in Russian or English to understand:
- The kind of place (beach, lake, forest, park, countryside, field, mountains, city, snow, campsite, room, kitchen, desk).
- The time of day and the season.
- The weather.
- Who was there (friends, family, a partner, alone).
- Events (campfire, walk, celebration, work, picnic, swim, tea, music).
- The emotion.
- The **focal object** (campfire, table, laptop, bench, etc.).
- Other objects mentioned in the story.

In the **primary online mode**, Gemini AI interprets these details together with the uploaded photographs to generate a coherent scene.

In **offline mode**, the built-in rule-based analysis extracts relevant information directly from the text.

Each scene attribute can store its source: "text", "photo-colours", "music", "manual" or "assumed". Assumed details are identified separately in the scene specification.

**Photos.**

- **Online AI:** Gemini analyses photographs using visual understanding, identifying locations, people, objects, spatial relationships, colours and atmosphere.
- **Offline:** Photos are analysed by their **colours**: sky/no sky, greenery, sand, water and brightness. This provides information about the palette, lighting and possible environment, but does not offer the same object recognition as cloud AI.
- The original photo is preserved and can appear as a small reference image inside the reconstructed memory.

**Music.**

Music plays only inside its associated memory. It fades out when the player returns to the hub and becomes quieter while paused. One shared player prevents overlapping playback.

Music affects lighting, haze and particles without creating unrelated physical objects.

- **Local file (mp3/m4a/wav/ogg, up to 8 MB):** Web Audio analyses tempo, key, energy, brightness, bass and dynamics.
  - The environment reacts gently to the music, with limited brightness changes and no strobing.
  - Music can help determine atmosphere when the description does not specify it.
  - Mood is inferred from musical characteristics rather than tempo alone.
  - Music does not override an emotion explicitly described by the user.
- **Music link (YouTube, Spotify, Yandex Music, etc.):** The link is saved and opens in the corresponding service. The game does not download the linked audio.
- **Manual mood and energy:** Used when no local audio file is provided. A generative melody plays in the selected mood.

## People, dialogue and text: what comes from your input

- **Characters only from evidence.**
  - In the online AI mode, photographs are interpreted to reconstruct people and their visible characteristics.
  - Offline, characters can be represented using photo cut-outs or locally reconstructed pixel models where supported.
  - People mentioned only in the description can appear as neutral silhouettes when their appearance is unknown.
  - The game avoids introducing unrelated characters.

- **Dialogue is based on the user's story.**
  - Explicit quotations can be attributed to the people who said them.
  - For example, a quote attributed to "мама" belongs to the character identified as "мама".
  - If a suitable character is unavailable, the quote can appear at the focal point of the memory.
  - The system avoids inventing personal conversations.

- **Diary fragments:** The user's own sentences appear as fragments of the memory rather than AI-invented first-person experiences.
- **Titles:** Generated from the information supplied by the user and editable in the frame menu.

## Voice narration

The game includes **prerecorded human voice narration** to make reconstructed memories feel more personal and emotionally engaging.

The narration library contains universal Russian phrases organised by:

- **Category:** Greeting, question, reaction, memory, remark and closing.
- **Emotion:** Happy, sad, calm and angry.
- **Voice characteristics:** Available voice variants and age-related settings.

The system selects appropriate recordings according to the atmosphere and context of the memory.

**How narration works:**
- Voice phrases complement the environment without replacing the user's original description.
- Narration is occasional and atmospheric rather than continuous.
- The selection of phrases takes emotional context into account.
- Background music and voice playback are coordinated so that spoken phrases remain understandable.
- Missing voice recordings are handled without interrupting gameplay.

The narration uses **recorded human voices**, not real-time text-to-speech generation.

## Cloud AI — primary generation mode

**Cloud AI is the main generation system of The Space Between Memories.**

The game uses the **Gemini API from Google AI Studio**, connected through a **Cloudflare Worker** backend.

When creating a memory, the user provides photographs, a description and optionally music. Gemini AI interprets these inputs to understand:

- **Location:** The type of environment and its spatial structure.
- **Objects:** Important items visible in photographs or mentioned in the description.
- **People:** Their presence, visible appearance and relationship to the memory.
- **Atmosphere:** Emotions, mood and environmental details.
- **Time and weather:** Lighting, season, time of day and weather conditions.
- **Composition:** How the environment should be arranged to create a coherent explorable scene.

The AI produces a structured scene specification, which the game interprets and renders as an interactive world.

**Scene validation** checks the generated specification to maintain spatial consistency, prevent misplaced objects and avoid unsupported dialogue or invented personal memories.

### AI generation workflow

1. The user uploads photographs and writes a memory description.
2. The game sends the relevant information to the Cloudflare Worker.
3. The Worker securely communicates with Gemini AI.
4. Gemini interprets the inputs and produces a structured scene specification.
5. The game validates and reconstructs the environment.
6. The user explores the generated memory world.

### Offline fallback

If the cloud AI service or internet connection is unavailable, the game uses its local generation systems.

Offline generation combines:
- **Rule-based text interpretation** for location, weather, events and emotions.
- **Photo-colour analysis** for visual palette and environmental clues.
- **Music analysis** for atmosphere and subtle environmental effects.
- **Built-in neural models** for supported local person analysis.
- **Procedural scene generation** for constructing explorable environments.

This allows users to continue creating and exploring memories without relying entirely on an external AI service.

**Online mode provides deeper semantic and visual understanding, while offline mode preserves the core memory-exploration experience.**

The current generation mode is displayed in the game interface.

### Security and deployment

The Gemini API key is stored in **Cloudflare Worker secrets**, not in the HTML or source repository.

The Worker acts as a secure intermediary between the browser and Google AI Studio.

Deployment instructions are provided in `README-DEPLOY.md`.

## Built-in neural network (offline)

The HTML includes a local neural network for analysing photographs of people: Human 3.3 / TensorFlow.js, together with BlazeFace, MoveNet, Selfie-segmentation and GEAR models, approximately 8 MB in total.

The models run in the browser using WebGL when available and can fall back to the CPU.

**What it does with a photograph of a person:**
- Detects the face, body pose and person's outline.
- Identifies body regions such as shoulders, elbows, hips, knees and ankles.
- Estimates age.
- Samples colours from visible regions including face, hair, torso, sleeves, legs and shoes.
- Builds a pixel-style character representation.

**What it does not do:**
- Reliably recognise details such as glasses, clothing prints or hats.
- Invent body parts or visual details not visible in the photograph.
- Generate an unsupported person when body detection fails.

When a person cannot be reconstructed, the photograph itself can be displayed as a cut-out figure.

**Performance:** On a typical GPU-equipped laptop, processing a photograph takes a few seconds. CPU-only processing may take longer.

The built-in network provides local visual analysis when cloud AI is unavailable.

## Rooms and windows

- **Human scale:** Hotel room 5×7 cells, room 6×7, kitchen and desk 5×6.
- **Windows:** A window is an opening in an exterior wall, showing the outside environment with sky, clouds and horizon.
- **View from the window:** If the story describes a view from a window, the player begins indoors, facing the window. Outdoor elements such as the sea, city or mountains appear outside.
- **Sky colour:** Derived from the photograph when it represents an outdoor view; otherwise it follows the time of day.
- **Scene validation:** Checks that outdoor objects do not appear indoors, weather effects are placed correctly, and the environment maintains appropriate scale.

## Composition and vast outdoor worlds

**Outdoors.**

- The playable zone is an irregular area approximately 22–32 cells across, within a larger 66–76-cell grid.
- There are **no visible artificial walls** at the edge of outdoor environments:
  - Lightweight distant scenery sprites extend the environment visually.
  - The floor continues toward the horizon; water can extend into an apparently infinite ocean.
  - Hills, forests, cities, mountains and fields can appear as silhouettes in the sky panorama.
- Natural obstacles such as trees, hedges, dunes, rocks, reeds, water and buildings define the playable boundaries.

**Composition.**

- **Focal point:** Positioned ahead of the starting location, approximately 6–8 cells away.
- **Mentioned objects:** Placed in the visible middle ground.
- **Trees, bushes and rocks:** Clustered in natural groups in the background.
- **Benches and lamps:** Positioned along paths.
- **Houses and tents:** Generally placed farther from the starting point.

**Indoors.**

Rooms preserve architectural walls and coherent furniture placement. Furniture is arranged according to the type of room, with tables, chairs and other objects positioned logically.

On rainy days, windows can show raindrops while the interior remains dry.

**Validation.**

Each generated environment is checked for:
- A walkable starting point.
- A reachable focal point.
- Objects correctly positioned on the ground.
- Appropriate placement of objects relative to water.
- Closed playable boundaries.

**Determinism.** Generation uses a stored seed so the same memory can be reconstructed consistently.

## The art system

The game includes five artistic influences. Their weights (0–1) can be blended together to create different visual styles.

| Influence | Post-processing | Generation |
|---|---|---|
| **Monet · impressionism** | Soft brush-like texture, pastel colours | — |
| **Kandinsky · expression** | Strong saturation, light posterisation, music-reactive colour | Slightly more objects |
| **Super 8 · film** | Warm colour cast, vignette, film grain, light leaks and subtle frame movement | — |
| **Romantic landscape** | Increased contrast, golden horizon light, atmospheric haze | More clouds and deeper haze |
| **Ma · Japanese minimalism** | Desaturation, paper tone and softer contrast | Fewer objects and more empty space |

- **Auto:** Automatically selects influences based on the emotion and location. For example, calm memories can use Monet + Ma, nostalgia can use Super 8, and tense scenes can use Kandinsky.
- **Manual selection:** Users can choose artistic influences while creating a memory and adjust them in the frame menu.
- Artistic influences affect colour, light and atmosphere rather than adding unrelated abstract objects to the physical environment.

## Titles

Titles are generated from the user's story, generally using 3–7 words in the language of the description.

Examples:
- "Закат из окна отеля" ("Sunset from the hotel window").
- "Ночь у костра с друзьями" ("Night by the campfire with friends").
- "Вечер дома с сестрой" ("Evening at home with my sister").

When the description does not provide enough information, the title can use an excerpt of the original text.

Users can edit the title directly in the frame menu.

## Saving, export, import

- **Storage:** IndexedDB (`liminal-worlds`) stores memories and their associated information. The record structure includes `id, created, t, frame, title, titleAuto, caption, img, extras, spec, art, seed, music, musicLink, manual`. Audio is stored separately.
- **Delete:** Frame menu → "УДАЛИТЬ" ("Delete"), with confirmation.
- **Export:** "⇩ ЭКСПОРТ" saves memories as a `.json` file, including photos, settings and audio data.
- **Import:** "⇧ ИМПОРТ" validates imported files and restores memories to their corresponding frames.
- **Storage full:** The game provides a message suggesting that users delete or export memories.

## Content check

Every description, character name and title is checked before generation.

- **Blocked:** Explicit sexual content, sexualisation of minors, sexual violence, graphic violence, hate and calls for violence against groups, and instructions or promotion of serious harm.
- **Allowed:** Grief, death, funerals, war, history and non-graphic trauma.
- **Offline checking:** Uses context-sensitive rules that consider combinations of words and their meaning.
- **AI checking:** Cloud AI generation works together with the game's content validation.
- **User text is treated as data:**
  - It is inserted through safe text APIs or escaped.
  - AI requests distinguish user-provided memory content from instructions.

## Accessibility and performance

- **Less motion:** Follows the system `prefers-reduced-motion` preference and can also be enabled in the menu.
- This mode reduces head bob, flashes, music-driven pulsing, film flicker and particle movement.
- **Rendering:** Canvas 2D raycaster at 320×200 with sprite culling and a texture cache for scenery.
- **Performance:** The game is designed to provide smooth exploration through lightweight procedural environments and optimised rendering.

## Libraries, assets, AI

- **Code:** The game uses a custom implementation of its rendering, interaction and procedural world-generation systems.
- **Local neural network:** Human + TensorFlow.js, with associated bundled models. See `THIRD-PARTY-LICENSES.txt` for licensing information.
- **Fonts:** Press Start 2P, IBM Plex Mono and Cormorant Garamond (SIL Open Font License 1.1), embedded from the @fontsource packages.
- **Graphics:** Procedurally generated textures, sprites, characters and sky environments.
- **Music:** Generative audio and Web Audio analysis.
- **Voice narration:** Prerecorded human voice clips organised by category, emotional context and available voice characteristics.
- **AI:** Gemini API through Google AI Studio and a secure Cloudflare Worker backend is the primary generation system. Built-in neural models and rule-based generation provide the offline fallback.
