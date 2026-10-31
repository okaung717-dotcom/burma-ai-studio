import { expect, test } from "@playwright/test";
import { testAdminPassword } from "./auth-test-credentials";

test("unauthenticated root opens the private-beta login and logout endpoint clears sessions", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:3117", extraHTTPHeaders: { "x-bas-spaces-test": "" } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome to Burma AI Studio" })).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  const logout = await context.request.post("/api/account/sign-out");
  expect(logout.status()).toBe(200);
  expect(await logout.json()).toEqual({ ok: true });
  await context.addCookies([{ name: "bas_admin_ok", value: "1", domain: "127.0.0.1", path: "/" }]);
  const legacySession = await context.request.get("/api/admin/session");
  expect((await legacySession.json()).ok).toBe(false);
  expect((await context.request.get("/api/admin/overview")).status()).toBe(401);
  expect((await context.request.post("/api/content", { data: { homeTitle: "unauthorized" } })).status()).toBe(401);
  await context.close();
});

test("local administrator authentication is secure and persists until logout", async ({ browser }) => {
  expect(testAdminPassword.length).toBeGreaterThanOrEqual(14);
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3117",
    extraHTTPHeaders: { "x-bas-spaces-test": "" },
  });
  const page = await context.newPage();
  await page.goto("/login");
  await page.getByLabel("Username").fill("okkar");
  const passwordInput = page.locator('input[autocomplete="current-password"]');
  await passwordInput.fill("Incorrect!Password9");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".login-error")).toContainText("incorrect");

  await passwordInput.fill(testAdminPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/studio\/spaces$/);
  const sessionCookie = (await context.cookies()).find((cookie) => cookie.name === "bas_admin_session");
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.sameSite).toBe("Lax");
  await page.reload();
  await expect(page).toHaveURL(/\/studio\/spaces$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/studio/spaces");
  await expect(page).toHaveURL(/\/login$/);
  const generation = await context.request.get("/api/studio/generate");
  expect(generation.status()).toBe(401);
  await context.close();
});

test("repeated failed administrator logins are rate limited", async ({ request }) => {
  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await request.post("/api/account/sign-in", {
      headers: { "x-forwarded-for": "203.0.113.25" },
      data: { username: "okkar", password: "9999" },
    });
  }
  expect(response?.status()).toBe(429);
  expect(response?.headers()["retry-after"]).toBeTruthy();
});

