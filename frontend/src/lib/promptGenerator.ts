export interface CharacterAppearanceTraits {
  gender?: string;
  age?: string;
  hair?: string;
  hairColour?: string;
  eyeColour?: string;
  clothStyle?: string;
  clothColour?: string;
}

export interface CharacterPersonalityTraits {
  temperament?: string;
  voice?: string;
  motivation?: string;
  flaw?: string;
  companion?: string;
  aura?: string;
}

export interface PromptGenResult {
  level: number;
  levelTierName: string;
  positivePrompt: string;
  negativePrompt: string;
  attireDescription: string;
  postureDescription: string;
  backgroundDescription: string;
  auraDescription: string;
  companionDescription: string;
}

interface LevelRule {
  tierName: string;
  attire: (style?: string, colour?: string) => string;
  posture: string;
  environment: string;
  aura: (auraChoice?: string) => string;
  companion: (compChoice?: string) => string;
  negative: string;
}

function getLevelRules(level: number): LevelRule {
  if (level <= 1) {
    return {
      tierName: "Level 1: Humble Novice",
      attire: () =>
        "wearing a tattered burlap potato sack tunic tied with a crude rope belt, frayed edges, worn scuffed sandals",
      posture: "timid slouching posture, nervous and hesitant gaze, zero confidence, unrefined look",
      environment:
        "set against a clean plain studio backdrop with zero background details, simple neutral void, soft flat portrait lighting",
      aura: () => "no magical glow, dull natural lighting",
      companion: () => "no companion present",
      negative:
        "fancy clothes, elaborate armor, jewelry, detailed background, trees, forest environment, glowing magic, floating runes, weapons, confident smile, modern clothes, ugly, blurry, bad anatomy, deformed, low quality",
    };
  }

  if (level <= 3) {
    return {
      tierName: `Level ${level}: Wandering Apprentice`,
      attire: (style, colour) =>
        `wearing a simple clean ${colour || "neutral"} linen tunic, leather belt with small pouch, basic travel boots${
          style ? `, simple ${style}` : ""
        }`,
      posture: "cautious posture, curious expression, mild determination, standing upright",
      environment:
        "set in a misty woodland clearing with faint soft silhouettes of distant trees in the background, subtle mossy ground",
      aura: (auraChoice) =>
        auraChoice && auraChoice !== "None"
          ? `very faint ${auraChoice.toLowerCase()} glint around hands`
          : "faint subtle ember glint around hands",
      companion: (compChoice) =>
        compChoice && compChoice !== "None"
          ? `a small ${compChoice.toLowerCase()} peeking behind`
          : "no active companion",
      negative:
        "elaborate plate armor, heavy jewelry, bright glowing magic spheres, cosmic effects, modern clothes, ugly, blurry, deformed, low quality",
    };
  }

  if (level <= 6) {
    return {
      tierName: `Level ${level}: Seasoned Adventurer`,
      attire: (style, colour) =>
        `wearing tailored ${colour || "forest green"} ${style || "leather armor"}, sturdy polished boots, embroidered wool cloak with bronze clasp`,
      posture: "confident posture, sharp attentive eyes, steady heroic stance, determined look",
      environment:
        "set inside a mystic fantasy forest with ancient mossy oak trees, glowing bioluminescent mushrooms, soft golden sunbeams filtering through dense leaves",
      aura: (auraChoice) =>
        `soft glowing ${auraChoice ? auraChoice.toLowerCase() : "verdant"} mana aura, floating subtle ambient light motes`,
      companion: (compChoice) =>
        compChoice && compChoice !== "None"
          ? `accompanied by a loyal ${compChoice.toLowerCase()} spirit standing nearby`
          : "no spirit companion",
      negative:
        "tattered rags, burlap sack, modern clothes, plain white background, low resolution, ugly, blurry, bad anatomy, deformed",
    };
  }

  if (level <= 9) {
    return {
      tierName: `Level ${level}: Forest Guardian`,
      attire: (style, colour) =>
        `wearing ornate silver-inlaid ${colour || "midnight"} ${
          style || "arcane robes"
        } with celestial embroidery, fur-lined mantle, glowing runic brooch`,
      posture: "commanding powerful posture, serene and wise expression, fearless piercing gaze",
      environment:
        "set deep within an ancient mystic fantasy forest under moonlight, towering ancient tree sentinels, glowing magical flora, floating runic standing stones, cascading ethereal mist",
      aura: (auraChoice) =>
        `vibrant radiant ${
          auraChoice ? auraChoice.toLowerCase() : "starlit"
        } magical aura, swirling energy wisps, elemental light particles`,
      companion: (compChoice) =>
        compChoice && compChoice !== "None"
          ? `flanked by a majestic glowing ${compChoice.toLowerCase()} spirit with ethereal armor`
          : "mystical wisps surrounding",
      negative:
        "poor clothes, burlap sack, timid pose, plain void background, modern clothes, ugly, blurry, bad proportions, low quality",
    };
  }

  return {
    tierName: `Level ${level}+: Mythic Sovereign`,
    attire: (style, colour) =>
      `wearing god-tier celestial regalia of pristine ${colour || "ivory and gold"} fabrics with glowing arcane patterns, floating golden pauldrons, divine crown of light`,
    posture: "supreme majestic posture, transcendent confidence, regal and divine presence, calm victorious gaze",
    environment:
      "set in the heart of a mythic fantasy forest sanctuary under a cosmic starry canopy with glowing aurora borealis, river of pure light, ancient celestial monoliths",
    aura: (auraChoice) =>
      `intense radiant ${
        auraChoice ? auraChoice.toLowerCase() : "cosmic"
      } aura bursting with floating golden runes, dynamic spell circles, star light specks`,
    companion: (compChoice) =>
      compChoice && compChoice !== "None"
        ? `flanked by a divine fully manifested ${compChoice.toLowerCase()} guardian deity`
        : "surrounded by celestial spirit guardians",
    negative:
      "cheap clothes, burlap sack, humble attire, plain background, simple forest, modern clothes, ugly, blurry, bad anatomy, deformed",
  };
}

