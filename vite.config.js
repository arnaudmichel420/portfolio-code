import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl";

export default {
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: {
        home: "/index.html",
        project1: "src/projects/gamejam/index.html",
        project2: "src/projects/massage-sportif-annecy/index.html",
        project3: "src/projects/cinema/index.html",
      },
    },
  },
  plugins: [
    restart({ restart: ["../static/**"] }), // Restart server on static file change
    glsl(), // Handle shader files
  ],
};
