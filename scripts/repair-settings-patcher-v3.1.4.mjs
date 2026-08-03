import fs from "node:fs";

const path = "scripts/patch-native-settings-v3.1.4.mjs";
let source = fs.readFileSync(path, "utf8");

const drawerCall = 'replaceRequired(oldDrawer, newDrawer, "settings drawer");';
const drawerReplacement = `const drawerStart = html.indexOf('<aside class="drawer" id="drawer">');
const drawerEnd = html.indexOf('</aside>', drawerStart);
if (drawerStart < 0 || drawerEnd < drawerStart) throw new Error("Missing settings drawer anchors");
html = html.slice(0, drawerStart) + newDrawer + html.slice(drawerEnd + '</aside>'.length);`;
if (!source.includes(drawerCall)) throw new Error("Settings drawer patch call was not found");
source = source.replace(drawerCall, drawerReplacement);

const profileCall = 'replaceRequired(oldProfile, newProfile, "profile settings logic");';
const profileReplacement = `if (html.includes(oldProfile)) {
  html = html.replace(oldProfile, () => newProfile);
} else {
  const profileStart = html.indexOf("$('#save').onclick=");
  const profileCatch = html.indexOf('catch{}', profileStart);
  if (profileStart < 0 || profileCatch < profileStart) throw new Error("Missing profile settings logic anchors");
  html = html.slice(0, profileStart) + newProfile + html.slice(profileCatch + 'catch{}'.length);
}`;
if (!source.includes(profileCall)) throw new Error("Profile logic patch call was not found");
source = source.replace(profileCall, profileReplacement);

fs.writeFileSync(path, source);
console.log("Repaired v3.1.4 settings patcher anchors");
