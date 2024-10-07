module.exports = {
  script: "ts-node",
  args: ["-P", "tsconfig.json", "./src/index.ts"],
  instances: 1,
  exec_mode: "fork",
  log: "./bot-logs.txt",
  name: "blinkord-bot",
};
