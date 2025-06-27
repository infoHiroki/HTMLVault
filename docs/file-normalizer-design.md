# HTMLファイル命名規則自動化プログラム設計書

## 1. プログラム要件定義

### 目的
HTMLVaultプロジェクトに追加される新規HTMLファイルを自動的に命名規則に従った形式に変換し、必要なメタデータを追加する

### 主要機能
- 不適切な命名のHTMLファイルを検出
- 命名規則に従ったファイル名への自動リネーム
- HTMLファイル内へのメタデータ自動追加
- files.jsonへの自動登録

## 2. アーキテクチャ設計

```
┌─────────────────────────────────────────────────────┐
│                   メインコントローラー                   │
│              (file-normalizer.js)                   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────────┐
        ▼                     ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  ファイルスキャナー  │ │  ファイル名分析器   │ │  メタデータ抽出器  │
│   モジュール      │ │    モジュール      │ │    モジュール     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                     │                  │
        ▼                     ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  ファイルリネーマー │ │  カテゴリ判定器    │ │  HTML更新器      │
│    モジュール     │ │    モジュール      │ │   モジュール      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   JSON更新器      │
                    │   モジュール       │
                    └──────────────────┘
```

## 3. モジュール定義

### 3.1 ファイルスキャナーモジュール
```javascript
class FileScanner {
  // html-filesディレクトリ内のHTMLファイルを検出
  scanDirectory() {}
  // 命名規則に従っていないファイルを抽出
  findNonCompliantFiles() {}
  // ファイルの基本情報を取得
  getFileInfo(filePath) {}
}
```

### 3.2 ファイル名分析器モジュール
```javascript
class FileNameAnalyzer {
  // 現在のファイル名から情報を抽出
  parseFileName(filename) {}
  // 新しいファイル名を生成
  generateNewFileName(metadata) {}
  // ファイル名の妥当性チェック
  validateFileName(filename) {}
}
```

### 3.3 メタデータ抽出器モジュール
```javascript
class MetadataExtractor {
  // HTMLファイルからメタデータを抽出
  extractFromHTML(htmlContent) {}
  // タイトルから内容を推測
  inferFromTitle(title) {}
  // 本文から要約を生成
  generateDescription(content) {}
}
```

### 3.4 カテゴリ判定器モジュール
```javascript
class CategoryClassifier {
  // コンテンツからカテゴリを判定
  classifyContent(title, description, keywords) {}
  // カテゴリコードを取得
  getCategoryCode(category) {}
  // カテゴリ判定の信頼度スコア
  getConfidenceScore() {}
}
```

### 3.5 ファイルリネーマーモジュール
```javascript
class FileRenamer {
  // ファイルを安全にリネーム
  renameFile(oldPath, newPath) {}
  // バックアップを作成
  createBackup(filePath) {}
  // リネーム履歴を記録
  logRenameHistory(oldName, newName) {}
}
```

### 3.6 HTML更新器モジュール
```javascript
class HTMLUpdater {
  // メタタグを追加/更新
  updateMetaTags(htmlContent, metadata) {}
  // DOMを解析して更新
  parseAndUpdateDOM(htmlContent) {}
  // 更新されたHTMLを保存
  saveUpdatedHTML(filePath, content) {}
}
```

### 3.7 JSON更新器モジュール
```javascript
class JSONUpdater {
  // files.jsonを読み込み
  loadFilesJSON() {}
  // 新しいエントリを追加
  addEntry(fileMetadata) {}
  // 重複チェック
  checkDuplicates(id) {}
  // JSONを保存
  saveFilesJSON(data) {}
}
```

## 4. エラーハンドリングと例外処理

### 4.1 エラータイプ定義
```javascript
class FileNormalizerError extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

// エラーコード定義
const ErrorCodes = {
  FILE_NOT_FOUND: 'FNF001',
  INVALID_HTML: 'IH002',
  RENAME_FAILED: 'RF003',
  PERMISSION_DENIED: 'PD004',
  DUPLICATE_ENTRY: 'DE005',
  CATEGORY_UNKNOWN: 'CU006',
  METADATA_MISSING: 'MM007',
  JSON_PARSE_ERROR: 'JP008'
};
```

