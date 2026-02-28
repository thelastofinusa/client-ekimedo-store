import fs from "fs";
import path from "path";
import crypto from "crypto";
import { client } from "@/sanity/lib/client";

/* ---------- Config ---------- */
const GALLERY_ROOT = path.join(process.cwd(), "gallery");
const OUTPUT = path.join(process.cwd(), "gallery.ndjson");

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/* ---------- Helpers ---------- */
function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((e) => {
    const p = path.join(dir, e);
    return fs.statSync(p).isDirectory() ? walk(p) : p;
  });
}

function idFromPath(p: string) {
  return crypto.createHash("sha1").update(p).digest("hex");
}

/* ---------- Main ---------- */
async function run() {
  const categories: Record<string, string> = Object.fromEntries(
    (
      await client.fetch(`
        *[_type == "category"]{
          _id,
          "slug": slug.current
        }
      `)
    ).map((c: { slug: string; _id: string }) => [c.slug, c._id]),
  );

  const out = fs.createWriteStream(OUTPUT, { flags: "w" });
  const files = walk(GALLERY_ROOT);

  let count = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!VALID_EXT.has(ext)) continue;

    const categorySlug = path.basename(path.dirname(file));
    const categoryId = categories[categorySlug];

    if (!categoryId) {
      throw new Error(`Missing category: ${categorySlug}`);
    }

    const absPath = path.resolve(file);
    const docId = `gallery-${idFromPath(absPath)}`;

    out.write(
      JSON.stringify({
        _id: docId,
        _type: "gallery",
        category: {
          _type: "reference",
          _ref: categoryId,
        },
        image: {
          _type: "image",
          _sanityAsset: `image@file://${absPath}`,
        },
      }) + "\n",
    );

    count++;
  }

  out.end();

  console.log(`NDJSON generated`);
  console.log(`Images queued: ${count}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
