import fs from "node:fs";

const path = "native-app/index.html";
let html = fs.readFileSync(path, "utf8");

function replaceRequired(from, to, label) {
  if (!html.includes(from)) throw new Error(`Missing ${label}`);
  html = html.replace(from, () => to);
}

replaceRequired('<button class="play" id="play">', '<button class="play" id="playFilm">', "featured film button");
replaceRequired('<button class="tb" id="smile" aria-label="Choose emoji">', '<button class="tb" id="emojiToggle" aria-label="Choose emoji">', "emoji toggle button");
replaceRequired('<button class="send" id="send" aria-label="Send message">', '<button class="send" id="sendMessage" aria-label="Send message">', "Chat send button");
replaceRequired("$('#play').onclick=", "$('#playFilm').onclick=", "featured film click binding");
replaceRequired("$('#smile').onclick=", "$('#emojiToggle').onclick=", "emoji toggle click binding");
replaceRequired("$('#send').onclick=send", "$('#sendMessage').onclick=send", "Chat send click binding");

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate native element IDs remain: ${duplicateIds.join(", ")}`);

for (const required of ["id=\"playFilm\"", "id=\"emojiToggle\"", "id=\"sendMessage\""]) {
  if (!html.includes(required)) throw new Error(`Missing finalized native marker: ${required}`);
}

fs.writeFileSync(path, html);
console.log("Finalized unique native controls for v3.1.2");
