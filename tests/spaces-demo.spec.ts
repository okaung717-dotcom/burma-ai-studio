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

test("complete Spaces demo workflow persists nodes, connections and results", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/studio\/spaces$/);
  for (const label of ["Spaces", "Image Studio", "Video Studio", "AI Director", "Assets Library", "Settings"]) {
    await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Spaces" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Demo campaign"));
  await page.getByRole("button", { name: "New project" }).click();
  const project = page.locator(".spaces-project-card").filter({ hasText: "Demo campaign" });
  await expect(project).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Launch film"));
  await project.getByRole("button", { name: "Create space" }).click();
  await project.getByRole("link", { name: /Launch film/ }).click();
  await expect(page.locator(".react-flow")).toBeVisible();

  await page.getByRole("button", { name: "Image Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "Video Generator", exact: true }).first().click();
  await page.getByRole("button", { name: "AI Director", exact: true }).first().click();
  await expect(page.locator(".studio-node")).toHaveCount(6);

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
  await expect(page.locator(".studio-node-image")).toHaveCount(3);
  await page.getByRole("button", { name: "Delete selected" }).click();
  await addNodes.click();
  await addMenu.getByRole("menuitem", { name: "Video Generator" }).click();
  await expect(page.locator(".studio-node-video")).toHaveCount(3);
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
  await expect(page.locator(".studio-node")).toHaveCount(6);
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
  await expect(page.locator(".studio-node")).toHaveCount(7);
  await expect(page.locator(".react-flow__edge")).toHaveCount(2);
  await expect(page.getByRole("dialog", { name: "Insert connected node" })).toBeHidden();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Demo history")).toBeHidden();
});
