const options = {
  NODE_ENV: "development",
  PORT: 3000,
}

for (const key in options) {
  process.env[key] = options[key]
}
