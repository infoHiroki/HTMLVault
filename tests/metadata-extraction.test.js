// HTMLメタデータ抽出のテスト
TestRunner.suite('metadata-extraction', ({ test, beforeEach, afterEach }) => {
    let scanner;
    
    beforeEach(() => {
        scanner = new HTMLFileScanner();
        MockFetch.mock();
    });
    
    afterEach(() => {
        MockFetch.restore();
    });
    
    test('基本的なタイトル抽出', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>テストタイトル</title></head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.equal(result.title, 'テストタイトル', 'タイトルが正しく抽出されること');
    });
    
    test('H1からのタイトル抽出（titleタグなし）', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head></head>
            <body><h1>H1からのタイトル</h1></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.equal(result.title, 'H1からのタイトル', 'H1からタイトルが抽出されること');
    });
    
    test('ファイル名からのタイトル生成', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head></head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('my-test-file.html', html);
        const result = await scanner.extractMetadata('my-test-file.html');
        
        assert.equal(result.title, 'my test file', 'ファイル名からタイトルが生成されること');
    });
    
    test('meta description抽出', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>テスト</title>
                <meta name="description" content="これはテスト用の説明文です">
            </head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.equal(result.description, 'これはテスト用の説明文です', 'meta descriptionが抽出されること');
    });
    
    test('OG description抽出', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>テスト</title>
                <meta property="og:description" content="OGの説明文">
            </head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.equal(result.description, 'OGの説明文', 'OG descriptionが抽出されること');
    });
    
    test('長い説明文の切り詰め', async (assert) => {
        const longDescription = 'あ'.repeat(200);
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>テスト</title>
                <meta name="description" content="${longDescription}">
            </head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.equal(result.description.length, 100, '説明文が100文字で切り詰められること');
        assert.truthy(result.description.endsWith('...'), '切り詰め時に...が付与されること');
    });
    
    test('キーワードからのタグ抽出', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>テスト</title>
                <meta name="keywords" content="JavaScript, HTML, CSS, プログラミング">
            </head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.truthy(result.tags.includes('JavaScript'), 'JavaScriptタグが含まれること');
        assert.truthy(result.tags.includes('HTML'), 'HTMLタグが含まれること');
        assert.truthy(result.tags.includes('CSS'), 'CSSタグが含まれること');
        assert.truthy(result.tags.includes('プログラミング'), 'プログラミングタグが含まれること');
    });
    
    test('タイトルからのタグ推測', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>AI機械学習入門</title></head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.truthy(result.tags.includes('AI'), 'AIタグが推測されること');
    });
    
    test('IDの生成', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>テスト</title></head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('html-files/test-file.html', html);
        const result = await scanner.extractMetadata('html-files/test-file.html');
        
        assert.equal(result.id, 'html-files-test-file-html', 'IDが正しく生成されること');
    });
    
    test('作成日の設定', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head><title>テスト</title></head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.truthy(result.created, '作成日が設定されること');
        assert.truthy(/^\d{4}-\d{2}-\d{2}$/.test(result.created), '作成日がYYYY-MM-DD形式であること');
    });
    
    test('取得失敗時のnull返却', async (assert) => {
        // レスポンスを設定しない（404エラーを模擬）
        const result = await scanner.extractMetadata('nonexistent.html');
        
        assert.equal(result, null, '取得失敗時にnullが返されること');
    });
    
    test('タグ数の制限', async (assert) => {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>テスト</title>
                <meta name="keywords" content="tag1,tag2,tag3,tag4,tag5,tag6,tag7,tag8,tag9,tag10">
            </head>
            <body></body>
            </html>
        `;
        
        MockFetch.setResponse('test.html', html);
        const result = await scanner.extractMetadata('test.html');
        
        assert.truthy(result.tags.length <= 8, 'タグ数が8個以下に制限されること');
    });
});