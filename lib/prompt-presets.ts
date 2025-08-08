export type PromptCategory =
  | "Professional"
  | "Lifestyle"
  | "Travel"
  | "Fitness"
  | "Fashion / Modeling"
  | "Creative / Fantasy"
  | "Cinematic"
  | "Retro"
  | "Trendy / Viral"
  | "Minimal Studio";

export type PromptPreset = {
  id: string;
  label: string;
  prompt: string;
};

export const PROMPT_LIBRARY: Record<PromptCategory, PromptPreset[]> = {
  "Professional": [
    {
      id: "pro-1",
      label: "Studio headshot (neutral bg)",
      prompt:
        "Ultra-clean studio headshot, soft key light, neutral gray seamless background, natural skin tone, crisp focus, shallow depth of field, editorial lighting, professional portrait"
    },
    {
      id: "pro-2",
      label: "Office portrait (window light)",
      prompt:
        "Casual office portrait by a large window, soft natural light, modern workspace bokeh, relaxed confident expression, business-casual outfit"
    },
    {
      id: "pro-3",
      label: "Corporate banner (wide)",
      prompt:
        "Wide corporate banner portrait, soft rim light, minimal gradient background, subtle shadow, friendly yet authoritative pose"
    },
    {
      id: "pro-4",
      label: "Tech founder vibe",
      prompt:
        "Portrait with tech founder aesthetic, dark moody background, soft top light, slight lens flare, pragmatic expression, modern casual outfit"
    },
    {
      id: "pro-5",
      label: "Conference speaker",
      prompt:
        "On-stage conference speaker look, spotlight key, auditorium bokeh, poised posture, warm highlights, confident energy"
    },
    {
      id: "pro-6",
      label: "LinkedIn hero",
      prompt:
        "Clean professional portrait for LinkedIn, high-key light, subtle gradient backdrop, friendly approachable smile, sharp suit"
    },
    {
      id: "pro-7",
      label: "Black & white editorial",
      prompt:
        "Monochrome editorial portrait, dramatic side light, rich contrast, film grain texture, timeless professional aesthetic"
    },
    {
      id: "pro-8",
      label: "Outdoor corporate (city)",
      prompt:
        "Outdoor corporate portrait with city skyline bokeh, golden hour light, polished yet candid look, light breeze in hair"
    },
    {
      id: "pro-9",
      label: "Boardroom cinematic",
      prompt:
        "Boardroom cinematic portrait, soft top light, shallow depth of field, reflective table highlights, focused executive energy"
    },
    {
      id: "pro-10",
      label: "Magazine cover (clean)",
      prompt:
        "Clean magazine cover portrait, center composition, immaculate retouch look, subtle vignette, modern typography space"
    }
  ],
  "Lifestyle": [
    { id: "life-1", label: "Coffee shop glow", prompt: "Lifestyle portrait in cozy coffee shop, warm ambient light, candid smile, latte art, wooden textures, soft bokeh" },
    { id: "life-2", label: "Sunlit apartment", prompt: "At-home lifestyle portrait, sunlit window, plants in background, relaxed wardrobe, natural candid vibe" },
    { id: "life-3", label: "Creative desk", prompt: "Creative workspace portrait, overhead warm lamp, notebooks, pencils, soft clutter aesthetic, focused expression" },
    { id: "life-4", label: "Night city walk", prompt: "Night lifestyle walk in city, neon reflections, cinematic street lights, candid mid-stride composition" },
    { id: "life-5", label: "Brunch terrace", prompt: "Brunch terrace vibe, pastel tableware, soft morning light, candid laugh, subtle wind in hair" },
    { id: "life-6", label: "Books & latte", prompt: "Bookstore cafe portrait, stacks of books, latte steam, warm tones, thoughtful gaze, cozy sweater" },
    { id: "life-7", label: "Bike & street", prompt: "Urban lifestyle with bicycle, soft backlight rim, shallow DOF, playful grin, summer feel" },
    { id: "life-8", label: "Kitchen chef", prompt: "Home kitchen cooking scene, golden light, steam highlights, candid plating moment, rustic props" },
    { id: "life-9", label: "Rooftop sunset", prompt: "Rooftop sunset portrait, city bokeh, soft breeze, warm flares, casual chic outfit" },
    { id: "life-10", label: "Studio plants", prompt: "Minimal lifestyle with indoor plants, diffused daylight, linen textures, calm expression" }
  ],
  "Travel": [
    { id: "trav-1", label: "Mediterranean alley", prompt: "Candid travel portrait in Mediterranean alley, stone walls, trailing ivy, golden light, vintage color palette" },
    { id: "trav-2", label: "Tropical beach", prompt: "Portrait on tropical beach at sunrise, pastel sky, gentle waves, windswept hair, serene vibe" },
    { id: "trav-3", label: "Mountain overlook", prompt: "Adventure portrait at mountain overlook, foggy valleys, windbreaker, cinematic scale" },
    { id: "trav-4", label: "Desert dunes", prompt: "Golden desert dunes backdrop, soft dunes curves, sun hat, dramatic shadows, editorial travel look" },
    { id: "trav-5", label: "Old Europe café", prompt: "Leisurely café portrait in old European square, cobblestones, geraniums, warm morning light" },
    { id: "trav-6", label: "Temple sunrise", prompt: "Temple sunrise scene, incense haze, dawn glow, respectful attire, tranquil expression" },
    { id: "trav-7", label: "Northern lights", prompt: "Portrait under northern lights, cold night breath, reflective jacket, awe-struck gaze" },
    { id: "trav-8", label: "Jungle bridge", prompt: "Rainforest hanging bridge, misty foliage, explorer aesthetic, humidity glow, saturated greens" },
    { id: "trav-9", label: "Canal boat", prompt: "Canal-side portrait on small boat, rippling reflections, pastel houses, travel diary mood" },
    { id: "trav-10", label: "Ski village", prompt: "Alpine ski village, fresh snow, warm knitwear, rosy cheeks, chalet bokeh" }
  ],
  "Fitness": [
    { id: "fit-1", label: "Gym strength", prompt: "Athletic portrait in gym, directional top light, chalk dust particles, determined expression, high contrast" },
    { id: "fit-2", label: "Track sprint", prompt: "Outdoor track portrait, motion blur, sunrise rim light, focused athlete energy" },
    { id: "fit-3", label: "Yoga calm", prompt: "Minimal yoga studio, diffused daylight, plants, serene breath, pastel mat" },
    { id: "fit-4", label: "Cycling road", prompt: "Road cycling scene, motion, rolling hills bokeh, aerodynamic kit, effort captured" },
    { id: "fit-5", label: "Boxing club", prompt: "Old-school boxing club, gritty textures, hanging bags, sweat sheen, intense gaze" },
    { id: "fit-6", label: "Climbing gym", prompt: "Indoor climbing portrait, colorful holds, chalk on hands, mid-move, dynamic angle" },
    { id: "fit-7", label: "HIIT studio", prompt: "HIIT studio session, strobe feel, smoke haze, neon accents, explosive energy" },
    { id: "fit-8", label: "Pilates light", prompt: "Bright pilates studio, mirrored walls, clean lines, aligned posture, airy aesthetic" },
    { id: "fit-9", label: "Trail run", prompt: "Trail running in forest, dappled light, earthy tones, action frame, joyful smile" },
    { id: "fit-10", label: "Swim pool", prompt: "Poolside portrait, turquoise water, reflective highlights, athletic calm, summertime" }
  ],
  "Fashion / Modeling": [
    { id: "mod-1", label: "Editorial high fashion", prompt: "High-fashion editorial portrait, dramatic styling, glossy lighting, couture silhouette, magazine grade" },
    { id: "mod-2", label: "Street style", prompt: "Street style fashion, urban textures, candid stride, strong color blocking, viral-fit energy" },
    { id: "mod-3", label: "Runway glow", prompt: "Runway look, spotlights, reflective floor, elongated silhouette, striking confidence" },
    { id: "mod-4", label: "Denim campaign", prompt: "Denim campaign mood, soft sunlight, dust haze, Americana vibe, authentic grit" },
    { id: "mod-5", label: "Beauty close-up", prompt: "Beauty close-up, radiant skin, glossy lips, soft diffused light, flawless gradient backdrop" },
    { id: "mod-6", label: "Luxury boutique", prompt: "Luxury boutique setting, warm spot accents, marble textures, poised pose, refined elegance" },
    { id: "mod-7", label: "Studio color gels", prompt: "Studio portrait with bold color gels, cyan-magenta split lighting, graphic shadow play" },
    { id: "mod-8", label: "Y2K revival", prompt: "Y2K fashion revival, chrome accents, candy colors, playful glam, glossy sheen" },
    { id: "mod-9", label: "Monochrome minimal", prompt: "Minimal monochrome fashion, sharp tailoring, soft top light, sculptural shadow" },
    { id: "mod-10", label: "Power suit", prompt: "Power suit portrait, crisp crease, subtle backlight halo, decisive stance, bold presence" }
  ],
  "Creative / Fantasy": [
    { id: "fan-1", label: "Elven forest", prompt: "Fantasy portrait as an elf in ancient forest, bioluminescent flora, ethereal backlight, silver accents" },
    { id: "fan-2", label: "Cyberpunk", prompt: "Cyberpunk city portrait, hologram ads, neon rain, reflective jacket, electric palette" },
    { id: "fan-3", label: "Steampunk", prompt: "Steampunk inventor, brass goggles, workshop smoke, sepia tones, intricate props" },
    { id: "fan-4", label: "Sorcerer", prompt: "Arcane sorcerer vibe, glowing runes, swirling particles, moody fog, cinematic grading" },
    { id: "fan-5", label: "Galaxy wanderer", prompt: "Cosmic wanderer portrait, starfield backdrop, nebula hues, reflective visor, space suit" },
    { id: "fan-6", label: "Mythic warrior", prompt: "Mythic warrior with ornate armor, cliffside storm, flying embers, epic scale" },
    { id: "fan-7", label: "Mermaid shore", prompt: "Mermaid on rocky shore at dusk, pearls, sea spray highlights, bioluminescent accents" },
    { id: "fan-8", label: "Vampire noir", prompt: "Gothic vampire portrait, candlelit cathedral, deep reds, baroque drama, pale elegance" },
    { id: "fan-9", label: "Forest spirit", prompt: "Forest spirit, moss crown, drifting spores, green-gold palette, mystical calm" },
    { id: "fan-10", label: "Dragon tamer", prompt: "Heroic dragon tamer, glowing embers, wind-blown cloak, cinematic backlight, epic fantasy" }
  ],
  "Cinematic": [
    { id: "cin-1", label: "Blade Runner vibes", prompt: "Moody cinematic portrait, rain-streaked window, neon reflections, teal and orange grading" },
    { id: "cin-2", label: "Wes Anderson symmetry", prompt: "Symmetrical composition, pastel palette, quirky props, centered framing, vintage charm" },
    { id: "cin-3", label: "Noir detective", prompt: "Film noir portrait, Venetian blinds light, cigarette smoke, fedora, dramatic shadows" },
    { id: "cin-4", label: "Indie film still", prompt: "Indie film still look, 35mm grain, soft warm highlights, wistful expression" },
    { id: "cin-5", label: "Sports docu", prompt: "Sports documentary portrait, sideline grit, compressed tele look, dynamic tension" },
    { id: "cin-6", label: "Desaturated war film", prompt: "Desaturated war-film tone, dust and smoke, harsh light, stoic gaze, dramatic texture" },
    { id: "cin-7", label: "Rom-com glow", prompt: "Rom-com city glow, fairy lights bokeh, soft backlight, bright smile, gentle color grade" },
    { id: "cin-8", label: "Western dusk", prompt: "Western dusk palette, amber and cobalt, horizon silhouette, cinematic dust" },
    { id: "cin-9", label: "A24 mood", prompt: "A24-esque mood, muted colors, long lens bokeh, introspective vibe, natural practicals" },
    { id: "cin-10", label: "Documentary still", prompt: "Candid doc still, imperfect light, authentic expression, real-world textures" }
  ],
  "Retro": [
    { id: "ret-1", label: "Polaroid flash", prompt: "Retro Polaroid flash portrait, slight overexposure, instant film frame, soft nostalgia" },
    { id: "ret-2", label: "90s camcorder", prompt: "90s camcorder aesthetic, VHS scanlines, suburban backdrop, candid grin" },
    { id: "ret-3", label: "80s studio", prompt: "1980s studio portrait, gradient backdrop, soft glam light, analog grain" },
    { id: "ret-4", label: "Disco glam", prompt: "Disco era glam, mirror ball reflections, saturated magenta-cyan, sparkle makeup" },
    { id: "ret-5", label: "70s film warm", prompt: "1970s warm film stock, sun flares, bell-bottoms, cozy vignette" },
    { id: "ret-6", label: "Arcade night", prompt: "Retro arcade night, RGB glow, CRT screens, playful expression, colorful bokeh" },
    { id: "ret-7", label: "Instant portrait", prompt: "Instant camera look, soft flash, candid laugh, slight motion blur, tactile nostalgia" },
    { id: "ret-8", label: "Old Hollywood", prompt: "Old Hollywood glam, black & white, butterfly lighting, satin highlights, timeless elegance" },
    { id: "ret-9", label: "Y2K club", prompt: "Y2K club scene, chrome and glitter, cyan lighting, fun attitude" },
    { id: "ret-10", label: "Film street", prompt: "Film street style, 400 ISO grain, muted tones, candid city moment" }
  ],
  "Trendy / Viral": [
    { id: "tr-1", label: "Lo-fi mirror", prompt: "Lo-fi mirror selfie vibe, soft diffusion, pastel stickers, candid charm" },
    { id: "tr-2", label: "Coquette soft", prompt: "Coquette aesthetic, ribbons and lace, blush tones, dreamy soft light" },
    { id: "tr-3", label: "Clean girl", prompt: "Clean girl aesthetic, slick bun, gold hoops, dewy highlight, minimalist bathroom" },
    { id: "tr-4", label: "Mob wife", prompt: "Mob wife glam, faux fur, strong liner, rich gold jewelry, dramatic attitude" },
    { id: "tr-5", label: "Tomato girl", prompt: "Tomato girl summer, coastal Italian palette, straw bag, sun-kissed skin" },
    { id: "tr-6", label: "Gorpcore trail", prompt: "Gorpcore fashion on forest trail, techwear layers, functional chic, moss greens" },
    { id: "tr-7", label: "Indie sleaze", prompt: "Indie sleaze flash, direct on-camera flash, messy party vibe, playful chaos" },
    { id: "tr-8", label: "Core memory", prompt: "Core memory moment, soft blur, dreamlike pastel, sentimental micro-story" },
    { id: "tr-9", label: "Grunge cyber", prompt: "Grunge-cyber mashup, distressed textures, neon accents, rebellious energy" },
    { id: "tr-10", label: "Pinterest cozy", prompt: "Pinterest-cozy portrait, beige knits, latte tones, window glow, calm mood" }
  ],
  "Minimal Studio": [
    { id: "ms-1", label: "White seamless", prompt: "Minimal portrait on white seamless, soft shadow, airy high-key aesthetic, clean styling" },
    { id: "ms-2", label: "Gray gradient", prompt: "Neutral gray gradient backdrop, precise softbox light, editorial minimalism" },
    { id: "ms-3", label: "Color pop", prompt: "Single bold color background, complementary outfit, graphic composition, studio crispness" },
    { id: "ms-4", label: "Soft duo-tone", prompt: "Duo-tone gel lighting, subtle color harmony, gentle contours, modern studio" },
    { id: "ms-5", label: "Window scrim", prompt: "Simulated window-scrim light, soft shadows, filmic subtlety, quiet mood" },
    { id: "ms-6", label: "Backlit haze", prompt: "Backlit haze effect, rim halo, ethereal studio atmosphere, light bloom" },
    { id: "ms-7", label: "Matte portrait", prompt: "Matte finish portrait, low contrast, refined skin tone, gentle gradients" },
    { id: "ms-8", label: "Hard light edge", prompt: "Hard light studio, crisp edges, graphic shadows, high-fashion punch" },
    { id: "ms-9", label: "Seated stool", prompt: "Classic seated-on-stool studio portrait, simple props, relaxed corrected posture" },
    { id: "ms-10", label: "Backdrop paper roll", prompt: "Visible backdrop paper roll, studio realism, c-stand hints, behind-the-scenes feel" }
  ]
};

// Flattened helpers
export const ALL_CATEGORIES = Object.keys(PROMPT_LIBRARY) as PromptCategory[];

export function getPromptsByCategory(cat: PromptCategory): PromptPreset[] {
  return PROMPT_LIBRARY[cat] ?? [];
}

export function getRandomPrompt(): { category: PromptCategory; preset: PromptPreset } {
  const cats = ALL_CATEGORIES;
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const list = PROMPT_LIBRARY[cat];
  const preset = list[Math.floor(Math.random() * list.length)];
  return { category: cat, preset };
}


