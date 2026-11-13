# Loader 1.0.0 / payload 1.9.2

- Added the separate ChessWare Loader userscript with the provided Gamesense.pub main-screen layout, real download status, Load, Exit, dragging, Insert and Tampermonkey reopen command.
- Downloads the versioned protected payload from Viktor1002/ChessWare, checks manifest schema, repository URL, file size and SHA-256, then executes only on Load in the userscript sandbox. Preserves the Firefox page bridge, GM requests and commands.
- No secondary installation, local server, fake authentication, automatic activation or permanent payload cache. Errors support retry; changed bytes are rejected.
- Added end-to-end coverage for the actual protected payload, full NNUE WASM, accepted local fixture move, disabled defaults, hash failure, connection retry and menu handoff.

# 1.9.2

- Added a separate one-file protected distribution, dist/ChessWare.protected.user.js. Locally applies identifier renaming, RC4 string-array encoding, partial control-flow flattening and dead branches to 18 owned JavaScript modules, then bundles without source maps.
- Keeps Tampermonkey metadata, GM APIs, page/worker integration, UI assets and pinned engine checksums intact. Vendor chess.js and Stockfish assets are not obfuscated. No paid API or source upload is used.
- Added a repeatable build report with options, module scope, sizes and hashes. Build dependencies use a pinned Zod patch to resolve audit findings; npm install reported zero vulnerabilities.
- Verified the actual protected artifact with full WASM on an intercepted local game fixture, accepted move/stop, all skins and config reload; native Firefox/Tampermonkey also passed after stopping the installation server.

# 1.9.1

- Renamed the Tampermonkey userscript to ChessWare, including its script-menu command and About text. The new main file is dist/ChessWare.user.js; legacy file aliases remain identical. Saved settings and theme names are preserved.
- Reduced the complete Fatachessty watermark: body text 12→10px, title 15→12px, line height 20→16px, padding 7/12→4/8px, smaller radius and shadow. Its overall height is now 25px instead of 35px. Menu geometry is unchanged.

# 1.9.0

- Matched the Fatachessty watermark to its menu: original bold Josefin face, uppercase/RGB-offset title, purple frame, rounded corners and menu shadow. Animation follows the existing toggle and reduced-motion preference. NeverChess retains NC.
- Kept distribution as one userscript with embedded UI assets and automatic verified engine loading; no local runtime, companion program, manual engine download or server is required on the destination computer.
- Passed 42 unit tests and the browser theme/default regression. Verified the installed userscript in Firefox 160.0 / Tampermonkey 5.5 after stopping its temporary installation server.

# 1.8.5

- Restored the compact NC watermark for NeverChess by request. chessence/Fatachessty watermark names and Menu Style labels remain unchanged.

# 1.8.4

- Watermark branding now follows the full selected skin name: chessence, NeverChess or Fatachessty. NeverChess no longer displays NC.
- Renamed Old — Skeet to chessence in Menu Style, with migration of saved current settings and presets, retaining dimensions and existing options.
- Passed 42 unit tests and browser checks for each real selector/watermark update, reload and three-skin restoration.

# 1.8.3

- Fixed vertically clipped nickname/config text in the Fatachessty header. Text rows now have a 16px line height, 18px minimum height and vertical breathing room inside a 40px wrapper; the avatar stays 28px and centred in the original 50px header.
- Verified a long Guest nickname and descenders in the config name through the browser port regression; preserved the window and column geometry.

# 1.8.2

- Removed the move-history/position-information display, Copy FEN/PGN actions and their switches from all three skins. Chess Utilities retains Move Sound.
- Removed the unused clipboard permission and action handlers; obsolete saved history/position keys are ignored. Internal board position/history reading remains available to the engine and session checks.
- Passed 42 unit tests and the focused browser regression, including absence of all removed controls and usable Move Sound.

# 1.8.1

- Every boolean function defaults to off. A one-time revision resets current switches and the baseline Default profile on upgrade, preserving geometry, numeric parameters and named saved presets. Subsequent explicit choices persist normally.
- Removed the folder/Configs shortcut from Fatachessty's bottom toolbar; the main Configs tab remains.
- Arrow Color now recolors highlights, check/threat/mate markings and all six chams roles as well as arrows. Color changes never enable functions. Individual color overrides remain editable afterward.
- Added empty-start/upgrade/master-color regressions; feature tests explicitly opt in instead of relying on enabled defaults.

# 1.8.0

- Added the third skin, Fatachessty, ported from the supplied FatalityGUI standalone source. Preserved the 848×588 frame, 50px header, 28px toolbar, original three-column geometry, purple/pink palette and source widget sizes.
- Embedded the original Josefin Sans faces and eight PNG resources through a data-only importer, with source paths and checksums. The native executable is never run by the userscript.
- Added fitting for the full Fatachessty title, own profile/avatar in the source header location, horizontal navigation, functional section views, settings search, quicksave, config navigation and About.
- All three styles retain independent dimensions/spacing. Panel order, material controls and custom dropdown/color editors restore correctly across skin changes. Existing manual game activation remains unchanged.
- Passed 39 unit tests, the new port/toolbar regression, the previous NeverChess source regression, full local NNUE integration and native Firefox/Tampermonkey UI verification.

# 1.7.0

