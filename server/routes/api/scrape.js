const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const verifyToken = require('../../middleware/auth');
const ExternalRecipeService = require('../../controllers/externalRecipeController');

router.use(verifyToken);

function extractFromJsonLd($) {
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const raw = $(scripts[i]).html();
      const data = JSON.parse(raw);
      const entries = Array.isArray(data) ? data : [data];
      for (const entry of entries) {
        const node = entry['@type'] === 'Recipe' ? entry
          : entry['@graph']?.find((n) => n['@type'] === 'Recipe');
        if (!node) continue;

        const name = node.name || null;
        const description = node.description || null;
        const image = Array.isArray(node.image)
          ? node.image[0]?.url || node.image[0]
          : node.image?.url || node.image || null;
        const preptime = node.prepTime || null;
        const cooktime = node.cookTime || null;
        const servings = node.recipeYield
          ? (Array.isArray(node.recipeYield) ? node.recipeYield[0] : node.recipeYield)
          : null;
        const ingredients = Array.isArray(node.recipeIngredient) ? node.recipeIngredient : [];
        const instructions = Array.isArray(node.recipeInstructions)
          ? node.recipeInstructions.map((s) => (typeof s === 'string' ? s : s.text || '')).filter(Boolean)
          : typeof node.recipeInstructions === 'string'
            ? [node.recipeInstructions]
            : [];

        const nutrition = node.nutrition
          ? {
              calories: node.nutrition.calories || null,
              protein: node.nutrition.proteinContent || null,
              carbs: node.nutrition.carbohydrateContent || null,
              fat: node.nutrition.fatContent || null,
              fiber: node.nutrition.fiberContent || null,
            }
          : null;

        if (name) {
          return { name, description, image, preptime, cooktime, servings, ingredients, instructions, nutrition };
        }
      }
    } catch (_) {
      // malformed JSON-LD — fall through to next script tag
    }
  }
  return null;
}

function extractHeuristic($) {
  const name = $('h1').first().text().trim() || null;

  const ingredients = [];
  $('ul li, ol li').each((_, el) => {
    const text = $(el).text().trim();
    const parent = $(el).closest('[class*="ingredient"], [id*="ingredient"]');
    if (parent.length > 0 && text) ingredients.push(text);
  });

  // Fallback: any li that looks like a measurement
  if (ingredients.length === 0) {
    $('li').each((_, el) => {
      const text = $(el).text().trim();
      if (/\d/.test(text) && text.length < 200) ingredients.push(text);
    });
  }

  const instructions = [];
  $('ol li').each((_, el) => {
    const parent = $(el).closest('[class*="instruction"], [id*="instruction"], [class*="step"], [id*="step"], [class*="direction"], [id*="direction"]');
    const text = $(el).text().trim();
    if (parent.length > 0 && text) instructions.push(text);
  });

  return { name, ingredients, instructions };
}

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  let html;
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NourishPlan/1.0)' },
    });
    html = response.data;
  } catch (err) {
    return res.status(422).json({ error: `Could not fetch URL: ${err.message}` });
  }

  const $ = cheerio.load(html);
  const sourceDomain = new URL(url).hostname.replace(/^www\./, '');

  let result = extractFromJsonLd($);

  if (!result || !result.name || !result.ingredients?.length) {
    const heuristic = extractHeuristic($);
    result = result
      ? { ...result, name: result.name || heuristic.name, ingredients: result.ingredients?.length ? result.ingredients : heuristic.ingredients, instructions: result.instructions?.length ? result.instructions : heuristic.instructions }
      : heuristic;
  }

  if (!result.name) {
    return res.status(422).json({ error: 'Could not extract recipe name from this page.' });
  }
  if (!result.ingredients || result.ingredients.length === 0) {
    return res.status(422).json({ error: 'Could not extract ingredients from this page.' });
  }

  try {
    const saved = await ExternalRecipeService.upsert(req.user.id, {
      sourceUrl: url,
      sourceDomain,
      name: result.name,
      description: result.description || '',
      image: result.image || '',
      preptime: result.preptime || '',
      cooktime: result.cooktime || '',
      servings: result.servings || '',
      ingredients: result.ingredients,
      instructions: result.instructions || [],
      nutrition: result.nutrition || undefined,
    });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
