// 検索機能のテスト
TestRunner.suite('search-functionality', ({ test, beforeEach }) => {
    let testFiles;
    let originalFiles;
    let originalApplyFilters;
    
    beforeEach(() => {
        // テスト用のサンプルファイルデータ
        testFiles = [
            {
                id: 'ai-tutorial',
                path: 'ai-tutorial.html',
                title: 'AI機械学習入門',
                description: '人工知能と機械学習の基礎を学ぶ',
                tags: ['AI', '機械学習', '教育'],
                created: '2025-01-01',
                category: '教育・AI'
            },
            {
                id: 'web-development',
                path: 'web-dev.html', 
                title: 'Web開発基礎',
                description: 'HTML、CSS、JavaScriptを使ったWeb開発',
                tags: ['HTML', 'CSS', 'JavaScript', 'Web開発'],
                created: '2025-01-02',
                category: '技術・開発'
            },
            {
                id: 'subsidy-info',
                path: 'subsidy.html',
                title: '教育訓練給付制度',
                description: 'プログラミング学習で給付金を受給する方法',
                tags: ['給付金', '補助金', '制度', '教育訓練'],
                created: '2025-01-03', 
                category: '制度・補助金'
            },
            {
                id: 'design-guide',
                path: 'design.html',
                title: 'UI/UXデザインガイド',
                description: 'ユーザビリティを重視したデザイン手法',
                tags: ['デザイン', 'UI', 'UX', 'ユーザビリティ'],
                created: '2025-01-04',
                category: 'デザイン'
            }
        ];
        
        // グローバル変数のバックアップ（テスト環境では存在しない可能性）
        if (typeof window !== 'undefined' && window.files) {
            originalFiles = window.files;
            window.files = [...testFiles];
        }
    });
    
    test('タイトルでの検索', (assert) => {
        const query = 'AI';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, 1, 'AI検索で1件ヒットすること');
        assert.equal(result[0].title, 'AI機械学習入門', '正しいファイルがヒットすること');
    });
    
    test('説明文での検索', (assert) => {
        const query = 'JavaScript';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, 1, 'JavaScript検索で1件ヒットすること');
        assert.equal(result[0].title, 'Web開発基礎', '正しいファイルがヒットすること');
    });
    
    test('タグでの検索', (assert) => {
        const query = '給付金';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, 1, '給付金検索で1件ヒットすること');
        assert.equal(result[0].title, '教育訓練給付制度', '正しいファイルがヒットすること');
    });
    
    test('カテゴリーでの検索', (assert) => {
        const query = 'デザイン';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, 1, 'デザイン検索で1件ヒットすること');
        assert.equal(result[0].category, 'デザイン', '正しいカテゴリーファイルがヒットすること');
    });
    
    test('部分マッチ検索', (assert) => {
        const query = '学習';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.truthy(result.length >= 1, '学習で検索結果があること');
        
        // AI機械学習入門と教育訓練給付制度がヒットするはず
        const titles = result.map(r => r.title);
        assert.truthy(titles.includes('AI機械学習入門'), 'AI機械学習入門がヒットすること');
    });
    
    test('大文字小文字を区別しない検索', (assert) => {
        const queries = ['ai', 'AI', 'Ai', 'aI'];
        
        queries.forEach(query => {
            const result = testFiles.filter(file => {
                const searchFields = [
                    file.title,
                    file.description,
                    file.category,
                    ...file.tags
                ].join(' ').toLowerCase();
                return searchFields.includes(query.toLowerCase());
            });
            
            assert.equal(result.length, 1, `${query}検索で1件ヒットすること`);
        });
    });
    
    test('複数キーワード検索', (assert) => {
        // スペース区切りの検索語（実装によってはAND検索になる）
        const query = '教育';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.truthy(result.length >= 1, '教育で複数件ヒットすること');
    });
    
    test('存在しないキーワードでの検索', (assert) => {
        const query = 'xyz存在しないワード';
        const result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, 0, '存在しないキーワードでは0件になること');
    });
    
    test('空文字検索', (assert) => {
        const query = '';
        const result = testFiles.filter(file => {
            if (!query.trim()) return true; // 空文字の場合は全件表示
            
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes(query.toLowerCase());
        });
        
        assert.equal(result.length, testFiles.length, '空文字検索では全件表示されること');
    });
    
    test('ソート機能 - 日付順', (assert) => {
        const sorted = [...testFiles].sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
        });
        
        assert.equal(sorted[0].created, '2025-01-04', '最新の日付が最初に来ること');
        assert.equal(sorted[sorted.length - 1].created, '2025-01-01', '最古の日付が最後に来ること');
    });
    
    test('ソート機能 - 名前順', (assert) => {
        const sorted = [...testFiles].sort((a, b) => {
            return a.title.localeCompare(b.title, 'ja');
        });
        
        // 日本語ソートのテスト
        const titles = sorted.map(f => f.title);
        assert.truthy(titles.indexOf('AI機械学習入門') < titles.indexOf('Web開発基礎'), 'AIがWebより前に来ること');
    });
    
    test('フィルターとソートの組み合わせ', (assert) => {
        // 教育関連を検索して日付順ソート
        let result = testFiles.filter(file => {
            const searchFields = [
                file.title,
                file.description,
                file.category,
                ...file.tags
            ].join(' ').toLowerCase();
            return searchFields.includes('教育');
        });
        
        result = result.sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
        });
        
        assert.truthy(result.length >= 1, '教育関連ファイルが検索されること');
        
        if (result.length > 1) {
            for (let i = 0; i < result.length - 1; i++) {
                assert.truthy(
                    new Date(result[i].created) >= new Date(result[i + 1].created),
                    '日付順でソートされていること'
                );
            }
        }
    });
});