test("Image Studio uses the light shell and persists safe Demo Mode creations", async ({ page }) => {
  await page.goto("/studio/image");
  await expect(page.getByRole("heading", { name: "Image Generator" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Studio navigation" })).toBeVisible();
  await expect(page.locator(".image-controls")).toBeVisible();
  await expect(page.locator(".image-creations")).toBeVisible();
  await expect(page.getByText("Your creation feed starts here")).toBeVisible();
  await page.waitForTimeout(500);
  await page.getByLabel("PROMPT").fill("Elegant rainy Yangon street, cinematic practical light");
  await expect(page.getByLabel("PROMPT")).toHaveValue("Elegant rainy Yangon street, cinematic practical light");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Generate in Demo Mode" }).click();
  await expect(page.getByRole("status")).toContainText("No provider was contacted");
  await expect(page.locator(".image-creation-card")).toHaveCount(2);
  await expect(page.getByText("No AI image generated").first()).toBeVisible();
  await page.reload();
  await expect(page.locator(".image-creation-card")).toHaveCount(2);
  await page.getByRole("button", { name: "My templates" }).click();
  await expect(page.getByText("Templates are coming to private beta")).toBeVisible();
});

test("complete Studio demo workflow persists nodes, connections and results", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/studio\/spaces$/);
  for (const label of ["Studio", "Image Studio", "Video Studio", "AI Director", "Assets Library", "Settings"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Demo campaign"));
  await page.getByRole("button", { name: "New project" }).click();
  const project = page.locator(".spaces-project-card").filter({ hasText: "Demo campaign" });
  await expect(project).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Launch film"));
  await project.getByRole("button", { name: "Create studio" }).click();
  await project.getByRole("link", { name: /Launch film/ }).click();
  await expect(page.locator(".react-flow")).toBeVisible();
  // A fresh Space is blank, and each library click inserts only its selected kind.
  await expect(page.locator(".studio-node")).toHaveCount(0);
  await page.getByRole("button", { name: "Add nodes" }).click();
  await page.getByRole("menu", { name: "Add nodes" }).getByRole("menuitem", { name: "Media / Creation" }).click();
  await expect(page.locator(".studio-node")).toHaveCount(1);
  await expect(page.locator(".studio-node-creation")).toHaveCount(1);
  await page.getByRole("button", { name: "Delete selected" }).click();
  await expect(page.locator(".studio-node")).toHaveCount(0);

  await page.getByRole("button", { name: "Image Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "Video Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "AI Director", exact: true }).first().click();
  await expect(page.locator(".studio-node")).toHaveCount(3);

  const addNodes = page.getByRole("button", { name: "Add nodes" });
  const addMenu = page.getByRole("menu", { name: "Add nodes" });
  await addNodes.click();
  await expect(addMenu).toBeVisible();
  const menuBox = await addMenu.boundingBox();
  expect(menuBox).not.toBeNull();
  await page.mouse.move(menuBox!.x + 30, menuBox!.y + 100, { steps: 8 });
  await addMenu.getByRole("menuitem", { name: "Image Generator" }).hover();
  await expect(addMenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(addMenu).toBeHidden();
  await addNodes.click();
  await page.locator(".react-flow__pane").click({ position: { x: 700, y: 100 } });
  await expect(addMenu).toBeHidden();

  await addNodes.click();
  await addMenu.getByRole("menuitem", { name: "Image Generator" }).click();
  await expect(page.locator(".studio-node-image")).toHaveCount(2);
  await page.getByRole("button", { name: "Delete selected" }).click();
  await addNodes.click();
  await addMenu.getByRole("menuitem", { name: "Video Generator" }).click();
  await expect(page.locator(".studio-node-video")).toHaveCount(2);
  await page.getByRole("button", { name: "Delete selected" }).click();

  await addNodes.click();
  await addMenu.getByRole("menuitem", { name: "Media / Creation" }).click();
  const creationNode = page.locator(".studio-node-creation").last();
  await expect(creationNode.locator(".studio-port-outputs")).toHaveCount(1);
  await expect(creationNode.locator('[data-handleid="image"]')).toHaveAttribute("aria-label", "Image · image");
  await expect(creationNode.locator('[data-handleid="video"], [data-handleid="audio"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Delete selected" }).click();

  await addNodes.click();
  await addMenu.getByRole("menuitem", { name: "Text", exact: true }).click();
  let textNode = page.locator(".studio-node-text").last();
  const textWrapper = textNode.locator("..");
  const transformBeforeTyping = await textWrapper.getAttribute("style");
  const textContent = "A reusable cinematic prompt that persists after refresh";
  await textNode.getByRole("textbox", { name: "Text content" }).fill(textContent);
  await expect(textWrapper).toHaveAttribute("style", transformBeforeTyping!);
  await expect(textNode.locator(".react-flow__handle.target")).toHaveCount(0);
  await expect(textNode.locator(".react-flow__handle.source")).toHaveCount(1);
  await expect(textNode.locator('[data-handleid="text"]')).toHaveAttribute("aria-label", "Text · text");
  const pane = page.locator(".react-flow__pane");
  const paneBounds = await pane.boundingBox();
  const textBounds = await textNode.boundingBox();
  expect(paneBounds).not.toBeNull();
  expect(textBounds).not.toBeNull();
  expect(textBounds!.x).toBeGreaterThanOrEqual(paneBounds!.x);
  expect(textBounds!.x + textBounds!.width).toBeLessThanOrEqual(paneBounds!.x + paneBounds!.width);
  await expect(page.getByText("Saved locally")).toBeVisible();
  await page.waitForTimeout(400);
  await page.reload();
  textNode = page.locator(".studio-node-text").last();
  await expect(textNode.getByRole("textbox", { name: "Text content" })).toHaveValue(textContent);
  const textPositionBeforeDrag = await textNode.locator("..").getAttribute("style");
  const textHeader = await textNode.locator(".studio-node-title").boundingBox();
  expect(textHeader).not.toBeNull();
  await page.mouse.move(textHeader!.x + 80, textHeader!.y + textHeader!.height / 2);
  await page.mouse.down();
  await page.mouse.move(textHeader!.x + 125, textHeader!.y + textHeader!.height / 2 + 25, { steps: 8 });
  await page.mouse.up();
  await expect(textNode.locator("..")).not.toHaveAttribute("style", textPositionBeforeDrag!);

  let newImage = page.locator(".studio-node-image").last();
  const newVideo = page.locator(".studio-node-video").last();
  const reversePromptInput = newVideo.locator('[data-handleid="prompt"]');
  const reverseInputBox = await reversePromptInput.boundingBox();
  const reversePaneBox = await page.locator(".react-flow__pane").boundingBox();
  expect(reverseInputBox).not.toBeNull();
  expect(reversePaneBox).not.toBeNull();
  await reversePromptInput.dispatchEvent("pointerdown", { button: 0, clientX: reverseInputBox!.x + reverseInputBox!.width / 2, clientY: reverseInputBox!.y + reverseInputBox!.height / 2 });
  await page.mouse.move(reversePaneBox!.x + reversePaneBox!.width / 2, reversePaneBox!.y + 140, { steps: 20 });
  await page.mouse.up();
  const reverseInsert = page.getByRole("dialog", { name: "Insert connected node" });
  await expect(reverseInsert).toBeVisible();
  await expect(reverseInsert.getByRole("option").first()).toContainText("Text");
  await page.getByLabel("Search compatible nodes").press("Enter");
  await expect(page.locator(".studio-node-text")).toHaveCount(2);
  await expect(page.locator(".react-flow__edge")).toHaveCount(1);
  const reverseTextNode = page.locator(".studio-node-text").last();
  await expect(reverseTextNode).toHaveClass(/selected/);
  await expect(reverseTextNode.locator('[data-handleid="text"]')).toHaveAttribute("data-connected", "true");
  await expect(reversePromptInput).toHaveAttribute("data-connected", "true");
  await reverseTextNode.getByRole("textbox", { name: "Text content" }).fill("Connected prompt resolved by the video demo");
  await newVideo.dispatchEvent("click");
  await page.getByRole("button", { name: "Run selected · Demo" }).click();
  await expect(newVideo.getByText("Demo workflow completed", { exact: false }).first()).toBeVisible();
  await reverseTextNode.dispatchEvent("click");
  await page.getByRole("button", { name: "Delete selected" }).click();
  await expect(page.locator(".studio-node-text")).toHaveCount(1);
  await expect(page.locator(".react-flow__edge")).toHaveCount(0);
  await textNode.locator('[data-handleid="text"]').dragTo(newVideo.locator('[data-handleid="prompt"]'), { force: true });
  await textNode.locator('[data-handleid="text"]').dragTo(newImage.locator('[data-handleid="prompt"]'), { force: true });
  await expect(page.locator(".react-flow__edge")).toHaveCount(2);
  await textNode.dispatchEvent("click");
  await page.getByRole("button", { name: "Duplicate selected" }).click();
  await expect(page.locator(".studio-node-text")).toHaveCount(2);
  await page.getByRole("button", { name: "Delete selected" }).click();
  await expect(page.locator(".studio-node-text")).toHaveCount(1);
  textNode = page.locator(".studio-node-text").last();
  await textNode.dispatchEvent("click");
  await page.getByRole("button", { name: "Delete selected" }).click();
  await expect(page.locator(".react-flow__edge")).toHaveCount(0);
  await expect(page.locator(".studio-inspector")).toHaveCount(0);

  const newDirector = page.locator(".studio-node-director").last();
  newImage = page.locator(".studio-node-image").last();
  const source = newDirector.locator('[data-handleid="prompt"]');
  const target = newImage.locator('[data-handleid="prompt"]');
  await expect(source.locator(".studio-port-icon svg")).toBeVisible();
  await expect(source).toHaveAttribute("aria-label", "Prompt · text");
  await source.hover();
  await expect(source.locator(".studio-port-tooltip")).toBeVisible();
  await source.dragTo(target, { force: true });
  await expect(page.locator(".react-flow__edge")).toHaveCount(1);

  await page.locator(".workflow-edge-hit").first().dispatchEvent("mouseover");
  const disconnect = page.getByRole("button", { name: "Disconnect" });
  await expect(disconnect).toBeVisible();
  await disconnect.dispatchEvent("pointerover");
  await page.waitForTimeout(220);
  await expect(disconnect).toBeVisible();
  await disconnect.dispatchEvent("pointerdown");
  await expect(page.locator(".react-flow__edge")).toHaveCount(0);
  await page.getByTitle("Undo").click();
  await expect(page.locator(".react-flow__edge")).toHaveCount(1);

  await newImage.dispatchEvent("click");
  const prompt = "Cinematic Yangon skyline at blue hour, warm practical lights";
  await page.getByRole("textbox", { name: "Prompt", exact: true }).fill(prompt);
  await page.getByRole("button", { name: "Run selected · Demo" }).click();
  await expect(newImage.getByText("Demo workflow completed", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Demo history")).toBeVisible();
  await expect(page.getByText("Saved locally")).toBeVisible();

  await page.reload();
  await expect(page.locator(".studio-node")).toHaveCount(3);
  await expect(page.locator(".react-flow__edge")).toHaveCount(1);
  await expect(page.getByText("Demo history")).toBeVisible();
  await page.locator(".studio-node-image").last().dispatchEvent("click");
  await expect(page.getByRole("textbox", { name: "Prompt", exact: true })).toHaveValue(prompt);

  const textOutput = page.locator(".studio-node-director").first().locator('[data-handleid="prompt"]');
  const outputBox = await textOutput.boundingBox();
  const paneBox = await page.locator(".react-flow__pane").boundingBox();
  expect(outputBox).not.toBeNull();
  expect(paneBox).not.toBeNull();
  await page.mouse.move(outputBox!.x + outputBox!.width / 2, outputBox!.y + outputBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(paneBox!.x + 320, paneBox!.y + paneBox!.height - 170, { steps: 20 });
  await page.mouse.up();
  await expect(page.getByRole("dialog", { name: "Insert connected node" })).toBeVisible();
  await expect(page.getByRole("option", { name: /Image Generator/ })).toBeVisible();
  await expect(page.getByRole("option", { name: /Video Generator/ })).toBeVisible();
  await page.getByLabel("Search compatible nodes").fill("video");
  await page.getByLabel("Search compatible nodes").press("Enter");
  await expect(page.locator(".studio-node")).toHaveCount(4);
  await expect(page.locator(".react-flow__edge")).toHaveCount(2);
  await expect(page.getByRole("dialog", { name: "Insert connected node" })).toBeHidden();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Demo history")).toBeHidden();
});

test("Studio canvas selects only the clicked node and Backspace deletes without affecting text editing", async ({ page }) => {
  await page.goto("/studio/spaces");
  await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();
  page.once("dialog", dialog => dialog.accept("Keyboard regression studio"));
  await page.getByRole("button", { name: "New project" }).click();
  const project = page.locator(".spaces-project-card").filter({ hasText: "Keyboard regression studio" });
  await expect(project).toBeVisible();
  page.once("dialog", dialog => dialog.accept("Keyboard studio"));
  await project.getByRole("button", { name: "Create studio" }).click();
  await project.getByRole("link", { name: "Keyboard studio" }).click();
  await expect(page.locator(".react-flow")).toBeVisible();
  await expect(page.locator(".studio-node")).toHaveCount(0);
  await page.getByRole("button", { name: "Image Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "Text", exact: true }).first().click();
  await expect(page.locator(".studio-node")).toHaveCount(2);
  await page.locator(".studio-node-image").dispatchEvent("click");
  await expect(page.getByRole("button", { name: "Delete selected" })).toBeVisible();
  await page.keyboard.press("Backspace");
  await expect(page.locator(".studio-node-image")).toHaveCount(0);
  await expect(page.locator(".studio-node-text")).toHaveCount(1);
  const content = page.getByRole("textbox", { name: "Text content" });
  await content.fill("Typing is safe");
  await content.press("Backspace");
  await expect(content).toHaveValue("Typing is saf");
  await expect(page.locator(".studio-node-text")).toHaveCount(1);
  await page.locator(".studio-node-title").click();
  await page.keyboard.press("Delete");
  await expect(page.locator(".studio-node")).toHaveCount(0);
});

test("Studio canvas uses arrow selection and temporary Space hand panning", async ({ page }) => {
  await page.goto("/studio/spaces");
  await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();
  page.once("dialog", dialog => dialog.accept("Pointer behavior project"));
  await page.getByRole("button", { name: "New project" }).click();
  const project = page.locator(".spaces-project-card").filter({ hasText: "Pointer behavior project" });
  page.once("dialog", dialog => dialog.accept("Pointer studio"));
  await project.getByRole("button", { name: "Create studio" }).click();
  await project.getByRole("link", { name: "Pointer studio" }).click();
  await expect(page.locator(".react-flow")).toBeVisible();

  const canvas = page.locator(".studio-canvas");
  const pane = page.locator(".react-flow__pane");
  const arrow = page.getByRole("button", { name: "Select tool" });
  const hand = page.getByRole("button", { name: "Hand tool" });
  await expect(arrow).toHaveAttribute("aria-pressed", "true");
  await expect(hand).toHaveAttribute("aria-pressed", "false");
  await expect(canvas).toHaveClass(/studio-mode-select/);
  await expect(pane).toHaveCSS("cursor", "default");

  await page.getByRole("button", { name: "Image Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "Text", exact: true }).first().click();
  await page.locator(".studio-node-image .studio-node-title").click();
  await expect(page.locator(".studio-node-image").first()).toHaveClass(/selected/);

  await hand.click();
  await expect(canvas).toHaveClass(/studio-mode-pan/);
  await expect(pane).toHaveCSS("cursor", "grab");
  await arrow.click();
  await expect(pane).toHaveCSS("cursor", "default");

  // Holding Space temporarily switches to the hand without changing the selected tool.
  await pane.click({ position: { x: 20, y: 30 } });
  await page.keyboard.down("Space");
  await expect(hand).toHaveAttribute("aria-pressed", "true");
  await expect(pane).toHaveCSS("cursor", "grab");
  await page.keyboard.up("Space");
  await expect(arrow).toHaveAttribute("aria-pressed", "true");
  await expect(pane).toHaveCSS("cursor", "default");
  await page.locator(".studio-node-image .studio-node-title").click();
  await page.keyboard.press("Backspace");
  await expect(page.locator(".studio-node-image")).toHaveCount(0);
  await expect(page.locator(".studio-node-text")).toHaveCount(1);
});

test("Video Studio shows professional controls and persists safe Demo Mode workflow history", async ({ page }) => {
  await page.goto("/studio/video");
  await expect(page.getByRole("heading", { name: "Video Generator" })).toBeVisible();
  await expect(page.locator(".video-controls")).toBeVisible();
  await expect(page.locator(".video-creations")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add first frame" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add last frame" })).toBeVisible();
  await expect(page.getByText("Turn your next idea into motion")).toBeVisible();

  await page.getByLabel("Motion prompt").fill("A camera slowly pushes toward the rainy Yangon street, natural lighting, 24 frames per second");
  await page.getByLabel("Video aspect ratio").selectOption("9:16");
  await page.getByLabel("Video duration").selectOption("8");
  await page.getByLabel("Video frame rate").selectOption("30");
  await page.getByLabel("CAMERA MOVEMENT").selectOption("Slow orbit");
  await page.getByRole("button", { name: "Create demo workflow" }).click();
  await expect(page.getByRole("status")).toContainText("No actual video was generated");
  await expect(page.locator(".video-creation-card")).toHaveCount(1);
  await expect(page.getByText("DEMO · NO VIDEO RENDERED")).toBeVisible();

  await page.reload();
  await expect(page.locator(".video-creation-card")).toHaveCount(1);
  await expect(page.getByLabel("Motion prompt")).toHaveValue(/camera slowly pushes/);
  await expect(page.getByLabel("Video aspect ratio")).toHaveValue("9:16");
  await page.getByRole("button", { name: "Favorite video" }).click();
  await page.getByRole("button", { name: "Show favorite videos" }).click();
  await expect(page.locator(".video-creation-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Reuse video settings" }).click();
  await expect(page.getByLabel("Video duration")).toHaveValue("8");
  await page.getByRole("button", { name: "My templates" }).click();
  await expect(page.getByText("Your video templates are coming")).toBeVisible();
  await page.getByRole("button", { name: "Back to creations" }).click();
  await expect(page.locator(".video-creation-card")).toHaveCount(1);
});
