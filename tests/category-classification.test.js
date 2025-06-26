// カテゴリー分類のテスト
TestRunner.suite('category-classification', ({ test, beforeEach }) => {
    let scanner;
    
    beforeEach(() => {
        scanner = new HTMLFileScanner();
    });
    
    test('制度・補助金カテゴリーの分類', (assert) => {
        const category1 = scanner.categorizeFile('給付金制度について', '補助金の申請方法', ['給付金', '支援']);
        assert.equal(category1, '制度・補助金', '給付金関連は制度・補助金カテゴリーになること');
        
        const category2 = scanner.categorizeFile('厚生労働省の支援制度', '国の制度説明', ['厚生労働省']);
        assert.equal(category2, '制度・補助金', '厚生労働省関連は制度・補助金カテゴリーになること');
    });
    
    test('教育・AIカテゴリーの分類', (assert) => {
        const category1 = scanner.categorizeFile('AI入門', '人工知能について学ぶ', ['AI', '機械学習']);
        assert.equal(category1, '教育・AI', 'AI関連は教育・AIカテゴリーになること');
        
        const category2 = scanner.categorizeFile('プログラミング学習', '教育訓練の内容', ['教育', '学習']);
        assert.equal(category2, '教育・AI', '教育関連は教育・AIカテゴリーになること');
    });
    
    test('技術・開発カテゴリーの分類', (assert) => {
        const category1 = scanner.categorizeFile('JavaScript開発', 'Web技術について', ['プログラミング', 'JavaScript']);
        assert.equal(category1, '技術・開発', 'プログラミング関連は技術・開発カテゴリーになること');
        
        const category2 = scanner.categorizeFile('HTML/CSS', 'ウェブ開発の基礎', ['HTML', 'CSS']);
        assert.equal(category2, '技術・開発', 'Web技術関連は技術・開発カテゴリーになること');
    });
    
    test('デザインカテゴリーの分類', (assert) => {
        const category1 = scanner.categorizeFile('UI/UXデザイン', 'ユーザーインターフェース設計', ['デザイン', 'UI']);
        assert.equal(category1, 'デザイン', 'デザイン関連はデザインカテゴリーになること');
        
        const category2 = scanner.categorizeFile('色彩設計', 'レイアウトの基本', ['色', 'レイアウト']);
        assert.equal(category2, 'デザイン', '色・レイアウト関連はデザインカテゴリーになること');
    });
    
    test('ビジネスカテゴリーの分類', (assert) => {
        const category1 = scanner.categorizeFile('マーケティング戦略', '経営計画について', ['ビジネス', '戦略']);
        assert.equal(category1, 'ビジネス', 'ビジネス関連はビジネスカテゴリーになること');
        
        const category2 = scanner.categorizeFile('企業経営', 'マーケティング手法', ['経営', 'マーケティング']);
        assert.equal(category2, 'ビジネス', '経営・マーケティング関連はビジネスカテゴリーになること');
    });
    
    test('その他カテゴリーの分類', (assert) => {
        const category = scanner.categorizeFile('一般的な情報', '特定分野に属さない内容', ['一般', '情報']);
        assert.equal(category, 'その他', '特定分野に属さない場合はその他カテゴリーになること');
    });
    
    test('複数キーワードマッチ時の優先順位', (assert) => {
        // 制度・補助金の優先度が高いことをテスト
        const category1 = scanner.categorizeFile('AI給付金制度', 'AIと給付金の両方について', ['AI', '給付金']);
        assert.equal(category1, '制度・補助金', '制度・補助金キーワードが優先されること');
        
        // 教育・AIとプログラミングの競合
        const category2 = scanner.categorizeFile('AIプログラミング教育', 'AI技術を用いた教育', ['AI', 'プログラミング', '教育']);
        assert.equal(category2, '教育・AI', '教育・AIキーワードがマッチすること');
    });
    
    test('大文字小文字の区別なし', (assert) => {
        const category1 = scanner.categorizeFile('ai学習', 'AI技術について', ['ai']);
        assert.equal(category1, '教育・AI', '小文字でもマッチすること');
        
        const category2 = scanner.categorizeFile('HTML/css', 'web開発', ['HTML', 'CSS']);
        assert.equal(category2, '技術・開発', '大文字小文字混在でもマッチすること');
    });
    
    test('部分マッチの動作', (assert) => {
        const category1 = scanner.categorizeFile('プログラミング言語', 'コーディング技術', ['coding']);
        assert.equal(category1, '技術・開発', 'プログラミングキーワードでマッチすること');
        
        const category2 = scanner.categorizeFile('webデザイン', 'ウェブサイトデザイン', ['webdesign']);
        assert.equal(category2, 'デザイン', 'デザインキーワードでマッチすること');
    });
    
    test('空文字・null入力への対処', (assert) => {
        const category1 = scanner.categorizeFile('', '', []);
        assert.equal(category1, 'その他', '空文字入力時はその他カテゴリーになること');
        
        const category2 = scanner.categorizeFile(null, null, null);
        assert.equal(category2, 'その他', 'null入力時はその他カテゴリーになること');
    });
    
    test('タイトルからのタグ抽出', (assert) => {
        // AI関連キーワード
        const aiTags = scanner.extractTagsFromTitle('AI機械学習入門');
        assert.includes(aiTags, 'AI', 'AIタグが抽出されること');
        
        // 教育関連キーワード
        const eduTags = scanner.extractTagsFromTitle('プログラミング教育研修');
        assert.includes(eduTags, 'プログラミング', 'プログラミングタグが抽出されること');
        assert.includes(eduTags, '教育', '教育タグが抽出されること');
        
        // 制度関連キーワード
        const systemTags = scanner.extractTagsFromTitle('厚生労働省給付制度');
        assert.includes(systemTags, '厚生労働省', '厚生労働省タグが抽出されること');
        assert.includes(systemTags, '給付金', '給付金タグが抽出されること');
    });
    
    test('複数パターンマッチ', (assert) => {
        const tags = scanner.extractTagsFromTitle('AI機械学習プログラミング教育');
        assert.includes(tags, 'AI', 'AIタグが抽出されること');
        assert.includes(tags, 'プログラミング', 'プログラミングタグが抽出されること');
        assert.includes(tags, '教育', '教育タグが抽出されること');
    });
    
    test('重複タグの除去', (assert) => {
        // 同じタグが複数回マッチする可能性をテスト
        const tags = scanner.extractTagsFromTitle('AI人工知能');
        const aiCount = tags.filter(tag => tag === 'AI').length;
        assert.equal(aiCount, 1, '重複タグが除去されること');
    });
});