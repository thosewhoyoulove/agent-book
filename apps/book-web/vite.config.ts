import { createReadStream, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type AudioRoots = Record<string, string>;

function contentType(fileName: string) {
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension === "ogg") return "audio/ogg";
  if (extension === "mp3") return "audio/mpeg";
  return "audio/wav";
}

function localAudioPlugin(audioRoots: AudioRoots, enabled: boolean): Plugin {
  const roots = Object.fromEntries(
    Object.entries(audioRoots).map(([directory, audioRoot]) => [directory, resolve(audioRoot)])
  );
  const route = "/__agent-book-local-audio";

  return {
    name: "agent-book-local-audio",
    apply: "serve",
    configureServer(server) {
      if (!enabled) return;

      server.middlewares.use(route, (request, response, next) => {
        const requestPath = decodeURIComponent((request.url ?? "/").split("?", 1)[0]);
        const mountedPath = requestPath.startsWith(route) ? requestPath.slice(route.length) : requestPath;
        const relativePath = mountedPath.replace(/^\/+/, "");
        const directory = Object.keys(roots)
          .sort((left, right) => right.length - left.length)
          .find((candidate) => relativePath.startsWith(`${candidate}/`));
        if (!directory) {
          next();
          return;
        }

        const root = roots[directory];
        const filePath = resolve(root, relativePath.slice(directory.length + 1));
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
        response.setHeader("Content-Type", contentType(filePath));
        response.setHeader("Content-Length", stats.size);
        response.setHeader("Cache-Control", "no-store");
        createReadStream(filePath).on("error", next).pipe(response);
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const localAudioEnabled = env.VITE_AGENT_BOOK_LOCAL_MUSIC === "true";
  const privateAudioRoot = resolve(process.cwd(), "src/assets/private-audio");
  const localStardewMusicRoot = env.AGENT_BOOK_LOCAL_AUDIO_DIR ?? resolve(privateAudioRoot, "stardew-music");
  const localAudioRoots: AudioRoots = {
    "stardew-music": localStardewMusicRoot,
    "stardew-audio": resolve(localStardewMusicRoot, "..", "stardew-audio"),
    "celeste/music": resolve(privateAudioRoot, "celeste/music"),
    "celeste/audio": resolve(privateAudioRoot, "celeste/audio"),
    "hollow/music": resolve(privateAudioRoot, "hollow/music"),
    "hollow/audio": resolve(privateAudioRoot, "hollow/audio")
  };

  return {
    plugins: [react(), localAudioPlugin(localAudioRoots, localAudioEnabled)],
    base: process.env.GITHUB_ACTIONS ? "/agent-book/" : "/",
    server: { port: 5173 }
  };
});
