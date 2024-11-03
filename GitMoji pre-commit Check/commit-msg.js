const fs = require("fs");

// Read the commit message file
const commitMessage = fs.readFileSync(process.argv[2], "utf8").trim();
console.warn("Commit message:", commitMessage);

// Regex to match if the first character is an emoji
const emojiRegex = /^[\p{Emoji}]/u;

// Check if the commit message starts with an emoji or if it's a merge commit
if (!emojiRegex.test(commitMessage) && !/merge/i.test(commitMessage)) {
  console.error(
    "❌ Commit message must start with a gitmoji (emoji) or be a merge commit. Please follow the gitmoji style."
  );
  process.exit(1);
}