export function generateCharacterPrompt(
  appearance: CharacterAppearanceTraits,
  personality: CharacterPersonalityTraits,
  level: number = 1
): PromptGenResult {
  const rules = getLevelRules(level);

  const genderStr = appearance.gender || "Female";
  const ageStr = appearance.age || "Young adult";
  const hairStr = appearance.hair ? `${appearance.hair.toLowerCase()}` : "long flowing";
  const hairColorStr = appearance.hairColour ? `${appearance.hairColour.toLowerCase()}` : "silver";
  const eyeStr = appearance.eyeColour ? `${appearance.eyeColour.toLowerCase()}` : "emerald";

  const rolePrefix =
    "You are a professional concept artist and master AI image prompt engineer specializing in high-fantasy character portraiture.";

  const subjectBaseline = `${ageStr} ${genderStr.toLowerCase()} character, ${hairStr} ${hairColorStr} hair, striking ${eyeStr} eyes`;

  const attire = rules.attire(appearance.clothStyle, appearance.clothColour);
  const posture = rules.posture;
  const tempStr = personality.temperament ? `${personality.temperament.toLowerCase()} temperament` : "";
  const aura = rules.aura(personality.aura);
  const companion = rules.companion(personality.companion);
  const env = rules.environment;

  const corePromptDetails = [
    subjectBaseline,
    attire,
    posture,
    tempStr,
    aura,
    companion !== "no companion present" && companion !== "no active companion" && companion !== "no spirit companion"
      ? companion
      : "",
    env,
    "mystic fantasy art style, digital painting, highly detailed, 8k resolution, cinematic lighting, octane render, masterpiece, trending on artstation",
  ]
    .filter(Boolean)
    .join(", ");

  const photoDimensions = "Image Dimensions & Framing: 4:5 vertical portrait aspect ratio (--ar 4:5), 1024x1280 resolution, centered full character portrait framing.";

  const formattedFullPrompt = `${rolePrefix}\n\n${corePromptDetails}\n\n${photoDimensions}`;

  return {
    level,
    levelTierName: rules.tierName,
    positivePrompt: formattedFullPrompt,
    negativePrompt: rules.negative,
    attireDescription: attire,
    postureDescription: posture,
    backgroundDescription: env,
    auraDescription: aura,
    companionDescription: companion,
  };
}
