// 超シンプルテストフレームワーク
const TestRunner = {
    suites: {},
    totalTests: 0,
    
    // テストスイート登録
    suite: function(name, fn) {
        const suite = {
            name: name,
            tests: [],
            beforeEach: null,
            afterEach: null
        };
        
        const api = {
            test: (testName, testFn) => {
                suite.tests.push({ name: testName, fn: testFn });
                TestRunner.totalTests++;
            },
            beforeEach: (fn) => {
                suite.beforeEach = fn;
            },
            afterEach: (fn) => {
                suite.afterEach = fn;
            }
        };
        
        fn(api);
        TestRunner.suites[name] = suite;
    },
    
    // テストスイート実行
    runSuite: async function(suiteName) {
        const suite = TestRunner.suites[suiteName];
        if (!suite) {
            console.error(`Test suite '${suiteName}' not found`);
            return;
        }
        
        console.log(`Running: ${suite.name}`);
        
        for (const test of suite.tests) {
            const result = {
                name: test.name,
                description: `${suite.name} - ${test.name}`,
                status: 'pass',
                error: null,
                duration: 0
            };
            
            const start = performance.now();
            
            try {
                if (suite.beforeEach) await suite.beforeEach();
                await test.fn(TestRunner.assert);
                if (suite.afterEach) await suite.afterEach();
            } catch (error) {
                result.status = 'fail';
                result.error = error.message;
                console.error(`FAIL: ${test.name}`, error);
            }
            
            result.duration = performance.now() - start;
            
            // 結果をイベントで通知
            window.dispatchEvent(new CustomEvent('test-result', { detail: result }));
            
            // 少し待機
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    },
    
    // 全テスト実行
    runAll: async function() {
        for (const suiteName of Object.keys(TestRunner.suites)) {
            await TestRunner.runSuite(suiteName);
        }
    },
    
    // 総テスト数取得
    getTotalTestCount: function() {
        return TestRunner.totalTests;
    },
    
    // アサーション
    assert: {
        equal: (actual, expected, message) => {
            if (actual !== expected) {
                throw new Error(`${message || 'Failed'}: expected ${expected}, got ${actual}`);
            }
        },
        
        truthy: (value, message) => {
            if (!value) {
                throw new Error(`${message || 'Failed'}: expected truthy, got ${value}`);
            }
        },
        
        falsy: (value, message) => {
            if (value) {
                throw new Error(`${message || 'Failed'}: expected falsy, got ${value}`);
            }
        },
        
        includes: (array, item, message) => {
            if (!array.includes(item)) {
                throw new Error(`${message || 'Failed'}: array does not include ${item}`);
            }
        },
        
        throws: async (fn, message) => {
            let threw = false;
            try {
                await fn();
            } catch (e) {
                threw = true;
            }
            if (!threw) {
                throw new Error(`${message || 'Failed'}: expected function to throw`);
            }
        }
    }
};

// Mock機能
const MockFetch = {
    responses: {},
    
    setResponse: function(url, response) {
        MockFetch.responses[url] = response;
    },
    
    mock: function() {
        MockFetch.originalFetch = window.fetch;
        window.fetch = function(url) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const response = MockFetch.responses[url];
                    if (response) {
                        resolve({
                            ok: true,
                            status: 200,
                            text: () => Promise.resolve(response),
                            json: () => Promise.resolve(JSON.parse(response))
                        });
                    } else {
                        reject(new Error(`No mock response for ${url}`));
                    }
                }, 10);
            });
        };
    },
    
    restore: function() {
        if (MockFetch.originalFetch) {
            window.fetch = MockFetch.originalFetch;
        }
    }
};

// グローバルに公開
window.TestRunner = TestRunner;
window.MockFetch = MockFetch;

console.log('✅ Simple test framework loaded');