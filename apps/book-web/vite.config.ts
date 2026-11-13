import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, sep } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function localAudioPlugin(audioRoot: string, enabled: boolean): Plugin {
  const root = resolve(audioRoot);
  const privateAudioRoot = resolve(root, "..");
  const ambientRoot = resolve(privateAudioRoot, "stardew-audio");
  const route = "/__agent-book-local-audio";

  return {
    name: "agent-book-local-audio",
    configureServer(server) {
      if (!enabled || !existsSync(root)) return;

      server.middlewares.use(route, (request, response, next) => {
        const requestPath = decodeURIComponent((request.url ?? "/").split("?", 1)[0]);
        const filePath = resolve(root, `.${requestPath}`);
        if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
          next();
          return;
        }

        let stats;
        try {
          stats = statSync(filePath);
        } catch {
          next();
          return;
        }
        if (!stats.isFile()) {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader("Content-Type", "audio/wav");
        response.setHeader("Content-Length", stats.size);
        response.setHeader("Cache-Control", "no-store");
        createReadStream(filePath).on("error", next).pipe(response);
      });
    },
    generateBundle() {
      if (!enabled) return;

      const directories = [
        { source: root, target: "stardew-music" },
        { source: ambientRoot, target: "stardew-audio" }
      ];

      for (const directory of directories) {
        if (!existsSync(directory.source)) continue;
        for (const fileName of readdirSync(directory.source)) {
          if (!fileName.toLowerCase().endsWith(".wav")) continue;
          const filePath = resolve(directory.source, fileName);
          if (!statSync(filePath).isFile()) continue;
          this.emitFile({
            type: "asset",
            fileName: `private-audio/${directory.target}/${fileName}`,
            source: readFileSync(filePath)
          });
        }
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const localMusicEnabled = env.VITE_AGENT_BOOK_LOCAL_MUSIC === "true";
  const localMusicRoot =
    env.AGENT_BOOK_LOCAL_AUDIO_DIR ?? resolve(tmpdir(), "agent-book-stardew-music");

  return {
    plugins: [react(), localAudioPlugin(localMusicRoot, localMusicEnabled)],
    base: process.env.GITHUB_ACTIONS ? "/agent-book/" : "/",
    server: { port: 5173 }
  };
});