- Both engine modes start paused, including when migrating saved settings that previously enabled Rage automatically. Human and bot support remain available through explicit activation in the current game.
- Rage, Legit and both auto-move switches are runtime state. Configs retain parameters, while config loading and page reload always start paused; saving a config does not interrupt the current game.
- Added observed-game session tracking. Board/game identity, route or game metadata changes, player-colour changes, history rollback and lost eligibility disarm both modes and cancel pending work. Normal moves and board orientation changes retain activation.
- Revalidate board and game-session identity before accepting analysis results or submitting a queued move, including a different game at the same FEN. Auto-move controls require their mode to be enabled. Strategic threat hints stay dormant while both modes are paused.
- This prevents unintended automatic activity. No reduction in Fair Play detection or account closures has been established.

# 1.6.1

- Reduced the NeverChess heading from 28px to 22px.
- Resolved own account identity from trusted current-user data and own profile navigation even outside a game and when Firefox page context is denied. Own-side game headers remain a fallback; opponents, spectators and anonymous labels cannot supply identity.
- Replaced the fixed sample avatar with the actual account avatar from the page or the public Chess.com profile API. Added anonymous requests, memory caching, stale-request cancellation and initials on image failure. Unavailable profiles show an ellipsis instead of a fake Guest label.
- Verified DOM identity/avatar changes, denied context, opponent exclusion, broken-image fallback and native Firefox/Tampermonkey public-avatar loading.

# 1.6.0

- Ported the source widgets and geometry: right-aligned 30×17 switches, 92×4 sliders with numeric cells, 130px combos, circular color buttons, source Museo 14/28, Font Awesome, avatar, split backgrounds and header positions. Kept NeverChess and all five chess tabs.
- Implemented the source three-part header as 15 functional panel views. Select popups escape panel clipping; the custom HSV/HEX/alpha editor is functional. Skeet panel ordering restores on skin changes.
- Added eight real silhouette materials: Flat, Glow, Outline, Wireframe, Glass, Metallic, Neon and Scanline. Added per-role material inheritance, independent color alpha, adjustable morphological outlines and pulse. Motion preferences and existing fades remain supported.
- Verified eight distinct rendered materials in both Edge and real Firefox/Tampermonkey, plus exact widget geometry, every panel view, color editing, config save/reload and navigation.

# 1.5.0

- Replaced New — chessence with NeverChess, an HTML/CSS port of the supplied ImGui example: 690×500 geometry, 170px sidebar, source blue palette, extracted Museo fonts, grouped navigation, account/config footer and functional Save Config action. Existing modern-skin settings migrate.
- Added a compact NC watermark for NeverChess with the actual current username, measured ping and clock. Old Skeet remains available.
- Added real piece-silhouette chams for own/opponent pieces, engine move origin, actual capture target (including en passant), selection and attacked pieces; independent colors/toggles, opacity, glow and reversible fades.
- Chams follow board orientation and the current piece set, ignore clicks and discard stale-position pieces. Disabled/reduced motion and teardown are handled.
- Added full-engine browser and native Firefox/Tampermonkey visual regression coverage. Corrected the local fixture's grid rows so empty ranks retain square geometry.

# 1.4.1

- Fixed the menu opening itself after navigating between Chess.com pages. Visibility now persists in per-tab session storage and stays separate from saved configs.
- A fresh tab starts with the menu hidden. Explicit hotkey, watermark and Tampermonkey toggles still work; the hidden state is applied before the UI is attached, avoiding an initialization flash.
- Added navigation, reload, config-load and tab-isolation regression coverage.

# 1.4.0

- Removed Watermark Brand and Nickname fields. The watermark now uses fixed chessence branding and the current Chess.com account name, with an own-side game-header fallback and Guest for anonymous sessions.
- Removed the manual Analyse Position hotkey, action and buttons. Automatic engine analysis remains.
- Moved Stop All Assistance key selection and the stop action to Rage.
- Removed Center Menu, Restore 657×555 and the target/crosshair shortcut. Five main tabs remain.

# 1.3.0

- Rebuilt Legit with Rage-like engine/search/live-analysis panels and independent controls.
- Legit uses real Stockfish Skill Level 0–10 (default 4), depth up to 16, up to 2500 ms, one thread and up to 64 MB hash. Rage explicitly restores Skill Level 20.
- Uses the engine's final weakened `bestmove`, even when it differs from exposed MultiPV candidates. Removed artificial mistakes/style settings.
- Removed tickrate from settings, persisted config schema and watermark output.
- Polished board arrows/markers/highlights, with reversible 220 ms opacity transitions, reduced-motion support and cleanup. Stale-position markings clear immediately.

# 1.2.0

- Renamed the script, menu branding, default watermark and distribution file to **chessence**.
- Removed the knife shortcut from the old menu.
- Removed bot-only eligibility. Active bot, Live Chess and Daily Chess boards use the same adapter and move checks.
- Analysis starts enabled on a fresh installation and once when migrating paused legacy settings; automatic moves remain separately enabled.
- Firefox page-owned data is copied into the userscript realm before UI use. Move payloads still use explicit page-realm cloning. Worker handlers use native event listeners.
- Retained existing config storage, menu choices and old download-file compatibility.
- Verified actual Firefox 159 + Tampermonkey 5.5 startup, full NNUE download, accepted auto move, stop and both menu skins.
