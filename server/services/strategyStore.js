// In-memory strategy store
const strategyStore = new Map();
const instanceId = `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const startTime = new Date().toISOString();

console.log('[StrategyStore] Initialized');
console.log(`[StrategyStore] Instance ID: ${instanceId}`);
console.log(`[StrategyStore] Process PID: ${process.pid}`);
console.log(`[StrategyStore] Start Time: ${startTime}`);

function saveStrategy(id, strategy) {
    strategyStore.set(id, strategy);
    console.log(`[StrategyStore] Saved strategy with ID: ${id}`);
    console.log(`[StrategyStore] Total strategies in memory: ${strategyStore.size}`);
    console.log(`[StrategyStore] Instance: ${instanceId} | PID: ${process.pid}`);
}

function getStrategy(id) {
    const strategy = strategyStore.get(id);
    if (strategy) {
        console.log(`[StrategyStore] ✓ Retrieved strategy with ID: ${id}`);
        console.log(`[StrategyStore] Instance: ${instanceId} | PID: ${process.pid}`);
    } else {
        console.log(`[StrategyStore] ✗ Strategy not found for ID: ${id}`);
        console.log(`[StrategyStore] Available IDs: [${Array.from(strategyStore.keys()).join(', ')}]`);
        console.log(`[StrategyStore] Instance: ${instanceId} | PID: ${process.pid}`);
    }
    return strategy;
}

function getAllStrategyIds() {
    return Array.from(strategyStore.keys());
}

function getStoreInfo() {
    return {
        instanceId,
        pid: process.pid,
        startTime,
        strategyCount: strategyStore.size,
        strategyIds: getAllStrategyIds()
    };
}

module.exports = {
    saveStrategy,
    getStrategy,
    getAllStrategyIds,
    getStoreInfo
};
