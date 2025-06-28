// HTMLファイル自動スキャンシステム
class HTMLFileScanner {
  constructor() {
    this.files = [];
    this.knownFiles = new Set();
  }

  // HTMLファイルからメタデータを抽出
  async extractMetadata(filePath) {
    try {
      const response = await fetch(filePath);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // タイトル抽出
      const title = doc.querySelector('title')?.textContent || 
                   doc.querySelector('h1')?.textContent || 
                   filePath.replace('.html', '').replace(/[-_]/g, ' ');
      
      // 説明抽出（複数のソースから試行）
      let description = 
        doc.querySelector('meta[name="description"]')?.content ||
        doc.querySelector('meta[property="og:description"]')?.content ||
        doc.querySelector('.header p')?.textContent ||
        doc.querySelector('p')?.textContent ||
        'HTMLファイル';
      
      // 説明を短縮
      if (description.length > 100) {
        description = description.substring(0, 97) + '...';
      }
      
      // キーワード/タグ抽出
      let tags = [];
      const keywords = doc.querySelector('meta[name="keywords"]')?.content;
      if (keywords) {
        tags = keywords.split(',').map(k => k.trim()).filter(k => k);
      }
      
      // タイトルからタグを推測
      const titleTags = this.extractTagsFromTitle(title);
      tags = [...new Set([...tags, ...titleTags])];
      
      
      // ファイル情報の修正日時取得（代替としてDate.now()使用）
      const created = new Date().toISOString().split('T')[0];
      
      return {
        id: this.generateId(filePath),
        path: filePath,
        title: title.trim(),
        description: description.trim(),
        tags: tags.slice(0, 8), // 最大8個まで
        created: created
      };
    } catch (error) {
      console.warn(`Failed to extract metadata from ${filePath}:`, error);
      return null;
    }
  }

  // タイトルからタグを抽出
  extractTagsFromTitle(title) {
    const keywords = [
      // 教育・学習関連
      { pattern: /(AI|人工知能|機械学習|深層学習)/i, tag: 'AI' },
      { pattern: /(教育|学習|研修|トレーニング)/i, tag: '教育' },
      { pattern: /(プログラミング|コーディング|開発)/i, tag: 'プログラミング' },
      
      // 制度・補助金関連
      { pattern: /(給付|補助|支援|制度)/i, tag: '給付金' },
      { pattern: /(厚生労働省|政府|国)/i, tag: '厚生労働省' },
      { pattern: /(訓練|実践)/i, tag: '教育訓練' },
      
      // 技術関連
      { pattern: /(Web|ウェブ|HTML|CSS|JavaScript)/i, tag: 'Web技術' },
      { pattern: /(デザイン|UI|UX)/i, tag: 'デザイン' },
      { pattern: /(データ|分析|解析)/i, tag: 'データ分析' },
      
      // ビジネス関連
      { pattern: /(ビジネス|経営|マーケティング)/i, tag: 'ビジネス' },
      { pattern: /(戦略|企画|計画)/i, tag: '戦略' },
    ];

    const tags = [];
    keywords.forEach(({ pattern, tag }) => {
      if (pattern.test(title)) {
        tags.push(tag);
      }
    });

    return tags;
  }


  // IDの生成
  generateId(filePath) {
    return filePath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  

  // 拡張可能なファイルリスト生成
  async generateFileList() {
    // まずfiles.jsonから読み込みを試みる
    try {
      console.log('files.jsonから設定を読み込み中...');
      const response = await fetch('files.json');
      if (response.ok) {
        const data = await response.json();
        if (data.files && Array.isArray(data.files)) {
          console.log(`✅ files.jsonから${data.files.length}個のファイルを読み込みました`);
          
          // files.jsonのデータをそのまま返す（pathを補完）
          return data.files.map(file => ({
            ...file,
            path: file.path.startsWith('html-files/') ? file.path : `html-files/${file.path}`
          }));
        }
      }
    } catch (error) {
      console.log('⚠️ files.jsonの読み込みに失敗しました。フォールバックを使用します。', error);
    }

    // フォールバック: ハードコードされたリスト（新ファイル名）
    const potentialFiles = [
      'html-files/2025-06-26-system-education-training.html',
      'html-files/2025-06-26-edu-ai-summary.html',
      'html-files/2025-06-26-tech-llmo-checklist.html',
      'html-files/2025-06-26-tech-claude-code.html',
      'html-files/2025-06-26-tech-go-tutorial.html',
    ];

    // 存在チェック付きで並行処理
    console.log('フォールバック: チェック対象ファイル:', potentialFiles);
    
    const promises = potentialFiles.map(async (path) => {
      try {
        console.log(`チェック中: ${path}`);
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          console.log(`✅ 見つかりました: ${path}`);
          return path;
        } else {
          console.log(`❌ 応答エラー: ${path}, status: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ 取得エラー: ${path}`, error);
      }
      return null;
    });

    const existingFiles = (await Promise.all(promises)).filter(path => path !== null);
    
    // メタデータ抽出
    const metadataPromises = existingFiles.map(path => this.extractMetadata(path));
    const metadataResults = await Promise.all(metadataPromises);
    
    return metadataResults.filter(result => result !== null);
  }

  // ディレクトリ内のHTMLファイルを自動検出
  async autoDetectHTMLFiles() {
    return await this.generateFileList();
  }
}

// HTMLファイル管理システムの拡張
class AutoFileManager {
  constructor() {
    this.scanner = new HTMLFileScanner();
    this.files = [];
    this.categories = new Set();
  }

  // ファイルリストの自動更新
  async refreshFileList() {
    try {
      this.files = await this.scanner.autoDetectHTMLFiles();
      this.updateCategories();
      return this.files;
    } catch (error) {
      console.error('ファイルリストの更新に失敗しました:', error);
      return [];
    }
  }

  // カテゴリー一覧の更新
  updateCategories() {
    this.categories = new Set(this.files.map(file => file.category));
  }

  // カテゴリー一覧の取得
  getCategories() {
    return Array.from(this.categories).sort();
  }

  // files.jsonの生成（デバッグ用）
  generateFilesJSON() {
    return JSON.stringify({ files: this.files }, null, 2);
  }

  // 新しいHTMLファイルの追加チェック
  async checkForNewFiles() {
    const currentFiles = new Set(this.files.map(f => f.path));
    const scannedFiles = await this.scanner.autoDetectHTMLFiles();
    
    const newFiles = scannedFiles.filter(file => !currentFiles.has(file.path));
    if (newFiles.length > 0) {
      this.files = scannedFiles;
      this.updateCategories();
      return newFiles;
    }
    
    return [];
  }
}

// グローバルに公開
window.AutoFileManager = AutoFileManager;