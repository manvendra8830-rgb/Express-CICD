const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");

const app = require("../server");

test("Express health endpoint", async () => {
    const server = app.listen(0);

    try {
        await once(server, "listening");

        const port = server.address().port;

        const response = await fetch(`http://127.0.0.1:${port}/health`);
        const data = await response.json();

        assert.equal(response.status, 200);
        assert.equal(
            data.status,
            "Express frontend is running successfully."
        );
        assert.equal(data.service, "express-cicd");
    } finally {
        server.close();
    }
});
