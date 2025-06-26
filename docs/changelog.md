# 変更履歴

## バージョン 2.0.0 (2025-06-26)

### 🎯 主要変更

#### 1. JSON設定ファイル方式の導入
- **`files.json`でファイル管理を一元化**
  - ハードコードされたファイルリストを廃止
  - メタデータの詳細制御が可能
  - 手動作業を1箇所に集約

#### 2. ファイル命名規則の統一
- **新しい命名規則**: `{日付}-{カテゴリ}-{内容説明}.html`
- **既存ファイルのリネーム**:
  - `education_training_infographic.html` → `2025-06-26-system-education-training.html`
  - `education_ai_summary.html` → `2025-06-26-edu-ai-summary.html`
  - `llmo_checklist_infographic.html` → `2025-06-26-tech-llmo-checklist.html`
  - `ClodeCode2025-06-26.html` → `2025-06-26-tech-claude-code.html`
  - `go_language_tutorial.html` → `2025-06-26-tech-go-tutorial.html`

#### 3. 支援ツールの追加
- **`file-helper.html`**: 新規ファイル追加を支援するGUIツール
- **`docs/naming-convention.md`**: 命名規則の詳細ガイド

#### 4. システム改良
- **`auto-scan.js`**: files.json優先読み込み方式に変更
- **フォールバック機能**: files.json読み込み失敗時の代替処理

### 📋 機能改善

| 項目 | v1.0.0 | v2.0.0 |
|------|--------|--------|
| 手動作業箇所 | 2箇所（ファイル配置 + JS編集） | 1箇所（JSON編集のみ） |
| ファイル名管理 | 不統一 | 命名規則統一 |
| 新規追加の複雑さ | 高い | 低い（GUIヘルパー付き） |
| メタデータ管理 | 自動抽出のみ | 柔軟な手動設定 |
| 時系列管理 | 困難 | 日付プレフィックスで容易 |

### 🔧 技術的変更

#### auto-scan.js
```javascript
// v1.0.0: ハードコードされたリスト
const potentialFiles = [
  'html-files/education_training_infographic.html',
  // ...
];

// v2.0.0: JSON優先読み込み
async generateFileList() {
  try {
    const response = await fetch('files.json');
    if (response.ok) {
      const data = await response.json();
      return data.files;
    }
  } catch (error) {
    return await this.legacyScanFiles();
  }
}
```

### 📁 ファイル構造変更

#### 追加されたファイル
- `file-helper.html`
- `docs/naming-convention.md`
- `docs/changelog.md`

#### 移動・リネーム
- すべてのHTMLファイルが新しい命名規則に準拠

### 🐛 解決した問題

1. **ファイル検出の半手動問題**: JSON設定方式で解決
2. **命名の不統一**: 統一的な命名規則で解決
3. **手動作業の複雑さ**: 1箇所に集約し、GUIヘルパーで支援

### 🔮 今後の予定

- [ ] ファイルバージョン管理機能
- [ ] 一括インポート機能
- [ ] JSONスキーマ検証
- [ ] より詳細なメタデータ対応

---

## バージョン 1.0.0 (2025-06-26)

### 🎉 初回リリース

#### 基本機能
- HTMLファイルの自動検出・管理
- メタデータ自動抽出
- レスポンシブデザイン
- リアルタイム検索
- カテゴリー別フィルタリング

#### 技術仕様
- HTML5 + CSS3 + Vanilla JavaScript
- モバイルファーストデザイン
- WCAG 2.1 AA準拠
- GitHub Pages対応

#### 初期ファイル
- `index.html`
- `auto-scan.js`
- `files.json`（バックアップ用）
- ドキュメント類（`docs/`）

---

**メンテナンス**: 2025年6月26日  
**ステータス**: 🟢 安定版