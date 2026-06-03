"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_service_1 = require("../redis/redis.service");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    app;
    adapterConstructor;
    constructor(app) {
        super(app);
        this.app = app;
    }
    async connectToRedis() {
        const redisService = this.app.get(redis_service_1.RedisService);
        const pubClient = redisService.getClient();
        const subClient = pubClient.duplicate({ lazyConnect: true });
        await subClient.connect();
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map