### 4.2 エラー処理戦略
```javascript
class ErrorHandler {
  // エラーログ記録
  logError(error) {}
  
  // ユーザー向けメッセージ生成
  getUserMessage(errorCode) {}
  
  // リカバリー戦略
  attemptRecovery(error) {
    switch(error.code) {
      case ErrorCodes.DUPLICATE_ENTRY:
        // 重複エントリの場合は番号を付与
        return this.handleDuplicate();
      case ErrorCodes.CATEGORY_UNKNOWN:
        // カテゴリ不明の場合は'misc'を使用
        return this.useDefaultCategory();
    }
  }
  
  // ロールバック処理
  rollback(transaction) {}
}
```

### 4.3 トランザクション管理
```javascript
class TransactionManager {
  // 変更履歴を記録
  recordChange(type, oldValue, newValue) {}
  
  // 全変更をロールバック
  rollbackAll() {}
  
  // 変更をコミット
  commitChanges() {}
}
```

## 5. 実行フローとユーザーインターフェース

### 5.1 実行フロー
```
開始
 │
 ├─→ [1] html-filesディレクトリをスキャン
 │     └─→ 命名規則に従っていないファイルをリストアップ
 │
 ├─→ [2] 各ファイルに対して処理
 │     ├─→ HTMLファイルを読み込み
 │     ├─→ メタデータを抽出
 │     ├─→ カテゴリを判定
 │     ├─→ 新しいファイル名を生成
 │     └─→ ユーザーに確認を求める
 │
 ├─→ [3] ユーザー承認後
 │     ├─→ トランザクション開始
 │     ├─→ ファイルをリネーム
 │     ├─→ HTMLにメタタグを追加
 │     ├─→ files.jsonを更新
 │     └─→ トランザクションコミット
 │
 └─→ [4] 処理結果レポート生成
       └─→ 終了
```

### 5.2 CLIインターフェース設計
```bash
# 基本コマンド
node file-normalizer.js [options]

# オプション
--scan          # スキャンのみ実行（変更なし）
--auto          # 自動モード（確認なし）
--interactive   # 対話モード（デフォルト）
--backup        # バックアップを作成
--dry-run       # ドライラン（変更をシミュレート）
--config <file> # 設定ファイルを指定

# 使用例
node file-normalizer.js --scan
node file-normalizer.js --interactive --backup
```

### 5.3 対話モード画面設計
```
========================================
HTMLファイル命名規則 自動適用ツール v1.0
========================================

[スキャン結果]
見つかった非準拠ファイル: 3件

1. vscode_tutorial_summary.html
   推奨: 2025-06-27-tech-vscode-github-copilot.html
   カテゴリ: 技術・開発 (信頼度: 95%)
   
   変更内容:
   - ファイル名変更
   - メタタグ追加 (created-date, category, keywords)
   
   この変更を適用しますか？ [Y/n/詳細(d)]: 

2. untitled_document.html
   推奨: 2025-06-27-misc-untitled-document.html
   カテゴリ: その他 (信頼度: 40%)
   
   カテゴリを手動で選択しますか？ [Y/n]: 

[処理オプション]
A: すべて自動適用
S: 選択したものだけ適用
C: キャンセル

選択してください [A/S/C]: 
```

### 5.4 設定ファイル形式
```json
{
  "namingRules": {
    "dateFormat": "YYYY-MM-DD",
    "separator": "-",
    "maxLength": 60
  },
  "categories": {
    "system": "制度・補助金",
    "edu": "教育・AI",
    "tech": "技術・開発",
    "design": "デザイン",
    "biz": "ビジネス",
    "misc": "その他"
  },
  "processing": {
    "createBackup": true,
    "preserveOriginalDate": false,
    "autoDetectCategory": true,
    "confidenceThreshold": 70
  },
  "output": {
    "logFile": "./normalization.log",
    "reportFormat": "json"
  }
}
```

## 設計まとめ

この自動化プログラムは以下の特徴を持ちます：

1. **モジュラー設計**: 各機能が独立したモジュールとして実装され、保守性が高い
2. **エラー耐性**: 包括的なエラーハンドリングとロールバック機能
3. **ユーザーフレンドリー**: 対話モードとドライラン機能で安全に操作可能
4. **拡張性**: 設定ファイルによる柔軟なカスタマイズ
5. **トレーサビリティ**: すべての変更履歴をログに記録

---

**作成日**: 2025年6月27日  
**バージョン**: 1.0.0  
**作成者**: HTMLVault開発チーム